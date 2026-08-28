// GlitchText — adapted from React Bits (reactbits.dev). JS + CSS variant.
// CSS injected once on load. Soulstory palette: sky/periwinkle shadows on ink card.
// Subtle glitch always on; intensifies on hover (bigger offset, faster, stronger shadow).

const GLITCH_TEXT_CSS = `
.glitch {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  user-select: none;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
}
.glitch::after,
.glitch::before {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  color: inherit;
  background: var(--glitch-bg, #06060B);
  overflow: hidden;
  pointer-events: none;
}
.glitch::after {
  left: var(--glitch-offset, 3px);
  text-shadow: var(--after-shadow, -4px 0 #8CC6FF);
  animation: soulstory-glitch var(--after-duration, 3.2s) infinite linear alternate-reverse;
}
.glitch::before {
  left: calc(var(--glitch-offset, 3px) * -1);
  text-shadow: var(--before-shadow, 4px 0 #8E9FEE);
  animation: soulstory-glitch var(--before-duration, 2.4s) infinite linear alternate-reverse;
}
.glitch:hover {
  --glitch-offset: 9px;
}
.glitch:hover::after {
  text-shadow: var(--after-shadow-strong, -8px 0 #8CC6FF);
  animation-duration: calc(var(--after-duration, 3.2s) * 0.38);
}
.glitch:hover::before {
  text-shadow: var(--before-shadow-strong, 8px 0 #8E9FEE);
  animation-duration: calc(var(--before-duration, 2.4s) * 0.38);
}
@keyframes soulstory-glitch {
  0%   { clip-path: inset(20% 0 50% 0); }
  5%   { clip-path: inset(10% 0 60% 0); }
  10%  { clip-path: inset(15% 0 55% 0); }
  15%  { clip-path: inset(25% 0 35% 0); }
  20%  { clip-path: inset(30% 0 40% 0); }
  25%  { clip-path: inset(40% 0 20% 0); }
  30%  { clip-path: inset(10% 0 60% 0); }
  35%  { clip-path: inset(15% 0 55% 0); }
  40%  { clip-path: inset(25% 0 35% 0); }
  45%  { clip-path: inset(30% 0 40% 0); }
  50%  { clip-path: inset(20% 0 50% 0); }
  55%  { clip-path: inset(10% 0 60% 0); }
  60%  { clip-path: inset(15% 0 55% 0); }
  65%  { clip-path: inset(25% 0 35% 0); }
  70%  { clip-path: inset(30% 0 40% 0); }
  75%  { clip-path: inset(40% 0 20% 0); }
  80%  { clip-path: inset(20% 0 50% 0); }
  85%  { clip-path: inset(10% 0 60% 0); }
  90%  { clip-path: inset(15% 0 55% 0); }
  95%  { clip-path: inset(25% 0 35% 0); }
  100% { clip-path: inset(30% 0 40% 0); }
}
`;

(function injectCss() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('glitch-text-css')) return;
  const el = document.createElement('style');
  el.id = 'glitch-text-css';
  el.textContent = GLITCH_TEXT_CSS;
  document.head.appendChild(el);
})();

const GlitchText = ({ children, speed = 1, enableShadows = true, className = '', bg = '#06060B' }) => {
  const inlineStyles = {
    '--after-duration': `${speed * 3.2}s`,
    '--before-duration': `${speed * 2.4}s`,
    '--after-shadow': enableShadows ? '-4px 0 #8CC6FF' : 'none',
    '--before-shadow': enableShadows ? '4px 0 #8E9FEE' : 'none',
    '--after-shadow-strong': enableShadows ? '-8px 0 #8CC6FF' : 'none',
    '--before-shadow-strong': enableShadows ? '8px 0 #8E9FEE' : 'none',
    '--glitch-bg': bg,
  };
  const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
  return (
    <span className={`glitch ${className}`} style={inlineStyles} data-text={text}>
      {text}
    </span>
  );
};

if (typeof window !== 'undefined') window.GlitchText = GlitchText;
if (typeof module !== 'undefined' && module.exports) module.exports = { GlitchText };
