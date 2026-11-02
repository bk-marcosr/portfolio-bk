import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { SystemSim } from './sim/engine';
import { LANES } from './sim/lanes';
import type { LaneCounts } from './sim/types';

type LaneId = keyof typeof LANES;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const numberFormat = new Intl.NumberFormat('pt-BR');

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ───────────────────────── scroll suave ───────────────────────── */

function initSmoothScroll(): void {
  if (reducedMotion) return;
  const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -64 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ───────────────────────── tipografia em movimento ───────────────────────── */

function initTextMotion(): void {
  document.documentElement.classList.add('motion-ready');
  if (reducedMotion) return;

  document.querySelectorAll<HTMLElement>('[data-split="chapter"], [data-split="lines"]').forEach((element) => {
    const chars = element.dataset.split === 'chapter';
    SplitText.create(element, {
      type: chars ? 'lines,chars' : 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(chars ? self.chars : self.lines, {
          yPercent: 110,
          duration: 1,
          ease: 'expo.out',
          stagger: chars ? 0.025 : 0.08,
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        }),
    });
  });
}

function initReveals(): void {
  if (reducedMotion) return;

  gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach((element, i) => {
    gsap.from(element, { opacity: 0, duration: 1.2, ease: 'power2.out', delay: 0.6 + i * 0.15 });
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal="up"]').forEach((element) => {
    gsap.from(element, {
      y: 36,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: element, start: 'top 90%', once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal="clip"]').forEach((element) => {
    gsap.fromTo(
      element,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.3,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-chapter]').forEach((chapter) => {
    const bar = chapter.querySelector<HTMLElement>('[data-bar]');
    if (!bar) return;
    gsap.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top 90%', end: 'top 35%', scrub: true } },
    );
  });
}

/* ───────────────────────── simulações ───────────────────────── */

function initHeroIntro(): void {
  if (reducedMotion) return;
  const portrait = document.querySelector<HTMLElement>('[data-hero-portrait]');
  const marquee = document.querySelector<HTMLElement>('[data-hero-name]');
  // Entrada nos filhos; o parallax de rolagem fica nos contêineres para as animações não brigarem.
  const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const photo = portrait?.firstElementChild;
  const name = marquee?.firstElementChild;
  if (photo) timeline.from(photo, { yPercent: 14, opacity: 0, duration: 1.6 }, 0.1);
  if (name) timeline.from(name, { yPercent: 60, opacity: 0, duration: 1.4 }, 0.35);

  // Ao rolar, a foto desce mais devagar que a página e o nome sobe.
  const hero = portrait?.closest('section');
  if (!hero) return;
  const scroll = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
  if (portrait) gsap.to(portrait, { yPercent: 18, ease: 'none', scrollTrigger: scroll });
  if (marquee) gsap.to(marquee, { yPercent: -60, ease: 'none', scrollTrigger: { ...scroll } });
}

/* ───────────────────────── faixas que correm ───────────────────────── */

function initMarquees(): void {
  const tracks = [...document.querySelectorAll<HTMLElement>('[data-marquee]')];
  if (tracks.length === 0 || reducedMotion) return;

  // Rolar para baixo empurra as faixas no sentido delas; rolar para cima inverte.
  let scrollDirection = 1;
  let boost = 0;
  let lastY = window.scrollY;
  window.addEventListener(
    'scroll',
    () => {
      const delta = window.scrollY - lastY;
      lastY = window.scrollY;
      if (delta === 0) return;
      scrollDirection = delta > 0 ? 1 : -1;
      boost = Math.min(Math.abs(delta) * 9, 900);
    },
    { passive: true },
  );

  tracks.forEach((track) => {
    const copy = track.querySelector<HTMLElement>('[data-marquee-copy]');
    if (!copy) return;
    const ownDirection = Number(track.dataset.marqueeDirection) || -1;
    const speed = Number(track.dataset.marqueeSpeed) || 70;
    const setX = gsap.quickSetter(track, 'x', 'px') as (value: number) => void;
    let width = copy.offsetWidth;
    let x = ownDirection > 0 ? -width : 0;
    let visible = true;

    new ResizeObserver(() => (width = copy.offsetWidth)).observe(copy);
    new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(track);

    gsap.ticker.add((_, deltaMs) => {
      if (!visible || width === 0) return;
      x += ownDirection * scrollDirection * (speed + boost) * (deltaMs / 1000);
      if (x <= -width) x += width;
      else if (x > 0) x -= width;
      setX(x);
    });
  });

  gsap.ticker.add(() => {
    boost *= 0.94;
  });
}

/* ───────────────────────── lista de trabalhos ───────────────────────── */

