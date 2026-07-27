/* ============================================================
   CORE
   Navigation, scroll spy and mobile menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const floatingNav = document.getElementById('floatingNav');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  let navTicking = false;
  let spyTicking = false;

  function setScrolledNav() {
    if (!floatingNav) return;
    floatingNav.classList.toggle('scrolled', window.scrollY > 60);
    navTicking = false;
  }

  function updateActiveNav() {
    const offsetY = window.scrollY + 180;
    let activeId = sections[0]?.getAttribute('id') || '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (offsetY >= sectionTop && offsetY < sectionBottom) {
        activeId = section.getAttribute('id') || activeId;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });

    spyTicking = false;
  }

  function closeMobileMenu() {
    if (!mobileMenuBtn || !mobileOverlay) return;
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'Abrir menu');
    mobileOverlay.classList.remove('active');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    if (!mobileMenuBtn || !mobileOverlay) return;
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileMenuBtn.setAttribute('aria-label', 'Fechar menu');
    mobileOverlay.classList.add('active');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function toggleMobileMenu() {
    if (!mobileOverlay?.classList.contains('active')) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
  }

  window.addEventListener('scroll', () => {
    if (!navTicking) {
      requestAnimationFrame(setScrolledNav);
      navTicking = true;
    }

    if (!spyTicking) {
      requestAnimationFrame(updateActiveNav);
      spyTicking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMobileMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  if (mobileMenuBtn && mobileOverlay) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  setScrolledNav();
  updateActiveNav();
});
