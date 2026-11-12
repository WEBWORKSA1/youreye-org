"""Fetch recent eye-health headlines into _data/news.yml (used by GitHub Actions)."""
import urllib.request
import xml.etree.ElementTree as ET

FEEDS = [
    ("https://www.sciencedaily.com/rss/health_medicine/eye_care.xml", "ScienceDaily"),
    ("https://www.nih.gov/news-releases/feed.xml", "NIH"),
]
KEYWORDS = ("eye", "vision", "retina", "glaucoma", "cataract", "macular", "myopia", "blind", "cornea", "sight")


def q(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"').strip() + '"'


items = []
for url, source in FEEDS:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "YourEye.org news bot"})
        root = ET.fromstring(urllib.request.urlopen(req, timeout=20).read())
    except Exception as exc:  # keep going if one feed fails
        print("skip", url, exc)
        continue
    for it in root.iter("item"):
        title = (it.findtext("title") or "").strip()
        link = (it.findtext("link") or "").strip()
        if not title or not link:
            continue
        if source != "ScienceDaily" and not any(k in title.lower() for k in KEYWORDS):
            continue
        items.append((title, link, source))

if len(items) >= 3:
    with open("_data/news.yml", "w", encoding="utf-8") as f:
        f.write("# Updated automatically by automation/fetch_news.py\n")
        for title, link, source in items[:8]:
            f.write("- title: %s\n  url: %s\n  source: %s\n" % (q(title), q(link), q(source)))
    print("wrote", min(len(items), 8), "items")
else:
    print("not enough items; leaving news.yml unchanged")
