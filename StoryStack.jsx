// StoryStack — a draggable, glowing 3:4 card stack telling otávio b.m.'s origin story.
// Stack behaviour adapted from React Bits "Stack"; the edge-glow border adapted
// from React Bits "BorderGlow" — both reimplemented on the project's global gsap
// so motion stays calm and brand-appropriate (gentle power3.out, no spring) per
// the Soulstory motion rules, and re-tuned to the indigo · lavender · sky trio
// (no rainbow, no gradient fills — a whispered light tracing the top card's edge).
// Drag or tap the top card — or click a dot — to advance. Each change dispatches
// window CustomEvent 'soulstory:story-change' { index } so the DC caption quadro
// slides to the matching story beat.

const { useState, useRef, useEffect } = React;
const h = React.createElement;

const BEATS = [
  { src: 'images/otavio-1-menino.png',     alt: 'otávio b.m. criança, cercado de quadrinhos, TV e filmes' },
  { src: 'images/otavio-2-inventando.png', alt: 'otávio b.m. na escola, inventando as próprias histórias' },
  { src: 'images/otavio-3-redator.png',    alt: 'otávio b.m. redator publicitário, escrevendo de tudo' },
  { src: 'images/otavio-4-mckee.png',      alt: 'otávio b.m. lendo o livro de marketing de Robert McKee' },
  { src: 'images/otavio-5-virada.png',     alt: 'a virada de percepção: propaganda descartada, história amada' },
  { src: 'images/otavio-6-venda.png',      alt: 'quando a boa história vira venda' },
];

// how each card sits in the pile, indexed by depth (0 = top). Fanned downward
// from a shared top edge so every card behind peeks clearly beneath the last.
const PILE = [
  { x: 0,   y: 0,  r: 0,    s: 1     },
  { x: 34,  y: 26, r: 5.5,  s: 0.955 },
  { x: -30, y: 48, r: -4.8, s: 0.915 },
  { x: 26,  y: 70, r: 4.2,  s: 0.878 },
  { x: -22, y: 90, r: -3.4, s: 0.844 },
  { x: 18,  y: 108, r: 2.6, s: 0.812 },
];

