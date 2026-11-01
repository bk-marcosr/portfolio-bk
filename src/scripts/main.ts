import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { SystemSim } from './sim/engine';
import { COLORS, HERO_LANES, LANES } from './sim/lanes';
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
  if (reducedMotion) return;

  const hero = document.querySelector<HTMLElement>('[data-split="hero"]');
  if (hero) {
    SplitText.create(hero, {
      type: 'lines,chars',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) => {
        document.documentElement.classList.add('motion-ready');
        return gsap.from(self.chars, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.035, delay: 0.1 });
      },
    });
  } else {
    document.documentElement.classList.add('motion-ready');
  }

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

  const statement = document.querySelector<HTMLElement>('[data-split="words"]');
  if (statement) {
    SplitText.create(statement, {
      type: 'words',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 50%', scrub: 0.6 },
          },
        ),
    });
  }
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

function initHeroSim(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas[data-sim="hero"]');
  if (!canvas) return;
  new SystemSim({ canvas, lanes: HERO_LANES, variant: 'hero' });
}

const ANNOUNCE: Record<string, (counts: LaneCounts) => string | null> = {
  campanhas: (c) => (c.down ? `Provedor fora do ar. ${c.waiting} mensagens seguras na fila.` : null),
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
    const interactive = target?.closest('a, button, canvas, [data-magnetic]');
    cursor.dataset.state = interactive ? 'active' : '';

    let color: string | undefined;
    if (target instanceof HTMLCanvasElement && target.dataset.sim === 'hero') {
      color = COLORS[target.dataset.lane as LaneId];
    }
    color ??= target?.closest<HTMLElement>('[data-cursor-color]')?.dataset.cursorColor;
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
  initHeroSim();
  initDetailSims();
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
