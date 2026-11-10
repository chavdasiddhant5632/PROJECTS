import { readFileSync } from 'node:fs';

const path = '/Users/virajvekariya/Desktop/Competition/Prem/Data Forge/Pathway Solution/01-claim.txt';
const raw = readFileSync(path, 'utf8').trim();

const failures = [];

// Exactly one sentence: exactly one terminal-punctuation character, and it must be the
// last character of the trimmed text.
const terminators = raw.match(/[.!?]/g) || [];
if (terminators.length !== 1) {
  failures.push(`expected exactly 1 sentence terminator, found ${terminators.length}`);
} else if (!/[.!?]$/.test(raw)) {
  failures.push('the single terminator is not at the end of the text');
}

const words = raw.split(/\s+/).filter(Boolean);
if (words.length < 15 || words.length > 80) {
  failures.push(`word count ${words.length} outside the 15-80 "highly specific, one sentence" range`);
}

const lower = raw.toLowerCase();
const requiredTerms = [
  { label: 'ARC-AGI framing', re: /\barc[- ]?agi\b|\barc\b/ },
  { label: 'BDH/BDH-CQ system named', re: /\bbdh(-cq)?\b/ },
  { label: 'recurrent/state mechanism', re: /\brecurrent\b|\bstate\b/ },
  { label: 'parameter-update contrast', re: /\bparameter\b/ },
];

for (const { label, re } of requiredTerms) {
  if (!re.test(lower)) {
    failures.push(`missing required grounding term: ${label}`);
  }
}

if (failures.length > 0) {
  console.error('FAIL:\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}

console.log(`Sentence (${words.length} words): ${raw}`);
console.log('CLAIM_OK');
