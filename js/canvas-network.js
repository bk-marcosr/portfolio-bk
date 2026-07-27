/* ============================================================
   CANVAS NETWORK
   Lightweight neural background animation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('neuralCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const pulses = [];
  const colorA = { r: 125, g: 211, b: 252 };
  const colorB = { r: 52, g: 211, b: 153 };

  let canvasW = 0;
  let canvasH = 0;
  let dpr = 1;
  let animFrameId = null;
  let resizeTimer = null;
  let mouseX = -1000;
  let mouseY = -1000;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasW = window.innerWidth;
    canvasH = window.innerHeight;
    canvas.width = Math.floor(canvasW * dpr);
    canvas.height = Math.floor(canvasH * dpr);
    canvas.style.width = `${canvasW}px`;
    canvas.style.height = `${canvasH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles() {
    resizeCanvas();
    particles.length = 0;
    pulses.length = 0;

    const density = canvasW < 768 ? 22 : canvasW < 1200 ? 42 : 62;

    for (let i = 0; i < density; i += 1) {
      particles.push({
        x: Math.random() * canvasW,
        y: Math.random() * canvasH,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        radius: Math.random() * 1.4 + 0.55,
        opacity: Math.random() * 0.26 + 0.08
      });
    }
  }

  function spawnPulse() {
    const maxDist = canvasW < 768 ? 120 : 170;

    for (let attempts = 0; attempts < 18; attempts += 1) {
      const from = Math.floor(Math.random() * particles.length);
      const to = Math.floor(Math.random() * particles.length);
      if (from === to) continue;

      const dx = particles[from].x - particles[to].x;
      const dy = particles[from].y - particles[to].y;
      const dist = Math.hypot(dx, dy);

      if (dist < maxDist && dist > 42) {
        pulses.push({
          from,
          to,
          progress: 0,
          speed: 0.007 + Math.random() * 0.008
        });
        break;
      }
    }
  }

  function updateParticle(particle) {
    const dx = particle.x - mouseX;
    const dy = particle.y - mouseY;
    const mouseDist = Math.hypot(dx, dy);

    if (mouseDist < 120 && mouseDist > 0) {
      const force = (1 - mouseDist / 120) * 0.3;
      particle.vx += (dx / mouseDist) * force;
      particle.vy += (dy / mouseDist) * force;
    }

    particle.vx *= 0.985;
    particle.vy *= 0.985;
    particle.vx = Math.max(Math.min(particle.vx, 1.2), -1.2);
    particle.vy = Math.max(Math.min(particle.vy, 1.2), -1.2);

    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -24) particle.x = canvasW + 24;
    if (particle.x > canvasW + 24) particle.x = -24;
    if (particle.y < -24) particle.y = canvasH + 24;
    if (particle.y > canvasH + 24) particle.y = -24;
  }

  function drawConnections() {
    const maxDist = canvasW < 768 ? 105 : 150;

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.08;
          ctx.strokeStyle = `rgba(${colorA.r}, ${colorA.g}, ${colorA.b}, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function drawParticles() {
    particles.forEach((particle, index) => {
      updateParticle(particle);

      const color = index % 3 === 0 ? colorB : colorA;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity})`;
      ctx.fill();
    });
  }

  function drawPulses() {
    for (let i = pulses.length - 1; i >= 0; i -= 1) {
      const pulse = pulses[i];
      pulse.progress += pulse.speed;

      if (pulse.progress >= 1) {
        pulses.splice(i, 1);
        continue;
      }

      const from = particles[pulse.from];
      const to = particles[pulse.to];
      const x = from.x + (to.x - from.x) * pulse.progress;
      const y = from.y + (to.y - from.y) * pulse.progress;
      const fade = Math.sin(pulse.progress * Math.PI);

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorB.r}, ${colorB.g}, ${colorB.b}, ${0.13 * fade})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * fade})`;
      ctx.fill();
    }
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, canvasW, canvasH);
    drawConnections();
    drawParticles();
    drawPulses();

    if (pulses.length < 5 && Math.random() < 0.018) {
      spawnPulse();
    }

    animFrameId = requestAnimationFrame(drawNetwork);
  }

  function startCanvas() {
    if (!animFrameId) drawNetwork();
  }

  function stopCanvas() {
    if (!animFrameId) return;
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }

  initParticles();
  startCanvas();

  const heroSection = document.getElementById('hero');

  if (heroSection) {
    heroSection.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCanvas();
        } else {
          stopCanvas();
        }
      });
    }, { threshold: 0 });

    heroObserver.observe(heroSection);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopCanvas();
    } else {
      startCanvas();
    }
  });

  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(initParticles, 180);
  }, { passive: true });
});
