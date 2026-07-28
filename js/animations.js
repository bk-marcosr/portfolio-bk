document.addEventListener('DOMContentLoaded', () => {
  const revealMap = {
    'reveal': { opacity: 0, transform: 'translateY(24px)' },
    'reveal-left': { opacity: 0, transform: 'translateX(-24px)' },
    'reveal-right': { opacity: 0, transform: 'translateX(24px)' },
    'reveal-scale': { opacity: 0, transform: 'scale(0.95)' },
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('[class*="reveal"]').forEach(el => {
    observer.observe(el);
  });
});
