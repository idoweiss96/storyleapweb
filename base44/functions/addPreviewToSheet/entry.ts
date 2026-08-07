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

// Column order matches addStoryToSheet's storyToRow exactly (through column W), plus the
// builder's own Z ("סטטוס") and AA ("קישור לתצוגה מקדימה") columns used to track preview/paid state.
function previewToRow(preview, lang) {
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
    '', // Credits Used
    '', // Credits Used (kept for column alignment)
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
    '', // Story Link (column V) — not used for previews, reserved for direct full-story purchases
    '', // Email Sent
    '', // (unused)
    '', // (unused note column)
    'preview', // Z — סטטוס
    preview.preview_link || '', // AA — קישור לתצוגה מקדימה
  ];
}

function colLetter(index) {
  // 0-indexed column -> spreadsheet letter (A, B, ... Z, AA)
  if (index < 26) return String.fromCharCode('A'.charCodeAt(0) + index);
  return 'A' + String.fromCharCode('A'.charCodeAt(0) + (index - 26));
}

const COL_STATUS = 25; // Z
const COL_PREVIEW_LINK = 26; // AA
const COL_CONTACT_EMAIL = 19; // T

async function findExistingRow(spreadsheetId, sheetName, accessToken, contactEmail) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A2:AA`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  const json = await res.json();
  const rows = json.values || [];
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];
    const email = (row[COL_CONTACT_EMAIL] || '').toLowerCase();
    const status = (row[COL_STATUS] || '').trim();
    if (email === (contactEmail || '').toLowerCase() && status === 'preview') {
      return i + 2; // +2: header row + 1-indexing
    }
  }
  return null;
}

async function updatePreviewLinkCell(spreadsheetId, sheetName, accessToken, rowNumber, previewLink) {
  const col = colLetter(COL_PREVIEW_LINK);
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!${col}${rowNumber}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [[previewLink || '']] }),
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

    // On update, only act when the preview link was just added (status -> "ready") —
    // find its existing row (status column Z = "preview") and fill in the link column AA.
    // Z stays "preview" here; it only becomes "paid" once the full story is purchased (see addStoryToSheet).
    if (eventType === 'update' && preview.status === 'ready') {
      const rowNumber = await findExistingRow(spreadsheetId, sheetName, accessToken, preview.contact_email);
      if (rowNumber) {
        await updatePreviewLinkCell(spreadsheetId, sheetName, accessToken, rowNumber, preview.preview_link);
        return Response.json({ success: true, action: 'updated_link', row: rowNumber });
      }
      // No matching row found (e.g. it was never logged) — append a fresh row with the link already set.
      const row = previewToRow(preview, lang);
      row[26] = preview.preview_link || '';
      const res = await appendRow(spreadsheetId, sheetName, accessToken, row);
      if (!res.ok) {
        const err = await res.text();
        return Response.json({ error: err }, { status: 500 });
      }
      return Response.json({ success: true, action: 'appended_with_link' });
    }

    // Create (or any other update) — append a row with status "preview" in column Z.
    const row = previewToRow(preview, lang);
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