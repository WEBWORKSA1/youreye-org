# Phase-wise build prompts for YourEye.org

Copy each phase into an AI coding assistant in order. Each phase assumes the previous ones are done.

## Phase 0: Strategy and guardrails

> You are building YourEye.org, a free eye-health website. Concept: free at-home eye checks and calculators (traffic), a plain-English eye-condition library (trust and AdSense), and an eye-care matching service (revenue). Every tool result and article must end with a relevant route to the matching form. Brand only as "YourEye.org"; never use "Your Eyes" or "Love Your Eyes" as a name or slogan (registered/used by IAPB). The site is an independent, ad-supported website, not a charity; say so wherever money is asked for. Nothing on the site may diagnose; every check is a screening aid with a clear "see a professional" message and urgent-care warnings. Cite NEI, AAO, AOA, WHO or CDC on every health page.

## Phase 1: Foundation

> Create a Jekyll site that GitHub Pages builds natively from the `main` branch (no custom plugins except jekyll-sitemap). `_config.yml` holds title, tagline, description, url `https://youreye.org`, empty baseurl, the AdSense client `ca-pub-6620975821265271`, and the owner contact URL `https://web.works/contact`. Build `_layouts/default.html` with: a computed `<base href>` so all internal links are relative and the same build works at `/youreye-org/` and at the domain root; title, description, canonical, Open Graph and JSON-LD (Organization, WebSite, BreadcrumbList, plus MedicalWebPage where relevant); the AdSense script `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>` on every page except lead forms, thank-you and 404 (`ads: false`); and, at the very top of every page, a bar reading "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership" linking to https://web.works/contact. Add ads.txt (`google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`), robots.txt with the sitemap, a web manifest and a 404 page that finds its own base path with JavaScript.

## Phase 2: Design system

> Build one CSS file. Palette: ink navy #0B1F33, iris teal #0E8F8A, lens sky #EAF4F8, paper #FBFCFD, amber CTA #F2A33A, alert red #C2410C. Type: Fraunces for headings, Inter for UI, system fallbacks. Components: sticky header with mega-menu (Checks, Conditions, Guides, Videos, Find care), mobile drawer, hero with an animated iris, cards, tool shells, stepper forms with progress bar, accordions, chips, urgent-care callout, ad slot boxes, footer with four columns. Add accessibility controls: text size A-/A+, high-contrast theme, reduced motion, skip link, visible focus. Mobile-first, fully responsive, Lighthouse 90+.

## Phase 3: Interactive tools

> Build 16 tools, each as its own page with 300+ words of explanation, an FAQ, sources and a CTA, and each script in `assets/js/tools/<name>.js`: (1) visual acuity screener with tumbling E, credit-card screen calibration and distance input, giving an approximate Snellen fraction per eye; (2) Amsler grid with per-eye answers and an urgent-advice result; (3) color-vision screener with procedurally drawn dot plates (no copyrighted Ishihara images); (4) astigmatism clock dial; (5) contrast check with fading letters; (6) near-vision reading card; (7) 20-20-20 break timer with notifications; (8) focus and blink trainer; (9) dry-eye symptom score (original questions, not OSDI); (10) screen eye-strain risk calculator; (11) glasses prescription decoder; (12) glasses-to-contacts vertex converter; (13) LASIK candidacy quiz; (14) LASIK vs glasses/contacts lifetime cost calculator; (15) children's myopia risk check; (16) eye-exam schedule by age. Every result screen links to the matching form with the right service pre-selected.

## Phase 4: Content library

