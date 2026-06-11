# Minimal Technical Theme — Change Log
All changes are applied via an inline `<style>` block in `index-v2.html` on top of the shared `css/style.css`.

---

## Color tokens (`:root` overrides)

| Token | Original (style.css) | Minimal theme |
|---|---|---|
| `--bg` | `#131112` | `#f5f6f8` (light grey) |
| `--bg-elev` | `#1c1922` | `#ffffff` |
| `--bg-soft` | `rgba(249,250,251,0.03)` | `rgba(17,19,30,0.03)` |
| `--border` | `rgba(249,250,251,0.08)` | `#e2e4e9` (solid grey) |
| `--border-soft` | `rgba(249,250,251,0.05)` | `#edeef1` |
| `--text` | `#f9fafb` | `#111827` (near black) |
| `--text-muted` | `#b3b7cc` | `#4b5563` |
| `--text-dim` | `#7d809a` | `#9ca3af` |
| `--accent` | `#8093f1` (purple) | `#2563eb` (blue) |
| `--accent-dark` | `#0f2db9` | `#1d4ed8` |
| `--accent-soft` | `rgba(128,147,241,0.12)` | `rgba(37,99,235,0.07)` |
| `--danger` | `#dc2626` | `#dc2626` (unchanged) |
| `--warning` | `#ea580c` | `#d97706` |
| `--medium` | `#f59e0b` | `#b45309` |
| `--radius` | `12px` | `4px` |
| `--radius-sm` | `8px` | `3px` |

---

## Background

**Original:** dark `#131112`.

**Minimal theme:** light `#f5f6f8` — the entire page reads as a light document surface. No pattern, no gradient, no texture anywhere.

---

## Navigation

- Background: `rgba(255,255,255,0.96)` — white, no blur effect
- `backdrop-filter: none` — glass effect removed
- Bottom border: solid `#e2e4e9` — a simple grey rule
- Brand colour: `var(--text)` (dark) with blue `<span>`
- Links: muted grey, darken on hover — no colour change to accent

---

## Hero

- Background: `var(--bg-elev)` (`#ffffff`) — plain white panel
- `::after` veil overlay: `display: none` — removed entirely
- `hero-canvas`: `display: none` — interactive canvas disabled, no animation
- Title: `background: none`, `-webkit-text-fill-color: var(--text)` — strips the gradient, pure dark ink
- Badge spans: transparent background, grey border, grey text — treated as metadata labels not trust signals
- No eyebrow pill, no blinking dot — hero reads like the opening of a report

---

## Section eyebrows

**Original:** purple, uppercase, `letter-spacing: 1.5px`.

**Minimal theme:** grey (`var(--text-dim)`), uppercase, same tracking — but with `::before` and `::after` pseudo-element content explicitly cleared to remove any bracket or `//` prefix from other themes:
```css
.section-eyebrow::before { content: none; }
.section-eyebrow::after  { content: none; }
```

---

## Pillar cards

- `background: var(--bg-elev)` (`#ffffff`) — white card on light-grey page
- `border: 1px solid var(--border)` — simple grey stroke
- `border-top: 2px solid var(--accent)` — a thin blue top stripe is the only colour on the card
- `box-shadow: none` — no elevation by default
- Hover: no lift (`transform: none`), border darkens slightly, adds `box-shadow: 0 2px 8px rgba(0,0,0,0.06)` — very subtle
- `.pillar-num` badge: blue soft background, no border, no shadow
- `.pillar-lede` uses blue `--accent` — keeps the call-out colour consistent with the top stripe

---

## Proof metrics

- Container: `border: 1px solid var(--border)`, white background, `border-radius: 4px`
- Cells divided by `border-right: 1px solid var(--border)` (same as red theme — no background gap trick)
- `.proof-value` ink black (`var(--text)`), monospace, no glow
- `.proof-zero` uses blue `--accent` — the only coloured number, draws the eye to the "0 headcount" payoff

---

## Steps (How it works)

- White background, grey border, `border-radius: 4px`
- `::before` counter watermark: `rgba(0,0,0,0.06)` — very faint dark ink
- `.step-title` blue `--accent`, uppercase, `letter-spacing: 1.2px` — no monospace, no prefix
- `h3` and `p` use standard dark text colours

---

## Buttons

- `border-radius: 4px`
- `.btn-primary`: flat blue (`var(--accent)`), white text, no gradient, no glow, no shadow
- `.btn-primary:hover`: darkens to `--accent-dark`, no transform
- `.btn-outline`: white background, grey border, dark text — hover shifts to blue border + blue text + blue soft background

---

## CTA block

- White background, grey border, `border-radius: 4px`
- No radial glow, no top stripe, no glass
- Plainest version of the CTA across all four themes

---

## Findings inbox

- Header: `var(--bg)` (light grey) — slightly recessed from the white card
- Severity badges: title-case (`Critical`, `High`, `Medium`) — not ALL-CAPS
- Severity labels use muted tinted backgrounds and readable text colours (danger red, amber, brown)
- Left-border stripes: `2px solid` in `--danger` / `--warning` / `--medium`
- Row hover: `var(--bg)` — barely perceptible
- Status labels: title-case (`Open`, `In progress`, `Acknowledged`) — not abbreviated
- `In progress` uses a blue border matching `--accent`
- Finding titles in monospace; metadata lines in default sans-serif

---

## Footer

- Background: `var(--bg-elev)` (`#ffffff`) — white, consistent with cards
- Top border: solid `var(--border)` — plain grey rule
- Brand `<span>` follows blue `--accent`
- Column heading, links: muted grey, darken on hover — no colour accent

---

## Shape language summary

| Property | style.css | Minimal theme |
|---|---|---|
| `--radius` | `12px` | `4px` |
| `--radius-sm` | `8px` | `3px` |
| Colour scheme | dark | light |
| Card style | dark elevated | white on light-grey |
| Background pattern | none | none |
| Hero canvas | animated | disabled |
| Hero gradient | white→purple | none — pure ink |
| Blur / glass | frosted nav | none anywhere |
| Numbers | white | black (0 = blue) |
| Border tint | white/neutral | grey (solid hex) |
| Accent colour | purple `#8093f1` | blue `#2563eb` (links only) |
| Severity labels | ALL-CAPS | Title Case |
| Buttons | rounded gradient | small-radius flat |
