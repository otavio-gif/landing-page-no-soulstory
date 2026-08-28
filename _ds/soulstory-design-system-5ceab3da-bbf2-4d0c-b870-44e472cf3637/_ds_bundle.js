/* @ds-bundle: {"format":4,"namespace":"SoulstoryDesignSystem_5ceab3","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"Badge","sourcePath":"components/content/Badge.jsx"},{"name":"Card","sourcePath":"components/content/Card.jsx"},{"name":"Overline","sourcePath":"components/content/Overline.jsx"},{"name":"SymbolMark","sourcePath":"components/content/SymbolMark.jsx"},{"name":"Tagline","sourcePath":"components/content/Tagline.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"a03ab956ce1c","components/content/Badge.jsx":"3672937b3687","components/content/Card.jsx":"e1b9a5b95c85","components/content/Overline.jsx":"69acf26dbcf1","components/content/SymbolMark.jsx":"831f503ca22d","components/content/Tagline.jsx":"33a9b79c9621","components/forms/Input.jsx":"622ee1ea59e4","components/forms/Textarea.jsx":"771950ff0906","ui_kits/soulstory-studio/Chrome.jsx":"5a3a7cc1ab5d","ui_kits/soulstory-studio/ContactScreen.jsx":"8a2e0fc02a3f","ui_kits/soulstory-studio/HomeScreen.jsx":"57735b4f672b","ui_kits/soulstory-studio/JournalScreen.jsx":"b7b40beefc06","ui_kits/soulstory-studio/WorkScreen.jsx":"af89d685b1bc"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SoulstoryDesignSystem_5ceab3 = window.SoulstoryDesignSystem_5ceab3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Soulstory Button — calm, brand-tinted, almost-square (radius 10px).
 * Variants: void (default), brand, outline, ghost. Sizes: sm, md, lg.
 * Hover shifts fill; press deepens to indigo-press. No scale-down (brand rule).
 */
function Button({
  children,
  variant = 'void',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '8px 16px',
      fontSize: 13
    },
    md: {
      padding: '12px 22px',
      fontSize: 15
    },
    lg: {
      padding: '15px 30px',
      fontSize: 16
    }
  };
  const variants = {
    void: {
      background: 'var(--ss-ink)',
      color: 'var(--ss-cream)',
      border: '1px solid transparent'
    },
    brand: {
      background: 'var(--ss-indigo)',
      color: 'var(--ss-cream)',
      border: '1px solid transparent'
    },
    outline: {
      background: 'transparent',
      color: 'var(--ss-ink)',
      border: '1px solid var(--ss-ink)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ss-indigo)',
      border: '1px solid transparent'
    }
  };
  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    lineHeight: 1,
    borderRadius: 'var(--r-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  const hovers = {
    void: {
      background: 'var(--ss-surface-indigo)'
    },
    brand: {
      background: 'var(--ss-indigo-press)'
    },
    outline: {
      background: 'rgba(60, 57, 110, 0.05)'
    },
    ghost: {
      background: 'var(--ss-lavender)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const composed = hover && !disabled ? {
    ...base,
    ...hovers[variant]
  } : base;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: "btn",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: composed
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/content/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Soulstory Badge — sharp lavender pill (radius 6px). Optional status dot.
 */
