// Two Robots in an Elevator — entry for
// https://make.fun/c/u-motasimfuad-two-robots-in-an-elevator-8c6aeb8f
//
// Writes ONE original line to /output/entry.txt: awkward small talk
// that one robot says to another while riding an elevator together.
// The line is validated before anything is written: 1-199 characters
// (the competition gate), not only whitespace, a single line, no
// control characters, and no leading or trailing whitespace. If
// validation fails, nothing is written and the program exits non-zero.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "I charged to 100% for this ride, and now I'm standing here at 99% with absolutely nothing to say to you.";

function validate(line: string): void {
  if (line.length < 1 || line.length > 199) {
    throw new Error(`line must be 1-199 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (line !== line.trim()) {
    throw new Error("line must not have leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
  // Any other control character (tab, escape, etc.) is also invalid.
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("line must not contain control characters");
  }
  // The line must carry real words, not just punctuation or digits.
  if (!/[A-Za-z]/.test(line)) {
    throw new Error("line must contain at least one letter");
  }
  // No lone surrogates: the file must be clean UTF-8 when read back.
  for (const ch of line) {
    if (ch.codePointAt(0)! >= 0xd800 && ch.codePointAt(0)! <= 0xdfff) {
      throw new Error("line must not contain lone surrogates");
    }
  }
}

validate(LINE);
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");
// Read the file back and confirm it holds exactly the validated line.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) {
  throw new Error("written entry does not match the validated line");
}
console.log(`Wrote ${LINE.length}-character line to /output/entry.txt`);
