import { CORE, UI } from './src/components/activities/feelings-explorer/feelingsExplorerContent.js';

const issues = [];
const ids = new Set();
let branches = 0;
let leaves = 0;

for (const core of CORE) {
  if (ids.has(core.id)) issues.push(`duplicate core id ${core.id}`);
  ids.add(core.id);
  for (const key of ['id', 'emoji', 'color', 'branches']) {
    if (!core[key]) issues.push(`core ${core.id} missing ${key}`);
  }
  for (const lang of ['he', 'en']) {
    if (!core[lang]?.label) issues.push(`core ${core.id} missing ${lang}.label`);
  }

  for (const branch of core.branches) {
    branches++;
    if (!branch.emoji) issues.push(`branch ${core.id}/${branch.id} missing emoji`);
    for (const lang of ['he', 'en']) {
      for (const key of ['label', 'means', 'question']) {
        if (!branch[lang]?.[key]) issues.push(`branch ${core.id}/${branch.id} missing ${lang}.${key}`);
      }
    }
    for (const leaf of branch.leaves) {
      leaves++;
      for (const lang of ['he', 'en']) {
        if (typeof leaf[lang] !== 'string' || !leaf[lang]) {
          issues.push(`leaf ${core.id}/${branch.id}/${leaf.id} missing ${lang}`);
        }
      }
    }
  }
}

for (const key of Object.keys(UI.he)) {
  if (!UI.en[key]) issues.push(`UI.en missing ${key}`);
}
for (const key of Object.keys(UI.en)) {
  if (!UI.he[key]) issues.push(`UI.he missing ${key}`);
}

console.log(`core=${CORE.length} branches=${branches} leaves=${leaves}`);
console.log(`paths available to a child: ${leaves} (plus ${branches} "something else" endings)`);
console.log(issues.length ? `ISSUES:\n${issues.join('\n')}` : 'STRUCTURE OK');