function Badge({
  children,
  tone = 'lavender',
  dot = false,
  style,
  ...rest
}) {
  const tones = {
    lavender: {
      background: 'var(--ss-lavender)',
      color: 'var(--ss-indigo)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--ss-indigo)',
      boxShadow: 'inset 0 0 0 1px var(--line-default)'
    },
    void: {
      background: 'var(--ss-surface-indigo)',
      color: 'var(--ss-cream)'
    },
    success: {
      background: 'rgba(92,139,122,0.14)',
      color: 'var(--status-success)'
    },
    error: {
      background: 'rgba(155,68,68,0.12)',
      color: 'var(--status-error)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "badge",
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: '0.1px',
      padding: '5px 11px',
      borderRadius: 'var(--r-sm)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      lineHeight: 1.2,
      ...tones[tone],
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Badge.jsx", error: String((e && e.message) || e) }); }

// components/content/Overline.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Overline — mono or sans uppercase eyebrow with wide tracking.
 * Use for kickers and section labels above a heading.
 */
function Overline({
  children,
  mono = false,
  color = 'var(--text-tertiary)',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontSize: mono ? 12 : 11,
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: mono ? '0.04em' : '0.6px',
      textTransform: 'uppercase',
      color,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Overline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Overline.jsx", error: String((e && e.message) || e) }); }

// components/content/SymbolMark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SymbolMark — the Soulstory (...) glyph (two arcs + three dots).
 * Always a PNG asset, never redrawn. Six color variants.
 * `base` points at the folder holding symbol-*.png (default "assets").
 */
function SymbolMark({
  color = 'indigo',
  size = 28,
  base = 'assets',
  style,
  alt = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("img", _extends({
    src: `${base}/symbol-${color}.png`,
    alt: alt,
    "aria-hidden": alt === '' ? true : undefined,
    style: {
      width: size,
      height: 'auto',
      display: 'inline-block',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { SymbolMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SymbolMark.jsx", error: String((e && e.message) || e) }); }

// components/content/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Soulstory Card — whisper border, soft indigo lift, optional corner glyph.
 * `tone`: light (white), veil (warm), void (dark quote surface).
 */
function Card({
  children,
  tone = 'light',
  mark = false,
  markBase = 'assets',
  hover = true,
  style,
  ...rest
}) {
  const tones = {
    light: {
      background: 'var(--ss-white)',
      color: 'var(--text-primary)',
      borderColor: 'var(--line-whisper)'
    },
    veil: {
      background: 'var(--ss-warm-veil)',
      color: 'var(--text-primary)',
      borderColor: 'var(--line-whisper)'
    },
    void: {
      background: 'var(--ss-ink)',
      color: 'var(--text-primary-dark)',
      borderColor: 'var(--line-whisper-dark)'
    }
  };
  const [lift, setLift] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => hover && setLift(true),
    onMouseLeave: () => hover && setLift(false),
    style: {
      position: 'relative',
      border: '1px solid',
      borderRadius: 'var(--r-xl)',
      padding: 28,
      boxShadow: lift ? 'var(--shadow-elevated)' : 'var(--shadow-soft-indigo)',
      transform: lift ? 'translateY(-2px)' : 'none',
      transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
      ...tones[tone],
      ...style
    }
  }, rest), children, mark && /*#__PURE__*/React.createElement(__ds_scope.SymbolMark, {
    color: tone === 'void' ? 'cream' : 'indigo',
    base: markBase,
    size: 28,
    style: {
      position: 'absolute',
      right: 18,
      bottom: 16,
      opacity: tone === 'void' ? 0.7 : 0.55
    }
  }));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Card.jsx", error: String((e && e.message) || e) }); }

// components/content/Tagline.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tagline — Minion serif italic, indigo. Editorial voice for taglines/standfirsts.
 * Serif is editorial only; never use it for UI labels.
 */
function Tagline({
  children,
  as = 'div',
  size = 16,
  color = 'var(--ss-indigo)',
  style,
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: size,
      fontWeight: 400,
      lineHeight: 1.45,
      letterSpacing: '0.2px',
      color,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tagline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Tagline.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Soulstory text Input. White fill, default hairline, periwinkle focus ring —
 * the one moment brand color pops on a form. Optional label + hint.
 */
function Input({
  label,
  hint,
  id,
  style,
  wrapStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `in-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      ...wrapStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: '0.1px',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      background: 'var(--ss-white)',
      border: '1px solid',
      borderColor: focus ? 'var(--line-active)' : 'var(--line-default)',
      borderRadius: 'var(--r-md)',
      padding: '12px 16px',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--text-primary)',
      boxShadow: focus ? 'var(--shadow-ring-focus)' : 'none',
      outline: 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, rest)), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-tertiary)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Soulstory Textarea — multi-line companion to Input. Same focus behaviour.
 */
function Textarea({
  label,
  hint,
  id,
  rows = 4,
  style,
  wrapStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `ta-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      ...wrapStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: '0.1px',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    id: inputId,
    rows: rows,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      background: 'var(--ss-white)',
      border: '1px solid',
      borderColor: focus ? 'var(--line-active)' : 'var(--line-default)',
      borderRadius: 'var(--r-md)',
      padding: '12px 16px',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.55,
      color: 'var(--text-primary)',
      boxShadow: focus ? 'var(--shadow-ring-focus)' : 'none',
      outline: 'none',
      resize: 'vertical',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, rest)), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-tertiary)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// ui_kits/soulstory-studio/Chrome.jsx
try { (() => {
// Soulstory Studio — shared top navigation + footer
const SS = window.SoulstoryDesignSystem_5ceab3;
const ASSETS = "../../assets";
function TopNav({
  route,
  onNavigate
}) {
  const links = [{
    id: 'home',
    label: 'Studio'
  }, {
    id: 'work',
    label: 'Work'
  }, {
    id: 'journal',
    label: 'Journal'
  }, {
    id: 'contact',
    label: 'Contact'
  }];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(250, 248, 245, 0.82)',
      backdropFilter: 'saturate(180%) blur(12px)',
      WebkitBackdropFilter: 'saturate(180%) blur(12px)',
      borderBottom: '1px solid var(--line-whisper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '18px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('home'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 20,
      fontWeight: 500,
      letterSpacing: '0.06em',
      color: 'var(--text-primary)'
    }
  }, "SOULSTORY"), /*#__PURE__*/React.createElement(SS.SymbolMark, {
    color: "indigo",
    base: ASSETS,
    size: 22
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 30,
      alignItems: 'center'
    }
  }, links.map(l => /*#__PURE__*/React.createElement("button", {
    key: l.id,
    onClick: () => onNavigate(l.id),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 500,
      color: route === l.id ? 'var(--ss-indigo)' : 'var(--text-secondary)',
      borderBottom: route === l.id ? '1px solid var(--ss-indigo)' : '1px solid transparent',
      transition: 'color var(--dur-fast) var(--ease-out)'
    }
  }, l.label)), /*#__PURE__*/React.createElement(SS.Button, {
    size: "sm",
    variant: "void",
    onClick: () => onNavigate('contact')
  }, "Tell us your story"))));
}
function Footer({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--ss-ink)',
      color: 'var(--text-secondary-dark)',
      padding: '64px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-primary-dark)',
      fontSize: 22,
      fontWeight: 500,
      letterSpacing: '0.06em'
    }
  }, "SOULSTORY"), /*#__PURE__*/React.createElement(SS.SymbolMark, {
    color: "cream",
    base: ASSETS,
    size: 20
  })), "Storytelling Branding \xB7 Design System 2.0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: 14,
      color: 'var(--text-tertiary-dark)'
    }
  }, "An open story \xB7 a held suspense \xB7 a continuation")));
}
Object.assign(window, {
  TopNav,
  Footer,
  ASSETS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/soulstory-studio/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/soulstory-studio/ContactScreen.jsx
try { (() => {
// Soulstory Studio — Contact
const SSc = window.SoulstoryDesignSystem_5ceab3;
function ContactScreen({
  onNavigate
}) {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ss-ink)',
      padding: '88px 40px',
      minHeight: '70vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 72,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SSc.Tagline, {
    size: 18,
    color: "var(--ss-sky)",
    style: {
      marginBottom: 22
    }
  }, "Tell us your story"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 60,
      fontWeight: 400,
      lineHeight: 1.06,
      letterSpacing: '-1.6px',
      margin: '0 0 24px',
      color: 'var(--text-primary-dark)'
    }
  }, "Every brand begins", /*#__PURE__*/React.createElement("br", null), "with a sentence."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 19,
      lineHeight: 1.65,
      color: 'var(--text-body-dark)',
      maxWidth: 460,
      margin: '0 0 40px'
    }
  }, "Tell us where yours starts. We read everything, and we reply in your voice \u2014 not ours."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, [['Studio', 'hello@soulstory.studio'], ['Located', 'Lisbon · remote'], ['Hours', 'Mon–Thu · by appointment']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      gap: 24,
      borderTop: '1px solid var(--line-whisper-dark)',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.6px',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary-dark)',
      width: 80
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--text-primary-dark)'
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--ss-elevated)',
      borderRadius: 'var(--r-2xl)',
      border: '1px solid var(--line-whisper-dark)',
      padding: 36,
      boxShadow: 'var(--shadow-floating)',
      position: 'relative'
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: ASSETS + '/symbol-sky.png',
    alt: "",
    style: {
      width: 56,
      marginBottom: 20
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 26,
      fontWeight: 400,
      color: 'var(--text-primary-dark)',
      margin: '0 0 10px'
    }
  }, "The story is in."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: 16,
      color: 'var(--ss-sky)',
      margin: 0
    }
  }, "We'll reply within two working days.")) : /*#__PURE__*/React.createElement("form", {
    className: "ss-dark-form",
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(SSc.Input, {
    label: "Name",
    placeholder: "Your name",
    required: true
  }), /*#__PURE__*/React.createElement(SSc.Input, {
    label: "Email",
    type: "email",
    placeholder: "you@brand.com",
    required: true
  }), /*#__PURE__*/React.createElement(SSc.Textarea, {
    label: "Tell us your story",
    rows: 4,
    placeholder: "Where does it begin?",
    required: true
  }), /*#__PURE__*/React.createElement(SSc.Button, {
    type: "submit",
    variant: "brand",
    size: "lg",
    style: {
      marginTop: 4
    }
  }, "Send to the studio"))))));
}
Object.assign(window, {
  ContactScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/soulstory-studio/ContactScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/soulstory-studio/HomeScreen.jsx
try { (() => {
// Soulstory Studio — Home
const SSh = window.SoulstoryDesignSystem_5ceab3;
function SectionHead({
  num,
  title,
  lede,
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      gap: 48,
      marginBottom: 56,
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      letterSpacing: '0.04em',
      color: dark ? 'var(--text-tertiary-dark)' : 'var(--text-tertiary)'
    }
  }, num), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 44,
      fontWeight: 400,
      lineHeight: 1.12,
      letterSpacing: '-1px',
      margin: '0 0 16px',
      color: dark ? 'var(--text-primary-dark)' : 'var(--text-primary)'
    },
    dangerouslySetInnerHTML: {
      __html: title
    }
  }), lede && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 17,
      lineHeight: 1.7,
      color: dark ? 'var(--text-body-dark)' : 'var(--text-body)',
      maxWidth: '60ch',
      margin: 0
    }
  }, lede)));
}
function HomeScreen({
  onNavigate
}) {
  const services = [{
    t: 'Brand strategy',
    d: 'Positioning, narrative architecture, and the recoverable decisions a voice is built from.'
  }, {
    t: 'Identity & design',
    d: 'Marks, type systems, and editorial design that carry the strategy into every surface.'
  }, {
    t: 'Voice & editorial',
    d: 'The language layer — taglines, manifestos, and the long-form that makes a brand stay.'
  }];
  const work = [{
    client: 'Meridian Press',
    kind: 'Identity · Editorial',
    line: 'A publishing house that needed to sound older than it was.'
  }, {
    client: 'Lumen Health',
    kind: 'Strategy · Naming',
    line: 'Calm authority for a category built on noise.'
  }, {
    client: 'Atlas & Field',
    kind: 'Brand · Voice',
    line: 'A field guide voice for a software company.'
  }];
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--ss-cream)',
      padding: '96px 40px 104px',
      borderBottom: '1px solid var(--line-whisper)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: ASSETS + '/symbol-indigo.png',
    alt: "",
    style: {
      position: 'absolute',
      right: -120,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 680,
      opacity: 0.06,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(SSh.Tagline, {
    size: 18,
    style: {
      marginBottom: 26
    }
  }, "Storytelling Branding"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 88,
      fontWeight: 400,
      lineHeight: 1.03,
      letterSpacing: '-2.2px',
      color: 'var(--text-primary)',
      margin: '0 0 30px',
      maxWidth: 900
    }
  }, "Brands grow through stories well told", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ss-indigo)'
    }
  }, ".")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 20,
      lineHeight: 1.6,
      color: 'var(--text-body)',
      maxWidth: 620,
      margin: '0 0 40px'
    }
  }, "We are a storytelling-branding studio. We help the moment a strategy hardens and a language softens land quietly, on purpose, and with the full weight of what came before."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(SSh.Button, {
    variant: "void",
    size: "lg",
    onClick: () => onNavigate('contact')
  }, "Tell us your story"), /*#__PURE__*/React.createElement(SSh.Button, {
    variant: "outline",
    size: "lg",
    onClick: () => onNavigate('work')
  }, "See the work")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ss-warm-veil)',
      padding: '96px 40px',
      borderBottom: '1px solid var(--line-whisper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    num: "01 \xB7 What we do",
    title: "Three disciplines,<br/>one continuous voice.",
    lede: "Strategy, identity, and editorial voice are not handoffs. They are one practice, kept in the same hands from positioning to the last footnote."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, services.map((s, i) => /*#__PURE__*/React.createElement(SSh.Card, {
    key: i,
    mark: true,
    markBase: ASSETS,
    style: {
      minHeight: 220
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-tertiary)',
      marginBottom: 14
    }
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 22,
      fontWeight: 500,
      letterSpacing: '-0.2px',
      margin: '0 0 10px'
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.55,
      color: 'var(--text-body)',
      margin: 0
    }
  }, s.d)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ss-ink)',
      padding: '96px 40px',
      borderBottom: '1px solid var(--line-whisper-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    dark: true,
    num: "02 \xB7 Selected work",
    title: "Quiet authority,<br/>case by case.",
    lede: "A few of the brands we have helped find a voice older and surer than their age."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, work.map((w, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => onNavigate('work'),
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.4fr auto',
      gap: 32,
      alignItems: 'baseline',
      padding: '28px 0',
      borderTop: '1px solid var(--line-whisper-dark)',
      background: 'none',
      border: 'none',
      borderTopStyle: 'solid',
      cursor: 'pointer',
      textAlign: 'left',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--text-primary-dark)'
    }
  }, w.client), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: 17,
      color: 'var(--text-body-dark)'
    }
  }, w.line), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--ss-sky)',
      whiteSpace: 'nowrap'
    }
  }, w.kind, " \u2192")))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ss-ink)',
      padding: '40px 40px 104px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820,
      margin: '0 auto',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 52,
      fontWeight: 400,
      lineHeight: 1.12,
      letterSpacing: '-1px',
      color: 'var(--text-primary-dark)',
      margin: '0 0 28px'
    }
  }, "A brand is a memory you build on purpose."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: 16,
      color: 'var(--ss-sky)'
    }
  }, "\u2014 Soulstory studio"), /*#__PURE__*/React.createElement("img", {
    src: ASSETS + '/symbol-cream.png',
    alt: "",
    style: {
      position: 'absolute',
      right: 0,
      bottom: -6,
      width: 64,
      opacity: 0.7
    }
  }))));
}
Object.assign(window, {
  HomeScreen,
  SectionHead
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/soulstory-studio/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/soulstory-studio/JournalScreen.jsx
try { (() => {
// Soulstory Studio — Journal (essay / article specimen)
const SSj = window.SoulstoryDesignSystem_5ceab3;
function JournalScreen({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("main", {
    style: {
      background: 'var(--ss-cream)'
    }
  }, /*#__PURE__*/React.createElement("article", {
    style: {
      maxWidth: 680,
      margin: '0 auto',
      padding: '72px 24px 96px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('home'),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.04em',
      color: 'var(--text-tertiary)',
      marginBottom: 36
    }
  }, "\u2190 Journal"), /*#__PURE__*/React.createElement(SSj.Overline, {
    mono: true,
    color: "var(--ss-indigo)"
  }, "Storytelling \xB7 Essays"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 52,
      fontWeight: 400,
      lineHeight: 1.08,
      letterSpacing: '-1.4px',
      margin: '16px 0 18px',
      color: 'var(--text-primary)'
    }
  }, "The slow architecture of a brand voice."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: 19,
      lineHeight: 1.55,
      color: 'var(--text-body)',
      margin: '0 0 24px'
    }
  }, "A note on the difference between brand and identity, written from twelve years of getting it wrong."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.04em',
      color: 'var(--text-secondary)',
      paddingBottom: 24,
      borderBottom: '1px solid var(--line-default)',
      marginBottom: 36
    }
  }, "BY OTAVIO PACHECO \xB7 APR 27, 2026 \xB7 9 MIN READ"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: '0 0 24px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      float: 'left',
      fontFamily: 'var(--font-serif)',
      fontSize: 64,
      lineHeight: 0.82,
      color: 'var(--ss-indigo)',
      padding: '6px 12px 0 0'
    }
  }, "T"), "welve years in, I still catch myself starting projects with the wrong sentence. The instinct is to ask what a brand should ", /*#__PURE__*/React.createElement("em", null, "say"), ", when the better question is what it should ", /*#__PURE__*/React.createElement("em", null, "sound like"), " when it isn't selling anything at all."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: '0 0 32px'
    }
  }, "Identity is the part you can see in a week \u2014 a mark, a palette, a typeface. Voice is the part that takes a season, because it is not a paragraph you write but a set of decisions you can keep recovering, long after the launch deck has gone quiet."), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      borderTop: '1px solid var(--line-default)',
      borderBottom: '1px solid var(--line-default)',
      padding: '24px 0',
      margin: '0 0 32px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 28,
      lineHeight: 1.3,
      color: 'var(--text-primary)',
      margin: 0
    }
  }, "A voice is not a paragraph. A voice is a set of recoverable decisions.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 18,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      margin: '0 0 32px'
    }
  }, "So we start slow, and on purpose. We write the manifesto before the wordmark. We argue about a single adverb. And when the identity finally arrives, it has somewhere to stand \u2014 because the language got there first."), /*#__PURE__*/React.createElement(SSj.Card, {
    tone: "veil",
    hover: false,
    mark: true,
    markBase: ASSETS,
    style: {
      margin: '0 0 40px'
    }
  }, /*#__PURE__*/React.createElement(SSj.Overline, {
    color: "var(--ss-indigo)"
  }, "The Soulstory method"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.6,
      color: 'var(--text-body)',
      margin: '12px 0 0',
      maxWidth: '52ch'
    }
  }, "Voice first, identity second, system always. Every brand we build ends the same way \u2014 with a single mark that closes the piece like the end of a paragraph.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      paddingTop: 32,
      borderTop: '1px solid var(--line-whisper)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: ASSETS + '/symbol-indigo.png',
    alt: "",
    style: {
      width: 30
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: 15,
      color: 'var(--text-secondary)'
    }
  }, "An open story \xB7 a held suspense \xB7 a continuation"))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ss-warm-veil)',
      padding: '72px 40px',
      borderTop: '1px solid var(--line-whisper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 680,
      margin: '0 auto',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 28,
      fontWeight: 400,
      letterSpacing: '-0.4px',
      margin: '0 0 10px'
    }
  }, "Keep reading."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 16,
      lineHeight: 1.6,
      color: 'var(--text-body)',
      margin: '0 0 24px'
    }
  }, "One essay a month on strategy, voice, and the slow craft of brand. No noise."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      maxWidth: 460
    }
  }, /*#__PURE__*/React.createElement(SSj.Input, {
    wrapStyle: {
      flex: 1
    },
    placeholder: "hello@soulstory.studio",
    "aria-label": "Email"
  }), /*#__PURE__*/React.createElement(SSj.Button, {
    variant: "void"
  }, "Subscribe")))));
}
Object.assign(window, {
  JournalScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/soulstory-studio/JournalScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/soulstory-studio/WorkScreen.jsx
try { (() => {
// Soulstory Studio — Work / Case study detail
const SSw = window.SoulstoryDesignSystem_5ceab3;
function WorkScreen({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ss-cream)',
      padding: '72px 40px 64px',
      borderBottom: '1px solid var(--line-whisper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 880,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('home'),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.04em',
      color: 'var(--text-tertiary)',
      marginBottom: 32
    }
  }, "\u2190 All work"), /*#__PURE__*/React.createElement(SSw.Overline, {
    mono: true,
    color: "var(--ss-indigo)"
  }, "Case study \xB7 Identity & editorial"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 60,
      fontWeight: 400,
      lineHeight: 1.06,
      letterSpacing: '-1.6px',
      margin: '18px 0 22px',
      color: 'var(--text-primary)'
    }
  }, "Meridian Press"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 20,
      lineHeight: 1.6,
      color: 'var(--text-body)',
      maxWidth: 620,
      margin: 0
    }
  }, "A publishing house that needed to sound older than it was \u2014 without pretending to be a museum."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 26,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(SSw.Badge, null, "Strategy"), /*#__PURE__*/React.createElement(SSw.Badge, null, "Naming"), /*#__PURE__*/React.createElement(SSw.Badge, null, "Identity"), /*#__PURE__*/React.createElement(SSw.Badge, null, "Editorial voice")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ss-warm-veil)',
      padding: '0',
      borderBottom: '1px solid var(--line-whisper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '56px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 420,
      borderRadius: 'var(--r-2xl)',
      overflow: 'hidden',
      background: 'var(--ss-ink)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-elevated)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: ASSETS + '/symbol-sky.png',
    alt: "",
    style: {
      width: 160,
      opacity: 0.9
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 24,
      left: 28,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-tertiary-dark)'
    }
  }, "Brand plate \xB7 the (...) mark on void")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ss-cream)',
      padding: '88px 40px',
      borderBottom: '1px solid var(--line-whisper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 64,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 32,
      fontWeight: 400,
      letterSpacing: '-0.6px',
      margin: '0 0 20px'
    }
  }, "The brief, and the turn"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 18,
      lineHeight: 1.75,
      color: 'var(--text-body)',
      margin: '0 0 24px'
    }
  }, "Meridian arrived with a logo and a launch date. What they lacked was the slower thing \u2014 a sentence the brand could keep starting with. We began with the voice, then let identity follow the language rather than the other way around."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 18,
      lineHeight: 1.75,
      color: 'var(--text-body)',
      margin: 0
    }
  }, "The result reads as quiet authority: a humanist sans for structure, a classical serif italic for the editorial register, and a single mark that closes every piece like the end of a paragraph."), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--line-default)',
      borderBottom: '1px solid var(--line-default)',
      padding: '20px 0',
      margin: '36px 0'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 26,
      lineHeight: 1.32,
      color: 'var(--text-primary)',
      margin: 0
    }
  }, "\"A voice is not a paragraph. A voice is a set of recoverable decisions.\""))), /*#__PURE__*/React.createElement("aside", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(SSw.Card, {
    tone: "veil",
    hover: false
  }, /*#__PURE__*/React.createElement(SSw.Overline, {
    color: "var(--text-tertiary)"
  }, "Engagement"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      marginTop: 14
    }
  }, [['Duration', '14 weeks'], ['Disciplines', 'Strategy → Identity'], ['Deliverables', 'Voice guide · Marks · Type system'], ['Year', '2026']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      borderTop: '1px solid var(--line-whisper)',
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-tertiary)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-primary)',
      textAlign: 'right'
    }
  }, v))))), /*#__PURE__*/React.createElement(SSw.Button, {
    variant: "brand",
    onClick: () => onNavigate('contact')
  }, "Start a project like this")))));
}
Object.assign(window, {
  WorkScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/soulstory-studio/WorkScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Overline = __ds_scope.Overline;

__ds_ns.SymbolMark = __ds_scope.SymbolMark;

__ds_ns.Tagline = __ds_scope.Tagline;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Textarea = __ds_scope.Textarea;

})();
