import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { computeAutoTagsForStories } from '../../shared/customerTags.ts';

const SPREADSHEET_ID_EN = '1vDfEGbVfwplAgHTTYREauRxUgX-fxa5uJJZXenotZac';
const SHEET_NAME_EN = 'Questionnaire';
const SPREADSHEET_ID_HE = '1hEBop1uM-ldASUKGQWNFShCPlO5xZ2R7SwFOZ7EtN30';
const SHEET_NAME_HE = 'שאלון';
const genderMapHE = { boy: 'בן', girl: 'בת', other: 'אחר' };
const parentRelationMapHE = { mom: 'אמא', dad: 'אבא' };
const parentRelationMapEN = { mom: 'Mom', dad: 'Dad' };
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

function storyToRow(story, lang, userEmail, tags) {
  const createdDate = story.created_date ? new Date(story.created_date).toLocaleString('he-IL') : '';
  const genderMap = lang === 'he' ? genderMapHE : genderMapEN;
  const settingMap = lang === 'he' ? settingMapHE : settingMapEN;
  const challengeMap = lang === 'he' ? challengeMapHE : challengeMapEN;
  const reactionMap = lang === 'he' ? reactionMapHE : reactionMapEN;
  // Column order matches the existing headers in the Questionnaire/שאלון sheets:
  // Timestamp, Language, Order ID, User Email, Price, Currency, Credits Used,
  // Child's Name, Age, Gender, Child's Photo Link, Parent Consent, Parent's Photo Link,
  // Whose Photo, Story World, Emotional Challenge, Trigger Description, Child's Reaction,
  // What the Child Loves, Contact Email, Contact Phone, Story Link, Email Sent, ..., Status (Z), Preview Link (AA)
  return [
    createdDate,
    lang === 'he' ? 'עברית' : 'English',
    story.order_id || '',
    userEmail || '',
    '', // Price — not tracked for credit-funded stories
    '', // Currency — not tracked for credit-funded stories
    story.payment_status === 'paid' ? 110 : '',
    story.child_name || '',
    story.child_age || '',
    genderMap[story.gender] || story.gender || '',
    story.child_image_url || '',
    '', // Parent Consent — not currently collected
    story.parent_image_url || '',
    (lang === 'he' ? parentRelationMapHE : parentRelationMapEN)[story.parent_relation] || '',
    settingMap[story.setting] || story.setting || '',
    story.challenge_type === 'other' ? (story.custom_challenge || '') : (challengeMap[story.challenge_type] || story.challenge_type || ''),
    story.trigger_desc || '',
    reactionMap[story.reaction_type] || story.reaction_type || '',
    story.hobbies || '',
    story.contact_email || '',
    story.contact_phone || '',
    '', // Story Link — filled in later once the story is ready
    '', // Email Sent — filled in by the notification automation
    '', // (unused)
    '', // (unused note column)
    story.payment_status === 'paid' ? 'paid' : '', // Z — סטטוס
    '', // AA — only used for rows upgraded from a preview (see findPreviewRow below)
  ];
}

const COL_CONTACT_EMAIL = 19; // T
const COL_STATUS = 25; // Z
const COL_PREVIEW_LINK = 26; // AA

function colLetter(index) {
  if (index < 26) return String.fromCharCode('A'.charCodeAt(0) + index);
  return 'A' + String.fromCharCode('A'.charCodeAt(0) + (index - 26));
}

// If this contact already has a free preview row (status "preview") in this sheet, upgrade
// that same row to "paid" instead of appending a brand new one for the same customer.
async function findPreviewRow(spreadsheetId, sheetName, accessToken, contactEmail) {
  if (!contactEmail) return null;
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
    if (email === contactEmail.toLowerCase() && status === 'preview') {
      return i + 2; // +2: header row + 1-indexing
    }
  }
  return null;
}

async function upgradeRowToPaid(spreadsheetId, sheetName, accessToken, rowNumber, storyLink) {
  const statusCol = colLetter(COL_STATUS);
  const data = [{ range: `${sheetName}!${statusCol}${rowNumber}`, values: [['paid']] }];
  // Only overwrite the link if the full story link is already known; otherwise leave the
  // existing preview link in place until an admin replaces it with the real one.
  if (storyLink) {
    const linkCol = colLetter(COL_PREVIEW_LINK);
    data.push({ range: `${sheetName}!${linkCol}${rowNumber}`, values: [[storyLink]] });
  }
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ valueInputOption: 'USER_ENTERED', data }),
    }
  );
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // entity automation sends { data: {...}, event: {...} }
    const storyData = body.data || body;
    if (!storyData) {
      console.log('[addStoryToSheet] No story data provided. Body keys:', Object.keys(body));
      return Response.json({ error: 'No story data provided' }, { status: 400 });
    }

    console.log('[addStoryToSheet] Story data received:', { child_name: storyData.child_name, event_type: body.event?.type, has_data: !!body.data });

    const lang = detectLanguage(storyData);
    const spreadsheetId = lang === 'he' ? SPREADSHEET_ID_HE : SPREADSHEET_ID_EN;
    const sheetName = lang === 'he' ? SHEET_NAME_HE : SHEET_NAME_EN;

    let tags = [];
    try {
      const email = storyData.contact_email;
      if (email) {
        const [customerTags, priorStories] = await Promise.all([
          base44.asServiceRole.entities.CustomerTag.filter({ email }),
          base44.asServiceRole.entities.Story.filter({ contact_email: email }),
        ]);
        const auto = computeAutoTagsForStories(priorStories.length ? priorStories : [storyData]);
        const manual = customerTags[0]?.tags || [];
        tags = Array.from(new Set([...manual, ...auto]));
      }
    } catch (e) {
      console.error('[addStoryToSheet] Tag lookup failed (non-fatal):', e.message);
    }

    const row = storyToRow(storyData, lang, storyData.contact_email || storyData.created_by || storyData.user_email, tags);

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

        // This customer already has a free preview row (status "preview") — upgrade it to "paid"
        // instead of appending a duplicate row for the same person.
        if (storyData.payment_status === 'paid') {
          const previewRow = await findPreviewRow(spreadsheetId, sheetName, accessToken, storyData.contact_email);
          if (previewRow) {
            await upgradeRowToPaid(spreadsheetId, sheetName, accessToken, previewRow, storyData.story_link);
            console.log('[addStoryToSheet] Upgraded preview row to paid:', { child_name: storyData.child_name, lang, row: previewRow });
            return Response.json({ success: true, lang, action: 'upgraded_preview_row', row: previewRow });
          }
        }

        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:append?valueInputOption=USER_ENTERED`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: [row] }),
          }
        );
        if (response.ok) {
          console.log('[addStoryToSheet] Success:', { child_name: storyData.child_name, lang, spreadsheetId, attempt });
          return Response.json({ success: true, lang });
        }
        const err = await response.text();
        console.error(`[addStoryToSheet] Sheets API error (attempt ${attempt}):`, response.status, err);
      } catch (e) {
        console.error(`[addStoryToSheet] Exception (attempt ${attempt}):`, e.message);
      }
      if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
    }

    console.error('[addStoryToSheet] FAILED after 3 attempts:', storyData.child_name);
    return Response.json({ error: 'Failed after 3 attempts' }, { status: 500 });
  } catch (error) {
    console.error('[addStoryToSheet] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});