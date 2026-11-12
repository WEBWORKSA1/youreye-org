# YourEye.org

Free at-home eye checks, plain-English eye health, and a matching service that connects people with eye-care providers. Static Jekyll site, built and hosted free by GitHub Pages from the `main` branch.

- `RESEARCH.md`: the concept, the numbers behind it, and the 38-site benchmark review
- `PROMPTS.md`: phase-by-phase prompts to rebuild or extend the site
- `automation/`: optional weekly news refresh (GitHub Actions)

## How it is built

GitHub Pages runs Jekyll on every push to `main`. Pages are plain HTML or Markdown with front matter; the shared header, footer, contact bar and AdSense code live once in `_layouts/` and `_includes/`.

Every page writes a `<base href>` computed from its depth, and all internal links are relative. The same build therefore works at `https://webworksa1.github.io/youreye-org/` and at `https://youreye.org/` with no config change.

| Folder | What it holds |
| --- | --- |
| `tools/` | 16 interactive eye checks and calculators (scripts in `assets/js/tools/`) |
| `conditions/` | Eye-condition library (Markdown). Add one by copying a file and adding a row to `_data/conditions.yml` |
| `guides/` | Long-form guides |
| `_data/` | Lists that drive cards, menus, videos and news |
| `assets/js/config.js` | Payment links, ad slot IDs, contest prize and other switches |

Local preview (needs Ruby): `gem install jekyll jekyll-sitemap && jekyll serve`

## One-time setup checklist

1. **GitHub Pages**: Settings → Pages → Build and deployment → *Deploy from a branch* → `main` / `(root)` → Save.
2. **Custom domain** (required for AdSense approval): Settings → Pages → Custom domain `youreye.org` → Save. At the registrar, set apex A records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and a `www` CNAME to `webworksa1.github.io`. Tick *Enforce HTTPS* once the certificate is issued. No code change is needed.
3. **Forms**: submit any form once. FormSubmit sends a one-time activation email to the site inbox; click *Activate*. All forms then deliver. The address is stored encoded in `assets/js/config.js` and never appears in the page source.
4. **AdSense**: add `youreye.org` in AdSense, keep `ads.txt` at the root, turn on Auto ads, and enable Google's consent message for EEA/UK/Switzerland under *Privacy & messaging*. After approval, paste display-unit slot IDs into `adSlots` in `assets/js/config.js`.
5. **Payments**: paste PayPal / Stripe / Buy Me a Coffee links into `donate` in `assets/js/config.js`. Until then the Support page collects pledges.
6. **Weekly news refresh (optional)**: copy `automation/update-news.yml` to `.github/workflows/update-news.yml`.

Website, domain, sponsorship, advertising and partnership enquiries: https://web.works/contact
