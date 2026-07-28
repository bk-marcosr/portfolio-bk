document.addEventListener('DOMContentLoaded', () => {
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
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
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
      mobileMenuBtn.classList.toggle('active');
      document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileOverlay.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 4. DARK MODE TOGGLE
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  if (themeToggle) {
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  // 5. TERMINAL TYPING EFFECT
  const typingLine = document.getElementById('typingLine');
  const commands = [
    './start --mode=production',
    'deploy --env=production',
    'npm run build:all',
    'docker-compose up -d',
    'git push origin main',
  ];
  let cmdIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 60;

  function typeEffect() {
    if (!typingLine) return;

    const currentCmd = commands[cmdIndex];

    if (isDeleting) {
      typingLine.textContent = currentCmd.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 25;
    } else {
      typingLine.textContent = currentCmd.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 60;
    }

    if (!isDeleting && charIndex === currentCmd.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      cmdIndex = (cmdIndex + 1) % commands.length;
      typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  if (typingLine) {
    setTimeout(typeEffect, 1500);
  }

  // 6. ANIMATED COUNTERS
  const counters = document.querySelectorAll('.stat-counter');

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const current = parseFloat(counter.textContent) || 0;
      const increment = target / 60;

      if (current < target) {
        const next = Math.min(current + increment, target);
        counter.textContent = Math.floor(next);
        requestAnimationFrame(animateCounters);
      } else {
        counter.textContent = target;
      }
    });
  }

  const statsBar = document.querySelector('.stats-bar');
  let countersAnimated = false;

  function checkCounters() {
    if (countersAnimated || !statsBar) return;
    const rect = statsBar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      countersAnimated = true;
      animateCounters();
    }
  }

  window.addEventListener('scroll', checkCounters);
  checkCounters();
});
