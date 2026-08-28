const { useState, useEffect, useLayoutEffect, useRef, useCallback } = React;

// --- one-time CSS injection (keyframes only; everything else is inline) ---
function ensureStyles() {
  if (typeof document === 'undefined' || document.getElementById('rotating-text-css')) return;
  const el = document.createElement('style');
  el.id = 'rotating-text-css';
  el.textContent = [
    '@keyframes rtxEnter { from { transform: translateY(115%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }',
    '@keyframes rtxLeave { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-125%); opacity: 0; } }',
    '@keyframes rtxIn { from { opacity: 0; } to { opacity: 1; } }',
    '@keyframes rtxOut { from { opacity: 1; } to { opacity: 0; } }'
  ].join('\n');
  document.head.appendChild(el);
}

function splitChars(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const seg = new Intl.Segmenter('pt', { granularity: 'grapheme' });
    return Array.from(seg.segment(String(text)), s => s.segment);
  }
  return Array.from(String(text));
}

function parseArr(v, fallback) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    const t = v.trim();
    if (!t) return fallback;
    try { return JSON.parse(t); } catch (e) { return t.split('|'); }
  }
  return fallback;
}

function num(v, d) { const n = parseFloat(v); return isNaN(n) ? d : n; }
function bool(v, d) { if (v === undefined || v === null) return d; return !(v === false || v === 'false' || v === 0); }

function totalChars(text) {
  return String(text).split(' ').reduce((s, w) => s + splitChars(w).length, 0);
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduce(!!mq.matches);
    on();
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on); };
  }, []);
  return reduce;
}

const RotatingText = (props) => {
  ensureStyles();

  const texts = parseArr(props.texts, []);
  const colors = parseArr(props.colors, []);
  const rotationInterval = num(props.rotationInterval, 2200);
  const stagger = num(props.staggerDuration, 0.03);
  const staggerFrom = props.staggerFrom || 'first';
  const dur = num(props.duration, 0.55);
  const ease = props.ease || 'cubic-bezier(0.22,1,0.36,1)';
  const auto = bool(props.auto, true);
  const loop = bool(props.loop, true);
  const PADX = props.padX || '0.28em';
  const PADY = props.padY || '0.12em';

  const reduce = usePrefersReducedMotion();
  const curRef = useRef(null);
  const [w, setW] = useState(null);
  const [ready, setReady] = useState(false);
  const [st, setSt] = useState({ idx: 0, prevIdx: null, gen: 0 });

  const advance = useCallback(() => {
    setSt(s => {
      const n = s.idx === texts.length - 1 ? (loop ? 0 : s.idx) : s.idx + 1;
      if (n === s.idx) return s;
      return { idx: n, prevIdx: s.idx, gen: s.gen + 1 };
    });
  }, [texts.length, loop]);

  useEffect(() => {
    if (!auto || texts.length <= 1) return undefined;
    const id = setInterval(advance, rotationInterval);
    return () => clearInterval(id);
  }, [auto, rotationInterval, advance, texts.length]);

  // retire the exiting layer once its animation has finished
  useEffect(() => {
    if (st.prevIdx == null) return undefined;
    const maxLen = Math.max(totalChars(texts[st.idx] || ''), totalChars(texts[st.prevIdx] || ''));
    const ms = (dur + stagger * maxLen) * 1000 + 140;
    const t = setTimeout(() => setSt(s => (s.gen === st.gen ? { ...s, prevIdx: null } : s)), ms);
    return () => clearTimeout(t);
  }, [st.gen]); // eslint-disable-line

  // measure the resting width so the chip morphs smoothly instead of snapping
  useLayoutEffect(() => {
    if (curRef.current) {
      const measured = curRef.current.offsetWidth;
      if (measured) setW(measured);
    }
  }, [st.idx]);

  useEffect(() => {
    const r = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(r);
  }, []);

  if (!texts.length) return React.createElement('span', null, '');

  const staggerDelay = (i, total) => {
    if (staggerFrom === 'last') return (total - 1 - i) * stagger;
    if (staggerFrom === 'center') { const c = Math.floor(total / 2); return Math.abs(c - i) * stagger; }
    return i * stagger;
  };

  const renderLayer = (text, mode, keyName, outerStyle, ref) => {
    const words = String(text).split(' ');
    const wordChars = words.map(splitChars);
    const total = wordChars.reduce((s, a) => s + a.length, 0) || 1;
    let gi = 0;
    const children = [];
    words.forEach((word, wi) => {
      const charEls = wordChars[wi].map((ch, ci) => {
        const delay = staggerDelay(gi, total);
        gi += 1;
        let animation = 'none';
        if (mode !== 'rest') {
          if (reduce) {
            animation = (mode === 'enter' ? 'rtxIn' : 'rtxOut') + ' ' + Math.min(dur, 0.22) + 's ' + ease + ' ' + Math.min(delay, 0.1) + 's both';
          } else {
            animation = (mode === 'enter' ? 'rtxEnter' : 'rtxLeave') + ' ' + dur + 's ' + ease + ' ' + delay + 's both';
          }
        }
        return React.createElement('span', { key: ci, style: { display: 'inline-block', animation, willChange: 'transform, opacity' } }, ch);
      });
      children.push(React.createElement('span', { key: 'w' + wi, style: { display: 'inline-flex' } }, charEls));
      if (wi !== words.length - 1) children.push(React.createElement('span', { key: 's' + wi, style: { whiteSpace: 'pre' } }, '\u00A0'));
    });
    const style = Object.assign({ display: 'inline-flex', padding: PADY + ' ' + PADX, boxSizing: 'border-box', lineHeight: 1.1, whiteSpace: 'nowrap' }, outerStyle || {});
    const layerProps = { key: keyName, style: style, 'aria-hidden': 'true' };
    if (ref) layerProps.ref = ref;
    return React.createElement('span', layerProps, children);
  };

  const cur = texts[st.idx] != null ? texts[st.idx] : '';
  const color = colors.length ? colors[st.idx % colors.length] : { bg: 'var(--ss-indigo)', fg: 'var(--ss-cream)' };

  const wrapperStyle = {
    display: 'inline-flex',
    position: 'relative',
    overflow: 'hidden',
    minWidth: 0,
    boxSizing: 'border-box',
    borderRadius: props.borderRadius || 'var(--r-sm)',
    backgroundColor: color.bg,
    color: color.fg,
    lineHeight: 1.1,
    whiteSpace: 'nowrap',
    textTransform: props.textTransform || 'none',
    letterSpacing: props.letterSpacing || 'inherit',
    width: w != null ? w + 'px' : 'auto',
    transition: ready ? ('width ' + dur + 's ' + ease + ', background-color ' + dur + 's ' + ease) : 'none'
  };

  return React.createElement(
    'span',
    { style: wrapperStyle },
    React.createElement('span', { 'aria-live': 'polite', style: { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 } }, cur),
    React.createElement(
      'span',
      { style: { position: 'relative', display: 'inline-flex' } },
      renderLayer(cur, st.gen === 0 ? 'rest' : 'enter', 'cur-' + st.gen, null, curRef),
      st.prevIdx != null ? renderLayer(texts[st.prevIdx], 'leave', 'prev-' + st.gen, { position: 'absolute', left: 0, top: 0 }, null) : null
    )
  );
};

RotatingText.displayName = 'RotatingText';
module.exports = { RotatingText };
