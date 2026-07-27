/* ============================================================
   CORE
   Navigation, Scroll Spy, and Mobile Menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. FLOATING NAV SCROLL STATE
  const floatingNav = document.getElementById('floatingNav');
  let ticking = false;

  function onNavScroll() {
    if (window.scrollY > 10) {
      floatingNav.classList.add('scrolled');
    } else {
      floatingNav.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onNavScroll);
      ticking = true;
    }
  });

  // 2. SCROLL SPY
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let spyTicking = false;

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id || link.getAttribute('href') === '../index.html#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
    spyTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!spyTicking) {
      requestAnimationFrame(updateActiveNav);
      spyTicking = true;
    }
  });
  updateActiveNav();

  // 3. MOBILE MENU
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileOverlay.classList.toggle('active');
      document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
});
