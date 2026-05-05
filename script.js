/* ─── script.js ─── */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initLoader();
  initCursor();
  initParticles();
  initNav();
  initTyping();
  initScrollReveal();
  initSkillBars();
  initAvatar3D();
  initProjectCards();
  initContactForm();
  initCounters();
});

/* ══════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════ */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if (!themeBtn || !themeIcon) return;

  const savedTheme = localStorage.getItem('site-theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const defaultTheme = savedTheme || (prefersLight ? 'light' : 'dark');

  applyTheme(defaultTheme);

  themeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    applyTheme(isLight ? 'dark' : 'light');
  });

  function applyTheme(theme) {
    const isLight = theme === 'light';
    document.body.classList.toggle('light-mode', isLight);
    themeIcon.textContent = isLight ? '🌙' : '☀';
    const nextModeLabel = isLight ? 'dark' : 'bright';
    themeBtn.setAttribute('aria-label', `Switch to ${nextModeLabel} mode`);
    themeBtn.setAttribute('title', `Switch to ${nextModeLabel} mode`);
    localStorage.setItem('site-theme', theme);
  }
}

/* ══════════════════════════════════════════
   LOADER
══════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
  });
}

/* ══════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animateCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.addEventListener('mousedown', () => dot.style.transform = 'translate(-50%,-50%) scale(1.6)');
  document.addEventListener('mouseup',   () => dot.style.transform = 'translate(-50%,-50%) scale(1)');
  document.addEventListener('mouseleave',() => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter',() => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/* ══════════════════════════════════════════
   PARTICLE NETWORK CANVAS
══════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 80, MAX_DIST = 130;

  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  function rand(a, b) { return Math.random() * (b - a) + a; }

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: rand(0, innerWidth), y: rand(0, innerHeight),
      vx: rand(-.35, .35),   vy: rand(-.35, .35),
      r: rand(1.5, 3)
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,198,255,.55)';
      ctx.fill();
    });

    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,198,255,${.45 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = .7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const open = navMenu.classList.toggle('active');
      hamburger.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.forEach(a => a.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
  }

  // Active link via IntersectionObserver
  const observer = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id);
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));

  // Smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      navMenu?.classList.remove('active');
      hamburger?.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
}

/* ══════════════════════════════════════════
   TYPING EFFECT
══════════════════════════════════════════ */
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const roles = ['AI/ML Engineer', 'IT Support Specialist', 'Full-Stack Developer', 'Problem Solver'];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const cur = roles[ri];
    el.textContent = cur.substring(0, ci);
    if (!deleting && ci === cur.length) {
      setTimeout(() => { deleting = true; tick(); }, 1600);
      return;
    }
    if (deleting && ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
    }
    ci += deleting ? -1 : 1;
    setTimeout(tick, deleting ? 50 : 75);
  }
  tick();
}

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-fade-up, .reveal-slide-left, .reveal-slide-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════
   SKILL BARS (animate on scroll)
══════════════════════════════════════════ */
function initSkillBars() {
  const section = document.getElementById('skill-bars');
  if (!section) return;
  const fills = section.querySelectorAll('.skill-bar-fill');
  let animated = false;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      fills.forEach(f => { f.style.width = f.dataset.width + '%'; });
    }
  }, { threshold: 0.3 });
  obs.observe(section);
}

/* ══════════════════════════════════════════
   3D FLOATING CARD AVATAR
══════════════════════════════════════════ */
function initAvatar3D() {
  const card = document.getElementById('avatar-3d');
  if (!card) return;
  const MAX = 18;

  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left - r.width  / 2;
    const y = e.clientY - r.top  - r.height / 2;
    const rx = (y / r.height) * MAX * -1;
    const ry = (x / r.width)  * MAX;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
    card.style.transition = 'transform .05s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .6s ease';
  });
}

