"""Update YouTube metadata on installations/exhibitions entries."""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from youtube_description import clean_tutorial_description, extract_patreon, short_description


def fetch_metadata(video_id):
    result = subprocess.run(
        ["yt-dlp", "--skip-download", "--dump-single-json", f"https://www.youtube.com/watch?v={video_id}"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    result.check_returncode()
    return json.loads(result.stdout)


def update_file(path):
    data = json.loads(path.read_text(encoding="utf-8"))
    changed = False
    for item in data.get("items", []):
        videos = item.get("videos") or []
        yt_url = next((v for v in videos if isinstance(v, str) and ("youtube" in v or "youtu.be" in v)), None)
        if not yt_url:
            continue
        m = re.search(r"(?:youtube\.com/watch\?v=|youtu\.be/)([A-Za-z0-9_-]{11})", yt_url)
        if not m:
            continue
        meta = fetch_metadata(m.group(1))
        raw = (meta.get("description") or "").replace("\r\n", "\n").replace("\r", "\n").strip()
        patreon = extract_patreon(raw)
        description = clean_tutorial_description(raw)
        item["youtubeDate"] = meta.get("upload_date") or ""
        item["fullDescription"] = description
        short = short_description(description)
        if short:
            item["description"] = short
        urls = dict(item.get("urls") or {})
        if patreon:
            urls["patreon"] = patreon
        if urls:
            item["urls"] = urls
        changed = True
        print(path.name, item.get("title"), item["youtubeDate"])
    if changed:
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    update_file(ROOT / "data" / "installations.json")
    update_file(ROOT / "data" / "exhibitions.json")
