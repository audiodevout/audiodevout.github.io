"""Strip YouTube boilerplate; keep tutorial-relevant text."""
import re

GREETING_PREFIX = re.compile(
    r"^(?:"
    r"hello+o*\s*(?:lovely\s+)?people!?+[\s!]*|"
    r"hello+o*\s*(?:everyone|people)!?+[\s!]*|"
    r"hey\s+(?:everyone|there|lovely\s+people)!?+[\s!]*|"
    r"hi\s+(?:everyone|there|lovely\s+people)!?+[\s!]*|"
    r"(?:hello+o*\s*)?(?:wonderful|lovely)\s+people!?+[\s!]*"
    r")",
    re.I,
)

DROP_SENTENCE_STARTS = (
    "as always, project files",
    "as always project files",
    "project files are available",
    "project files available",
    "free project files",
    "please like and subscribe",
    "like and subscribe",
    "thanks for watching",
    "thank you for watching",
    "don't forget to like",
    "dont forget to like",
    "feel free to drop a comment",
    "follow me on instagram",
    "check out some of my new music",
    "check out my new music",
    "i'd love to see what you make",
    "id love to see what you make",
    "would love to see what you make",
    "as always, would love to see",
    "enjoy and let me know",
    "check it out!",
    "if you have any questions or ideas",
    "however, i've got something else lined up for you",
    "big thanks for all the support",
    "your encouragement means the world",
    "if you are able, please consider supporting",
    "if you are able to, please consider supporting",
    "please consider supporting me",
    "my website",
    "welcome back to the channel",
    "i just got my hands on obs",
    "don't worry, i'll be investing in a microphone",
    "dont worry, i'll be investing in a microphone",
    "do not worry, i will be investing in a microphone",
    "today, i'm bringing you a super simple",
    "today, i am bringing you a super simple",
    "today, i'm bringing you",
    "today, i am bringing you",
    "i can't believe this channel is almost at",
    "thank you for being here and pushing me",
    "new project files for my support",
    "it has been a while since i uploaded",
    "i had a nice little vacation",
    "hope you enjoy",
    "hope you like the video",
    "hope you like it",
    "i have been busy with my masters",
    "rest assured, i will update you",
    "i am working on some other stuff",
    "fluidscape by kevin macLeod",
    "source: http://incompetech",
    "artist: http://incompetech",
    "is licensed under a creative commons",
    "please tag me in your work",
    "would love to see what you guys come up",
    "let me know what you think",
    "so, if you're keen to get your hands on them",
    "apologies for the absence of a tutorial",
    "that's because my trusty 1650ti gpu",
    "there is a tutorial on ableton+td in the works",
    "i have another noise sculpting tutorial for you guys",
    "a new tutorial for you after a while",
    "i'm back after a long break",
    "thanks to @elekktronaut for the interaction display",
    "thanks to  @elekktronaut  for the interaction display",
)

DROP_SENTENCE_CONTAINS = (
    "patreon.com",
    "instagram.com",
    "bandcamp.com",
    "atharvagupta.net",
    "audiodevout.github.io",
    "audiodevout.com",
    "my only source of income",
    "cool stuff on my patreon",
    "on my patreon",
    "for all members on patreon",
    "i graduate in june",
    "getting back into college and youtube",
    "if you have any suggestions for future videos",
    "share them in the comments",
    "frame rate drops, especially if you're watching in 4k",
    "shiny new laptop is on the way",
    "incompetech.com",
    "creativecommons.org",
    "almost at a 1000 subscribers",
    "almost at 1000 subscribers",
    "please tag me if you share",
    "licensed under a creative commons",
    "by chris zabriskie",
    "(free for the first 2 weeks!)",
    "be sure to join!",
)

DROP_PARAGRAPH_STARTS = (
    "new project files for my support",
    "please like and subscribe",
    "big thanks for all the support",
    "cgi snake by",
    "i am a man who will fight for your honor by",
    "fluidscape by kevin macLeod",
)

# Trailing comment / CTA fragments stripped from otherwise good sentences.
TRAILING_CTA_RE = re.compile(
    r"\s+(?:"
    r"(?:as always,?\s*)?(?:i['’]?d|i would)\s+love to see what you (?:all )?(?:come up with|make with|guys come up with)[^.!?]*[.!?]|"
    r"(?:as always,?\s*)?please tag me[^.!?]*[.!?]|"
    r"let me know what you think(?:\s+(?:about it|down in the comments|in the comments below))?[^.!?]*[.!?]|"
    r"if you have any questions or ideas, feel free to share them[^.!?]*[.!?]|"
    r"check it out![.!?]?|"
    r"enjoy and let me know[^.!?]*[.!?]|"
    r"also i can['’]?t believe this channel is almost at[^.!?]*[.!?]|"
    r"would love to see what you guys come up with[^.!?]*[.!?]"
    r")\s*$",
    re.I,
)


