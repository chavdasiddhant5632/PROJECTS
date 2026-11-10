import { readFileSync } from 'node:fs';

const path = '/Users/virajvekariya/Desktop/Competition/Prem/Data Forge/Pathway Solution/03-bdh-module.md';
const text = readFileSync(path, 'utf8');
const lower = text.toLowerCase();

const failures = [];

// States plainly which system is meant.
if (!lower.includes('which system, stated plainly')) failures.push('missing explicit "which system" statement');
if (!lower.includes('bdh-cq')) failures.push('missing BDH-CQ');

// Primary-source citations (arXiv IDs), not secondhand summaries.
const requiredArxivIds = ['2509.26507', '2608.09888', '2506.21734', '2510.04871', '2512.11847'];
for (const id of requiredArxivIds) {
  if (!text.includes(id)) failures.push(`missing primary-source arXiv id: ${id}`);
}

// Woven into flow, not appended.
if (!lower.includes('woven into') || !lower.includes('not appended')) {
  failures.push('missing "woven into the flow, not appended" framing');
}

// The actual recurrence equations (paper notation), not the earlier generic Hebbian formula.
if (!text.includes('S_t = U_theta') || !text.includes('H_{r+1} = F_theta')) {
  failures.push('missing BDH-CQ recurrence equations (S_t / H_r+1 form)');
}
if (!text.includes('sigma(i,j)')) failures.push('missing BDH synaptic edge-variable notation sigma(i,j)');

// Must NOT claim the toy model's fixed 4 refinement steps is BDH-CQ's real hyperparameter.
if (!lower.includes('not a published bdh-cq hyperparameter') && !lower.includes('not a claimed property of the real system')) {
  failures.push('missing disclaimer that the toy 4-step refinement count is not BDH-CQ\'s real hyperparameter');
}

// Errors-found section, consistent with the running self-check discipline.
const errorsSection = text.split(/##\s*Errors found and fixed/i)[1] || '';
const errorItems = (errorsSection.match(/^\d+\./gm) || []).length;
if (errorItems < 3) failures.push(`errors-found section lists only ${errorItems} items, expected >= 3`);

if (failures.length > 0) {
  console.error('FAIL:\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}

console.log(`arXiv ids cited: ${requiredArxivIds.length}; errors logged: ${errorItems}`);
console.log('BDH_MODULE_OK');
