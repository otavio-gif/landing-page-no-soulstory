# Soulstory Design System 2.0

> Storytelling Branding · *An open story · a held suspense · a continuation*

Soulstory is a **storytelling-branding studio**. The brand voice is **editorial-mystical**: warm parchment in dialogue with a deep indigo void, a humanist-sans + classical-serif voice pair, brand-tinted shadows, and a single glyph — `(...)` — that holds it all together. The thesis on every surface: *brands grow through stories well told.*

This design system restores and packages that brand into a compiler-readable library: tokens, fonts, foundation specimens, reusable React components, and a studio website UI kit.

---

## Sources

This system was restored from a self-contained brand package:

- **`Design System 2.0/Soulstory Design System 2.0.html`** — the canonical specimen document (hero, color, type, components, samples, rules).
- **`Design System 2.0/colors_and_type.css`** — the original token + type-utility stylesheet (split here into `tokens/`).
- **`Design System 2.0/assets/`** — logo lockups and the `(...)` symbol in six color variants.

No Figma or live codebase was attached — the HTML/CSS package is the source of truth.

---

## Brand context

| | |
|---|---|
| **Studio** | Soulstory |
| **Discipline** | Storytelling Branding — strategy + identity + editorial voice |
| **Wordmark** | `SOULSTORY` (all caps, alone) — never typed with the parenthesis |
| **Symbol** | `(...)` — two arcs + three dots, a PNG asset only |
| **Programs** | **Nó** · StoryFunnels · **Trama** · Storytelling Branding Camp — endorsed, each with its own SVG symbol |
| **Surfaces** | Parchment (light) ↔ Void (dark), alternated like chapters |
| **Version** | 2.0 · April 2026 |

The glyph is meaning-bearing: an *open story*, a *held suspense*, a *continuation*. It appears at card corners, as section dividers, and as a low-opacity hero watermark — never typed as the characters `(...)`.

---

## CONTENT FUNDAMENTALS

How Soulstory writes.

- **Tone** — quiet authority. Confident, unhurried, a little literary. Never hype, never exclamation marks, never emoji. "Editorial restraint over decorative complexity" is the governing instinct.
- **Voice** — first-person-plural studio voice ("**we** help that moment land"), occasionally first-person-singular in editorial essays ("twelve years in, **I** still catch myself…"). Addresses the reader as **you** in CTAs ("Tell us your story").
- **Casing** — sentence case for body and headings; the wordmark `SOULSTORY` and overlines are uppercase. Mono overlines use wide tracking.
- **Sentence rhythm** — short declaratives next to longer reflective ones. Aphoristic pull quotes: *"A brand is a memory you build on purpose."* · *"Stories don't sell. Stories stay."* · *"A voice is not a paragraph. A voice is a set of recoverable decisions."*
- **Punctuation** — the middot ` · ` separates metadata (`Storytelling Branding · Design System 2.0`). Em dashes for attribution (`— Soulstory studio`). Arrows `→` on text CTAs.
- **What it never does** — no emoji, no slang, no growth-marketing verbs ("supercharge", "unlock"), no exclamation. Serif italic is reserved for taglines and quoted matter; it never appears in UI labels.
- **Sample copy** — kickers: "Storytelling · Essays". CTAs: "Tell us your story", "Book a call", "Open the specimen". Taglines: "Storytelling Branding", "Strategy that holds its silence."

---

## VISUAL FOUNDATIONS

- **Color** — an indigo–violet axis warmed by parchment. Brand: Indigo Authority `#3D396E`, Lavender Insight `#8E9FEE`, Sky Awakening `#8CC6FF`. Surfaces: Parchment `#FAF8F5`, Warm Veil `#F1EFEC`, Mist Lavender `#E1E4F6`, Void `#0C0B14`. **No warm chromatics** — no orange, red, saturated yellow or green. Saturation is restrained; the brightest violet is a soft lavender, never electric purple.
- **Program tricolor** — the program symbols (Nó, Trama) carry three dots in the brand trio — Indigo Authority `#3D396E`, Lavender Insight `#8E9FEE`, Sky Awakening `#8CC6FF` — always sequenced **in the direction of the symbol's movement**: in **Nó** the sequence descends (the funnel narrowing to the essential), in **Trama** it ascends (the weave rising), and it always ends in **sky**. On **Void** the trio lifts one step for contrast — Lavender `#8E9FEE`, Sky `#8CC6FF`, Mist Lavender `#E1E4F6` — with the threads in cream at 50%. The **one-color** cut is all indigo on light, all cream on dark, all black in single-channel print. Never a gradient — the house has none.
- **Backgrounds** — flat color only. **No gradients, ever.** Depth comes from alternating Parchment and Void sections (chapter rhythm), not gradient fills. Pure white is never a page background — always Parchment or Void. The `(...)` symbol may sit as a ~6% opacity watermark.
- **Type** — Mr Eaves Sans OT (humanist sans) for all structure and UI; Minion 3 Pro (classical serif, usually italic) for taglines, editorial body, and pull quotes. Display sizes use **weight 400** — light weight as whispered authority. Body line-height never drops below 1.50; editorial body runs 1.70.
- **Spacing** — 8px base scale (4 → 160px). Generous section padding (96px desktop). 1200px container max.
- **Corners** — almost-square. Radius scale **stops at 32px**; badges 6px, buttons/inputs 10px, cards 12–16px. **No fully-rounded pills.**
- **Borders** — "whisper borders before drop shadows." Hairlines tinted with indigo: `--line-whisper` (10%), `--line-default` (18%). Active/focus line is periwinkle.
- **Shadows** — **always indigo-tinted** `rgba(60,57,110, …)`, never neutral gray. A soft-indigo lift for resting cards; elevated/floating ramps for overlays. Focus ring is a 3px periwinkle glow at 20% — the one moment brand color pops on a form.
- **Imagery** — cool-toned, editorial, calm. Warm/grainy/saturated imagery is off-brand.
- **Motion** — calm and intentional. Durations 160/280/520ms. Easing `cubic-bezier(0.22,1,0.36,1)` (gentle ease-out). Fades and small lifts (`translateY(-2px)`) on hover; **no bounce, no spring**. Respects `prefers-reduced-motion`.
- **Hover / press** — cards lift 2px and deepen to `--shadow-elevated`; buttons shift fill (void → surface-indigo). Press deepens fill (indigo → indigo-press). No scale-down.
- **Layout** — left-aligned editorial grids; a `200px / 1fr` section-head grid pairs a mono section number with title + serif lede. Quote bands and drop caps are signature editorial devices.

