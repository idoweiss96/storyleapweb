import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SPREADSHEET_ID = '1rATg8VqjteU8MUwxckXv4pUprUfUGHGleMbhNuKBmKk';
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
  'תמונות משפחה',
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

    const spreadsheetId = SPREADSHEET_ID;
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;

    // Write headers to existing sheet
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