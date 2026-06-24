"""Update visual.json YouTube entries from yt-dlp metadata and sort chronologically."""
import json
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from youtube_description import (
    clean_tutorial_description,
    description_from_title,
    extract_patreon,
    short_description,
)

ROOT = Path(__file__).resolve().parent.parent
VISUAL = ROOT / "data" / "visual.json"
YTDLP = "yt-dlp"


def extract_video_id(url):
    m = re.search(r"(?:youtube\.com/watch\?v=|youtu\.be/)([A-Za-z0-9_-]{11})", url)
    return m.group(1) if m else None


def fetch_metadata(video_id):
    url = f"https://www.youtube.com/watch?v={video_id}"
    result = subprocess.run(
        [YTDLP, "--skip-download", "--dump-single-json", url],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or f"yt-dlp failed for {video_id}")
    return json.loads(result.stdout)


def main():
    data = json.loads(VISUAL.read_text(encoding="utf-8"))
    items = data["items"]

    video_items = []
    other_items = []

    for item in items:
        videos = item.get("videos") or []
        yt_url = next(
            (
                v
                for v in videos
                if isinstance(v, str)
                and ("youtube" in v or "youtu.be" in v)
            ),
            None,
        )
        if yt_url:
            video_items.append(item)
        else:
            other_items.append(item)

    print(f"Updating {len(video_items)} YouTube entries…")

    for item in video_items:
        yt_url = next(v for v in item["videos"] if "youtube" in v or "youtu.be" in v)
        video_id = extract_video_id(yt_url)
        meta = fetch_metadata(video_id)
        raw_description = (meta.get("description") or "").replace("\r\n", "\n").replace("\r", "\n").strip()
        patreon = extract_patreon(raw_description)
        description = clean_tutorial_description(raw_description)
        if not description:
            description = description_from_title(meta.get("title") or item.get("title", ""))

        item["title"] = meta.get("title") or item.get("title", "")
        item["description"] = short_description(description)
        item["fullDescription"] = description
        item["youtubeDate"] = meta.get("upload_date") or ""
        item["videos"] = [f"https://www.youtube.com/watch?v={video_id}"]

        urls = dict(item.get("urls") or {})
        if patreon:
            urls["patreon"] = patreon
        elif "patreon" in urls:
            del urls["patreon"]
        if urls:
            item["urls"] = urls
        elif "urls" in item:
            del item["urls"]

        print(f"  {item['youtubeDate']}  {item['title'][:70]}")

    video_items.sort(key=lambda x: x.get("youtubeDate") or "", reverse=True)
    data["items"] = other_items + video_items

    VISUAL.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {VISUAL} ({len(video_items)} videos, newest first)")


if __name__ == "__main__":
    main()
