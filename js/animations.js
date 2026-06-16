/* ============================================================
   ANIMATIONS
   Scroll reveals and mouse-following glow
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL REVEAL (STAGGERED)
  const revealElements = document.querySelectorAll('.reveal');
  const heroReveals = document.querySelectorAll('.hero-content .reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent ? parent.querySelectorAll(':scope > .reveal') : [];
        const index = Array.from(siblings).indexOf(entry.target);
        const delay = index >= 0 ? index * 0.15 : 0;

        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe only non-hero elements
  revealElements.forEach(el => {
    let isHero = false;
    heroReveals.forEach(heroEl => {
      if (heroEl === el) isHero = true;
    });
    if (!isHero) revealObserver.observe(el);
  });

  // Hero custom entrance
  setTimeout(() => {
    heroReveals.forEach((el, i) => {
      el.style.transitionDelay = `${0.3 + i * 0.2}s`;
      el.classList.add('visible');
    });
  }, 100);

  // 2. BENTO CARD MOUSE GLOW
  const cards = document.querySelectorAll('.bento-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.background = `
        radial-gradient(
          800px circle at ${x}px ${y}px, 
          rgba(255,255,255,0.06),
          transparent 40%
        ),
        var(--bg-card)
      `;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.background = 'var(--bg-card)';
    });
  });
});
