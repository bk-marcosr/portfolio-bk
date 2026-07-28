(function() {
  var revealStyles = {
    'reveal': { opacity: '0', transform: 'translateY(24px)' },
    'reveal-left': { opacity: '0', transform: 'translateX(-24px)' },
    'reveal-right': { opacity: '0', transform: 'translateX(24px)' },
    'reveal-scale': { opacity: '0', transform: 'scale(0.95)' },
  };

  function revealIn(el) {
    el.style.opacity = '1';
    el.style.transform = 'none';
  }

  function initReveal() {
    var els = document.querySelectorAll('[class*="reveal"]');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) revealIn(els[i]);
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          revealIn(entries[i].target);
          observer.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      for (var cls in revealStyles) {
        if (el.classList.contains(cls)) {
          el.style.opacity = revealStyles[cls].opacity;
          el.style.transform = revealStyles[cls].transform;
          break;
        }
      }
      observer.observe(el);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }

  setTimeout(function() {
    var hidden = document.querySelectorAll('[class*="reveal"]:not([style*="opacity: 1"])');
    for (var i = 0; i < hidden.length; i++) revealIn(hidden[i]);
  }, 4000);
})();