/* ══════════════════════════════════════════
   PROJECT CARDS — modal
══════════════════════════════════════════ */
function initProjectCards() {
  document.querySelectorAll('.project-demo-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const card  = btn.closest('.project-card');
      const title = card.querySelector('h3')?.textContent || '';
      const desc  = card.querySelector('p')?.textContent  || '';
      const icon  = card.querySelector('.project-icon')?.textContent || '';
      const tags  = [...card.querySelectorAll('.project-tags span')].map(s => s.textContent);
      openModal({ title, desc, icon, tags });
    });
  });
}

function openModal({ title, desc, icon, tags }) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,23,.8);display:flex;align-items:center;justify-content:center;z-index:5000;padding:20px;backdrop-filter:blur(6px)';

  const tagsHtml = tags.map(t => `<span style="padding:5px 10px;background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.2);border-radius:6px;color:#a78bfa;font-size:.82rem">${t}</span>`).join('');

  overlay.innerHTML = `
    <div style="background:linear-gradient(145deg,#0d1424,#070b18);border:1px solid rgba(0,198,255,.18);border-radius:18px;padding:2.5rem;max-width:580px;width:100%;box-shadow:0 40px 100px rgba(0,0,0,.6);position:relative">
      <button id="modal-close" style="position:absolute;top:1.2rem;right:1.2rem;background:rgba(255,255,255,.06);border:none;color:#94a3b8;font-size:1.1rem;width:34px;height:34px;border-radius:50%;cursor:pointer;transition:.2s" aria-label="Close">✕</button>
      <div style="font-size:3rem;margin-bottom:.8rem">${icon}</div>
      <h2 style="font-family:'Outfit',sans-serif;font-size:1.6rem;margin-bottom:.8rem;background:linear-gradient(135deg,#00c6ff,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${title}</h2>
      <p style="color:#94a3b8;line-height:1.75;margin-bottom:1.4rem">${desc}</p>
      <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.6rem">${tagsHtml}</div>
      <div style="display:flex;gap:.8rem">
        <a href="#" style="background:linear-gradient(135deg,#00c6ff,#1e90ff);color:#fff;padding:.8rem 1.4rem;border-radius:10px;text-decoration:none;font-weight:700;font-size:.9rem">Open Demo</a>
        <button id="modal-close2" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#fff;padding:.8rem 1.4rem;border-radius:10px;cursor:pointer;font-size:.9rem">Close</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.querySelector('#modal-close').addEventListener('click', close);
  overlay.querySelector('#modal-close2').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
}

/* ══════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = form.querySelector('#cf-name')?.value.trim();
    const email   = form.querySelector('#cf-email')?.value.trim();
    const subject = form.querySelector('#cf-subject')?.value.trim();
    const msg     = form.querySelector('#cf-message')?.value.trim();

    if (!name || !subject || !msg || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please fill all fields correctly.', 'error'); return;
    }
    const tid = showToast('Sending…', 'info', false);
    await new Promise(r => setTimeout(r, 1000));
    removeToast(tid);
    form.reset();
    showToast('Message sent! I will be in touch soon 🚀', 'success');
  });
}

/* ══════════════════════════════════════════
   COUNTERS
══════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el  = en.target;
      const end = parseInt(el.dataset.target, 10);
      let cur = 0;
      const step = Math.ceil(end / 40);
      const t = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = cur + '+';
        if (cur >= end) clearInterval(t);
      }, 40);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => obs.observe(c));
}

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */
const _toastMap = new Map();
let _twrap = null;

function getWrap() {
  if (!_twrap) {
    _twrap = document.createElement('div');
    _twrap.id = 'toast-wrap';
    document.body.appendChild(_twrap);
  }
  return _twrap;
}

function showToast(msg, type = 'success', autoClose = true) {
  const wrap = getWrap();
  const id   = 't_' + Math.random().toString(36).slice(2, 9);
  const el   = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  wrap.appendChild(el);
  _toastMap.set(id, el);
  if (autoClose) setTimeout(() => removeToast(id), 3500);
  return id;
}

function removeToast(id) {
  const el = _toastMap.get(id);
  if (el) { el.remove(); _toastMap.delete(id); }
}
