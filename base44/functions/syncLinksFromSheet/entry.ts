import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SPREADSHEET_ID_EN = '1-LZ-ai2LdJ4BoTTdSacDRl-L0LpcIEg5JrCKK6txLxg';
const SPREADSHEET_ID_HE = '1yT2WdAlyjpp8gciT4iZYEL122FyrliTin3MEcTvvr20';
const SHEET_NAME = 'A:M';

// Column indices (0-based): Date=0, Name=1, Age=2, ..., ImageLink=11, StoryLink=12
const COL_NAME = 1;
const COL_STORY_LINK = 12;

async function getSheetRows(spreadsheetId, accessToken) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${SHEET_NAME}`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  // Skip header row
  return (data.values || []).slice(1);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Fetch all rows from both sheets
    const [heRows, enRows] = await Promise.all([
      getSheetRows(SPREADSHEET_ID_HE, accessToken),
      getSheetRows(SPREADSHEET_ID_EN, accessToken),
    ]);

    // Fetch all stories from DB
    const stories = await base44.asServiceRole.entities.Story.list('-created_date', 500);

    let updated = 0;

    // Build a map: childName (lowercase) -> rows with story_link
    const sheetLinks = {};
    for (const row of [...heRows, ...enRows]) {
      const name = (row[COL_NAME] || '').trim().toLowerCase();
      const link = (row[COL_STORY_LINK] || '').trim();
      if (name && link) {
        sheetLinks[name] = link;
      }
    }

    // Update stories that have a link in the sheet but not in DB
    for (const story of stories) {
      const fields = (story.data && typeof story.data === 'object') ? story.data : story;
      const name = (fields.child_name || '').trim().toLowerCase();
      const currentLink = fields.story_link || '';
      const sheetLink = sheetLinks[name];

      if (sheetLink && sheetLink !== currentLink) {
        await base44.asServiceRole.entities.Story.update(story.id, { story_link: sheetLink });
        updated++;
        // Send email notification to customer
        const email = fields.contact_email || '';
        const childName = fields.child_name || '';
        if (email) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: email,
            subject: `${childName}'s Story is Ready! ✨`,
            body: `Hi there! ✨<br><br>${childName} personalized story is ready.<br><br>You can read it here: ${sheetLink}<br><br>Please open this in a landscape mode.<br><br>Thanks for choosing StoryLeap 💛<br><br>The StoryLeap Team`
          });
        }
      }
    }

    return Response.json({ success: true, updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});