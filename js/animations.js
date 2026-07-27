/* ============================================================
   ANIMATIONS
   Scroll reveals and subtle pointer spotlight
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal');
  const heroReveals = document.querySelectorAll('.hero-shell .reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const parent = entry.target.parentElement;
      const siblings = parent ? parent.querySelectorAll(':scope > .reveal') : [];
      const index = Array.from(siblings).indexOf(entry.target);
      const delay = index >= 0 ? index * 0.08 : 0;

      entry.target.style.transitionDelay = `${delay}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -56px 0px'
  });

  revealElements.forEach((element) => {
    if (!Array.from(heroReveals).includes(element)) {
      revealObserver.observe(element);
    }
  });

  setTimeout(() => {
    heroReveals.forEach((element, index) => {
      element.style.transitionDelay = `${0.14 + index * 0.1}s`;
      element.classList.add('visible');
    });
  }, 80);

  const spotlightCards = document.querySelectorAll('.project-card, .skill-card, .focus-card, .metric-card, .timeline-content, .contact-card, .about-panel');

  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.background = `
        radial-gradient(
          620px circle at ${x}px ${y}px,
          rgba(125, 211, 252, 0.075),
          transparent 42%
        ),
        var(--bg-card)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
});
