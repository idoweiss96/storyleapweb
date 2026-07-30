import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SPREADSHEET_ID_HE = '1tVuanXaYnEt50RA2ckzaFVRiLh6WR_OLS6cLLYzkhS8';
const SHEET_NAME_HE = 'כיתה א';

const SPREADSHEET_ID_EN = '1udSbvT_3BbVYkAMxB7KovDocCyF_Soz727FgSfI6gz4';
const SHEET_NAME_EN = 'Kindergarten';

const OTHER_LABEL_HE = 'אחר';
const OTHER_LABEL_EN = 'Other';

function formatValue(val) {
  if (val == null) return '';
  if (Array.isArray(val)) return val.join(', ');
  return String(val);
}

const NO_RELATION_LABEL_HE = '(לא נבחר קשר)';
const NO_RELATION_LABEL_EN = '(No relation selected)';

// Returns [relation, link] for the single family photo, or ['', ''] if not provided.
function getFamilyPhotoPair(photo, otherLabel, noRelationLabel) {
  const p = photo && typeof photo === 'object' ? photo : null;
  if (!p || !p.photo) return ['', ''];
  const relation = p.role === otherLabel ? (p.customLabel || otherLabel) : (p.role || noRelationLabel);
  return [relation, p.photo];
}

function answersToRow(answers, userEmail, lang) {
  const isEn = lang === 'en';
  const now = new Date().toLocaleString(isEn ? 'en-US' : 'he-IL');
  const otherLabel = isEn ? OTHER_LABEL_EN : OTHER_LABEL_HE;
  const noRelationLabel = isEn ? NO_RELATION_LABEL_EN : NO_RELATION_LABEL_HE;
  const [photoRelation, photoLink] = getFamilyPhotoPair(answers.family_photos, otherLabel, noRelationLabel);
  return [
    now,
    userEmail || '',
    // Page 1
    formatValue(answers.name),
    formatValue(answers.gender),
    formatValue(answers.strength),
    formatValue(answers.strength_parent),
    answers.photo || '',
    answers.photo_consent ? (isEn ? 'Yes' : 'כן') : (isEn ? 'No' : 'לא'),
    // Page 2
    formatValue(answers.feelings_before),
    formatValue(answers.feelings_before_parent),
    formatValue(answers.scary_things),
    formatValue(answers.separation_feelings),
    formatValue(answers.separation_feelings_parent),
    // Page 3
    formatValue(answers.favorite_person),
    formatValue(answers.favorite_person_parent),
    formatValue(answers.gan_friends),
    formatValue(answers.sibling_experience),
    photoRelation,
    photoLink,
    // Page 4
    formatValue(answers.activities),
    formatValue(answers.hero),
    formatValue(answers.comfort),
    // Page 5
    formatValue(answers.looking_forward),
    formatValue(answers.looking_forward_parent),
    formatValue(answers.one_worry),
    formatValue(answers.visited_school),
    // Page 6
    formatValue(answers.wish_self),
    formatValue(answers.wish_self_parent),
    formatValue(answers.wish_parent),
    formatValue(answers.wish_parent_parent),
    '', // Contact email — filled in later once collected on the details step
    '', // Contact phone — filled in later once collected on the details step
    '', // Story link — filled in later once the story is ready
    '', // Email sent — filled in by the notification automation
  ];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { answers, lang } = body;

    if (!answers) {
      return Response.json({ error: 'No answers provided' }, { status: 400 });
    }

    const isEn = lang === 'en';
    const spreadsheetId = isEn ? SPREADSHEET_ID_EN : SPREADSHEET_ID_HE;
    const sheetName = isEn ? SHEET_NAME_EN : SHEET_NAME_HE;

    // Get user email if logged in (optional — questionnaire may be public)
    let userEmail = '';
    try {
      const user = await base44.auth.me();
      userEmail = user?.email || '';
    } catch (_) {}

    const row = answersToRow(answers, userEmail, lang);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:append?valueInputOption=USER_ENTERED`,
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