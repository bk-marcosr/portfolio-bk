/* ============================================================
   ANIMATIONS — Lenis smooth scroll + GSAP ScrollTrigger
   Immersive, physics-based, silky-smooth navigation.
   ============================================================ */

(function () {
  'use strict';

  var HIDDEN_SELECTOR = '[class*="gs-hidden"]';

  function revealAll() {
    var hidden = document.querySelectorAll(HIDDEN_SELECTOR);
    hidden.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // Safety net registered FIRST: if anything below throws, content still appears.
  setTimeout(revealAll, 5000);

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // CDN blocked (adblock, corporate proxy, offline) or reduced motion → static page.
  if (prefersReducedMotion || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
    revealAll();
    return;
  }

  // ——— LENIS SMOOTH SCROLL (optional enhancement) ———
  var lenis = null;

  if (typeof window.Lenis !== 'undefined') {
    try {
      lenis = new Lenis({
        duration: 1.4,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 2,
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } catch (err) {
      lenis = null;
      console.warn('[animations] Lenis init failed, using native scroll.', err);
    }
  }

  window.__lenis = lenis;

  function scrollToTarget(target) {
    if (lenis) {
      lenis.scrollTo(target, { offset: target === 0 ? 0 : -80, duration: 1.8 });
      return;
    }
    if (target === 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    var top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  // ——— SMOOTH ANCHOR NAVIGATION via Lenis ———
  // All links with [data-scroll-to] will use Lenis scrollTo instead of native jump
  var anchorLinks = document.querySelectorAll('[data-scroll-to]');
  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;

      e.preventDefault();

      // Close mobile menu if open
      var overlay = document.getElementById('mobileOverlay');
      var btn = document.getElementById('mobileMenuBtn');
      if (overlay && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        if (btn) btn.classList.remove('active');
        document.body.style.overflow = '';
      }

      if (href === '#') {
        scrollToTarget(0);
        return;
      }

      var target = document.querySelector(href);
      if (target) scrollToTarget(target);
    });
  });

  // ——— GSAP ScrollTrigger ———
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
      stagger: 0.18,
      ease: 'expo.out',
      delay: 0.3,
    });
  }

  // ——— SCALE reveals (hero code card) ———
  var scaleEls = document.querySelectorAll('.gs-hidden-scale');
  if (scaleEls.length) {
    gsap.fromTo(scaleEls, {
      opacity: 0,
      scale: 0.92,
    }, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'expo.out',
      delay: 0.6,
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

  // ——— PROJECT IMAGES — Parallax subtle shift ———
  var projectVisuals = document.querySelectorAll('.project-visual img');
  projectVisuals.forEach(function (img) {
    gsap.fromTo(img, {
      yPercent: -8,
    }, {
      scrollTrigger: {
        trigger: img.closest('.project-item'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
      yPercent: 8,
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
    onUpdate: function () {
      var nav = document.getElementById('siteNav');
      if (!nav) return;
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    },
  });

})();
