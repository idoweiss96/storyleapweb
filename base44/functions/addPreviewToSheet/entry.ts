import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Appends free story preview requests into the SAME per-language Questionnaire
// sheets used by addStoryToSheet, tagged "Preview Requested" / "Preview Sent"
// so previews show up alongside regular story submissions.
const SPREADSHEET_ID_EN = '1vDfEGbVfwplAgHTTYREauRxUgX-fxa5uJJZXenotZac';
const SHEET_NAME_EN = 'Questionnaire';
const SPREADSHEET_ID_HE = '1hEBop1uM-ldASUKGQWNFShCPlO5xZ2R7SwFOZ7EtN30';
const SHEET_NAME_HE = 'שאלון';

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

function detectLanguage(preview) {
  if (preview.lang) return preview.lang === 'he' ? 'he' : 'en';
  return isHebrew(preview.child_name) || isHebrew(preview.trigger_desc) || isHebrew(preview.hobbies) ? 'he' : 'en';
}

// Column order matches addStoryToSheet's storyToRow exactly, so preview rows
// line up under the same headers in the Questionnaire/שאלון sheets.
function previewToRow(preview, lang, tag) {
  const createdDate = preview.created_date ? new Date(preview.created_date).toLocaleString('he-IL') : '';
  const genderMap = lang === 'he' ? genderMapHE : genderMapEN;
  const settingMap = lang === 'he' ? settingMapHE : settingMapEN;
  const challengeMap = lang === 'he' ? challengeMapHE : challengeMapEN;
  const reactionMap = lang === 'he' ? reactionMapHE : reactionMapEN;
  return [
    createdDate,
    lang === 'he' ? 'עברית' : 'English',
    '', // Order ID
    '', // User Email
    '', // Price
    '', // Currency
    '', // Credits Used
    preview.child_name || '',
    preview.child_age || '',
    genderMap[preview.gender] || preview.gender || '',
    preview.child_image_url || '',
    '', // Parent Consent
    preview.parent_image_url || '',
    (lang === 'he' ? { mom: 'אמא', dad: 'אבא' } : { mom: 'Mom', dad: 'Dad' })[preview.parent_relation] || '',
    settingMap[preview.setting] || preview.setting || '',
    preview.challenge_type === 'other' ? (preview.custom_challenge || '') : (challengeMap[preview.challenge_type] || preview.challenge_type || ''),
    preview.trigger_desc || '',
    reactionMap[preview.reaction_type] || preview.reaction_type || '',
    preview.hobbies || '',
    preview.contact_email || '',
    preview.contact_phone || '',
    preview.preview_link || '',
    '', // Email Sent
    tag,
  ];
}

function colLetter(index) {
  // 0-indexed column -> spreadsheet letter (A, B, ... X)
  return String.fromCharCode('A'.charCodeAt(0) + index);
}

async function findExistingRow(spreadsheetId, sheetName, accessToken, contactEmail) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A2:X`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  const json = await res.json();
  const rows = json.values || [];
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];
    const email = (row[19] || '').toLowerCase();
    const tag = row[23] || '';
    if (email === (contactEmail || '').toLowerCase() && tag.includes('Preview Requested') && !tag.includes('Preview Sent')) {
      return i + 2; // +2: header row + 1-indexing
    }
  }
  return null;
}

async function updateRowToSent(spreadsheetId, sheetName, accessToken, rowNumber, previewLink) {
  const storyLinkCol = colLetter(21);
  const tagsCol = colLetter(23);
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: [
          { range: `${sheetName}!${storyLinkCol}${rowNumber}`, values: [[previewLink || '']] },
          { range: `${sheetName}!${tagsCol}${rowNumber}`, values: [['Preview Sent']] },
        ],
      }),
    }
  );
}

async function appendRow(spreadsheetId, sheetName, accessToken, row) {
  return fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] }),
    }
  );
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const preview = body.data || body;
    const eventType = body.event?.type || 'create';

    if (!preview || !preview.child_name) {
      return Response.json({ error: 'No preview data provided' }, { status: 400 });
    }

    const lang = detectLanguage(preview);
    const spreadsheetId = lang === 'he' ? SPREADSHEET_ID_HE : SPREADSHEET_ID_EN;
    const sheetName = lang === 'he' ? SHEET_NAME_HE : SHEET_NAME_EN;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // On update, only act when the preview just became "ready" (link added) —
    // find its existing "Preview Requested" row and flip it to "Preview Sent".
    if (eventType === 'update' && preview.status === 'ready') {
      const rowNumber = await findExistingRow(spreadsheetId, sheetName, accessToken, preview.contact_email);
      if (rowNumber) {
        await updateRowToSent(spreadsheetId, sheetName, accessToken, rowNumber, preview.preview_link);
        return Response.json({ success: true, action: 'updated', row: rowNumber });
      }
      // No matching row found (e.g. it was never logged) — append a fresh "Preview Sent" row instead.
      const row = previewToRow(preview, lang, 'Preview Sent');
      const res = await appendRow(spreadsheetId, sheetName, accessToken, row);
      if (!res.ok) {
        const err = await res.text();
        return Response.json({ error: err }, { status: 500 });
      }
      return Response.json({ success: true, action: 'appended_sent' });
    }

    // Create (or any other update) — append a "Preview Requested" row.
    const row = previewToRow(preview, lang, 'Preview Requested');
    const res = await appendRow(spreadsheetId, sheetName, accessToken, row);
    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: 500 });
    }
    return Response.json({ success: true, action: 'appended_requested', lang });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}