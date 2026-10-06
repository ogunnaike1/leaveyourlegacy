// HALDEN — shared motion layer: pinned progress, parallax, reveals, magnetic buttons, contextual cursor.
// Everything writes CSS custom properties; templates read them with var(). Normal scrolling is never hijacked.
(function () {
  if (window.HALDEN_MOTION) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let pins = [], pars = [], ticking = false, io = null, cursor = null;
  // Vars live in a private stylesheet (not inline styles) so framework re-renders never wipe them.
  const sheet = document.createElement('style');
  sheet.textContent = '[data-in]{--in:1}[data-hover="1"]{--h:1}';
  document.head.appendChild(sheet);
  const rules = new Map(); let mid = 0;
  function setVar(el, name, val) {
    let id = el.getAttribute('data-mid');
    if (!id) { id = 'm' + (++mid); el.setAttribute('data-mid', id); }
    let r = rules.get(id);
    if (!r || !r.parentStyleSheet) { const s = sheet.sheet; const i = s.insertRule('[data-mid="' + id + '"]{}', s.cssRules.length); r = s.cssRules[i]; rules.set(id, r); }
    r.style.setProperty(name, val);
  }

  function scan() {
    pins = [...document.querySelectorAll('[data-pin]')];
    pars = reduced ? [] : [...document.querySelectorAll('[data-parallax]')];
    document.querySelectorAll('[data-reveal]:not([data-seen])').forEach(el => {
      el.setAttribute('data-seen', '');
      const r = el.getBoundingClientRect();
      const inView = r.top < innerHeight * 0.95 && r.bottom > 0;
      if (reduced || !io) el.setAttribute('data-in', '');
      else if (inView) setTimeout(() => el.setAttribute('data-in', ''), 60);
      else io.observe(el);
    });
    document.querySelectorAll('[data-magnetic]:not([data-mag])').forEach(bindMagnet);
    document.querySelectorAll('[data-cursor]:not([data-cur])').forEach(bindCursor);
    update();
  }
  function update() {
    ticking = false;
    const vh = innerHeight;
    pins.forEach(el => {
      const r = el.getBoundingClientRect();
      const total = Math.max(1, r.height - vh);
      setVar(el, el.getAttribute('data-pin') || '--p', clamp(-r.top / total, 0, 1).toFixed(4));
    });
    pars.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const f = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      setVar(el, '--py', ((r.top + r.height / 2 - vh / 2) * -f).toFixed(1) + 'px');
    });
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  function bindMagnet(el) {
    el.setAttribute('data-mag', '');
    if (!fine || reduced) return;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      setVar(el, '--mx', (((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2));
      setVar(el, '--my', (((e.clientY - r.top) / r.height - 0.5) * 4).toFixed(2));
    });
    el.addEventListener('mouseleave', () => { setVar(el, '--mx', '0'); setVar(el, '--my', '0'); });
  }
  function ensureCursor() {
    if (cursor) return cursor;
    cursor = document.createElement('div');
    cursor.style.cssText = 'position:fixed;left:0;top:0;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;background:#f2efea;color:#1c1b19;display:flex;align-items:center;justify-content:center;font:500 10px/1 "JetBrains Mono",monospace;letter-spacing:.12em;text-transform:uppercase;pointer-events:none;z-index:9999;transform:scale(0);transition:transform .35s cubic-bezier(.2,.7,.2,1);mix-blend-mode:normal';
    document.body.appendChild(cursor);
    addEventListener('mousemove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }, { passive: true });
    return cursor;
  }
  function bindCursor(el) {
    el.setAttribute('data-cur', '');
    if (!fine) return;
    el.addEventListener('mouseenter', () => { const c = ensureCursor(); c.textContent = el.getAttribute('data-cursor'); c.style.transform = 'scale(1)'; });
    el.addEventListener('mouseleave', () => { if (cursor) cursor.style.transform = 'scale(0)'; });
  }

  let started = false, mo = null, scanT = 0;
  window.HALDEN_MOTION = {
    reduced,
    start() {
      if (started) { scan(); return; }
      started = true;
      if ('IntersectionObserver' in window && !reduced) {
        io = new IntersectionObserver(es => es.forEach(e => {
          if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); }
        }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      }
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
      mo = new MutationObserver(() => { clearTimeout(scanT); scanT = setTimeout(scan, 60); });
      mo.observe(document.body, { childList: true, subtree: true });
      scan();
    },
    refresh: () => scan(),
    setVar
  };
})();
