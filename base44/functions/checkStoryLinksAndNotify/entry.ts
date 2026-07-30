import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const SPREADSHEET_ID_HE = '1vOXZ0bVjICeSzCjXUQ2DXby6OjQtJrYcpTxORfbJ1vo';
const SPREADSHEET_ID_EN = '153bOGbdmfaPj1_W1P6crJ9zoCYo_CBhXkT4oRTiaxUc';
const RANGE = 'A2:Q'; // skip header row
const SHEET_NAME = 'Sheet1';

// Row layout (0-based), written by addStoryToSheet + the Story Link / Email Sent columns appended after it:
// 0 created_date, 1 user_email, 2 child_name, 3 age, 4 gender, 5 child_image_url, 6 setting,
// 7 challenge, 8 custom_challenge, 9 trigger_desc, 10 reaction, 11 hobbies, 12 contact_email,
// 13 parent_image_url, 14 parent_relation, 15 story_link, 16 email_sent
const COL_CHILD_NAME = 2;
const COL_CONTACT_EMAIL = 12;
const COL_STORY_LINK = 15;
const COL_EMAIL_SENT = 16;

function isMarkedSent(value) {
  const v = (value || '').toString().trim().toUpperCase();
  return v === 'TRUE' || v === '✔' || v === 'V' || v === 'YES';
}

async function markEmailSent(spreadsheetId, rowNumber, accessToken) {
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${SHEET_NAME}!Q${rowNumber}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [['TRUE']] }),
    }
  );
}

async function processSheet(base44, spreadsheetId, isHebrew, accessToken) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${SHEET_NAME}!${RANGE}`,
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

    await markEmailSent(spreadsheetId, rowNumber, accessToken);
    sent++;
  }

  return { sent, skipped };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    const [heResult, enResult] = await Promise.all([
      processSheet(base44, SPREADSHEET_ID_HE, true, accessToken),
      processSheet(base44, SPREADSHEET_ID_EN, false, accessToken),
    ]);

    return Response.json({ success: true, hebrew: heResult, english: enResult });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}