const STORYSTACK_CSS = `
.sstk-story { width:100%; display:flex; flex-direction:column; align-items:center; gap:10px; -webkit-user-select:none; user-select:none; }
.sstk-stage { position:relative; width:clamp(330px, 36vw, 468px); aspect-ratio:3 / 4; margin:10px auto 96px; }
.sstk-card {
  --edge-proximity:0; --cursor-angle:45deg; --edge-sensitivity:26;
  --color-sensitivity:calc(var(--edge-sensitivity) + 22);
  --border-radius:18px; --glow-padding:58px; --cone-spread:26;
  position:absolute; inset:0; border-radius:var(--border-radius);
  isolation:isolate; transform:translate3d(0,0,0.01px);
  background:#fff; border:1px solid rgba(60,57,110,0.13);
  box-shadow:0 2px 6px rgba(60,57,110,0.07), 0 20px 44px -22px rgba(60,57,110,0.55);
  will-change:transform; touch-action:pan-y; -webkit-backface-visibility:hidden; backface-visibility:hidden; overflow:visible;
}
.sstk-card.sstk-top { cursor:grab; }
.sstk-card.sstk-top:active { cursor:grabbing; }
.sstk-card::before, .sstk-card > .sstk-glow {
  content:""; position:absolute; inset:0; border-radius:inherit;
  transition:opacity .25s ease-out; z-index:-1; pointer-events:none;
}
.sstk-card:not(.sstk-top)::before,
.sstk-card:not(.sstk-top) > .sstk-glow { opacity:0 !important; }
.sstk-card.sstk-top:not(:hover):not(.sstk-sweep)::before,
.sstk-card.sstk-top:not(:hover):not(.sstk-sweep) > .sstk-glow {
  opacity:0; transition:opacity .7s ease-in-out;
}
/* mesh-gradient border, brand trio, revealed by a directional cone at the cursor */
.sstk-card::before {
  border:1px solid transparent;
  background:
    linear-gradient(#fff 0 100%) padding-box,
    linear-gradient(rgba(255,255,255,0) 0 100%) border-box,
    radial-gradient(at 80% 55%, #8E9FEE 0px, transparent 50%) border-box,
    radial-gradient(at 69% 34%, #B9A9F2 0px, transparent 50%) border-box,
    radial-gradient(at 8% 6%,   #8CC6FF 0px, transparent 50%) border-box,
    radial-gradient(at 41% 38%, #8E9FEE 0px, transparent 50%) border-box,
    radial-gradient(at 86% 85%, #B9A9F2 0px, transparent 50%) border-box,
    radial-gradient(at 82% 18%, #8CC6FF 0px, transparent 50%) border-box,
    radial-gradient(at 51% 4%,  #B9A9F2 0px, transparent 50%) border-box,
    linear-gradient(#8E9FEE 0 100%) border-box;
  opacity:calc((var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));
  mask-image:conic-gradient(from var(--cursor-angle) at center,
    black calc(var(--cone-spread) * 1%),
    transparent calc((var(--cone-spread) + 15) * 1%),
    transparent calc((100 - var(--cone-spread) - 15) * 1%),
    black calc((100 - var(--cone-spread)) * 1%));
}
/* outer glow — a soft lavender halo tracing the two edges nearest the cursor */
.sstk-card > .sstk-glow {
  inset:calc(var(--glow-padding) * -1); z-index:1;
  mask-image:conic-gradient(from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%);
  opacity:calc((var(--edge-proximity) - var(--edge-sensitivity)) / (100 - var(--edge-sensitivity)));
  mix-blend-mode:plus-lighter;
}
.sstk-card > .sstk-glow::before {
  content:""; position:absolute; inset:var(--glow-padding); border-radius:inherit;
  box-shadow:
    inset 0 0 0 1.5px hsl(229deg 74% 74% / 100%),
    inset 0 0 4px 0 hsl(229deg 74% 74% / 65%),
    inset 0 0 10px 0 hsl(229deg 74% 74% / 48%),
    inset 0 0 22px 0 hsl(224deg 66% 78% / 34%),
    inset 0 0 44px 3px hsl(210deg 100% 78% / 22%),
    0 0 4px 0 hsl(229deg 74% 74% / 70%),
    0 0 12px 0 hsl(229deg 74% 74% / 52%),
    0 0 26px 0 hsl(224deg 66% 78% / 38%),
    0 0 52px 5px hsl(210deg 100% 78% / 24%),
    0 0 82px 8px hsl(210deg 100% 78% / 14%);
}
.sstk-inner { position:relative; z-index:1; width:100%; height:100%; border-radius:inherit; overflow:hidden; }
.sstk-inner::after { content:""; position:absolute; inset:0; border-radius:inherit; box-shadow:inset 0 0 0 1px rgba(255,255,255,0.32); pointer-events:none; }
.sstk-img { width:100%; height:100%; object-fit:cover; display:block; pointer-events:none; -webkit-user-drag:none; }
.sstk-foot { display:flex; flex-direction:column; align-items:center; gap:12px; }
.sstk-dots { display:flex; align-items:center; gap:10px; }
.sstk-dot {
  width:9px; height:9px; padding:0; border:none; border-radius:50%;
  background:rgba(60,57,110,0.2); cursor:pointer;
  transition:transform .32s cubic-bezier(0.22,1,0.36,1), background .32s ease;
}
.sstk-dot:hover { background:rgba(60,57,110,0.42); }
.sstk-dot.on { background:var(--ss-indigo, #3D396E); transform:scale(1.5); }
.sstk-hint {
  font-family:var(--font-mono, monospace); font-size:11px; font-weight:500;
  letter-spacing:0.14em; text-transform:uppercase;
  color:var(--text-tertiary, rgba(60,57,110,0.5)); transition:opacity .45s ease;
}
.sstk-hint.gone { opacity:0; }
@media (prefers-reduced-motion: reduce) { .sstk-dot { transition:none; } }
`;

