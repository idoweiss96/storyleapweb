import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SPREADSHEET_ID = '1R4BcLPgr5moYJlVOnYmBOdtpcYJCWkbsTfYT6TYDkJM';
const SHEET_NAME = 'Kita Alef Answers';

const HEADERS = [
  'Date',
  'User Email',
  // Page 1 - Who are you?
  "Child's Name",
  'Gender',
  'Biggest Strength',
  'Parent - Strength you see in them',
  'Has Photo?',
  // Page 2 - Feelings
  'Feelings about starting 1st grade',
  'Parent - What feeling comes up for you',
  'What seems a little scary',
  'How separations feel',
  'Parent - Word/sentence that could help',
  // Page 3 - Who matters to you?
  'Person they love spending time with most',
  'Parent - What that person thinks about 1st grade',
  'Friends from kindergarten also going to 1st grade',
  'Older sibling - What they said',
  'Family Photos',
  // Page 4 - What do you love?
  'What they love doing most',
  'Hero/heroine they love',
  'When uncomfortable - What helps most',
  // Page 5 - 1st Grade
  'Most looking forward to in 1st grade',
  'Parent - What you would have been excited about',
  'One thing that is a bit worrying',
  'Visited the school yet',
  // Page 6 - Wishes
  'What they wish for themselves',
  'Parent - Additional wish',
  'What they think their parent wishes for them',
  'Parent - The moment to tell them directly',
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Add a new sheet/tab to the existing spreadsheet
    const addSheetRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{ addSheet: { properties: { title: SHEET_NAME } } }],
        }),
      }
    );

    // If the sheet already exists, that's fine — continue
    if (!addSheetRes.ok) {
      const errText = await addSheetRes.text();
      if (!errText.includes('already exists')) {
        return Response.json({ error: errText }, { status: 500 });
      }
    }

    // Write headers
    const writeRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}!A1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [HEADERS] }),
      }
    );

    if (!writeRes.ok) {
      const err = await writeRes.text();
      return Response.json({ error: err }, { status: 500 });
    }

    // Make the sheet shared (anyone with link can edit)
    await fetch(`https://www.googleapis.com/drive/v3/files/${SPREADSHEET_ID}/permissions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'writer', type: 'anyone' }),
    });

    return Response.json({
      success: true,
      spreadsheetId: SPREADSHEET_ID,
      sheetName: SHEET_NAME,
      headersCount: HEADERS.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});