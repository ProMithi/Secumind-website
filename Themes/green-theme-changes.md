# Green Theme — Change Log
All changes are applied via an inline `<style>` block in `index-v2.html` on top of the shared `css/style.css`.

---

## Color tokens (`:root` overrides)

| Token | Original (style.css) | Green theme |
|---|---|---|
| `--bg` | `#131112` | `#060a0d` |
| `--bg-elev` | `#1c1922` | `#0d1117` |
| `--bg-soft` | `rgba(249,250,251,0.03)` | `rgba(35,134,54,0.04)` |
| `--border` | `rgba(249,250,251,0.08)` | `rgba(35,134,54,0.14)` |
| `--border-soft` | `rgba(249,250,251,0.05)` | `rgba(35,134,54,0.07)` |
| `--text` | `#f9fafb` | `#e6edf3` |
| `--text-muted` | `#b3b7cc` | `#8b949e` |
| `--text-dim` | `#7d809a` | `#484f58` |
| `--accent` | `#8093f1` (purple) | `#3fb950` (green) |
| `--accent-dark` | `#0f2db9` | `#238636` |
| `--accent-soft` | `rgba(128,147,241,0.12)` | `rgba(63,185,80,0.1)` |
| `--danger` | `#dc2626` | `#f85149` |
| `--warning` | `#ea580c` | `#d29922` |
| `--radius` | `12px` | `4px` |
| `--radius-sm` | `8px` | `3px` |

---

## Background

**Original:** solid `var(--bg)` color only.

**Green theme:** grid is scoped to the hero section only, layered with the ambient radial glows:
```css
.hero {
  background:
    linear-gradient(rgba(63,185,80,0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(63,185,80,0.07) 1px, transparent 1px),
    radial-gradient(ellipse 80% 40% at 50% 0%, rgba(63,185,80,0.07), transparent),
    radial-gradient(ellipse at bottom left, rgba(248,81,73,0.04), transparent 55%);
  background-size: 32px 32px, 32px 32px, auto, auto;
}
```

---

## Navigation

- Background tightened to `rgba(6,10,13,0.92)` (darker than original `rgba(19,17,18,0.85)`)
- `.nav-brand` set to `font-family: var(--font-mono)` with `letter-spacing: 0`
- Brand `<span>` accent colour follows new green `--accent`
- Active and hover link colour changed to green `--accent`
- `.nav-live-dot` stays red (`var(--danger)`) — unchanged intent, new shade

---

## Hero

- Background glow changed from purple radial to green radial at top + faint red at bottom-left
- `.hero-title` set to `font-family: var(--font-mono)` — headline renders in monospace
- `.hero-title` gradient changed from `#f9fafb → #8093f1` (white-to-purple) to `#e6edf3 → #3fb950` (white-to-green)
- Blinking cursor added via `::after` pseudo-element:
  ```css
  .hero-title::after {
      content: '_';
      -webkit-text-fill-color: var(--accent);
      animation: blink 1s step-end infinite;
  }
  ```
- `.hero-badges span` border and text colour changed to green; background tinted green

---

## Section eyebrows

**Original:** uppercase, `--accent` (purple), `12px`, `letter-spacing: 1.5px`.

**Green theme:** lowercase, monospace, `11px`, `--text-dim` colour, with a CSS-generated `// ` prefix in green:
```css
.section-eyebrow::before { content: '// '; color: var(--accent); }
```

---

## Pillar cards

- `border-top: 2px solid var(--accent)` — permanent green top stripe (was only a hover highlight)
- `border-radius` reduced from `12px` to `4px`
- `.pillar-num` badge: green background, green border, monospace font
- `.pillar-title` set to monospace, `15px`
- `.pillar-lede` colour changed from purple `--accent` to green `--accent`
- Feature list dash `::before` changed from purple to green

---

## Proof metrics

- `.proof-value` colour changed from `--text` (white) to `--accent` (green)
- `.proof-zero` colour changed from `--accent` (purple) to `#79c0ff` (blue) — visually separates the "0 headcount" number from the operational green numbers

---

## Steps (How it works)

- `border-radius` reduced to `4px`
- `.step::before` counter colour changed to `rgba(63,185,80,0.25)` (faint green watermark)
- `.step-title` set to monospace, `11px`, uppercase green
- CSS `$ ` prefix added to step titles:
  ```css
  .step-title::before { content: '$ '; }
  ```

---

## Buttons

- Both `.btn-primary` and `.btn-outline` set to `font-family: var(--font-mono)`, `font-size: 13px`
- `border-radius` reduced to `4px` / `3px`
- `.btn-primary` gradient changed to green; text colour set to `#060a0d` (dark, not white)
- `.btn-outline` border and text changed to green; hover background is a faint green tint

---

## CTA block

- Background radial glow changed from purple to green
- `border-radius` reduced to `4px`

---

## Findings inbox

- Header bar font changed to `var(--font-mono)`
- Title label changed from "Findings inbox" to `findings.inbox`
- Severity badge border-radius reduced to `3px` (from `4px`)
- Finding titles and metadata lines set to monospace
- Left-border severity stripes added per row: `3px solid` in red / amber / transparent
- Status labels changed to `OPEN`, `IN PROGRESS`, `ACK` (abbreviated)
- `IN PROGRESS` status badge styled in green instead of neutral grey

---

## Footer

- `.footer-brand` set to monospace
- Brand `<span>` follows green `--accent`

---

## Shape language summary

| Property | style.css | Green theme |
|---|---|---|
| `--radius` | `12px` | `4px` |
| `--radius-sm` | `8px` | `3px` |
| Card hover | lift + purple border | lift + green border |
| Border tint | white/neutral | green-tinted |
| Background pattern | none | green line grid |
