"""Build the curated N5 word inventory from attributed, local source snapshots.

The output is a bulk-generated CC BY-SA 4.0 data file. Run this only when
refreshing source snapshots, then review the resulting Chinese glosses.
"""

import argparse
import json
import re
import sqlite3
from collections import Counter
from difflib import SequenceMatcher
from pathlib import Path


UNIT_SPECS = [
    ("kana-sounds", 40, {36, 38, 39}),
    ("introductions", 60, {1, 2, 3, 25}),
    ("things-and-places", 70, {5, 6, 13, 26}),
    ("time-and-numbers", 70, {7, 8, 9, 10, 11, 12}),
    ("daily-actions", 70, {27, 28, 29, 33}),
    ("existence", 70, {13, 26, 30, 37}),
    ("descriptions", 70, {2, 20, 31, 32}),
    ("te-form", 70, {27, 28, 29}),
    ("past-and-plans", 70, {10, 11, 12, 27, 28}),
    ("travel-and-services", 70, {16, 17, 18, 19, 22, 23}),
    ("reading-and-listening", 80, {14, 15, 21, 24, 34, 35, 37}),
    ("n5-review", 60, set(range(1, 41))),
]


STOPWORDS = {"a", "an", "the", "to", "of", "for", "and", "or", "in", "on", "with", "is", "be", "one", "something", "someone", "somebody"}
VOCAB_OVERRIDES = {
    "ごちそうさまでした": "我吃好了，谢谢款待",
    "ううん": "不（口语）",
    "いただきます": "我开动了（餐前用语）",
    "私": "我",
    "私たち": "我们",
    "テレビ": "电视",
    "一": "一",
    "午後": "下午",
    "午前": "上午",
    "する": "做",
    "行く": "去",
    "ぜひ": "务必；一定",
    "きっさてん": "咖啡馆",
    "ふべん": "不方便",
    "だいすき": "非常喜欢",
    "だいきらい": "非常讨厌",
    "あんぜん": "安全",
    "すき": "喜欢",
    "じょうぶ": "结实；健康",
    "で": "在（动作场所）；用（方式）",
    "ね": "呢；吧（征求认同）",
    "よ": "哦；呀（提示或强调）",
    "しか": "只有（后接否定）",
    "または": "或者",
    "それで": "所以；然后",
    "べつべつ": "分别；分开",
    "にこにこ": "笑眯眯地",
}


def meaning_score(source, candidate):
    source_words = {word for word in re.findall(r"[a-z]{3,}", source.lower()) if word not in STOPWORDS}
    candidate_words = {word for word in re.findall(r"[a-z]{3,}", candidate.lower()) if word not in STOPWORDS}
    overlap = len(source_words & candidate_words)
    return overlap * 3 + SequenceMatcher(None, source.lower()[:60], candidate.lower()[:60]).ratio()


def chinese_gloss(raw, source_english, english_senses):
    senses = raw.get("senses", {})
    options = []
    for key, sense in senses.items():
        glosses = [gloss.get("text", "").strip() for gloss in sense.get("glosses", [])]
        english = english_senses.get(key, "")
        if glosses and glosses[0]:
            options.append((meaning_score(source_english, english), glosses[0]))
    if not options:
        return "", 0
    score, text = max(options, key=lambda option: option[0])
    return text.split("；")[0].split(";")[0][:80], score


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-vocab", type=Path, required=True)
    parser.add_argument("--source-dictionary", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("src/content/vocabulary.json"))
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    source = json.loads(args.source_vocab.read_text(encoding="utf-8"))["entries"]
    db = sqlite3.connect(f"file:{args.source_dictionary}?mode=ro", uri=True)
    db.row_factory = sqlite3.Row
    matched = []
    missing = []
    seen = set()

    for item in source:
        form = str(item.get("form") or "").strip()
        reading = str(item.get("reading") or "").strip()
        if not form or not reading or (form, reading) in seen:
            continue
        seen.add((form, reading))
        rows = db.execute(
            "SELECT e.id, e.data, z.data FROM forms f "
            "JOIN entries e ON e.id = f.entry_id "
            "JOIN zh_defs z ON z.entry_id = e.id AND z.locale = 'zh-CN' "
            "WHERE f.text = ? LIMIT 30",
            (form,),
        ).fetchall()
        candidates = []
        for row in rows:
            entry = json.loads(row[1])
            readings = {kana.get("text") for kana in entry.get("kana", [])}
            if reading not in readings:
                continue
            english_senses = {str(index): "; ".join(gloss.get("text", "") for gloss in sense.get("glosses", []) if gloss.get("lang") == "eng") for index, sense in enumerate(entry.get("senses", []))}
            gloss, score = chinese_gloss(json.loads(row[2]), str(item.get("gloss") or ""), english_senses)
            if gloss:
                candidates.append((row[0], gloss, score, entry.get("is_common", False)))
        if not candidates:
            missing.append(form)
            continue
        candidates.sort(key=lambda entry: (-entry[2], not entry[3], len(entry[1])))
        source_id, gloss, match_score, _ = candidates[0]
        if form in VOCAB_OVERRIDES:
            gloss = VOCAB_OVERRIDES[form]
        section = str(item.get("section") or "")
        section_number = int(re.match(r"\d+", section).group()) if re.match(r"\d+", section) else 40
        rank = item.get("frequency_rank")
        matched.append({
            "id": f"n5-word-{len(matched) + 1:04d}",
            "japanese": form,
            "reading": reading,
            "chinese": gloss,
            "english": str(item.get("gloss") or "").strip(),
            "section": section,
            "sectionNumber": section_number,
            "frequencyRank": rank if isinstance(rank, int) else 999999,
            "matchScore": round(match_score, 3),
            "reviewedOverride": form in VOCAB_OVERRIDES,
            "sourceIds": {"jlptSuccess": item.get("id"), "tomoshi": source_id},
        })

    matched.sort(key=lambda item: (item["frequencyRank"], item["japanese"]))
    available = matched.copy()
    selected = []
    for slug, quota, categories in UNIT_SPECS:
        preferred = [item for item in available if item["sectionNumber"] in categories]
        chosen = preferred[:quota]
        if len(chosen) < quota:
            chosen += [item for item in available if item not in chosen][: quota - len(chosen)]
        if len(chosen) != quota:
            raise RuntimeError(f"{slug}: only {len(chosen)} of {quota} words available")
        for item in chosen:
            item["unitSlug"] = slug
        selected.extend(chosen)
        ids = {item["id"] for item in chosen}
        available = [item for item in available if item["id"] not in ids]

    selected.sort(key=lambda item: (next(index for index, spec in enumerate(UNIT_SPECS) if spec[0] == item["unitSlug"]), item["frequencyRank"], item["japanese"]))
    for index, item in enumerate(selected, 1):
        item["id"] = f"n5-word-{index:04d}"
        item.pop("sectionNumber")
    print(f"source={len(source)} matched={len(matched)} missing={len(missing)} selected={len(selected)}")
    print("units", dict(Counter(item["unitSlug"] for item in selected)))
    print("low-confidence", len([item for item in selected if item["matchScore"] < 1]))
    print("unmatched sample", missing[:20])
    if not args.dry_run:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps({"license": "CC BY-SA 4.0", "words": selected}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
