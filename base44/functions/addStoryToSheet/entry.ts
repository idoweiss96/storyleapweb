import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SPREADSHEET_ID = '1-LZ-ai2LdJ4BoTTdSacDRl-L0LpcIEg5JrCKK6txLxg';
const SHEET_NAME = 'Sheet1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const story = body.data;
    if (!story) {
      return Response.json({ error: 'No story data provided' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const genderMap = { boy: 'בן', girl: 'בת', other: 'אחר' };
    const settingMap = { space: 'חלל', forest: 'יער קסום', castle: 'ארמון', sports: 'ספורט', real_life: 'חיים אמיתיים' };
    const challengeMap = { fears: 'פחדים', social_difficulty: 'קושי חברתי', changes: 'שינויים', emotional_regulation: 'ויסות רגשי', separation_anxiety: 'חרדת נטישה', self_confidence: 'ביטחון עצמי', sleep_issues: 'קשיי שינה' };
    const reactionMap = { outburst: 'התפרצות', withdrawal: 'הסתגרות', attention_seeking: 'חיפוש תשומת לב', crying: 'בכי', aggression: 'תוקפנות', avoidance: 'הימנעות' };

    const createdDate = story.created_date ? new Date(story.created_date).toLocaleDateString('he-IL') : '';

    const row = [
      createdDate,
      story.child_name || '',
      story.child_age || '',
      genderMap[story.gender] || story.gender || '',
      settingMap[story.setting] || story.setting || '',
      challengeMap[story.challenge_type] || story.challenge_type || '',
      story.trigger_desc || '',
      reactionMap[story.reaction_type] || story.reaction_type || '',
      story.hobbies || '',
      story.contact_email || '',
      story.contact_phone || '',
      story.story_link || '',
    ];

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
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