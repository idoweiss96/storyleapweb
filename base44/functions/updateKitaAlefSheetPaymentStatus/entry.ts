import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Called only after a KitaAlefStory's payment_status has actually flipped to
// 'paid' (i.e. after credits — themselves only granted following a verified
// PayPal capture — were successfully deducted). Finds the matching row in the
// Kita Alef Google Sheet by the internal story_id column (written by
// submitKitaAlefAnswers) and updates its "Payment Status" cell to "שולם"/"Paid".
// Never blocks or throws into the caller — this is best-effort visibility only.

const SPREADSHEET_ID_HE = '1tVuanXaYnEt50RA2ckzaFVRiLh6WR_OLS6cLLYzkhS8';
const SHEET_NAME_HE = 'כיתה א';
const SPREADSHEET_ID_EN = '1udSbvT_3BbVYkAMxB7KovDocCyF_Soz727FgSfI6gz4';
const SHEET_NAME_EN = 'Kindergarten';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { story_id, lang } = await req.json();
    if (!story_id) return Response.json({ error: 'story_id required' }, { status: 400 });

    const isEn = lang === 'en';
    const spreadsheetId = isEn ? SPREADSHEET_ID_EN : SPREADSHEET_ID_HE;
    const sheetName = isEn ? SHEET_NAME_EN : SHEET_NAME_HE;
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Column AI holds the internal story_id written at submission time.
    const colRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!AI:AI`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!colRes.ok) {
      console.error('[updateKitaAlefSheetPaymentStatus] Failed to read column:', await colRes.text());
      return Response.json({ found: false });
    }
    const colData = await colRes.json();
    const values = colData.values || [];
    const rowIndex = values.findIndex((row) => row[0] === story_id);
    if (rowIndex === -1) {
      console.log('[updateKitaAlefSheetPaymentStatus] Row not found for story_id:', story_id);
      return Response.json({ found: false });
    }

    const rowNumber = rowIndex + 1; // 1-based, AI:AI starts at row 1
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!AJ${rowNumber}:AJ${rowNumber}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [[isEn ? 'Paid' : 'שולם']] }),
      }
    );
    if (!updateRes.ok) {
      console.error('[updateKitaAlefSheetPaymentStatus] Failed to update cell:', await updateRes.text());
      return Response.json({ found: true, updated: false });
    }

    return Response.json({ found: true, updated: true });
  } catch (error) {
    console.error('[updateKitaAlefSheetPaymentStatus] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});