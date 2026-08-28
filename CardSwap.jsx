// CardSwap — adapted from React Bits (reactbits.dev), JS + CSS variant.
// Uses global gsap (loaded via <helmet> CDN) and the injected React runtime.
// Exposes a self-contained, Soulstory-branded deck: window.CardSwapDeck.

const { useEffect, useMemo, useRef } = React;

const CARDSWAP_CSS = `
.card-swap-container {
  position: absolute;
  top: 50%;
  left: 58%;
  transform: translate(-50%, -33%);
  transform-origin: center center;
  perspective: 1000px;
  overflow: visible;
}
.ss-card {
  position: absolute;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  border-radius: 22px;
  border: 1.5px solid rgba(142, 159, 238, 0.55);
  background: var(--ss-ink, #06060B);
  box-shadow: 0 40px 82px -26px rgba(6, 6, 11, 0.74), 0 0 0 1px rgba(142, 159, 238, 0.12), 0 0 48px -10px rgba(142, 159, 238, 0.30), inset 0 1px 0 rgba(226, 228, 246, 0.34);
  padding: 0;
  gap: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  cursor: default;
}
.ss-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 22px;
  background: radial-gradient(120% 80% at 100% 0%, rgba(142, 159, 238, 0.16), transparent 58%);
  pointer-events: none;
}
@media (max-width: 1200px) {
  .card-swap-container { transform: translate(-50%, -33%) scale(0.82); }
}
@media (max-width: 900px) {
  .card-swap-container { transform: translate(-50%, -33%) scale(0.66); }
}
@media (max-width: 560px) {
  .card-swap-container { transform: translate(-50%, -34%) scale(0.48); }
}
`;

(function injectCss() {
  if (typeof document === 'undefined' || document.getElementById('cardswap-css')) return;
  const el = document.createElement('style');
  el.id = 'cardswap-css';
  el.textContent = CARDSWAP_CSS;
  document.head.appendChild(el);
})();

const Card = React.forwardRef(({ customClass, ...rest }, ref) =>
  React.createElement('div', {
    ref,
    ...rest,
    className: `ss-card ${customClass ?? ''} ${rest.className ?? ''}`.trim(),
  })
);
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});
const placeNow = (gsap, el, slot, skew) =>
  gsap.set(el, {
    x: slot.x, y: slot.y, z: slot.z,
    xPercent: -50, yPercent: -50,
    skewY: skew, transformOrigin: 'center center',
    zIndex: slot.zIndex, force3D: true,
  });

