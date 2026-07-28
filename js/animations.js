/* ============================================================
   ANIMATIONS — Lenis smooth scroll + GSAP ScrollTrigger
   Immersive, physics-based, silky-smooth.
   ============================================================ */

(function () {
  'use strict';

  // ——— LENIS SMOOTH SCROLL ———
  const lenis = new Lenis({
    duration: 1.2,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  // Sync Lenis RAF with GSAP ticker
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // ——— GSAP ScrollTrigger Defaults ———
  gsap.registerPlugin(ScrollTrigger);

  // ——— HERO — Staggered reveal from bottom ———
  var heroEls = document.querySelectorAll('.hero .gs-hidden');
  if (heroEls.length) {
    gsap.fromTo(heroEls, {
      opacity: 0,
      y: 60,
    }, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'expo.out',
      delay: 0.3,
    });
  }

  // ——— SECTION ELEMENTS — Scroll-triggered reveals ———
  var gsHidden = document.querySelectorAll('main .gs-hidden:not(.hero .gs-hidden)');

  gsHidden.forEach(function (el) {
    gsap.fromTo(el, {
      opacity: 0,
      y: 40,
    }, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        end: 'top 55%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'expo.out',
    });
  });

  // ——— LEFT/RIGHT reveals ———
  var gsLeft = document.querySelectorAll('.gs-hidden-left');
  gsLeft.forEach(function (el) {
    gsap.fromTo(el, {
      opacity: 0,
      x: -60,
    }, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      x: 0,
      duration: 1.1,
      ease: 'expo.out',
    });
  });

  var gsRight = document.querySelectorAll('.gs-hidden-right');
  gsRight.forEach(function (el) {
    gsap.fromTo(el, {
      opacity: 0,
      x: 60,
    }, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      x: 0,
      duration: 1.1,
      ease: 'expo.out',
    });
  });

  // ——— SCALE reveals ———
  var gsScale = document.querySelectorAll('.gs-hidden-scale');
  gsScale.forEach(function (el) {
    gsap.fromTo(el, {
      opacity: 0,
      scale: 0.92,
    }, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'expo.out',
    });
  });

  // ——— PROJECT IMAGES — Parallax subtle shift ———
  var projectVisuals = document.querySelectorAll('.project-visual img');
  projectVisuals.forEach(function (img) {
    gsap.fromTo(img, {
      yPercent: -5,
    }, {
      scrollTrigger: {
        trigger: img.closest('.project-item'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
      yPercent: 5,
      ease: 'none',
    });
  });

  // ——— SECTION DIVIDERS — Width expand on scroll ———
  var dividers = document.querySelectorAll('.section-divider');
  dividers.forEach(function (hr) {
    gsap.fromTo(hr, {
      scaleX: 0,
      transformOrigin: 'left center',
    }, {
      scrollTrigger: {
        trigger: hr,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
      scaleX: 1,
      duration: 1.4,
      ease: 'expo.inOut',
    });
  });

  // ——— SKILL TABLE ROWS — Staggered cascade ———
  var skillRows = document.querySelectorAll('.skill-row');
  if (skillRows.length) {
    gsap.fromTo(skillRows, {
      opacity: 0,
      x: -20,
    }, {
      scrollTrigger: {
        trigger: '.skills-table',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      x: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'expo.out',
    });
  }

  // ——— TIMELINE ROWS — Sequential stagger ———
  var timelineRows = document.querySelectorAll('.timeline-row');
  if (timelineRows.length) {
    gsap.fromTo(timelineRows, {
      opacity: 0,
      y: 30,
    }, {
      scrollTrigger: {
        trigger: '.timeline-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.18,
      ease: 'expo.out',
    });
  }

  // ——— NAV SCROLL STATE ———
  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: function (self) {
      var nav = document.getElementById('siteNav');
      if (!nav) return;
      if (self.direction === 1 && window.scrollY > 60) {
        nav.classList.add('scrolled');
      }
      if (window.scrollY <= 10) {
        nav.classList.remove('scrolled');
      }
    },
  });

  // ——— FALLBACK: reveal anything still hidden after 5s ———
  setTimeout(function () {
    var still = document.querySelectorAll('[class*="gs-hidden"]');
    still.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }, 5000);

})();