def scrub_leading_punctuation(text):
    return re.sub(r"^[\s,;–—-]+", "", (text or "").strip())


def normalize_apostrophes(text):
    return (text or "").replace("\u2019", "'").replace("\u2018", "'")


def normalize_newlines(text):
    return (text or "").replace("\r\n", "\n").replace("\r", "\n")


def strip_greeting(text):
    text = GREETING_PREFIX.sub("", (text or "").strip())
    return scrub_leading_punctuation(text)


def is_boilerplate_sentence(sentence):
    stripped = sentence.strip()
    if not stripped:
        return True
    if stripped.startswith("http") or re.search(r"https?://", stripped):
        return True
    lower = normalize_apostrophes(stripped).lower()
    if any(lower.startswith(prefix) for prefix in DROP_SENTENCE_STARTS):
        return True
    if any(token in lower for token in DROP_SENTENCE_CONTAINS):
        return True
    if re.match(r"^hope you (enjoy|like)\b", lower):
        return True
    if lower.endswith("–") or lower.endswith("-"):
        if any(label in lower for label in ("website", "instagram", "bandcamp", "patreon")):
            return True
    return False


def is_off_topic_paragraph(paragraph):
    lower = paragraph.lower().strip()
    if not lower:
        return True
    if any(lower.startswith(prefix) for prefix in DROP_PARAGRAPH_STARTS):
        return True
    if lower.startswith("helloo people") and "patreon" in lower:
        return True
    if "licensed under a creative commons" in lower and "touchdesigner" not in lower:
        return True
    if re.fullmatch(r"[―\-–—\s]+", paragraph):
        return True
    return False


def clean_sentence(sentence):
    sentence = strip_greeting(sentence.strip())
    sentence = normalize_apostrophes(sentence)
    sentence = TRAILING_CTA_RE.sub("", sentence).strip()
    if not sentence or is_boilerplate_sentence(sentence):
        return ""
    return sentence


def clean_tutorial_description(text):
    text = normalize_newlines(text)
    paragraphs = re.split(r"\n\s*\n", text)
    kept = []

    for paragraph in paragraphs:
        paragraph = paragraph.strip()
        if not paragraph or is_off_topic_paragraph(paragraph):
            continue

        merged = re.sub(r"\s+", " ", paragraph)
        merged = strip_greeting(merged)
        merged = scrub_leading_punctuation(merged)
        if not merged:
            continue

        sentences = re.split(r"(?<=[.!?])\s+", merged)
        tutorial_sentences = []
        for sentence in sentences:
            cleaned = clean_sentence(sentence)
            if cleaned:
                tutorial_sentences.append(cleaned)

        if tutorial_sentences:
            kept.append(" ".join(tutorial_sentences))

    result = "\n\n".join(kept).strip()
    result = re.sub(r"\n{3,}", "\n\n", result)
    return result


def first_sentence(text, max_len=180):
    text = re.sub(r"\s+", " ", text or "").strip()
    if not text:
        return ""
    parts = re.split(r"(?<=[.!?])\s+", text)
    sentence = parts[0]
    if len(sentence) > max_len:
        return sentence[: max_len - 1].rstrip() + "…"
    return sentence


def short_description(full_description):
    cleaned = clean_tutorial_description(full_description)
    if not cleaned:
        return ""
    flat = cleaned.replace("\n", " ")
    return first_sentence(flat)


def description_from_title(title):
    """Fallback when YouTube description is only boilerplate."""
    text = re.sub(
        r"\s*[-–—|]\s*(?:TouchDesigner\s*)?(?:Tutorial|Project Overview|Project Showcase|Behind the Network)\s*$",
        "",
        title or "",
        flags=re.I,
    ).strip()
    if not text:
        return ""
    if re.search(r"tutorial|overview|showcase", title or "", re.I):
        return f"{text}."
    return text


def extract_patreon(raw_description):
    if not raw_description:
        return None
    matches = re.findall(
        r"https?://(?:www\.)?patreon\.com[^\s\)\]\"']+", raw_description, re.I
    )
    if not matches:
        return None
    for link in matches:
        if "/posts/" in link:
            return link.rstrip(".,)")
    return matches[0].rstrip(".,)")