(function injectCss() {
  if (typeof document === 'undefined' || document.getElementById('storystack-css')) return;
  const el = document.createElement('style');
  el.id = 'storystack-css';
  el.textContent = STORYSTACK_CSS;
  document.head.appendChild(el);
})();

function StoryStack() {
  const cardRefs = useRef(BEATS.map(() => React.createRef()));
  const orderRef = useRef(BEATS.map((_, i) => i)); // orderRef[0] === top card
  const dragRef = useRef({ down: false, moved: false, sx: 0, sy: 0, pid: null, el: null });
  const downRef = useRef(() => {});
  const goRef = useRef(() => {});
  const glowRef = useRef(() => {});
  const [active, setActive] = useState(0);
  const [hint, setHint] = useState(true);

  useEffect(() => {
    let reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) {}
    let auto = null, killed = false, sweepRaf = null;
    const G = () => window.gsap;

    const stopAuto = () => { if (auto) { clearInterval(auto); auto = null; } };
    const startAuto = () => { if (reduce) return; stopAuto(); auto = setInterval(() => sendBack(), 6000); };

    const layout = (animate) => {
      const g = G();
      orderRef.current.forEach((ci, pos) => {
        const el = cardRefs.current[ci].current;
        if (!el) return;
        el.classList.toggle('sstk-top', pos === 0);
        const o = PILE[Math.min(pos, PILE.length - 1)];
        const p = { x: o.x, y: o.y, scale: o.s, rotation: o.r, zIndex: 100 - pos, transformOrigin: '50% 0%' };
        if (g) {
          if (animate && !reduce) g.to(el, Object.assign({ duration: 0.62, ease: 'power3.out', overwrite: true }, p));
          else g.set(el, p);
        } else {
          el.style.transform = 'translate(' + o.x + 'px,' + o.y + 'px) scale(' + o.s + ') rotate(' + o.r + 'deg)';
          el.style.transformOrigin = '50% 0%';
          el.style.zIndex = 100 - pos;
        }
      });
    };

    const sweep = (el) => {
      if (!el || reduce) return;
      if (sweepRaf) cancelAnimationFrame(sweepRaf);
      el.classList.add('sstk-sweep');
      const t0 = performance.now(), dur = 1500, a0 = 84, a1 = 468;
      const finish = () => { el.classList.remove('sstk-sweep'); el.style.setProperty('--edge-proximity', '0'); };
      const step = (now) => {
        const t = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - t, 3);
        el.style.setProperty('--cursor-angle', (a0 + (a1 - a0) * e) + 'deg');
        const prox = t < 0.42 ? (t / 0.42) : (1 - (t - 0.42) / 0.58);
        el.style.setProperty('--edge-proximity', (Math.max(prox, 0) * 100).toFixed(1));
        if (t < 1 && !killed) { sweepRaf = requestAnimationFrame(step); }
        else { finish(); sweepRaf = null; }
      };
      sweepRaf = requestAnimationFrame(step);
      setTimeout(finish, dur + 260); // guaranteed clear even if the rAF is torn down (double-mount)
    };

    const announce = (i) => {
      try { window.dispatchEvent(new CustomEvent('soulstory:story-change', { detail: { index: i } })); } catch (_) {}
    };
    const setTop = (i) => { setActive(i); announce(i); sweep(cardRefs.current[i].current); };

    const sendBack = () => {
      const o = orderRef.current;
      if (o.length < 2) return;
      orderRef.current = o.slice(1).concat(o[0]);
      setTop(orderRef.current[0]);
      layout(true);
    };
    const goTo = (t) => {
      const o = orderRef.current;
      const idx = o.indexOf(t);
      if (idx < 1) return;
      orderRef.current = o.slice(idx).concat(o.slice(0, idx));
      setTop(t);
      layout(true);
    };
    goRef.current = (t) => { stopAuto(); setHint(false); goTo(t); startAuto(); };

    glowRef.current = (e) => {
      const top = orderRef.current[0];
      const el = cardRefs.current[top] && cardRefs.current[top].current;
      if (!el || dragRef.current.down) return;
      if (el.classList.contains('sstk-sweep')) el.classList.remove('sstk-sweep'); // pointer overrides any in-flight sweep
      const rect = el.getBoundingClientRect();
      const cx = rect.width / 2, cy = rect.height / 2;
      const dx = (e.clientX - rect.left) - cx, dy = (e.clientY - rect.top) - cy;
      let kx = Infinity, ky = Infinity;
      if (dx !== 0) kx = cx / Math.abs(dx);
      if (dy !== 0) ky = cy / Math.abs(dy);
      const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
      let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90; if (deg < 0) deg += 360;
      el.style.setProperty('--edge-proximity', (edge * 100).toFixed(2));
      el.style.setProperty('--cursor-angle', deg.toFixed(2) + 'deg');
    };

    downRef.current = (i, e) => {
      if (orderRef.current[0] !== i) return; // only the top card is draggable
      const el = cardRefs.current[i].current;
      if (!el) return;
      dragRef.current = { down: true, moved: false, sx: e.clientX, sy: e.clientY, pid: e.pointerId, el };
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
      stopAuto();
      const g = G(); if (g) g.killTweensOf(el);
    };
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d.down) return;
      const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
      if (!d.moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) { d.moved = true; setHint(false); }
      const rot = Math.max(-9, Math.min(9, dx * 0.045));
      const g = G();
      if (g) g.set(d.el, { x: dx, y: dy, rotation: rot });
      else d.el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg)';
    };
    const onUp = (e) => {
      const d = dragRef.current;
      if (!d.down) return;
      d.down = false;
      try { d.el.releasePointerCapture(d.pid); } catch (_) {}
      const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
      if (!d.moved || Math.hypot(dx, dy) > 82) sendBack();
      else layout(true);
      startAuto();
    };
    const onCancel = () => {
      const d = dragRef.current;
      if (!d.down) return;
      d.down = false;
      layout(true);
      startAuto();
    };

    const boot = () => {
      if (killed) return;
      if (!G()) { setTimeout(boot, 60); return; }
      cardRefs.current.forEach((r) => { if (r.current) r.current.classList.remove('sstk-sweep'); }); // clear any stale class from a prior mount
      layout(false);
      setTimeout(() => { if (!killed) sweep(cardRefs.current[orderRef.current[0]].current); }, 480);
    };
    boot();
    announce(0);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    startAuto();

    const stage = cardRefs.current[0].current && cardRefs.current[0].current.parentNode;
    const enter = () => stopAuto();
    const leave = () => startAuto();
    if (stage) { stage.addEventListener('mouseenter', enter); stage.addEventListener('mouseleave', leave); }

    return () => {
      killed = true;
      stopAuto();
      if (sweepRaf) cancelAnimationFrame(sweepRaf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      if (stage) { stage.removeEventListener('mouseenter', enter); stage.removeEventListener('mouseleave', leave); }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return h('div', { className: 'sstk-story' },
    h('div', { className: 'sstk-stage', onPointerMove: (e) => glowRef.current(e) },
      BEATS.map((b, i) =>
        h('div', {
          key: i,
          className: 'sstk-card',
          ref: cardRefs.current[i],
          onPointerDown: (e) => downRef.current(i, e),
        },
          h('span', { className: 'sstk-glow' }),
          h('div', { className: 'sstk-inner' },
            h('img', { className: 'sstk-img', src: b.src, alt: b.alt, draggable: false })
          )
        )
      )
    ),
    h('div', { className: 'sstk-foot' },
      h('div', { className: 'sstk-dots' },
        BEATS.map((_, i) =>
          h('button', {
            key: i,
            type: 'button',
            className: 'sstk-dot' + (active === i ? ' on' : ''),
            onClick: () => goRef.current(i),
            'aria-label': 'Ir para o quadro ' + (i + 1) + ' de ' + BEATS.length,
          })
        )
      ),
      h('div', { className: 'sstk-hint' + (hint ? '' : ' gone') }, 'arraste ou toque \u203A')
    )
  );
}

if (typeof window !== 'undefined') window.StoryStack = StoryStack;
if (typeof module !== 'undefined' && module.exports) module.exports = { StoryStack, default: StoryStack };
