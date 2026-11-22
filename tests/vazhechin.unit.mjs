import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync("vazhechin/index.html", "utf8");
const script = html.match(/<script>([\s\S]+)<\/script>/)?.[1] || "";
const extractArray = (name, nextName) => {
  const match = script.match(
    new RegExp(`const ${name} = (\\[[\\s\\S]*?\\]);\\s*const ${nextName}`),
  );
  assert.ok(match, `${name} is present in the game source`);
  // The production data deliberately uses JavaScript trailing commas for readable diffs.
  return Function(`"use strict"; return (${match[1]});`)();
};
const extended = extractArray("EXTENDED", "DICTIONARY");
const puzzles = extractArray("P", "\\$");
const clean = (word) =>
  word
    .normalize("NFC")
    .replace(/ك/g, "ک")
    .replace(/ي/g, "ی")
    .replace(/[أإ]/g, "ا")
    .replace(/[\u0654\u200c\u200d\s]/g, "");
const points = (puzzle, word) => {
  const letters = clean(word);
  return (
    (letters.length === 4 ? 1 : letters.length) +
    (puzzle.a.every((letter) => letters.includes(letter)) ? 7 : 0)
  );
};

assert.equal(puzzles.length, 10, "all ten puzzles remain");
assert.equal(extended.length, puzzles.length, "every puzzle has a dictionary");

puzzles.forEach((puzzle, index) => {
  assert.equal(
    new Set(puzzle.a).size,
    7,
    `puzzle ${index + 1} keeps seven distinct letters`,
  );
  assert.ok(
    puzzle.a.includes(puzzle.c),
    `puzzle ${index + 1} keeps its center letter`,
  );
  const allowed = new Set(puzzle.a);
  const dictionary = new Set(extended[index].map(clean));
  extended[index].forEach((word) => {
    const normalized = clean(word);
    assert.ok(normalized.length >= 4, `${word} meets the four-letter minimum`);
    assert.ok(
      normalized.includes(puzzle.c),
      `${word} contains the required center letter`,
    );
    assert.ok(
      [...normalized].every((letter) => allowed.has(letter)),
      `${word} only uses board letters`,
    );
  });
  puzzle.w.forEach((word) =>
    assert.ok(dictionary.has(clean(word)), `${word} stays accepted`),
  );
});

assert.equal(
  points(puzzles[0], "روزنامه"),
  14,
  "a seven-letter pangram earns its letter score plus 7",
);
assert.equal(points(puzzles[1], "کتاب"), 1, "four-letter words earn one point");
 
// Editorially reviewed additions must remain playable on their intended board.
const curatedAdditions = {
  0: ["نارون"],
  1: ["دیرتر", "بیتدبیر", "بیتردید", "بیتربیت", "تکراری", "باریکتر"],
  3: ["انگبین"],
  4: ["خاندانی", "دوان"],
  5: ["نباتی"],
  6: ["کلاسی"],
  7: ["دونات"],
  8: ["آمدنی", "آرمید"],
  9: ["جهاندار", "رنجانده"],
};
for (const [index, words] of Object.entries(curatedAdditions)) {
  const dictionary = new Set(extended[Number(index)].map(clean));
  for (const word of words) {
    assert.ok(dictionary.has(clean(word)), `Curated word ${word} is accepted on board ${Number(index) + 1}`);
  }
}
assert.equal(clean("بی‌تردید"), "بیتردید", "half-spaces do not change accepted words");
assert.equal(clean("بی‌تربیت"), "بیتربیت", "standard orthography remains accepted");
assert.ok(!extended[0].includes("هاماوران"), "proper names are not silently added");

console.log(
  `Validated ${extended.flat().length.toLocaleString("en-US")} entries across 10 boards.`,
);
