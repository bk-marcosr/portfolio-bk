import type { LaneConfig, LaneCounts, StationConfig } from './types';

type PacketState = 'moving' | 'buffered' | 'service' | 'exiting';

interface Packet {
  id: number;
  /** Posição na linha, de 0 a 1. */
  x: number;
  /** Índice da estação para onde o item está indo (ou onde está). */
  target: number;
  state: PacketState;
  hollow: boolean;
  uncertain: boolean;
  failed: boolean;
  /** Tempo de serviço decorrido na estação atual (ms). */
  t: number;
  /** Fade de saída, de 1 a 0. */
  fade: number;
}

interface Station {
  cfg: StationConfig;
  buffer: Packet[];
  slot: Packet | null;
  incoming: number;
}

interface Lane {
  cfg: LaneConfig;
  stations: Station[];
  transit: Packet[];
  exiting: Packet[];
  nextSpawnAt: number;
  down: boolean;
  locked: boolean;
  forceUncertain: number;
  done: number;
  hollow: number;
  failed: number;
  hover: boolean;
  lastSignature: string;
}

export interface SimOptions {
  canvas: HTMLCanvasElement;
  lanes: LaneConfig[];
  variant: 'hero' | 'detail';
  autoplay?: boolean;
  onChange?: (laneId: string, counts: LaneCounts) => void;
}

const TRAVEL_MS = { hero: 2600, detail: 3000 } as const;
const WARMUP_MS = 9000;
const STEP_MS = 16;
const FONT = '"Funnel Sans Variable", ui-sans-serif, system-ui, sans-serif';

const PALETTE = {
  line: '#262626',
  lineHover: '#3d3d3d',
  tick: '#3a3a3a',
  label: '#6b6b67',
  text: '#eeeeec',
  muted: '#9a9a96',
  failed: '#8a8a86',
};

let packetSeq = 0;

function randomBetween([min, max]: [number, number]): number {
  return min + Math.random() * (max - min);
}

const numberFormat = new Intl.NumberFormat('pt-BR');

export class SystemSim {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly variant: 'hero' | 'detail';
  private readonly lanes: Lane[];
  private readonly onChange?: SimOptions['onChange'];
  private readonly reducedMotion: boolean;
  private autoplay: boolean;

  private width = 0;
  private height = 0;
  private dpr = 1;
  private clock = 0;
  private lastFrame = 0;
  private frame = 0;
  private visible = false;
  private destroyed = false;

  private readonly resizeObserver: ResizeObserver;
  private readonly intersectionObserver: IntersectionObserver;

