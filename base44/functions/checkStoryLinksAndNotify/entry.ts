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

function isMarkedSent(value) {
  const v = (value || '').toString().trim().toUpperCase();
  return v === 'TRUE' || v === '✔' || v === 'V' || v === 'YES';
}

async function markEmailSent(spreadsheetId, sheetName, rowNumber, accessToken) {
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!W${rowNumber}?valueInputOption=USER_ENTERED`,
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

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const [heResult, enResult] = await Promise.all([
      processSheet(base44, SPREADSHEET_ID_HE, SHEET_NAME_HE, true, accessToken),
      processSheet(base44, SPREADSHEET_ID_EN, SHEET_NAME_EN, false, accessToken),
    ]);

    return Response.json({ success: true, hebrew: heResult, english: enResult });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}