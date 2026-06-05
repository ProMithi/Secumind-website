# Red Team Theme — Change Log
All changes are applied via an inline `<style>` block in `index-v2.html` on top of the shared `css/style.css`.

---

## Color tokens (`:root` overrides)

| Token | Original (style.css) | Red theme |
|---|---|---|
| `--bg` | `#131112` | `#0c0c0c` |
| `--bg-elev` | `#1c1922` | `#141414` |
| `--bg-soft` | `rgba(249,250,251,0.03)` | `rgba(255,255,255,0.03)` |
| `--border` | `rgba(249,250,251,0.08)` | `rgba(255,255,255,0.1)` |
| `--border-soft` | `rgba(249,250,251,0.05)` | `rgba(255,255,255,0.05)` |
| `--text` | `#f9fafb` | `#ffffff` (pure white) |
| `--text-muted` | `#b3b7cc` | `#999999` |
| `--text-dim` | `#7d809a` | `#555555` |
| `--accent` | `#8093f1` (purple) | `#ef4444` (red) |
| `--accent-dark` | `#0f2db9` | `#b91c1c` |
| `--accent-soft` | `rgba(128,147,241,0.12)` | `rgba(239,68,68,0.1)` |
| `--danger` | `#dc2626` | `#ef4444` |
| `--warning` | `#ea580c` | `#f97316` |
| `--medium` | `#f59e0b` | `#eab308` |
| `--radius` | `12px` | `0px` |
| `--radius-sm` | `8px` | `0px` |

---

## Background

**Original:** solid `var(--bg)`.

**Red theme:** pure black with a faint red radial glow at the top of the hero only:
```css
.hero {
  background:
    radial-gradient(ellipse 70% 50% at 50% 0%, rgba(239,68,68,0.08), transparent),
    #000000;
}
```
Body stays plain `#0c0c0c`. No pattern anywhere.

---

## Navigation

- Background: `#000000` (pure black, no blur)
- `backdrop-filter: none` — removes the frosted glass effect entirely
- Bottom border: `rgba(239,68,68,0.3)` — red tint instead of neutral
- Brand `<span>` follows red `--accent`
- Active and hover links use red `--accent`
- `.nav-live-dot` colour set to red `--accent`

---

## Hero

- "Operation active" eyebrow replaces scan-status pill — block shape (no `border-radius`), red border, monospace, uppercase, blinking square dot:
  ```css
  .hero-op-dot { animation: blink-red 1.2s step-end infinite; }
  ```
- `.hero-title` rendered in monospace (`var(--font-mono)`), gradient stripped — pure white (`-webkit-text-fill-color: #ffffff`)
- `.hero-badges span` border-radius `0`, neutral grey text — badges read as labels not trust signals
- Hero `border-bottom`: `rgba(239,68,68,0.2)` red tint

---

## Section eyebrows

**Original:** uppercase, purple, no prefix.

**Red theme:** red, monospace, `letter-spacing: 1.5px`, wrapped in bracket notation via CSS:
```css
.section-eyebrow::before { content: '[ '; }
.section-eyebrow::after  { content: ' ]'; }
```

---

## Pillar cards

- `border-radius: 0` — fully square corners
- Left border: `3px solid var(--accent)` — permanent red stripe (structural, not a hover effect)
- Hover: no lift (`transform: none`), background lightens to `#1a1a1a`, border stays red
- `.pillar-num` badge: red tint, `border-radius: 0`, monospace
- `.pillar-title` uppercased, monospace
- `.pillar-lede` muted grey, italic — removed from accent colour

---

## Proof metrics

- Container: `border: 1px solid var(--border)`, `border-radius: 0`, transparent background (no fill)
- Each cell divided by `border-right: 1px solid var(--border)` instead of a 1px gap background
- `.proof-value` pure white, no glow, monospace
- `.proof-zero` uses red `--accent` — the "0" is the payoff of the whole section

---

## Steps (How it works)

- `border-radius: 0`
- `border-top: 2px solid var(--accent)` — red top stripe instead of pillar-style left stripe
- `::before` counter watermark: `32px`, faint red (`rgba(239,68,68,0.12)`)
- `.step-title` uppercase, monospace, red, with a `// ` comment prefix at 50% opacity
- `h3` inside steps set to monospace

---

## Buttons

- `border-radius: 0` — square corners
- `text-transform: uppercase`, `letter-spacing: 0.8px`, monospace
- `.btn-primary`: flat red (`var(--accent)`), white text, no gradient, no shadow
- `.btn-primary:hover`: darkens to `--accent-dark`, no transform
- `.btn-outline`: neutral white border, white text — red only appears on hover

---

## CTA block

- `border-radius: 0`
- `border-top: 2px solid var(--accent)` — red top accent stripe
- No radial glow, no glass — flat `var(--bg-elev)` background

---

## Findings inbox

- Header background: `#000000` (pure black)
- Severity badge border-radius: `0`
- All text: monospace
- Queue label uppercased: `FINDINGS.QUEUE`
- Severity left-border stripes: `3px solid` (thicker than blue theme's `2px`)
  - Critical: `#ef4444`
  - High: `#f97316`
  - Medium: `#eab308`
- Hover row: very faint red tint `rgba(239,68,68,0.03)`
- Status labels: `letter-spacing: 0.5px`, no border-radius
- `IN PROGRESS` badge uses red border instead of cyan

---

## Footer

- Background: `#000000` (pure black)
- Top border: `rgba(239,68,68,0.2)` red tint
- Brand `<span>` follows red `--accent`

---

## Shape language summary

| Property | style.css | Red theme |
|---|---|---|
| `--radius` | `12px` | `0px` |
| `--radius-sm` | `8px` | `0px` |
| Card style | rounded, elevated | square, flat |
| Background pattern | none | none |
| Blur / glass | frosted nav | none anywhere |
| Numbers | white | white (0 = red) |
| Border tint | white/neutral | white/neutral (red reserved for accent only) |
| Accent colour | purple `#8093f1` | red `#ef4444` |
| Buttons | rounded, gradient | square, flat red |
