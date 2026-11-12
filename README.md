# YourEye.org

Free at-home eye checks, plain-English eye health, and a matching service that connects people with eye-care providers. Static Jekyll site, built and hosted free by GitHub Pages.

**Live now:** https://webworksa1.github.io/youreye-org/ (moves to https://youreye.org once the domain is attached; no code change needed)

- `RESEARCH.md`: the concept, the numbers behind it, and the 38-site benchmark review
- `PROMPTS.md`: phase-by-phase prompts to rebuild or extend the site
- `automation/`: optional weekly news refresh (GitHub Actions)

## How it is built

GitHub Pages runs Jekyll on every push. Pages are plain HTML or Markdown with front matter; the shared header, footer, contact bar and AdSense code live once in `_layouts/` and `_includes/`.

Every page writes a `<base href>` computed from its depth, and all internal links are relative. The same build therefore works at `https://webworksa1.github.io/youreye-org/` and at `https://youreye.org/`.

| Folder | What it holds |
| --- | --- |
| `tools/` | 16 interactive eye checks and calculators (scripts in `assets/js/tools/`) |
| `conditions/` | Eye-condition library (Markdown). Add one by copying a file and adding a row to `_data/conditions.yml` |
| `guides/` | Long-form guides |
| `_data/` | Lists that drive cards, menus, videos and news |
| `assets/js/config.js` | Payment links, ad slot IDs, contest prize and other switches |

Local preview (needs Ruby): `gem install jekyll jekyll-sitemap && jekyll serve`

## Publishing branch

GitHub Pages was switched on by creating a `gh-pages` branch, an exact copy of `main`. To publish from `main` as intended: Settings → Pages → Build and deployment → *Deploy from a branch* → `main` / `(root)` → Save. After that, `gh-pages` can be deleted. Until then, push changes to both branches.

## One-time setup checklist

1. **Publish from main**: see "Publishing branch" above.
2. **Custom domain** (required for AdSense approval): Settings → Pages → Custom domain `youreye.org` → Save. At the registrar, replace the current A records with `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and add a `www` CNAME to `webworksa1.github.io`. Tick *Enforce HTTPS* once the certificate is issued.
3. **Forms**: submit any form once. FormSubmit sends a one-time activation email to the site inbox; click *Activate*. All forms then deliver. The address is stored encoded in `assets/js/config.js` and never appears in the page source.
4. **AdSense**: add `youreye.org` in AdSense, keep `ads.txt` at the root, turn on Auto ads, and enable Google's consent message for EEA/UK/Switzerland under *Privacy & messaging*. After approval, paste display-unit slot IDs into `adSlots` in `assets/js/config.js`.
5. **Payments**: paste PayPal / Stripe / Buy Me a Coffee links into `donate` in `assets/js/config.js`. Until then the Support page collects pledges.
6. **Weekly news refresh (optional)**: copy `automation/update-news.yml` to `.github/workflows/update-news.yml` in the GitHub web editor (the connector that built the site is not allowed to create workflow files).

Website, domain, sponsorship, advertising and partnership enquiries: https://web.works/contact
