// Leave Your Legacy — shared motion layer, ported from design-reference/motion.js.
// Pinned progress, parallax, reveals, magnetic buttons, contextual cursor.
// Everything writes CSS custom properties; components read them with var(). Normal scrolling is never hijacked.

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Engine = { reduced: boolean; start: () => void; refresh: () => void; setVar: (el: Element, name: string, val: string) => void };

let engine: Engine | null = null;

export function getMotion(): Engine {
  if (engine) return engine;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const clipped = new Set<Element>();
  let pins: Element[] = [], pars: Element[] = [], ticking = false, io: IntersectionObserver | null = null, cursor: HTMLDivElement | null = null;
  // Vars live in a private stylesheet (not inline styles) so React re-renders never wipe them.
  const sheet = document.createElement('style');
  sheet.textContent = '[data-in]{--in:1}[data-hover="1"]{--h:1}';
  document.head.appendChild(sheet);
  const rules = new Map<string, CSSStyleRule>(); let mid = 0;
  function setVar(el: Element, name: string, val: string) {
    let id = el.getAttribute('data-mid');
    if (!id) { id = 'm' + (++mid); el.setAttribute('data-mid', id); }
    let r = rules.get(id);
    if (!r || !r.parentStyleSheet) { const s = sheet.sheet!; const i = s.insertRule('[data-mid="' + id + '"]{}', s.cssRules.length); r = s.cssRules[i] as CSSStyleRule; rules.set(id, r); }
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
      // IntersectionObserver applies the target's own clip-path, so a clip-path reveal that starts fully
      // clipped (inset(100% …)) never intersects. Those are checked geometrically in update() instead,
      // with the same threshold (.12) and bottom margin (−8%).
      else if (getComputedStyle(el).clipPath !== 'none') clipped.add(el);
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
      const f = parseFloat(el.getAttribute('data-parallax') || '') || 0.1;
      setVar(el, '--py', ((r.top + r.height / 2 - vh / 2) * -f).toFixed(1) + 'px');
    });
    clipped.forEach(el => {
      if (!el.isConnected) { clipped.delete(el); return; }
      const r = el.getBoundingClientRect();
      const visible = Math.min(r.bottom, vh * 0.92) - Math.max(r.top, 0);
      if (r.height > 0 && visible / r.height >= 0.12) { el.setAttribute('data-in', ''); clipped.delete(el); }
    });
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  function bindMagnet(el: Element) {
    el.setAttribute('data-mag', '');
    if (!fine || reduced) return;
    el.addEventListener('mousemove', e => {
      const ev = e as MouseEvent;
      const r = el.getBoundingClientRect();
      setVar(el, '--mx', (((ev.clientX - r.left) / r.width - 0.5) * 6).toFixed(2));
      setVar(el, '--my', (((ev.clientY - r.top) / r.height - 0.5) * 4).toFixed(2));
    });
    el.addEventListener('mouseleave', () => { setVar(el, '--mx', '0'); setVar(el, '--my', '0'); });
  }
  // Contextual cursor: 84px stone disc with a mono label, only over [data-cursor] areas, fine pointers only.
  function ensureCursor() {
    if (cursor) return cursor;
    cursor = document.createElement('div');
    cursor.style.cssText = 'position:fixed;left:0;top:0;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;background:#f2efea;color:#1c1b19;display:flex;align-items:center;justify-content:center;font:500 10px/1 var(--font-mono),monospace;letter-spacing:.12em;text-transform:uppercase;pointer-events:none;z-index:9999;transform:scale(0);transition:transform .35s cubic-bezier(.2,.7,.2,1);mix-blend-mode:normal';
    document.body.appendChild(cursor);
    addEventListener('mousemove', e => { cursor!.style.left = e.clientX + 'px'; cursor!.style.top = e.clientY + 'px'; }, { passive: true });
    return cursor;
  }
  function bindCursor(el: Element) {
    el.setAttribute('data-cur', '');
    if (!fine) return;
    // The label is read on enter, so a changing data-cursor (e.g. Zoom → Close) is picked up live.
    el.addEventListener('mouseenter', () => { const c = ensureCursor(); c.textContent = el.getAttribute('data-cursor'); c.style.transform = 'scale(1)'; });
    el.addEventListener('mouseleave', () => { if (cursor) cursor.style.transform = 'scale(0)'; });
    new MutationObserver(() => { if (cursor && el.matches(':hover')) cursor.textContent = el.getAttribute('data-cursor'); })
      .observe(el, { attributes: true, attributeFilter: ['data-cursor'] });
  }

  let started = false, scanT: ReturnType<typeof setTimeout> | undefined;
  engine = {
    reduced,
    start() {
      if (started) { scan(); return; }
      started = true;
      if ('IntersectionObserver' in window && !reduced) {
        io = new IntersectionObserver(es => es.forEach(e => {
          if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io!.unobserve(e.target); }
        }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      }
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
      const mo = new MutationObserver(() => { clearTimeout(scanT); scanT = setTimeout(scan, 60); });
      mo.observe(document.body, { childList: true, subtree: true });
      scan();
    },
    refresh: () => scan(),
    setVar
  };
  return engine;
}

/** Scroll progress of a [data-pin] wrapper: -rect.top / (height - innerHeight), clamped 0–1. */
export function pinProgress(el: Element | null) {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
}
