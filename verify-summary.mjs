import { readFileSync } from 'node:fs';

const path = '/Users/virajvekariya/Desktop/Competition/Prem/Data Forge/Pathway Solution/04-summary.md';
const raw = readFileSync(path, 'utf8');

const startIdx = raw.indexOf('<!-- summary-start -->');
const endIdx = raw.indexOf('<!-- summary-end -->');
if (startIdx === -1 || endIdx === -1) {
  console.error('FAIL: missing summary-start/summary-end markers');
  process.exit(1);
}
const body = raw.slice(startIdx, endIdx);

const failures = [];

// Word count 500-950 (PS hard constraint), counting the rendered text (markdown
// punctuation stripped) rather than raw markdown source.
const text = body
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/[#|>*_`-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const words = text.split(' ').filter(Boolean);
if (words.length < 500 || words.length > 950) {
  failures.push(`word count ${words.length} outside the 500-950 range`);
}

// >= 3 primary papers 2022-2026, cited by arXiv id.
const arxivIds = [...new Set((body.match(/\b\d{4}\.\d{4,5}\b/g) || []))];
if (arxivIds.length < 3) {
  failures.push(`only ${arxivIds.length} distinct arXiv ids cited, expected >= 3`);
}

// Required substantive sections.
const requiredSections = [
  'cost-accuracy pareto',
  'evidence classification',
  'strengths, limitations, and one open question',
];
const lower = body.toLowerCase();
for (const s of requiredSections) {
  if (!lower.includes(s)) failures.push(`missing required section: ${s}`);
}

// "No AI slop": banned stock phrases (case-insensitive).
const bannedPhrases = [
  "it is important to note", 'in today\'s fast-paced', 'unlock the power',
  'delve into', 'at the end of the day', 'game-changer', 'game changer',
  'cutting-edge', 'cutting edge', 'revolutioniz', 'seamless', 'robust and scalable',
  'paradigm shift', 'in conclusion', 'in summary', 'furthermore, it', 'moreover, it',
  'plays a crucial role', 'plays a vital role', 'leverage the power', 'harness the power',
  'stands as a testament', 'not just a', 'in the realm of', 'landscape of',
];
const hits = bannedPhrases.filter((p) => lower.includes(p));
if (hits.length > 0) {
  failures.push(`banned AI-slop phrase(s) found: ${hits.join(', ')}`);
}

// Must explicitly flag the toy artifact vs. published-benchmark distinction (evidence discipline).
if (!lower.includes('not a reproduction')) {
  failures.push('missing explicit toy-artifact-is-not-a-reproduction disclaimer');
}

if (failures.length > 0) {
  console.error('FAIL:\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}

console.log(`Word count: ${words.length}; distinct arXiv ids: ${arxivIds.length} (${arxivIds.join(', ')})`);
console.log('SUMMARY_OK');
