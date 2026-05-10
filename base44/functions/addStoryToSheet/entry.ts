import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SPREADSHEET_ID_EN = '1-LZ-ai2LdJ4BoTTdSacDRl-L0LpcIEg5JrCKK6txLxg';
const SPREADSHEET_ID_HE = '1yT2WdAlyjpp8gciT4iZYEL122FyrliTin3MEcTvvr20';
const genderMapHE = { boy: 'בן', girl: 'בת', other: 'אחר' };
const settingMapHE = { space: 'חלל', forest: 'יער קסום', castle: 'ארמון', sports: 'ספורט', real_life: 'חיים אמיתיים' };
const challengeMapHE = { fears: 'פחדים', social_difficulty: 'קושי חברתי', changes: 'שינויים', emotional_regulation: 'ויסות רגשי', separation_anxiety: 'חרדת נטישה', self_confidence: 'ביטחון עצמי', sleep_issues: 'קשיי שינה' };
const reactionMapHE = { outburst: 'התפרצות', withdrawal: 'הסתגרות', attention_seeking: 'חיפוש תשומת לב', crying: 'בכי', aggression: 'תוקפנות', avoidance: 'הימנעות' };

const genderMapEN = { boy: 'Boy', girl: 'Girl', other: 'Other' };
const settingMapEN = { space: 'Space', forest: 'Enchanted Forest', castle: 'Castle', sports: 'Sports', real_life: 'Real Life' };
const challengeMapEN = { fears: 'Fears', social_difficulty: 'Social Difficulty', changes: 'Changes', emotional_regulation: 'Emotional Regulation', separation_anxiety: 'Separation Anxiety', self_confidence: 'Self Confidence', sleep_issues: 'Sleep Issues' };
const reactionMapEN = { outburst: 'Outburst', withdrawal: 'Withdrawal', attention_seeking: 'Attention Seeking', crying: 'Crying', aggression: 'Aggression', avoidance: 'Avoidance' };

function isHebrew(text) {
  return /[\u0590-\u05FF]/.test(text || '');
}

function detectLanguage(story) {
  return isHebrew(story.child_name) || isHebrew(story.trigger_desc) || isHebrew(story.hobbies) ? 'he' : 'en';
}

function storyToRow(story, lang) {
  const createdDate = story.created_date ? new Date(story.created_date).toLocaleDateString('he-IL') : '';
  const genderMap = lang === 'he' ? genderMapHE : genderMapEN;
  const settingMap = lang === 'he' ? settingMapHE : settingMapEN;
  const challengeMap = lang === 'he' ? challengeMapHE : challengeMapEN;
  const reactionMap = lang === 'he' ? reactionMapHE : reactionMapEN;
  return [
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
    story.child_image_url || '',
    story.story_link || '',
  ];
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // entity automation sends { data: {...}, event: {...} }
    const storyData = body.data || body;
    if (!storyData) {
      return Response.json({ error: 'No story data provided' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // storyData here is already the flat fields from automation payload
    const lang = detectLanguage(storyData);
    const spreadsheetId = lang === 'he' ? SPREADSHEET_ID_HE : SPREADSHEET_ID_EN;

    const row = storyToRow(storyData, lang);

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
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

    return Response.json({ success: true, lang });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});