function initWorkIndex(): void {
  const list = document.querySelector<HTMLElement>('[data-work]');
  const preview = document.querySelector<HTMLElement>('[data-work-preview]');
  const track = preview?.querySelector<HTMLElement>('[data-work-track]');
  if (!list || !preview || !track || !finePointer || reducedMotion) return;

  const rows = [...list.querySelectorAll<HTMLElement>('[data-work-row]')];
  const videos = [...preview.querySelectorAll<HTMLVideoElement>('video')];
  gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
  const toX = gsap.quickTo(preview, 'x', { duration: 0.65, ease: 'power3.out' });
  const toY = gsap.quickTo(preview, 'y', { duration: 0.65, ease: 'power3.out' });
  let active = -1;
  let open = false;

  const select = (index: number): void => {
    if (index === active) return;
    active = index;
    gsap.to(track, { yPercent: -100 * index, duration: 0.7, ease: 'expo.out' });
    videos.forEach((video) => {
      if (Number(video.dataset.index) === index) video.play().catch(() => undefined);
      else video.pause();
    });
  };

  const hide = (): void => {
    if (!open) return;
    open = false;
    active = -1;
    gsap.to(preview, { scale: 0.6, autoAlpha: 0, duration: 0.35, ease: 'power3.in', overwrite: 'auto' });
    videos.forEach((video) => video.pause());
  };

  // A prévia fica ao lado do cursor (não em cima do nome) e troca de lado perto da borda.
  const targetX = (clientX: number): number => {
    const half = preview.offsetWidth / 2;
    const gap = 56;
    return clientX + gap + half * 2 < window.innerWidth - 16 ? clientX + gap + half : clientX - gap - half;
  };

  list.addEventListener('pointerenter', (event) => {
    open = true;
    gsap.set(preview, { x: targetX(event.clientX), y: event.clientY });
    gsap.to(preview, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
  });
  list.addEventListener('pointermove', (event) => {
    toX(targetX(event.clientX));
    toY(event.clientY);
  });
  list.addEventListener('pointerleave', hide);
  rows.forEach((row, index) => row.addEventListener('pointerenter', () => select(index)));

  // Rolar com o mouse parado tira a lista de baixo do cursor sem disparar pointerleave.
  window.addEventListener(
    'scroll',
    () => {
      if (!open) return;
      const rect = list.getBoundingClientRect();
      const y = Number(gsap.getProperty(preview, 'y'));
      if (y < rect.top || y > rect.bottom) hide();
    },
    { passive: true },
  );
}

/* ───────────────────────── trajetória ───────────────────────── */

function initLedger(): void {
  document.querySelectorAll<HTMLElement>('[data-ledger-row]').forEach((row) => {
    const button = row.querySelector<HTMLButtonElement>('[data-ledger-toggle]');
    const panel = row.querySelector<HTMLElement>('[data-ledger-panel]');
    if (!button || !panel) return;

    const setOpen = (open: boolean): void => {
      row.toggleAttribute('data-open', open);
      button.setAttribute('aria-expanded', String(open));
      panel.style.gridTemplateRows = open ? '1fr' : '0fr';
      panel.inert = !open;
    };

    // Sem JS tudo fica aberto; com JS a lista começa fechada.
    setOpen(false);
    button.addEventListener('click', () => {
      setOpen(button.getAttribute('aria-expanded') !== 'true');
      window.setTimeout(() => ScrollTrigger.refresh(), 520);
    });
  });

  if (reducedMotion) return;
  const pills = document.querySelectorAll<HTMLElement>('[data-pill]');
  if (pills.length === 0) return;
  gsap.from(pills, {
    width: 0,
    duration: 1.1,
    ease: 'expo.out',
    stagger: 0.12,
    scrollTrigger: { trigger: pills[0], start: 'top 85%', once: true },
  });
}

/* ───────────────────────── relógio de Belém ───────────────────────── */

function initClock(): void {
  const nodes = document.querySelectorAll<HTMLElement>('[data-clock]');
  if (nodes.length === 0) return;
  const format = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Belem', hour: '2-digit', minute: '2-digit' });
  const tick = (): void => {
    const time = format.format(new Date());
    nodes.forEach((node) => {
      node.textContent = node.dataset.clockFormat === 'long' ? `Belém, PA · ${time}` : `${time} · UTC−3`;
    });
  };
  tick();
  window.setInterval(tick, 15_000);
}

const ANNOUNCE: Record<string, (counts: LaneCounts) => string | null> = {
  talos: (c) => (c.down ? `Gemini fora do ar. ${c.diverted} mensagens já foram para um humano.` : null),
  rotor: (c) => (c.locked && c.waiting > 0 ? `Trava fechada. ${c.waiting} ordens esperando a reconciliação.` : null),
};

function initDetailSims(): void {
  document.querySelectorAll<HTMLElement>('[data-sim-block]').forEach((block) => {
    const laneId = block.dataset.lane as LaneId | undefined;
    const canvas = block.querySelector<HTMLCanvasElement>('canvas[data-sim="detail"]');
    if (!laneId || !canvas || !LANES[laneId]) return;

    const valueNodes = new Map<string, HTMLElement>();
    block.querySelectorAll<HTMLElement>('[data-counter]').forEach((node) => {
      const value = node.querySelector<HTMLElement>('[data-value]');
      if (node.dataset.counter && value) valueNodes.set(node.dataset.counter, value);
    });
    const live = block.querySelector<HTMLElement>('[data-live]');
    let lastAnnouncement = '';

    const sim = new SystemSim({
      canvas,
      lanes: [LANES[laneId]],
      variant: 'detail',
      onChange: (_, counts) => {
        valueNodes.forEach((node, field) => {
          const value = counts[field as keyof LaneCounts];
          if (typeof value === 'number') node.textContent = numberFormat.format(value);
        });
        const message = ANNOUNCE[laneId]?.(counts) ?? '';
        if (live && message !== lastAnnouncement) {
          live.textContent = message;
          lastAnnouncement = message;
        }
      },
    });

    block.querySelectorAll<HTMLButtonElement>('button[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        if (action === 'burst') {
          sim.burst(laneId, Number(button.dataset.amount) || undefined);
          return;
        }
        if (action === 'lose-response') {
          sim.loseNextResponse(laneId);
          return;
        }
        if (action === 'toggle-down') {
          const down = button.getAttribute('aria-pressed') !== 'true';
          button.setAttribute('aria-pressed', String(down));
          button.textContent = (down ? button.dataset.labelActive : button.dataset.label) ?? '';
          sim.setDown(laneId, down);
        }
      });
    });
  });
}

