document.addEventListener('DOMContentLoaded', () => {

  // ======= PARTICLE CANVAS =======
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() < 0.5 ? '232,121,176' : '124,63,168';
        this.life = 0;
        this.maxLife = Math.random() * 300 + 150;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
          this.reset();
        }
      }
      draw() {
        const fade = Math.min(this.life / 30, (this.maxLife - this.life) / 30, 1);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity * fade})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(232,121,176,${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(tick);
    }
    tick();
  }

  // ======= NAV SCROLL =======
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  // ======= NAV LINKS =======
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ======= INTERSECTION OBSERVER =======
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.tl-item').forEach(el => io.observe(el));

  // ======= COUNTER ANIMATION =======
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = target / 50;
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target + (target === 1 ? '' : '+');
            clearInterval(interval);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // ======= REVEAL TITLES on scroll =======
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.reveal-title, .reveal-title-light').forEach(el => {
    titleObserver.observe(el);
  });

  // ======= CONTACT FORM =======
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! I will get back to you soon.');
      contactForm.reset();
    });
  }

  // ======= PROJECTS CAROUSEL =======
  const carousel = {
    currentIndex: 0,
    totalSlides: 4,
    init() {
      const track = document.getElementById('projTrack');
      const prevBtn = document.getElementById('projPrev');
      const nextBtn = document.getElementById('projNext');
      const indicators = document.querySelectorAll('.indicator');

      if (!track) return;

      const updateCarousel = () => {
        const offset = -this.currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;

        indicators.forEach((dot, index) => {
          dot.classList.toggle('active', index === this.currentIndex);
        });
      };

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
          updateCarousel();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
          updateCarousel();
        });
      }

      indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          this.currentIndex = index;
          updateCarousel();
        });
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
          updateCarousel();
        }
        if (e.key === 'ArrowRight') {
          this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
          updateCarousel();
        }
      });
    }
  };
  carousel.init();

  // ======= KEYBOARD SHORTCUTS =======
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') window.scrollBy({ top: 100, behavior: 'smooth' });
    if (e.key === 'ArrowUp') window.scrollBy({ top: -100, behavior: 'smooth' });
  });

});
