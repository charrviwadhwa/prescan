import csv
from pathlib import Path
from rapidfuzz import process, fuzz
import re

DATASET_PATH = (
    Path(__file__).resolve().parent
    / "data"
    / "investigations.csv"
)


def normalize(text):
    return " ".join(text.lower().strip().split())


def load_investigations():
    with open(DATASET_PATH, "r", encoding="utf-8-sig") as file:
        return list(csv.DictReader(file))


def match_investigation(raw_name, standard_name):
    investigations = load_investigations()

    candidates = []

    for item in investigations:
        candidates.append({
            "name": item["canonical_name"],
            "item": item,
            "source": "canonical_name"
        })

        aliases = item.get("aliases", "")

        for alias in aliases.split(";"):
            alias = alias.strip()

            if alias:
                candidates.append({
                    "name": alias,
                    "item": item,
                    "source": "alias"
                })

    query = normalize(standard_name)

    # First check exact canonical name or alias
    for candidate in candidates:
        if query == normalize(candidate["name"]):
            item = candidate["item"]

            return {
                "raw_name": raw_name,
                "standard_name": standard_name,
                "canonical_name": item["canonical_name"],
                "matched_alias": candidate["name"],
                "match_score": 100,
                "match_status": "exact_match",
                "match_source": candidate["source"],
                "matched": True
            }

    # Otherwise find a fuzzy candidate
    result = process.extractOne(
        standard_name,
        [candidate["name"] for candidate in candidates],
        scorer=fuzz.WRatio,
        score_cutoff=85
    )

    if result:
        matched_name, score, index = result

        # Check whether the two names share meaningful medical terms
        query_tokens = set(re.findall(r"[a-z0-9]+", normalize(standard_name)))
        candidate_tokens = set(re.findall(r"[a-z0-9]+", normalize(matched_name)))

        ignored_words = {"and", "or", "the", "of", "serum", "test"}

        common_tokens = (
            query_tokens & candidate_tokens
        ) - ignored_words

        # Reject fuzzy suggestions with insufficient meaningful overlap
        if len(common_tokens) < 2:
            result = None

    if result:
        matched_name, score, index = result
        candidate = candidates[index]
        item = candidate["item"]

        return {
            "raw_name": raw_name,
            "standard_name": standard_name,
            "canonical_name": item["canonical_name"],
            "matched_alias": matched_name,
            "match_score": round(score, 2),
            "match_status": "needs_review",
            "match_source": "fuzzy",
            "matched": False
        }

    return {
        "raw_name": raw_name,
        "standard_name": standard_name,
        "canonical_name": None,
        "matched_alias": None,
        "match_score": 0,
        "match_status": "unmatched",
        "match_source": None,
        "matched": False
    }