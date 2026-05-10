import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SPREADSHEET_ID = '1-LZ-ai2LdJ4BoTTdSacDRl-L0LpcIEg5JrCKK6txLxg';
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
  'קישור לסיפור',
];

const genderMap = { boy: 'בן', girl: 'בת', other: 'אחר' };
const settingMap = { space: 'חלל', forest: 'יער קסום', castle: 'ארמון', sports: 'ספורט', real_life: 'חיים אמיתיים' };
const challengeMap = { fears: 'פחדים', social_difficulty: 'קושי חברתי', changes: 'שינויים', emotional_regulation: 'ויסות רגשי', separation_anxiety: 'חרדת נטישה', self_confidence: 'ביטחון עצמי', sleep_issues: 'קשיי שינה' };
const reactionMap = { outburst: 'התפרצות', withdrawal: 'הסתגרות', attention_seeking: 'חיפוש תשומת לב', crying: 'בכי', aggression: 'תוקפנות', avoidance: 'הימנעות' };

function storyToRow(story) {
  const d = story.data || story;
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
    d.story_link || '',
  ];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Clear the sheet first
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}:clear`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      }
    );

    // Fetch all stories
    const stories = await base44.asServiceRole.entities.Story.list('-created_date', 200);

    const rows = [HEADERS, ...stories.map(storyToRow)];

    // Write all at once
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/A1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: rows }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: err }, { status: 500 });
    }

    return Response.json({ success: true, count: stories.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});