import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const SPREADSHEET_ID_HE = '1hEBop1uM-ldASUKGQWNFShCPlO5xZ2R7SwFOZ7EtN30';
const SHEET_NAME_HE = 'שאלון';
const SPREADSHEET_ID_EN = '1vDfEGbVfwplAgHTTYREauRxUgX-fxa5uJJZXenotZac';
const SHEET_NAME_EN = 'Questionnaire';
const RANGE = 'A2:W'; // skip header row

// Row layout (0-based), matching the headers already defined in the Questionnaire/שאלון sheets:
// 0 Timestamp, 1 Language, 2 Order ID, 3 User Email, 4 Price, 5 Currency, 6 Credits Used,
// 7 Child's Name, 8 Age, 9 Gender, 10 Child's Photo Link, 11 Parent Consent, 12 Parent's Photo Link,
// 13 Whose Photo, 14 Story World, 15 Emotional Challenge, 16 Trigger Description, 17 Child's Reaction,
// 18 What the Child Loves, 19 Contact Email, 20 Contact Phone, 21 Story Link, 22 Email Sent
const COL_CHILD_NAME = 7;
const COL_CONTACT_EMAIL = 19;
const COL_STORY_LINK = 21;
const COL_EMAIL_SENT = 22; // column W

// Kita Alef (Hebrew) / Kindergarten (English) sheets — these are a SEPARATE pair of sheets from the
// regular questionnaire above, and were previously not being polled at all, which is why story links
// entered there never triggered the "story is ready" email or updated the personal area.
const SPREADSHEET_ID_KITA_HE = '1tVuanXaYnEt50RA2ckzaFVRiLh6WR_OLS6cLLYzkhS8';
const SHEET_NAME_KITA_HE = 'כיתה א';
const SPREADSHEET_ID_KITA_EN = '1udSbvT_3BbVYkAMxB7KovDocCyF_Soz727FgSfI6gz4';
const SHEET_NAME_KITA_EN = 'Kindergarten';
const RANGE_KITA = 'A2:AI'; // skip header row
// Row layout (0-based) for the Kita Alef/Kindergarten sheets:
// 2 Child's Name, 30 Contact Email, 32 Story Link, 33 Email Sent
const COL_KITA_CHILD_NAME = 2;
const COL_KITA_STORY_LINK = 32;
const COL_KITA_EMAIL_SENT = 33; // column AH

function isMarkedSent(value) {
  const v = (value || '').toString().trim().toUpperCase();
  return v === 'TRUE' || v === '✔' || v === 'V' || v === 'YES';
}

function colLetter(index) {
  let n = index + 1;
  let letters = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return letters;
}

async function markEmailSent(spreadsheetId, sheetName, rowNumber, accessToken, colIndex = COL_EMAIL_SENT) {
  const col = colLetter(colIndex);
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!${col}${rowNumber}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [['TRUE']] }),
    }
  );
}

async function processSheet(base44, spreadsheetId, sheetName, isHebrew, accessToken) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!${RANGE}`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  const rows = data.values || [];

  let sent = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const storyLink = (row[COL_STORY_LINK] || '').trim();
    const alreadySent = isMarkedSent(row[COL_EMAIL_SENT]);

    // Only fire on the empty -> filled transition: a link is present and it hasn't been notified yet.
    if (!storyLink || alreadySent) continue;

    const contactEmail = (row[COL_CONTACT_EMAIL] || '').trim();
    const childName = (row[COL_CHILD_NAME] || '').trim();
    const rowNumber = i + 2; // +2: header row + 0-based index

    if (!contactEmail) {
      skipped++;
      continue;
    }

    await base44.asServiceRole.functions.invoke('sendStoryReadyEmail', {
      to: contactEmail,
      childName,
      storyLink,
      isHebrew,
    });

    await markEmailSent(spreadsheetId, sheetName, rowNumber, accessToken);

    // Also write the link back onto the matching Story record so it shows up
    // as ready in the parent's "My Stories" area, not just via email.
    try {
      const matches = await base44.asServiceRole.entities.Story.filter({ contact_email: contactEmail, child_name: childName });
      const target = matches.find(s => !s.story_link);
      if (target) {
        await base44.asServiceRole.entities.Story.update(target.id, { story_link: storyLink });
      }
    } catch (e) {
      console.error('[checkStoryLinksAndNotify] Failed to sync story_link to Story entity:', e.message);
    }

    sent++;
  }

  return { sent, skipped };
}

async function processKitaAlefSheet(base44, spreadsheetId, sheetName, accessToken, kitaStories) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!${RANGE_KITA}`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  const rows = data.values || [];

  let sent = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const storyLink = (row[COL_KITA_STORY_LINK] || '').trim();
    const alreadySent = isMarkedSent(row[COL_KITA_EMAIL_SENT]);

    // Only fire on the empty -> filled transition: a link is present and it hasn't been notified yet.
    if (!storyLink || alreadySent) continue;

    const childName = (row[COL_KITA_CHILD_NAME] || '').trim();
    const rowNumber = i + 2; // +2: header row + 0-based index

    if (!childName) {
      skipped++;
      continue;
    }

    // Match to the KitaAlefStory record and write the link there. Updating story_link on the entity
    // is what drives both the "story ready" email (via the onStoryLinkAdded entity automation) and
    // the "ready" status shown in the personal area — same field, one source of truth.
    // Names are compared trimmed: the sheet and the stored entity don't always agree on stray whitespace.
    try {
      const target = kitaStories.find(s => !s.story_link && (s.child_name || '').trim() === childName);
      if (target) {
        await base44.asServiceRole.entities.KitaAlefStory.update(target.id, { story_link: storyLink });
        target.story_link = storyLink; // avoid re-matching the same record twice within this run
        await markEmailSent(spreadsheetId, sheetName, rowNumber, accessToken, COL_KITA_EMAIL_SENT);
        sent++;
      } else {
        skipped++;
      }
    } catch (e) {
      console.error('[checkStoryLinksAndNotify] Failed to sync Kita Alef story_link:', e.message);
      skipped++;
    }
  }

  return { sent, skipped };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const kitaStories = await base44.asServiceRole.entities.KitaAlefStory.filter({}, '-created_date', 500);

    const [heResult, enResult, kitaHeResult, kitaEnResult] = await Promise.all([
      processSheet(base44, SPREADSHEET_ID_HE, SHEET_NAME_HE, true, accessToken),
      processSheet(base44, SPREADSHEET_ID_EN, SHEET_NAME_EN, false, accessToken),
      processKitaAlefSheet(base44, SPREADSHEET_ID_KITA_HE, SHEET_NAME_KITA_HE, accessToken, kitaStories),
      processKitaAlefSheet(base44, SPREADSHEET_ID_KITA_EN, SHEET_NAME_KITA_EN, accessToken, kitaStories),
    ]);

    return Response.json({ success: true, hebrew: heResult, english: enResult, kita_alef_hebrew: kitaHeResult, kita_alef_english: kitaEnResult });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}