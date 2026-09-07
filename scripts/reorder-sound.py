"""Reorder sound.json to the canonical asymmetrica list."""
import json
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOUND = ROOT / "data" / "sound.json"

ORDER = [
    "asymmetrica-radical",
    "asymmetrica-gcpssm",
    "asymmetrica-recording-tests-akerk",
    "asymmetrica-minus-12-c",
    "asymmetrica-the-process-of-becoming",
    "asymmetrica-impulse",
    "asymmetrica-telephone-game",
    "asymmetrica-sublimatic",
    "asymmetrica-the-sauce",
    "asymmetrica-have-a-nice-last-few-days-of-summer",
    "asymmetrica-biding-my-time",
    "asymmetrica-a-reasonable-crashout",
    "asymmetrica-symmetrical-fictions",
    "asymmetrica-stranded-deep-but-fast",
    "asymmetrica-stranded-deep",
    "asymmetrica-tiptoe",
    "asymmetrica-supersounds",
    "asymmetrica-stretching",
    "asymmetrica-the-machine",
    "asymmetrica-not-as-i-remember-it",
    "asymmetrica-automaton",
]

TITLE_OVERRIDES = {
    "asymmetrica-impulse": "impulse",
    "asymmetrica-sublimatic": "sublimatic",
    "asymmetrica-the-sauce": "the sauce",
    "asymmetrica-have-a-nice-last-few-days-of-summer": "have a nice last few days of summer",
    "asymmetrica-biding-my-time": "biding my time",
    "asymmetrica-a-reasonable-crashout": "a reasonable crashout",
    "asymmetrica-tiptoe": "tiptoe",
    "asymmetrica-the-machine": "the machine",
    "asymmetrica-not-as-i-remember-it": "not as i remember it",
    "asymmetrica-automaton": "automaton",
    "asymmetrica-supersounds": "supersounds",
    "asymmetrica-stretching": "stretching",
}

NEW_ITEMS = {
    "asymmetrica-the-process-of-becoming": {
        "id": "asymmetrica-the-process-of-becoming",
        "title": "The Process of Becoming",
        "category": "ASYMMETRICA AUDIO COLLECTION",
        "color": "violet",
        "description": "Album by asymmetrica — released on Bandcamp.",
        "fullDescription": "The Process of Becoming by asymmetrica — full album on Bandcamp.",
        "medium": "Digital audio album",
        "themes": "electronic, experimental, asymmetrica",
        "bandcampTracks": [
            {
                "title": "The Process of Becoming",
                "albumId": "1575772062",
                "url": "https://asymmetrica.bandcamp.com/album/the-process-of-becoming",
            }
        ],
        "year": 2025,
    },
    "asymmetrica-telephone-game": {
        "id": "asymmetrica-telephone-game",
        "title": "telephone game",
        "category": "ASYMMETRICA AUDIO COLLECTION",
        "color": "amber",
        "description": "Album by asymmetrica — released on Bandcamp.",
        "fullDescription": "telephone game by asymmetrica — full album on Bandcamp.",
        "medium": "Digital audio album",
        "themes": "electronic, experimental, asymmetrica",
        "bandcampTracks": [
            {
                "title": "telephone game",
                "albumId": "2884693329",
                "url": "https://asymmetrica.bandcamp.com/album/telephone-game",
            }
        ],
        "year": 2025,
    },
    "asymmetrica-stranded-deep-but-fast": {
        "id": "asymmetrica-stranded-deep-but-fast",
        "title": "stranded deep but fast",
        "category": "ASYMMETRICA AUDIO COLLECTION",
        "color": "neon-magenta",
        "description": "Accelerated glitch rhythms exploring rapid flux and temporal distortion.",
        "fullDescription": "stranded deep but fast pushes accelerated glitch rhythms against meditative undercurrents—a sonic dive into rapid change, displacement, and emotional flux.",
        "medium": "Digital audio, generative synthesis",
        "technology": "DAW, granular synthesis, digital manipulation",
        "themes": "Temporal manipulation, glitch aesthetics, rapid flux",
        "bandcampTracks": [
            {
                "title": "stranded deep but fast",
                "trackId": "2743015108",
                "url": "https://asymmetrica.bandcamp.com/track/stranded-deep-but-fast",
            }
        ],
        "year": 2025,
    },
    "asymmetrica-stranded-deep": {
        "id": "asymmetrica-stranded-deep",
        "title": "stranded deep",
        "category": "ASYMMETRICA AUDIO COLLECTION",
        "color": "neon-magenta",
        "description": "Slow meditative pulses exploring isolation and temporal stretch.",
        "fullDescription": "stranded deep unfolds through slow meditative pulses and organic-synthetic resonance—a companion study in displacement, isolation, and temporal distortion.",
        "medium": "Digital audio, generative synthesis",
        "technology": "DAW, granular synthesis, digital manipulation",
        "themes": "Temporal manipulation, isolation, meditative pulse",
        "bandcampTracks": [
            {
                "title": "stranded deep",
                "trackId": "2338898025",
                "url": "https://asymmetrica.bandcamp.com/track/stranded-deep",
            }
        ],
        "year": 2025,
    },
}

def main():
    data = json.loads(SOUND.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in data["items"]}

    items = []
    for item_id in ORDER:
        if item_id in NEW_ITEMS:
            item = deepcopy(NEW_ITEMS[item_id])
        elif item_id in by_id:
            item = deepcopy(by_id[item_id])
        else:
            raise KeyError(f"Missing item: {item_id}")

        if item_id in TITLE_OVERRIDES:
            item["title"] = TITLE_OVERRIDES[item_id]

        items.append(item)

    SOUND.write_text(
        json.dumps({"items": items}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(items)} sound items")


if __name__ == "__main__":
    main()
