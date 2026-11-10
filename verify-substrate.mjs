import { readFileSync } from 'node:fs';

const path = '/Users/virajvekariya/Desktop/Competition/Prem/Data Forge/Pathway Solution/02-substrate-design.md';
const text = readFileSync(path, 'utf8');
const lower = text.toLowerCase();

const failures = [];

// Exactly 3 named controls, each a real variable.
const requiredControls = ['puzzle', 'demonstrations shown', 'reset state before query'];
for (const c of requiredControls) {
  if (!lower.includes(c)) failures.push(`missing control: ${c}`);
}
// Guard against scope creep: no 4th control term should appear as a *control*.
if (/\|\s*recurrence depth\s*\|/.test(lower) || /\|\s*refinement steps\s*\|/.test(lower)) {
  failures.push('a 4th control slipped into the controls table (scope creep)');
}

// Truth beside estimate.
if (!lower.includes('ground truth') || !lower.includes('model prediction')) {
  failures.push('missing truth-beside-estimate panel (ground truth / model prediction)');
}
if (!/chance\s*=\s*25%|chance baseline.*25%|25%.*chance/i.test(text)) {
  failures.push('missing explicit chance baseline (25%) next to the accuracy readout');
}

// Preset on load, not a blank canvas.
if (!lower.includes('preset on load') || !lower.includes('blank canvas')) {
  failures.push('missing preset-on-load / no-blank-canvas section');
}

// Guide then sandbox.
if (!lower.includes('guide, then sandbox') && !lower.includes('guide then sandbox')) {
  failures.push('missing guide-then-sandbox flow');
}

// Toy-model / provenance disclaimer (judging: BDH integration + craft/provenance).
if (!lower.includes('not the official bdh-cq') && !lower.includes('not presented as one')) {
  failures.push('missing explicit toy-model-not-official-BDH-CQ disclaimer');
}

// Caps and limits stated explicitly (design standard: "No hidden limits").
const capsSection = text.split(/##\s*Caps and limits/i)[1] || '';
const capsNumbers = capsSection.match(/\d+/g) || [];
if (capsNumbers.length < 4) {
  failures.push(`caps/limits section has only ${capsNumbers.length} stated numeric bounds, expected >= 4`);
}

// Errors-found section must be non-trivial (this step was asked to self-check for errors).
const errorsSection = text.split(/##\s*Errors found and fixed/i)[1] || '';
const errorItems = (errorsSection.match(/^\d+\./gm) || []).length;
if (errorItems < 3) {
  failures.push(`errors-found section lists only ${errorItems} items, expected >= 3`);
}

if (failures.length > 0) {
  console.error('FAIL:\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}

console.log(`Controls: ${requiredControls.length}; caps stated: ${capsNumbers.length}; errors logged: ${errorItems}`);
console.log('SUBSTRATE_OK');