---

## ICONOGRAPHY

- **No icon font, no UI-icon set ships with this brand.** The original package contains zero line/glyph icons — the visual language is type, rule-lines, and the brand symbol.
- **The house symbol is `(...)` — a PNG asset only.** `assets/symbol-*.png` — the `(...)` glyph (two arcs + three dots) in six colors: `indigo`, `periwinkle`, `lavender`, `sky`, `cream`, `black`. Use it as a corner mark, section divider, inline pause, or low-opacity watermark. **Never** redraw it as text or SVG — always `<img src="assets/symbol-*.png">`. (The program symbols below are a *separate* mark system and ship as SVG.)
- **Logo lockups** — `assets/logo-black.png`, `assets/logo-white.png` (full `SOULSTORY (...)` + serif "Storytelling Branding"), and `assets/logo-on-light.png`.
- **Program logos — Nó & Trama.** Soulstory endorses; the programs sign. Two program marks sit beside the house glyph: **Nó** · StoryFunnels — a *funnel* (two threads converge, three dots fall and diminish) — and **Trama** · Storytelling Branding Camp — a *woven basket* (four threads interlaced over-and-under, three dots on an ascending diagonal). Each ships as a scalable SVG in three variants: `assets/no-symbol-{parchment,void,mono}.svg` and `assets/trama-symbol-{parchment,void,mono}.svg`. Full manual in `guidelines/product-logos.html`.
- **Program logo rules.** The endorsement `UM PROGRAMA SOULSTORY` sets in spaced uppercase, **text only**, anchored to the lockup's typographic column beneath a hairline rule — **never** paired with the house `(...)` symbol (each program carries its own). Clear space is **half the symbol height** (x/2) on every edge. Below **22px** name-height, use symbol + name only — no descriptor, no endorsement. **Never** leave the índigo · lavender · sky trio, recolor dots individually, alter thread weight, rotate, distort, or apply shadow or gradient.
- **No emoji. No unicode pictographs.** The only non-letter glyphs in running text are the middot ` · `, em dash `—`, and arrow `→`.
- **If a UI surface genuinely needs functional icons** (e.g. a product app), substitute **Lucide** (CDN, 1.5–2px stroke, rounded) as the closest match to the brand's calm hairline weight — and flag it as a substitution, since it is *not* part of the original package.

---

## Index / manifest

Root files:

- `styles.css` — global entry point (imports only). Consumers link this.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `motion.css`, `base.css`.
- `assets/` — logo lockups, the `(...)` symbol (6 colors, PNG), and the program symbols **Nó** & **Trama** (SVG · parchment / void / mono).
- `guidelines/` — foundation specimen cards (Type, Colors, Spacing, Brand).
- `components/` — reusable React primitives + per-directory specimen cards.
- `ui_kits/soulstory-studio/` — the studio marketing-site UI kit (full screens).
- `SKILL.md` — Agent-Skill manifest for portable use.

**Components:** Button · Badge · Card · Input · Textarea · Overline · Tagline · SymbolMark — see `components/`.

**UI kit:** Soulstory Studio website — Home, Work/Case study, Journal (essay), Contact.

---

## Font substitution note

Mr Eaves Sans OT and Minion 3 Pro are **Adobe Typekit** fonts, loaded from kit `wnf4ddz`. The live kit ships weights **400 + 700 only** — components requesting weight 500 fall back to 400. To recover the full hierarchy, add **Medium (n5)** for `mr-eaves-sans` and `minion-3` in Adobe Fonts → Web Projects → `wnf4ddz`. There are no free Google Fonts equivalents; the stacks fall back to Avenir Next / Garamond locally.
