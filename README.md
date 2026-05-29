# Secumind website

Marketing site for [Secumind](https://github.com/ProMithi/Secumind) — continuous AI-powered security operations.

Plain HTML/CSS/JS. No build step. Deploys to GitHub Pages out of the box.

## Structure

```
secumind-website/
├── index.html        Landing page
├── product.html      Three pillars deep-dive
├── pricing.html      Tiers + comparison table
├── about.html        Why we exist, principles, founder
├── contact.html      Book-a-demo form
├── faq.html          Common questions
├── css/style.css     Shared design system (dark theme, mint accent)
├── js/main.js        Mobile nav toggle, footer year
├── .nojekyll         Tells GitHub Pages not to run Jekyll
└── README.md
```

## Local preview

Any static server. Two easy options:

```powershell
# Python (already installed if you have Secumind running)
python -m http.server 8000

# Or open index.html directly in a browser (works for everything except form submit)
```

Then visit http://localhost:8000.

## Deploy to GitHub Pages

1. **Create the repo** on GitHub: `secumind-website` (public).
2. **Push these files** to `main`:
   ```powershell
   git init
   git add .
   git commit -m "initial site"
   git branch -M main
   git remote add origin https://github.com/<your-user>/secumind-website.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)`**.
4. Wait ~1 minute. Your site is live at `https://<your-user>.github.io/secumind-website/`.

## Custom domain (optional)

To use `secumind.com` (or any domain you own):

1. Buy the domain.
2. Add a `CNAME` file at the repo root with one line — the bare domain, e.g.:
   ```
   secumind.com
   ```
3. In your DNS provider, add either:
   - **Apex domain (secumind.com):** four `A` records pointing to GitHub's IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **Subdomain (www.secumind.com):** one `CNAME` record pointing to `<your-user>.github.io`
4. In GitHub: **Settings → Pages → Custom domain** → enter your domain → tick **Enforce HTTPS** (once SSL provisions, usually within an hour).

## Things to swap before going live

| File | Placeholder | Replace with |
|---|---|---|
| `contact.html` | `https://formspree.io/f/YOUR_FORM_ID` | Real Formspree (or Netlify Forms / Getform) endpoint |
| `*.html` | `mikklar@proton.me` | Real contact email |
| `pricing.html` | `€49`, `€199` | Final pricing |
| `index.html` (stats) | `250k+`, `4`, `~20m`, `0` | Numbers you can defend |
| `about.html` | Founder bio | Final wording |

## Customizing the look

All styles live in [`css/style.css`](css/style.css). Brand colors are CSS variables at the top:

```css
--bg:          #07101e;   /* page background */
--bg-elev:     #0c1728;   /* cards */
--accent:      #1fcf56;   /* mint — primary brand color */
--text:        #e2e8f0;
--text-muted:  #94a3b8;
```

Change these in one place and the whole site rebrands.

## License

Choose a license before going public (MIT is fine for a marketing site).
