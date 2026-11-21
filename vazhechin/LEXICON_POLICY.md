# واژه‌چین dictionary policy

The game accepts a deliberately broad, offline vocabulary so it remains fast and private. The imported list is a **candidate source**, not a claim that every string is common Persian.

## What stays stable

- Existing accepted entries remain playable. Removing them could invalidate a player's prior save or a word they have already learned.
- A board always needs seven distinct letters, and every accepted entry must use only those letters, contain the center letter, and have at least four letters after normalization.
- Proper names, places, brand names, obvious OCR artifacts, and questionable inflections are not added in new curation without an explicit product decision.

## Curation workflow

1. Record user reports in a review queue with the board and normalized spelling.
2. Check a reliable Persian reference (for example Dehkhoda, Moein, or Vajehyab) and label the decision: add, retain legacy, or decline.
3. Add a regression test for every new accepted or deliberately declined word.
4. Do not generate inflections at runtime. Presentation-only normalization may add the conventional نیم‌فاصله.

## Source and attribution

See [LEXICON_ATTRIBUTION.md](LEXICON_ATTRIBUTION.md) for the MIT-licensed candidate source and its known limitations.
