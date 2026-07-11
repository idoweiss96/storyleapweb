import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SHEET_NAME = 'תשובות שאלון כיתה א';

const HEADERS = [
  'תאריך',
  'אימייל משתמש',
  // עמוד 1 - מי אתה/את?
  'שם הילד/ה',
  'מגדר',
  'הכוח הכי גדול שלך',
  'הורה - מה הכוח שאתם רואים בו/בה',
  'יש תמונה?',
  // עמוד 2 - רגשות
  'איך מרגישים לקראת כיתה א',
  'הורה - איזה רגש מגיע אליכם',
  'מה נראה קצת מפחיד',
  'איך מרגישים בפרידות',
  'הורה - מילה/משפט שיכולים לעזור',
  // עמוד 3 - מי חשוב לך?
  'האדם שהכי אוהב/ת לבלות איתו/ה',
  'הורה - מה אותו/ה אדם חושב על כיתה א׳',
  'חברים מהגן שגם עולים לכיתה א',
  'אח/ות גדול/ה - מה אמר/ה',
  // עמוד 4 - מה אוהבים?
  'מה הכי אוהבים לעשות',
  'גיבור/ה שהכי אוהב/ת',
  'כשקצת לא בנוח - מה הכי עוזר',
  // עמוד 5 - כיתה א׳
  'מה הכי מחכים לו/לה בכיתה א',
  'הורה - ממה הייתם מתרגשים בגיל הזה',
  'איזה דבר אחד קצת מדאיג',
  'ביקרתם כבר בבית הספר',
  // עמוד 6 - משאלות
  'מה אתה/את מאחל/ת לעצמך',
  'הורה - משאלה נוספת',
  'מה לדעתך ההורה שלך מאחל לך',
  'הורה - הרגע לומר לו/ה ישירות',
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Create a new spreadsheet
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        properties: { title: 'StoryLeap - שאלון כיתה א' },
        sheets: [{ properties: { title: SHEET_NAME } }],
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      return Response.json({ error: err }, { status: 500 });
    }

    const sheet = await createRes.json();
    const spreadsheetId = sheet.spreadsheetId;
    const spreadsheetUrl = sheet.spreadsheetUrl;

    // Write headers
    const writeRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(SHEET_NAME)}!A1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [HEADERS] }),
      }
    );

    if (!writeRes.ok) {
      const err = await writeRes.text();
      return Response.json({ error: err, spreadsheetId, spreadsheetUrl }, { status: 500 });
    }

    // Make the sheet shared (anyone with link can view)
    await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}/permissions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'writer', type: 'anyone' }),
    });

    return Response.json({
      success: true,
      spreadsheetId,
      spreadsheetUrl,
      headersCount: HEADERS.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});