/* ───────────────────────── vídeos da interface real ───────────────────────── */

function initVideos(): void {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]');
  if (videos.length === 0) return;

  // Quem prefere menos movimento recebe controles e decide quando tocar.
  if (reducedMotion) {
    videos.forEach((video) => {
      video.controls = true;
      video.preload = 'metadata';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          video.play().catch(() => {
            video.controls = true;
          });
          return;
        }
        video.pause();
      });
    },
    { threshold: 0.35 },
  );
  videos.forEach((video) => observer.observe(video));
}

/* ───────────────────────── cursor e detalhes ───────────────────────── */

function initCursor(): void {
  if (!finePointer || reducedMotion) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  document.documentElement.classList.add('has-cursor');

  const moveX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  const moveY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });
  let pointerX = -100;
  let pointerY = -100;

  const describe = (target: Element | null): void => {
    const label = target?.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel ?? '';
    const interactive = target?.closest('a, button, canvas, [data-magnetic]');
    cursor.dataset.state = label ? 'label' : interactive ? 'active' : '';
    if (cursor.textContent !== label) cursor.textContent = label;

    const color = target?.closest<HTMLElement>('[data-cursor-color]')?.dataset.cursorColor;
    cursor.style.setProperty('--cursor-c', color ?? '#eeeeec');
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.style.opacity = '1';
      moveX(pointerX);
      moveY(pointerY);
      describe(event.target instanceof Element ? event.target : null);
    },
    { passive: true },
  );

  // Rolar muda o que está sob o cursor sem disparar pointermove.
  window.addEventListener('scroll', () => describe(document.elementFromPoint(pointerX, pointerY)), { passive: true });
  document.addEventListener('pointerleave', () => (cursor.style.opacity = '0'));
}

function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let lastY = window.scrollY;

  const update = (): void => {
    const y = window.scrollY;
    header.toggleAttribute('data-scrolled', y > 24);
    header.toggleAttribute('data-hidden', y > lastY && y > 160);
    lastY = y;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  header.addEventListener('focusin', () => header.removeAttribute('data-hidden'));
}

function initMagnetic(): void {
  if (!finePointer || reducedMotion) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((element) => {
    const toX = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' });
    const toY = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' });
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      toX((event.clientX - (rect.left + rect.width / 2)) * 0.12);
      toY((event.clientY - (rect.top + rect.height / 2)) * 0.2);
    });
    element.addEventListener('pointerleave', () => {
      toX(0);
      toY(0);
    });
  });
}

function initCopy(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const status = button.querySelector<HTMLElement>('[data-copy-status]');
    const original = status?.textContent ?? '';
    let timer = 0;

    button.addEventListener('click', async () => {
      const text = button.dataset.copy ?? '';
      try {
        await navigator.clipboard.writeText(text);
        if (status) status.textContent = 'Copiado. Te espero na caixa de entrada.';
      } catch {
        window.location.href = `mailto:${text}`;
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (status) status.textContent = original;
      }, 2400);
    });
  });
}

/* ───────────────────────── boot ───────────────────────── */

function boot(): void {
  initSmoothScroll();
  initClock();
  initHeroIntro();
  initMarquees();
  initWorkIndex();
  initLedger();
  initDetailSims();
  initVideos();
  initCopy();
  initHeader();
  initCursor();
  initMagnetic();

  const startMotion = () => {
    initTextMotion();
    initReveals();
    ScrollTrigger.refresh();
  };
  // Espera a fonte para que o SplitText meça as linhas certas.
  if (document.fonts?.ready) document.fonts.ready.then(startMotion).catch(startMotion);
  else startMotion();
}

boot();
