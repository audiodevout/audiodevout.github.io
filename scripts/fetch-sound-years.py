"""Add year fields to sound.json from Bandcamp publish dates."""
import html
import json
import re
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOUND = ROOT / "data" / "sound.json"


def bandcamp_year(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        page = urllib.request.urlopen(req, timeout=20).read().decode("utf-8", "replace")
    except urllib.error.HTTPError:
        return None

    match = re.search(r"data-tralbum=\"([^\"]+)\"", page)
    if match:
        payload = json.loads(html.unescape(match.group(1)))
        current = payload.get("current") or {}
        for key in ("publish_date", "release_date", "album_release_date"):
            value = current.get(key)
            if value:
                match = re.search(r"(\d{4})", str(value))
                if match:
                    return int(match.group(1))

    for pattern in (
        r'"publish_date":"(\d{4})',
        r'"release_date":"(\d{4})',
        r'itemprop="datePublished" content="(\d{4})',
    ):
        match = re.search(pattern, page)
        if match:
            return int(match.group(1))
    return None


def year_from_description(text):
    match = re.search(r"Released\s+(?:\w+\s+)?(\d{4})", text or "", re.I)
    return int(match.group(1)) if match else None


def main():
    data = json.loads(SOUND.read_text(encoding="utf-8"))
    for item in data["items"]:
        tracks = item.get("bandcampTracks") or []
        first = tracks[0] if tracks else {}
        url = first.get("url")
        if not url and first.get("albumId"):
            url = f"https://asymmetrica.bandcamp.com/album/{item['id'].replace('asymmetrica-', '')}"
        year = bandcamp_year(url) if url else None
        if not year:
            year = year_from_description(item.get("fullDescription"))
        if year:
            item["year"] = year
            print(f"{item['id']}: {year}")
        else:
            print(f"{item['id']}: no year")
    SOUND.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
