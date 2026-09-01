// מדפיס סיכום דחוס של הישויות שנותרו, בלי גוש JSON שלם
const fs = require('fs');
const want = ['ChildSpace', 'SpaceActivity', 'ActivityEntry', 'MoodEntry',
              'Reminder', 'FeedbackSurvey', 'StoryPreview', 'CustomerTag',
              'FreeActivityLead'];

for (const name of want) {
  const file = `/app/base44/entities/${name}.jsonc`;
  if (!fs.existsSync(file)) { console.log(`${name}: (חסר)`); continue; }
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  const req = new Set(j.required || []);
  console.log(`\n### ${j.name}`);
  for (const [k, v] of Object.entries(j.properties || {})) {
    let t = v.type;
    if (v.enum) t = `enum(${v.enum.join('|')})`;
    if (v.format) t += `/${v.format}`;
    const extras = [];
    if (req.has(k)) extras.push('required');
    if (v.default !== undefined) extras.push(`default=${JSON.stringify(v.default)}`);
    console.log(`  ${k} : ${t}${extras.length ? '  [' + extras.join(', ') + ']' : ''}`);
  }
  const rls = j.rls ? Object.keys(j.rls).join(',') : 'none';
  console.log(`  -- rls: ${rls}`);
}
