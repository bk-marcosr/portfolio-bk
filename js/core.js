/* ============================================================
   CORE — Scroll spy, mobile menu, theme toggle
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ——— SCROLL SPY ———
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateSpy() {
    var scrollY = window.scrollY + 140;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', function () {
    requestAnimationFrame(updateSpy);
  });
  updateSpy();

  // ——— MOBILE MENU ———
  var mobileBtn = document.getElementById('mobileMenuBtn');
  var mobileOverlay = document.getElementById('mobileOverlay');
  var mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileBtn && mobileOverlay) {
    mobileBtn.addEventListener('click', function () {
      mobileOverlay.classList.toggle('active');
      mobileBtn.classList.toggle('active');
      document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileOverlay.classList.remove('active');
        mobileBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ——— THEME TOGGLE ———
  var toggleBtn = document.getElementById('themeToggle');
  var icon = document.getElementById('themeIcon');
  var html = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (icon) icon.textContent = theme === 'dark' ? '☀' : '☽';
  }

  if (toggleBtn) {
    var current = html.getAttribute('data-theme') || 'dark';
    if (icon) icon.textContent = current === 'dark' ? '☀' : '☽';

    toggleBtn.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

});