const CardSwap = ({
  width = 680, height = 400,
  cardDistance = 66, verticalDistance = 58,
  delay = 4600, pauseOnHover = true,
  skewAmount = 6, easing = 'elastic',
  meta = [],
  children,
}) => {
  const config = easing === 'elastic'
    ? { ease: 'elastic.out(0.62,0.9)', durDrop: 1.15, durMove: 1.25, durReturn: 1.25, promoteOverlap: 0.72, returnDelay: 0.08 }
    : { ease: 'power1.inOut', durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 };

  const childArr = useMemo(() => React.Children.toArray(children), [children]);
  const refs = useMemo(() => childArr.map(() => React.createRef()), [childArr.length]);
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let cleanupHover = null;
    let cleanupNav = null;

    const boot = () => {
      const gsap = window.gsap;
      if (!gsap) { if (!cancelled) setTimeout(boot, 60); return; }
      if (cancelled) return;

      const total = refs.length;
      let animating = false;
      let pendingDir = 0;
      refs.forEach((r, i) => r.current && placeNow(gsap, r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

      const announce = (i) => {
        const idx = (i == null) ? order.current[0] : i;
        const m = (meta && meta[idx]) || {};
        try { window.dispatchEvent(new CustomEvent('soulstory:deck-change', { detail: { index: idx, name: m.name, followers: m.followers, num: m.num, copy: m.copy } })); } catch (_) {}
      };
      announce();

      const swap = () => {
        if (animating || order.current.length < 2) return;
        animating = true;
        const [front, ...rest] = order.current;
        announce(rest[0]);
        const elFront = refs[front].current;
        const tl = gsap.timeline();
        tlRef.current = tl;
        tl.to(elFront, { y: '+=500', duration: config.durDrop, ease: config.ease });
        tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
        rest.forEach((idx, i) => {
          const el = refs[idx].current;
          const slot = makeSlot(i, cardDistance, verticalDistance, total);
          tl.set(el, { zIndex: slot.zIndex }, 'promote');
          tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`);
        });
        const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
        tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
        tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, 'return');
        tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease }, 'return');
        tl.call(() => { order.current = [...rest, front]; animating = false; if (pendingDir) { const d = pendingDir; pendingDir = 0; (d < 0 ? swapBack : swap)(); } });
      };

      const swapBack = () => {
        if (animating || order.current.length < 2) return;
        animating = true;
        const arr = order.current.slice();
        const back = arr.pop();
        const newOrder = [back].concat(arr);
        order.current = newOrder;
        announce();
        const tl = gsap.timeline();
        tlRef.current = tl;
        newOrder.forEach((idx, i) => {
          const el = refs[idx].current;
          if (!el) return;
          const slot = makeSlot(i, cardDistance, verticalDistance, total);
          tl.set(el, { zIndex: slot.zIndex }, 0);
          tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, 0);
        });
        tl.call(() => { animating = false; if (pendingDir) { const d = pendingDir; pendingDir = 0; (d < 0 ? swapBack : swap)(); } });
      };

      const restart = () => { clearInterval(intervalRef.current); intervalRef.current = window.setInterval(swap, delay); };
      intervalRef.current = window.setInterval(swap, delay);

      const onNav = (e) => {
        const dir = (e && e.detail && e.detail.dir) || 1;
        if (animating) { pendingDir = dir; return; }
        if (dir < 0) swapBack(); else swap();
        restart();
      };
      window.addEventListener('soulstory:deck-nav', onNav);
      cleanupNav = () => window.removeEventListener('soulstory:deck-nav', onNav);

      if (pauseOnHover && container.current) {
        const node = container.current;
        const pause = () => { clearInterval(intervalRef.current); };
        const resume = () => { restart(); };
        node.addEventListener('mouseenter', pause);
        node.addEventListener('mouseleave', resume);
        cleanupHover = () => { node.removeEventListener('mouseenter', pause); node.removeEventListener('mouseleave', resume); };
      }
    };

    boot();
    return () => { cancelled = true; clearInterval(intervalRef.current); if (cleanupHover) cleanupHover(); if (cleanupNav) cleanupNav(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) =>
    React.isValidElement(child)
      ? React.cloneElement(child, { key: i, ref: refs[i], style: { width, height, ...(child.props.style ?? {}) } })
      : child
  );

  return React.createElement('div', { ref: container, className: 'card-swap-container', style: { width, height } }, rendered);
};

// ---- Soulstory prova social · clientes reais (bio do Instagram + big number) ----
const CLIENTS = [
  { name: 'Igor Gonçalves', followers: '747 mil seguidores', img: 'images/client-3.png', num: 'R$ 48,3 milhões faturados.', copy: 'Cinco lançamentos de sete dígitos, dois de oito, movidos por uma só narrativa: os Inconformados.' },
  { name: 'Camila Vieira', followers: '4,4 mi seguidores', img: 'images/client-2.png', num: 'Do zero a múltiplos 8 dígitos em 11 meses.', copy: 'Ela leu a própria copy e perguntou se não tinha sido ela quem escreveu.' },
  { name: 'Patrícia Domingos', followers: '40,9 mil seguidores', img: 'images/client-5.png', num: '198 mil euros em 9 meses, no tráfego orgânico.', copy: 'Tudo isso sem um euro em anúncio.' },
  { name: '49 educação', followers: '27,3 mil seguidores', img: 'images/client-4.png', num: 'R$ 1,2 milhão no primeiro ano de operação.', copy: 'Empresa no primeiro ano, seis pessoas no time, e o caixa já cruza os sete dígitos.' },
  { name: 'Spencer', followers: '2 mi seguidores', img: 'images/spencer.png', num: 'De 629 para 2.187 alunos em 8 meses.', copy: 'Oito meses, e a história começou a encher a escola de aluno novo.' },
  { name: 'Codirect', followers: '227 mil seguidores', img: 'images/codirect.png', num: 'Ticket de R$ 3.600 para R$ 19.800 em menos de 12 meses.', copy: 'Em dois anos, o mês de R$ 260 mil virou mês de R$ 770 mil.' },
];

const BioPanel = (c) =>
  React.createElement('div', { style: { position: 'relative', width: '100%', flex: '1 1 auto', minHeight: 0, overflow: 'hidden', background: '#0C1014' } },
    c.placeholder
      ? React.createElement('div', { style: { width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center', padding: '0 24px' } },
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ss-periwinkle, #8E9FEE)' } }, 'Codirect'),
          React.createElement('span', { style: { fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, lineHeight: 1.4, color: 'rgba(250,248,245,0.52)' } }, 'bio do Instagram · em breve')
        )
      : React.createElement('img', { src: c.img, alt: 'Bio de ' + c.name + ' no Instagram', loading: 'lazy', style: { width: '100%', height: '100%', objectFit: 'contain', display: 'block' } })
  );

const CardSwapDeck = () => {
  const cards = CLIENTS.map((c, i) =>
    React.createElement(Card, { key: i, customClass: 'ss-deck-card' },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '15px 22px', borderBottom: '1px solid rgba(142,159,238,0.22)', flex: '0 0 auto', background: 'linear-gradient(180deg, rgba(21,19,31,0.6), rgba(12,11,20,0))', minWidth: 0 } },
        React.createElement('span', { style: { width: 9, height: 9, borderRadius: '50%', background: 'var(--ss-periwinkle, #8E9FEE)', flex: '0 0 auto', boxShadow: '0 0 12px rgba(142,159,238,0.85)' } }),
        React.createElement('span', { style: { fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'clamp(18px, 1.4vw, 21px)', letterSpacing: '-0.3px', color: 'var(--ss-cream, #FAF8F5)', whiteSpace: 'nowrap', flex: '0 0 auto' } }, c.name),
        c.followers
          ? React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', color: 'var(--ss-periwinkle, #8E9FEE)', whiteSpace: 'nowrap', flex: '0 0 auto' } }, '· ' + c.followers)
          : null
      ),
      BioPanel(c)
    )
  );
  const meta = CLIENTS.map((c) => ({ name: c.name, followers: c.followers, num: c.num, copy: c.copy }));
  return React.createElement(CardSwap, {
    width: 680, height: 400, cardDistance: 66, verticalDistance: 58,
    delay: 4600, pauseOnHover: true, skewAmount: 6, easing: 'elastic', meta,
  }, cards);
};

if (typeof window !== 'undefined') { window.CardSwap = CardSwap; window.Card = Card; window.CardSwapDeck = CardSwapDeck; }
if (typeof module !== 'undefined' && module.exports) module.exports = { CardSwap, Card, CardSwapDeck, default: CardSwapDeck };