> Write 16 condition pages in Markdown (myopia, hyperopia, astigmatism, presbyopia, cataract, glaucoma, AMD, diabetic retinopathy, dry eye, digital eye strain, pink eye, floaters and flashes, amblyopia, strabismus, keratoconus, color vision deficiency) with the structure: What it is, Symptoms, Who is at risk, Diagnosis, Treatment, Get help now if, Prevention and living with it, FAQ, Sources. Add 6 guides (LASIK vs SMILE vs PRK vs ICL, buying glasses online, contact-lens safety, children's vision and myopia control, eye emergencies, sunglasses and UV). Drive index pages from `_data/*.yml`. Embed official AAO and NEI YouTube videos with a click-to-load facade, plus an auto-updating NEI uploads playlist.

## Phase 5: Lead generation engine

> Build `find-care.html`: a 3-step form (service, location and situation, contact and consent) with progress bar, pre-selection from `?need=`, client-side lead score 0 to 100, UTM/referrer/landing-page capture, honeypot, required consent that discloses that providers may pay YourEye.org, and a thank-you page. Build `for-providers.html` for clinics to buy leads or featured listings. Add a lead CTA block to every content and tool page. All forms post through FormSubmit AJAX to the owner's inbox, whose address is stored only as an encoded array in `config.js` and decoded at submit time; it must never appear in HTML, CSS, JS or README as plain text.

## Phase 6: Community and revenue

> Build: Support page (preset amounts $5/$15/$50/$100/custom, one-time or monthly, purposes: operations, promotions and marketing, hiring talent, contests and prizes; payment links from config with a pledge form fallback; clear "not a charity, not tax-deductible" note). Contests page (monthly 10-question Eye-Q quiz with auto-rotating theme, countdown, prize-draw entry form, creative contest, official rules). Careers page (medical reviewers, writers, video creators, translators, partnerships, community, developer) with an application form. Advertise page (featured clinic listing, sponsored tool, newsletter, contest sponsor, category exclusive) with an enquiry form and the web.works link.

## Phase 7: Trust and compliance

> Add About (mission, WHO statistics, independence), Editorial policy (sources, review, corrections, AI-assistance note), Medical disclaimer, Privacy (FormSubmit, Google AdSense cookies and personalised ads, YouTube nocookie embeds, lead sharing with consent, data requests through the contact form, EEA/UK consent through Google's certified CMP), Terms, Accessibility statement, Contact page with form, and a Trademark and copyright disclosure that names the IAPB "YOUR EYES"/"Love Your Eyes" and "MYEYES" marks and disclaims affiliation. No ads on lead forms; no ads that look like content; no prohibited health claims.

## Phase 8: Automation

> Add self-updating parts that need no server: a daily eye tip and daily fact chosen by date, an awareness-month banner (January glaucoma, February AMD and low vision, March workplace eye wellness, April sports eye safety, May healthy vision, June cataract awareness, July UV safety, August children's eye health, October World Sight Day, November diabetic eye disease, December safe toys), the contest theme and countdown rotating by month, site search over a Jekyll-generated JSON index, and jekyll-sitemap. Provide an optional GitHub Actions workflow that pulls eye-health news RSS weekly into `_data/news.yml` and commits it.

## Phase 9: QA

> Build locally, crawl every internal link and asset, run each tool, submit each form to a test endpoint, grep the build for the inbox address (must be zero hits), validate JSON-LD, test at 360px, 768px and 1280px, and check keyboard navigation and contrast.

## Phase 10: Publish

> Push to github.com/WEBWORKSA1/youreye-org on `main`. Settings → Pages → Deploy from a branch → `main` / root. Add the custom domain youreye.org (A records 185.199.108.153, .109.153, .110.153, .111.153; `www` CNAME to webworksa1.github.io), then Enforce HTTPS. Submit the first form and click FormSubmit's activation email.

## Phase 11: Grow (post-launch)

> Apply to AdSense on the custom domain with Auto ads and Google's consent message. Submit the sitemap in Search Console. Sign one clinic per metro before scaling traffic. Add "LASIK cost in [city]" and "eye doctors in [city]" pages for the top 50 metros, one new condition or guide per week, Spanish versions of the top 10 pages, a monthly newsletter, and a YouTube Shorts series demonstrating each tool.