  constructor(options: SimOptions) {
    const ctx = options.canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D indisponível');

    this.canvas = options.canvas;
    this.ctx = ctx;
    this.variant = options.variant;
    this.onChange = options.onChange;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.autoplay = (options.autoplay ?? true) && !this.reducedMotion;

    this.lanes = options.lanes.map((cfg) => ({
      cfg,
      stations: cfg.stations.map((stationCfg) => ({ cfg: stationCfg, buffer: [], slot: null, incoming: 0 })),
      transit: [],
      exiting: [],
      nextSpawnAt: randomBetween(cfg.spawnEveryMs),
      down: false,
      locked: false,
      forceUncertain: 0,
      done: 0,
      hollow: 0,
      failed: 0,
      hover: false,
      lastSignature: '',
    }));

    this.warmUp();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.canvas);

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry?.isIntersecting ?? false;
        if (this.visible) this.play();
      },
      { rootMargin: '80px' },
    );
    this.intersectionObserver.observe(this.canvas);

    document.addEventListener('visibilitychange', this.handleVisibility);

    if (this.variant === 'hero') {
      this.canvas.addEventListener('pointermove', this.handlePointerMove);
      this.canvas.addEventListener('pointerleave', this.handlePointerLeave);
      this.canvas.addEventListener('click', this.handleClick);
    }

    this.resize();
    document.fonts?.ready.then(() => this.draw()).catch(() => this.draw());
  }

  /* ───────────────────────── API pública ───────────────────────── */

  burst(laneId: string, amount?: number): void {
    const lane = this.findLane(laneId);
    if (!lane) return;
    const count = amount ?? lane.cfg.burst;
    for (let i = 0; i < count; i += 1) {
      this.spawn(lane, -i * 0.035);
    }
    this.play();
  }

  setDown(laneId: string, down: boolean): void {
    const lane = this.findLane(laneId);
    if (!lane) return;
    lane.down = down;
    this.emit(lane, true);
    this.play();
  }

  /** A próxima ordem que chegar na estação remota perde a resposta. */
  loseNextResponse(laneId: string): void {
    const lane = this.findLane(laneId);
    if (!lane) return;
    lane.forceUncertain += 1;
    this.burst(laneId, 1);
  }

  destroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', this.handleVisibility);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas.removeEventListener('pointerleave', this.handlePointerLeave);
    this.canvas.removeEventListener('click', this.handleClick);
  }

  /* ───────────────────────── ciclo ───────────────────────── */

  private play(): void {
    if (this.destroyed || !this.visible || document.hidden || this.frame) return;
    this.lastFrame = performance.now();
    this.frame = requestAnimationFrame(this.loop);
  }

  private readonly loop = (time: number): void => {
    this.frame = 0;
    const dt = Math.min(time - this.lastFrame, 50);
    this.lastFrame = time;

    this.step(dt);
    this.draw();

    const keepRunning = this.autoplay || this.hasActivity();
    if (keepRunning && this.visible && !document.hidden && !this.destroyed) {
      this.frame = requestAnimationFrame(this.loop);
    }
  };

  private readonly handleVisibility = (): void => {
    if (document.hidden) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      return;
    }
    this.play();
  };

  private warmUp(): void {
    if (!this.autoplay) return;
    for (let elapsed = 0; elapsed < WARMUP_MS; elapsed += STEP_MS) this.step(STEP_MS);
  }

  private hasActivity(): boolean {
    return this.lanes.some(
      (lane) =>
        lane.transit.length > 0 ||
        lane.exiting.length > 0 ||
        lane.stations.some((station) => station.slot !== null || (station.buffer.length > 0 && !this.isBlocked(lane, station))),
    );
  }

  /* ───────────────────────── simulação ───────────────────────── */

  private step(dt: number): void {
    this.clock += dt;
    const speed = 1 / TRAVEL_MS[this.variant];

    for (const lane of this.lanes) {
      if (this.autoplay && this.clock >= lane.nextSpawnAt) {
        this.spawn(lane, 0);
        lane.nextSpawnAt = this.clock + randomBetween(lane.cfg.spawnEveryMs);
      }

      // Itens em trânsito andam até a próxima estação.
      for (let i = lane.transit.length - 1; i >= 0; i -= 1) {
        const packet = lane.transit[i];
        const station = lane.stations[packet.target];
        packet.x += speed * dt;
        if (packet.x < station.cfg.at) continue;

        packet.x = station.cfg.at;
        packet.state = 'buffered';
        station.incoming = Math.max(0, station.incoming - 1);
        station.buffer.push(packet);
        lane.transit.splice(i, 1);
      }

      // Estações puxam do buffer e processam.
      lane.stations.forEach((station, index) => {
        if (index === 0) return;
        this.serve(lane, station, index, dt);
      });

      for (let i = lane.exiting.length - 1; i >= 0; i -= 1) {
        const packet = lane.exiting[i];
        packet.fade -= dt / 520;
        if (packet.fade <= 0) lane.exiting.splice(i, 1);
      }

      this.emit(lane, false);
    }
  }

  private spawn(lane: Lane, offset: number): void {
    const first = lane.stations[0];
    const next = lane.stations[1];
    if (!first || !next) return;

    const packet: Packet = {
      id: (packetSeq += 1),
      x: first.cfg.at + offset,
      target: 1,
      state: 'moving',
      hollow: Math.random() < (lane.cfg.hollowRatio ?? 0),
      uncertain: false,
      failed: false,
      t: 0,
      fade: 1,
    };
    next.incoming += 1;
    lane.transit.push(packet);
  }

  private isBlocked(lane: Lane, station: Station): boolean {
    if (station.cfg.kind === 'worker' && lane.down) return true;
    if (station.cfg.kind === 'gate' && lane.locked) return true;
    return false;
  }

  private serve(lane: Lane, station: Station, index: number, dt: number): void {
    const { kind } = station.cfg;

    if (!station.slot && station.buffer.length > 0 && !this.isBlocked(lane, station)) {
      const packet = station.buffer.shift();
      if (packet) {
        packet.state = 'service';
        packet.t = 0;
        if (kind === 'remote') {
          const forced = lane.forceUncertain > 0;
          if (forced) lane.forceUncertain -= 1;
          packet.uncertain = forced || Math.random() < (lane.cfg.uncertainRatio ?? 0);
        }
        station.slot = packet;
      }
    }

    const packet = station.slot;
    if (!packet) return;
    if (kind === 'worker' && lane.down) return;

    packet.t += dt;
    const duration =
      kind === 'remote' && packet.uncertain ? lane.cfg.reconcileMs ?? 2400 : station.cfg.serviceMs ?? 0;
    if (packet.t < duration) return;

    if (kind === 'queue') {
      const next = lane.stations[index + 1];
      const nextIsFree = next && next.slot === null && next.buffer.length === 0 && next.incoming === 0;
      if (!nextIsFree || this.isBlocked(lane, next)) return;
    }

    if (kind === 'gate') lane.locked = true;

    if (kind === 'remote') {
      lane.locked = false;
      if (packet.uncertain) {
        packet.failed = true;
        packet.state = 'exiting';
        lane.failed += 1;
        lane.exiting.push(packet);
        station.slot = null;
        return;
      }
    }

    if (kind === 'sink') {
      packet.state = 'exiting';
      if (packet.hollow) lane.hollow += 1;
      else lane.done += 1;
      lane.exiting.push(packet);
      station.slot = null;
      return;
    }

    const next = lane.stations[index + 1];
    station.slot = null;
    if (!next) return;
    packet.state = 'moving';
    packet.target = index + 1;
    next.incoming += 1;
    lane.transit.push(packet);
  }

  private emit(lane: Lane, force: boolean): void {
    if (!this.onChange) return;
    const waiting = lane.stations.reduce((sum, station) => sum + station.buffer.length, 0);
    const signature = `${lane.done}|${lane.hollow}|${lane.failed}|${waiting}|${lane.down}|${lane.locked}`;
    if (!force && signature === lane.lastSignature) return;
    lane.lastSignature = signature;
    this.onChange(lane.cfg.id, {
      done: lane.done,
      hollow: lane.hollow,
      failed: lane.failed,
      waiting,
      down: lane.down,
      locked: lane.locked,
    });
  }

  /* ───────────────────────── desenho ───────────────────────── */

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.draw();
  }

  private geometry(index: number) {
    const isHero = this.variant === 'hero';
    const laneHeight = this.height / this.lanes.length;
    const top = laneHeight * index;
    const lineY = Math.round(top + laneHeight * (isHero ? 0.66 : 0.62)) + 0.5;
    const inset = isHero ? 0 : 6;
    const x0 = inset + (isHero ? 3 : 8);
    const x1 = this.width - inset - (isHero ? 3 : 8);
    return { top, laneHeight, lineY, x0, x1, size: isHero ? 6 : 10 };
  }

  private draw(): void {
    const { ctx } = this;
    if (!this.width || !this.height) return;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    this.lanes.forEach((lane, index) => this.drawLane(lane, index));
  }

  private drawLane(lane: Lane, index: number): void {
    const { ctx } = this;
    const isHero = this.variant === 'hero';
    const { lineY, x0, x1, size, laneHeight } = this.geometry(index);
    const span = x1 - x0;
    const xAt = (fraction: number) => x0 + fraction * span;
    const color = lane.cfg.color;
    const showStationLabels = !isHero || this.width >= 620;

    // Linha base
    ctx.strokeStyle = lane.hover ? PALETTE.lineHover : PALETTE.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, lineY);
    ctx.lineTo(x1, lineY);
    ctx.stroke();

    // Rótulo da linha e contador (só no hero; no detalhe o contador fica no HTML)
    if (isHero) {
      const labelY = lineY - laneHeight * 0.42;
      ctx.font = `500 13px ${FONT}`;
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';
      ctx.fillStyle = color;
      ctx.fillText(lane.cfg.label, x0, labelY);

      const value = numberFormat.format(lane.done);
      ctx.textAlign = 'right';
      ctx.font = `400 12px ${FONT}`;
      ctx.fillStyle = PALETTE.muted;
      const suffix = this.width >= 520 ? ` ${lane.cfg.counter}` : '';
      ctx.fillText(suffix, x1, labelY);
      const suffixWidth = ctx.measureText(suffix).width;
      ctx.font = `500 12px ${FONT}`;
      ctx.fillStyle = PALETTE.text;
      ctx.fillText(value, x1 - suffixWidth, labelY);
    }

    // Estações
    lane.stations.forEach((station) => {
      const x = Math.round(xAt(station.cfg.at)) + 0.5;
      ctx.strokeStyle = PALETTE.tick;
      ctx.beginPath();
      ctx.moveTo(x, lineY - 4);
      ctx.lineTo(x, lineY + 4);
      ctx.stroke();

      if (!showStationLabels) return;
      let label = station.cfg.label;
      let labelColor = PALETTE.label;
      if (station.cfg.kind === 'worker' && lane.down) {
        label = `${label} · fora do ar`;
        labelColor = color;
      }
      if (station.cfg.kind === 'gate' && lane.locked) {
        label = `${label} · fechada`;
        labelColor = color;
      }
      ctx.font = `400 ${isHero ? 11 : 13}px ${FONT}`;
      ctx.textBaseline = 'top';
      ctx.textAlign = station.cfg.at <= 0.02 ? 'left' : station.cfg.at >= 0.98 ? 'right' : 'center';
      ctx.fillStyle = labelColor;
      ctx.fillText(label, station.cfg.at <= 0.02 ? x0 : station.cfg.at >= 0.98 ? x1 : x, lineY + (isHero ? 9 : 14));
    });

    // Buffers empilhados acima da estação
    const maxStack = isHero ? 4 : 8;
    lane.stations.forEach((station) => {
      if (station.buffer.length === 0) return;
      const x = xAt(station.cfg.at);
      const visible = Math.min(station.buffer.length, maxStack);
      for (let k = 0; k < visible; k += 1) {
        const packet = station.buffer[k];
        const y = lineY - size - 5 - k * (size + 2);
        this.drawSquare(x, y + size / 2, size, color, packet.hollow, 1);
      }
      if (station.buffer.length > maxStack) {
        ctx.font = `500 ${isHero ? 10 : 12}px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = color;
        ctx.fillText(`+${station.buffer.length - maxStack}`, x, lineY - 6 - visible * (size + 2) - 2);
      }
    });

    // Item em processamento + barra de progresso
    lane.stations.forEach((station) => {
      const packet = station.slot;
      if (!packet || station.cfg.kind === 'source') return;
      const x = xAt(station.cfg.at);
      const duration =
        station.cfg.kind === 'remote' && packet.uncertain ? lane.cfg.reconcileMs ?? 2400 : station.cfg.serviceMs ?? 1;
      const progress = Math.min(packet.t / Math.max(duration, 1), 1);

      if (packet.uncertain) {
        const blink = 0.35 + 0.65 * Math.abs(Math.sin(this.clock / 160));
        this.drawSquare(x, lineY, size + 2, color, true, blink);
        ctx.font = `500 ${isHero ? 11 : 13}px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = color;
        ctx.fillText(isHero ? '?' : 'resposta perdida · reconciliando', x, lineY - size - 8);
      } else {
        this.drawSquare(x, lineY, size + 2, color, packet.hollow, 1);
      }

      const barWidth = isHero ? 16 : 28;
      ctx.fillStyle = PALETTE.tick;
      ctx.fillRect(x - barWidth / 2, lineY + (isHero ? 5 : 8), barWidth, 2);
      ctx.fillStyle = color;
      ctx.fillRect(x - barWidth / 2, lineY + (isHero ? 5 : 8), barWidth * progress, 2);
    });

    // Itens em trânsito
    for (const packet of lane.transit) {
      this.drawSquare(xAt(packet.x), lineY, size, color, packet.hollow, 1);
    }

    // Saindo (entregues somem; falhas viram um X)
    for (const packet of lane.exiting) {
      const x = xAt(lane.stations[packet.target]?.cfg.at ?? packet.x);
      if (packet.failed) {
        const arm = size * 0.7;
        ctx.strokeStyle = PALETTE.failed;
        ctx.globalAlpha = packet.fade;
        ctx.beginPath();
        ctx.moveTo(x - arm, lineY - arm - size);
        ctx.lineTo(x + arm, lineY + arm - size);
        ctx.moveTo(x + arm, lineY - arm - size);
        ctx.lineTo(x - arm, lineY + arm - size);
        ctx.stroke();
        ctx.globalAlpha = 1;
        continue;
      }
      const drift = (1 - packet.fade) * size * 2;
      this.drawSquare(x + drift, lineY, size, color, packet.hollow, packet.fade);
    }
  }

  private drawSquare(cx: number, cy: number, size: number, color: string, hollow: boolean, alpha: number): void {
    const { ctx } = this;
    const half = size / 2;
    ctx.globalAlpha = alpha;
    if (hollow) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(Math.round(cx - half) + 0.5, Math.round(cy - half) + 0.5, size - 1, size - 1);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(cx - half), Math.round(cy - half), size, size);
    }
    ctx.globalAlpha = 1;
  }

  /* ───────────────────────── interação (hero) ───────────────────────── */

  private laneIndexAt(clientY: number): number {
    const rect = this.canvas.getBoundingClientRect();
    const y = clientY - rect.top;
    const index = Math.floor(y / (rect.height / this.lanes.length));
    return Math.max(0, Math.min(this.lanes.length - 1, index));
  }

  private readonly handlePointerMove = (event: PointerEvent): void => {
    const index = this.laneIndexAt(event.clientY);
    let changed = false;
    this.lanes.forEach((lane, i) => {
      const hover = i === index;
      if (lane.hover !== hover) changed = true;
      lane.hover = hover;
    });
    this.canvas.dataset.lane = this.lanes[index]?.cfg.id ?? '';
    if (changed && !this.frame) this.draw();
  };

  private readonly handlePointerLeave = (): void => {
    this.lanes.forEach((lane) => (lane.hover = false));
    delete this.canvas.dataset.lane;
    if (!this.frame) this.draw();
  };

  private readonly handleClick = (event: MouseEvent): void => {
    const lane = this.lanes[this.laneIndexAt(event.clientY)];
    if (lane) this.burst(lane.cfg.id);
  };

  private findLane(id: string): Lane | undefined {
    return this.lanes.find((lane) => lane.cfg.id === id);
  }
}
