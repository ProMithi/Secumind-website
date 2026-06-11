# Blue Theme — Change Log
All changes are applied via an inline `<style>` block in `index-v2.html` on top of the shared `css/style.css`.

---

## Color tokens (`:root` overrides)

| Token | Original (style.css) | Blue theme |
|---|---|---|
| `--bg` | `#131112` | `#070b11` |
| `--bg-elev` | `#1c1922` | `#0c1420` |
| `--bg-soft` | `rgba(249,250,251,0.03)` | `rgba(34,211,238,0.03)` |
| `--border` | `rgba(249,250,251,0.08)` | `rgba(34,211,238,0.1)` |
| `--border-soft` | `rgba(249,250,251,0.05)` | `rgba(34,211,238,0.05)` |
| `--text` | `#f9fafb` | `#f0f6fc` |
| `--text-muted` | `#b3b7cc` | `#8b9cad` |
| `--text-dim` | `#7d809a` | `#4a5a6a` |
| `--accent` | `#8093f1` (purple) | `#22d3ee` (cyan) |
| `--accent-dark` | `#0f2db9` | `#0891b2` |
| `--accent-soft` | `rgba(128,147,241,0.12)` | `rgba(34,211,238,0.08)` |
| `--mint` | `#b4edd2` | `#34d399` |
| `--danger` | `#dc2626` | `#f87171` |
| `--warning` | `#ea580c` | `#fbbf24` |
| `--radius` | `12px` | `8px` |
| `--radius-sm` | `8px` | `6px` |

---

## Background

**Original:** solid `var(--bg)` only.

**Blue theme:** dot grid scoped to the hero, layered with ambient glows:
```css
.hero {
  background:
    radial-gradient(rgba(34,211,238,0.09) 1px, transparent 1px),  /* dot grid */
    radial-gradient(ellipse 90% 60% at 50% -10%, rgba(34,211,238,0.09), transparent),
    radial-gradient(ellipse at bottom right, rgba(248,113,113,0.05), transparent 55%);
  background-size: 28px 28px, auto, auto;
}
```
The rest of the page body is plain `#070b11` — no grid outside the hero.

---

## Navigation

- Background: `rgba(7,11,17,0.88)` with `backdrop-filter: blur(16px)` (stronger blur than original)
- Brand `<span>` follows cyan `--accent`
- Active and hover links use cyan `--accent`

---

## Hero

- Dot grid (28px spacing) replaces line grid; scoped to `.hero` only
- Ambient glow: cyan radial at top + faint red at bottom-right
- Title gradient: `#f0f6fc → #22d3ee` at `165deg` (vs. original vertical purple fade)
- New "Continuous monitoring active" eyebrow pill above the headline:
  ```css
  .hero-scan-status { display: inline-flex; border-radius: 999px; font-family: monospace; ... }
  .hero-scan-dot { box-shadow: 0 0 6px var(--accent); animation: pulse-glow 2s infinite; }
  ```
- `.hero-badges span` tinted cyan

---

## Section eyebrows

**Original:** uppercase, purple, `12px`, `letter-spacing: 1.5px`.

**Blue theme:** monospace, uppercase, cyan, `11px`, with a `◈` diamond prefix:
```css
.section-eyebrow::before { content: '◈'; font-size: 9px; opacity: 0.7; }
```

---

## Pillar cards

- Glass effect: `background: rgba(12,20,32,0.75)` + `backdrop-filter: blur(12px)`
- Top-edge gradient line via `::before` (`linear-gradient(90deg, transparent, cyan, transparent)`) — brightens on hover
- `border-radius` stays at `8px` (less angular than green theme)
- `.pillar-num` badge: cyan soft bg, cyan border, faint box-shadow glow
- `.pillar-lede` cyan at 85% opacity

---

## Proof metrics

- Each `.proof-metric` cell: glassy `rgba(12,20,32,0.85)` + `backdrop-filter`
- Top-edge gradient line via `::before` at 30% opacity
- `.proof-value` cyan with `text-shadow: 0 0 24px rgba(34,211,238,0.45)` glow
- `.proof-zero` uses `--mint` (`#34d399`) with its own green glow — separates it from the cyan operational numbers

---

## Steps (How it works)

- Glassy card: `rgba(12,20,32,0.75)` + `backdrop-filter`
- `::before` counter: large `28px` faint cyan watermark number (top-right)
- `::after` bottom-edge gradient line fades in on hover
- `.step-title` monospace, uppercase, cyan, `11px`, `letter-spacing: 1.2px`

---

## Buttons

- All buttons: monospace font, `13px`, `letter-spacing: 0.2px`, `border-radius: 6px`
- `.btn-primary`: cyan gradient, dark text (`#070b11`), `box-shadow: 0 0 20px rgba(34,211,238,0.2)` — glow intensifies on hover
- `.btn-outline`: faint cyan border + tint, hover adds `box-shadow: 0 0 16px rgba(34,211,238,0.12)`

---

## CTA block

- Glass: `rgba(12,20,32,0.8)` + `backdrop-filter: blur(12px)`
- Radial cyan glow inside
- Top-edge gradient line via `::before`
- Border: `rgba(34,211,238,0.14)`

---

## Findings inbox

- Custom `.inbox-header` class (replaces inline `<div>` styles)
- Custom `.inbox-row`, `.inbox-row--critical`, `.inbox-row--high`, `.inbox-row--medium` classes
- Left-border severity stripes: `2px solid` red / amber / faint cyan
- Hover row: subtle cyan tint `rgba(34,211,238,0.025)`
- Status labels: `OPEN`, `IN PROGRESS`, `ACK` in monospace
- `IN PROGRESS` badge uses cyan border

---

## Footer

- Background: `rgba(4,7,11,0.6)` (darker than original)
- Brand `<span>` follows cyan `--accent`

---

## Shape language summary

| Property | style.css | Blue theme |
|---|---|---|
| `--radius` | `12px` | `8px` |
| `--radius-sm` | `8px` | `6px` |
| Card style | flat, opaque | glassy (`backdrop-filter: blur`) |
| Background pattern | none | dot grid in hero only |
| Numbers | white | cyan with glow (`text-shadow`) |
| Border tint | white/neutral | cyan-tinted |
| Accent colour | purple `#8093f1` | cyan `#22d3ee` |
