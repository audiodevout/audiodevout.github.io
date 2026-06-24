"""Clean YouTube descriptions in portfolio JSON files."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from youtube_description import (
    clean_tutorial_description,
    description_from_title,
    short_description,
)

DATA_FILES = [
    ROOT / "data" / "visual.json",
    ROOT / "data" / "installations.json",
    ROOT / "data" / "exhibitions.json",
]


def has_youtube(item):
    videos = item.get("videos") or []
    return any(
        isinstance(v, str) and ("youtube" in v or "youtu.be" in v)
        for v in videos
    )


def main():
    for path in DATA_FILES:
        if not path.exists():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        count = 0
        for item in data.get("items", []):
            if not has_youtube(item):
                continue
            raw = item.get("fullDescription") or item.get("description") or ""
            cleaned = clean_tutorial_description(raw) if raw else ""
            if not cleaned:
                cleaned = description_from_title(item.get("title") or "")
            if not cleaned:
                continue
            item["fullDescription"] = cleaned
            item["description"] = short_description(cleaned)
            count += 1
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"{path.name}: cleaned {count} entries")


if __name__ == "__main__":
    main()
