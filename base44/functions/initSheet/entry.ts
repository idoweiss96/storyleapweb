import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SPREADSHEET_ID_EN = '1-LZ-ai2LdJ4BoTTdSacDRl-L0LpcIEg5JrCKK6txLxg';
const SPREADSHEET_ID_HE = '1yT2WdAlyjpp8gciT4iZYEL122FyrliTin3MEcTvvr20';
const SHEET_NAME = 'Sheet1';

const HEADERS = [
  'תאריך',
  'שם הילד/ה',
  'גיל',
  'מגדר',
  'תפאורה',
  'אתגר רגשי',
  'תיאור הטריגר',
  'תגובת הילד/ה',
  'תחביבים',
  'מייל',
  'טלפון',
  'קישור לתמונה',
  'קישור לסיפור',
];

const genderMap = { boy: 'בן', girl: 'בת', other: 'אחר' };
const settingMap = { space: 'חלל', forest: 'יער קסום', castle: 'ארמון', sports: 'ספורט', real_life: 'חיים אמיתיים' };
const challengeMap = { fears: 'פחדים', social_difficulty: 'קושי חברתי', changes: 'שינויים', emotional_regulation: 'ויסות רגשי', separation_anxiety: 'חרדת נטישה', self_confidence: 'ביטחון עצמי', sleep_issues: 'קשיי שינה' };
const reactionMap = { outburst: 'התפרצות', withdrawal: 'הסתגרות', attention_seeking: 'חיפוש תשומת לב', crying: 'בכי', aggression: 'תוקפנות', avoidance: 'הימנעות' };

function isHebrew(text) {
  return /[\u0590-\u05FF]/.test(text || '');
}

function getFields(story) {
  // SDK list always returns story.data as nested object
  return (story.data && typeof story.data === 'object') ? story.data : story;
}

function detectLanguage(story) {
  const d = getFields(story);
  return isHebrew(d.child_name) || isHebrew(d.trigger_desc) || isHebrew(d.hobbies) ? 'he' : 'en';
}

function storyToRow(story) {
  const d = getFields(story);
  const createdDate = story.created_date ? new Date(story.created_date).toLocaleDateString('he-IL') : '';
  return [
    createdDate,
    d.child_name || '',
    d.child_age || '',
    genderMap[d.gender] || d.gender || '',
    settingMap[d.setting] || d.setting || '',
    challengeMap[d.challenge_type] || d.challenge_type || '',
    d.trigger_desc || '',
    reactionMap[d.reaction_type] || d.reaction_type || '',
    d.hobbies || '',
    d.contact_email || '',
    d.contact_phone || '',
    d.child_image_url || '',
    d.story_link || '',
  ];
}

async function writeToSheet(spreadsheetId, rows, accessToken) {
  // Clear first
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${SHEET_NAME}:clear`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    }
  );

  // Write
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: rows }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const stories = await base44.asServiceRole.entities.Story.list('-created_date', 200);

    const heStories = stories.filter(s => detectLanguage(s) === 'he');
    const enStories = stories.filter(s => detectLanguage(s) === 'en');

    await Promise.all([
      writeToSheet(SPREADSHEET_ID_HE, [HEADERS, ...heStories.map(storyToRow)], accessToken),
      writeToSheet(SPREADSHEET_ID_EN, [HEADERS, ...enStories.map(storyToRow)], accessToken),
    ]);

    return Response.json({ success: true, hebrew: heStories.length, english: enStories.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});