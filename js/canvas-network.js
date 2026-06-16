/* ============================================================
   CANVAS NETWORK
   Neural intelligence background animation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let pulses = [];
  let canvasW, canvasH;
  let animFrameId = null;
  let mouseX = -1000, mouseY = -1000;

  function initCanvas() {
    canvasW = canvas.width = window.innerWidth;
    canvasH = canvas.height = window.innerHeight;

    const density = canvasW < 768 ? 20 : canvasW < 1200 ? 40 : 60;
    particles = [];

    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * canvasW,
        y: Math.random() * canvasH,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.5 + 0.5,
        baseOpacity: Math.random() * 0.3 + 0.1
      });
    }
    pulses = [];
  }

  function spawnPulse() {
    const maxDist = 180;
    for (let attempts = 0; attempts < 20; attempts++) {
      const a = Math.floor(Math.random() * particles.length);
      const b = Math.floor(Math.random() * particles.length);
      if (a === b) continue;

      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist && dist > 50) {
        pulses.push({
          from: a,
          to: b,
          progress: 0,
          speed: 0.008 + Math.random() * 0.008
        });
        break;
      }
    }
  }

  // Neon Blue/Purple Accent
  const r = 139, g = 92, b = 246;

  function drawNetwork() {
    ctx.clearRect(0, 0, canvasW, canvasH);
    const maxDist = 150;

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.08;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse interaction
      const dmx = p.x - mouseX;
      const dmy = p.y - mouseY;
      const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
      if (mouseDist < 120 && mouseDist > 0) {
        const force = (1 - mouseDist / 120) * 0.4;
        p.vx += (dmx / mouseDist) * force;
        p.vy += (dmy / mouseDist) * force;
      }

      p.vx *= 0.99;
      p.vy *= 0.99;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.baseOpacity})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = canvasW + 20;
      if (p.x > canvasW + 20) p.x = -20;
      if (p.y < -20) p.y = canvasH + 20;
      if (p.y > canvasH + 20) p.y = -20;
    }

    // Pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
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
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.1 * fade})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * fade})`;
      ctx.fill();
    }

    if (pulses.length < 5 && Math.random() < 0.02) {
      spawnPulse();
    }

    animFrameId = requestAnimationFrame(drawNetwork);
  }

  function startCanvas() {
    if (!animFrameId) drawNetwork();
  }
  function stopCanvas() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  initCanvas();
  startCanvas();

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    heroSection.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.isIntersecting ? startCanvas() : stopCanvas();
      });
    }, { threshold: 0 });
    heroObserver.observe(heroSection);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initCanvas, 200);
  });
});
