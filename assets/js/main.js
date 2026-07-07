// ============================================================
// Dr. Fawzi Hesham Yasin — Portfolio
// Shared interactivity
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initNav();
  initRevealObserver();
  initCounters();
  initTyping();
  initSkillsTabs();
  initToTop();
  initTimelineObserver();
  markActiveNav();
});

/* ---------------- Loader ---------------- */
function initLoader() {
  const loader = document.querySelector('.loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // Fallback in case load event already fired
  setTimeout(() => loader.classList.add('hidden'), 2200);
}

/* ---------------- Theme toggle ---------------- */
function initTheme() {
  const toggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('fhy-theme');
  if (saved === 'dark') root.setAttribute('data-theme', 'dark');

  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('fhy-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('fhy-theme', 'dark');
    }
  });
}

/* ---------------- Mobile nav ---------------- */
function initNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ---------------- Mark active nav link by current page ---------------- */
function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---------------- Scroll reveal ---------------- */
function initRevealObserver() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => io.observe(item));
}

function initTimelineObserver() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  items.forEach(item => io.observe(item));
}

/* ---------------- Animated counters ---------------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target % 1 === 0 ? Math.floor(target * eased) : (target * eased).toFixed(1);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => io.observe(el));
}

/* ---------------- Typing animation ---------------- */
function initTyping() {
  const el = document.querySelector('.hero-typed');
  if (!el) return;
  const phrases = [
    'Advancing AI-assisted neurosurgery.',
    'Designing intelligent OSCE platforms.',
    'Bridging medicine and software engineering.',
    'Building the future of digital health.'
  ];
  const textEl = document.createElement('span');
  const cursorEl = document.createElement('span');
  cursorEl.className = 'cursor';
  el.appendChild(textEl);
  el.appendChild(cursorEl);

  let phraseIndex = 0, charIndex = 0, deleting = false;

  function step() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      textEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(step, 1800);
        return;
      }
    } else {
      charIndex--;
      textEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(step, deleting ? 30 : 45);
  }
  step();
}

/* ---------------- Skills tabs ---------------- */
function initSkillsTabs() {
  const tabs = document.querySelectorAll('.skills-tab');
  const panels = document.querySelectorAll('.skills-panel');
  if (!tabs.length) return;

  function animateBars(panel) {
    panel.querySelectorAll('.skill-bar-fill').forEach(bar => {
      const pct = bar.getAttribute('data-pct');
      requestAnimationFrame(() => { bar.style.width = pct + '%'; });
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(target);
      panel.classList.add('active');
      animateBars(panel);
    });
  });

  // Animate first visible panel on load
  const firstActive = document.querySelector('.skills-panel.active');
  if (firstActive) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateBars(firstActive);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(firstActive);
  }
}

/* ---------------- Back to top ---------------- */
function initToTop() {
  const btn = document.querySelector('.to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
