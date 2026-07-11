import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SPREADSHEET_ID = '1rATg8VqjteU8MUwxckXv4pUprUfUGHGleMbhNuKBmKk';
const SHEET_NAME = 'תשובות שאלון כיתה א';

function formatValue(val) {
  if (val == null) return '';
  if (Array.isArray(val)) return val.join(', ');
  return String(val);
}

function answersToRow(answers, userEmail) {
  const now = new Date().toLocaleString('he-IL');
  return [
    now,
    userEmail || '',
    // עמוד 1
    formatValue(answers.name),
    formatValue(answers.gender),
    formatValue(answers.strength),
    formatValue(answers.strength_parent),
    answers.photo ? 'כן' : 'לא',
    // עמוד 2
    formatValue(answers.feelings_before),
    formatValue(answers.feelings_before_parent),
    formatValue(answers.scary_things),
    formatValue(answers.separation_feelings),
    formatValue(answers.separation_feelings_parent),
    // עמוד 3
    formatValue(answers.favorite_person),
    formatValue(answers.favorite_person_parent),
    formatValue(answers.gan_friends),
    formatValue(answers.sibling_experience),
    // עמוד 4
    formatValue(answers.activities),
    formatValue(answers.hero),
    formatValue(answers.comfort),
    // עמוד 5
    formatValue(answers.looking_forward),
    formatValue(answers.looking_forward_parent),
    formatValue(answers.one_worry),
    formatValue(answers.visited_school),
    // עמוד 6
    formatValue(answers.wish_self),
    formatValue(answers.wish_self_parent),
    formatValue(answers.wish_parent),
    formatValue(answers.wish_parent_parent),
  ];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { answers } = body;

    if (!answers) {
      return Response.json({ error: 'No answers provided' }, { status: 400 });
    }

    // Get user email if logged in (optional — questionnaire may be public)
    let userEmail = '';
    try {
      const user = await base44.auth.me();
      userEmail = user?.email || '';
    } catch (_) {}

    const row = answersToRow(answers, userEmail);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [row] }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: err }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});