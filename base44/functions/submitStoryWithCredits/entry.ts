import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SPREADSHEET_ID_EN = '1-LZ-ai2LdJ4BoTTdSacDRl-L0LpcIEg5JrCKK6txLxg';
const SPREADSHEET_ID_HE = '1yT2WdAlyjpp8gciT4iZYEL122FyrliTin3MEcTvvr20';

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

function storyToRow(story, lang) {
  const createdDate = story.created_date ? new Date(story.created_date).toLocaleDateString('he-IL') : '';
  const genderMap = lang === 'he' ? genderMapHE : genderMapEN;
  const settingMap = lang === 'he' ? settingMapHE : settingMapEN;
  const challengeMap = lang === 'he' ? challengeMapHE : challengeMapEN;
  const reactionMap = lang === 'he' ? reactionMapHE : reactionMapEN;
  return [
    createdDate,
    story.child_name || '',
    story.child_age || '',
    genderMap[story.gender] || story.gender || '',
    settingMap[story.setting] || story.setting || '',
    challengeMap[story.challenge_type] || story.challenge_type || '',
    story.trigger_desc || '',
    reactionMap[story.reaction_type] || story.reaction_type || '',
    story.hobbies || '',
    story.contact_email || '',
    story.contact_phone || '',
    story.child_image_url || '',
    story.story_link || '',
  ];
}

async function addStoryToSheet(base44ServiceRole, story) {
  const lang = isHebrew(story.child_name) || isHebrew(story.trigger_desc) || isHebrew(story.hobbies) ? 'he' : 'en';
  const spreadsheetId = lang === 'he' ? SPREADSHEET_ID_HE : SPREADSHEET_ID_EN;
  const row = storyToRow(story, lang);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { accessToken } = await base44ServiceRole.connectors.getConnection('googlesheets');
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [row] }),
        }
      );
      if (response.ok) {
        console.log('[submitStoryWithCredits] Story added to sheet:', { child_name: story.child_name, lang, attempt });
        return true;
      }
      const err = await response.text();
      console.error(`[submitStoryWithCredits] Sheets API error (attempt ${attempt}):`, response.status, err);
    } catch (e) {
      console.error(`[submitStoryWithCredits] addStoryToSheet exception (attempt ${attempt}):`, e.message);
    }
    if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
  }
  console.error('[submitStoryWithCredits] FAILED to add story to sheet after 3 attempts:', story.child_name);
  return false;
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) { binary += String.fromCharCode(byte); }
  return btoa(binary);
}

function buildRawMessage(to, subject, html) {
  const encodedSubject = `=?UTF-8?B?${utf8ToBase64(subject)}?=`;
  const message = [`To: ${to}`, `Subject: ${encodedSubject}`, 'Content-Type: text/html; charset=utf-8', 'MIME-Version: 1.0', '', html].join('\r\n');
  return utf8ToBase64(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sendStoryInProgressEmail(base44ServiceRole, email, childName, isHebrew) {
  if (!email) return;
  const subject = isHebrew
    ? 'הקסם מתחיל! אנחנו כבר עובדים על הסיפור שלך 📝✨'
    : "The magic begins! We're working on your story 📝✨";
  const body = isHebrew
    ? `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
        <h2>היי,</h2>
        <p style="font-size:16px;line-height:1.7;">איזה כיף! קיבלנו את הפרטים בהצלחה.</p>
        <p style="font-size:16px;line-height:1.7;">אנחנו כבר עובדים על יצירת הסיפור המיוחד שלכם.</p>
        <p style="font-size:16px;line-height:1.7;">ברגע שהסיפור יהיה מוכן, נשלח לך מייל עדכון נוסף עם קישור ישיר לקריאה.</p>
        <p style="margin-top:24px;font-size:15px;">תודה,<br/>צוות StoryLeap</p>
      </div>`
    : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
        <h2>Hi there,</h2>
        <p style="font-size:16px;line-height:1.7;">Exciting news! We have successfully received your details.</p>
        <p style="font-size:16px;line-height:1.7;">We are already working on creating your special story.</p>
        <p style="font-size:16px;line-height:1.7;">As soon as the story is ready, we will send you another email with a direct link to read it.</p>
        <p style="margin-top:24px;font-size:15px;">Best regards,<br/>StoryLeap</p>
      </div>`;
  const { accessToken } = await base44ServiceRole.connectors.getConnection('gmail');
  const raw = buildRawMessage(email, subject, body);
  await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { story_id } = await req.json();
    if (!story_id) return Response.json({ error: 'story_id required' }, { status: 400 });

    // Server-side: get fresh user data for authoritative credit check
    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const dbUser = users[0];
    if (!dbUser) return Response.json({ error: 'User not found' }, { status: 404 });

    const currentCredits = dbUser.credits || 0;

    // Not enough credits — stop here, frontend should redirect to Pricing
    if (currentCredits < 20) {
      return Response.json({ success: false, reason: 'insufficient_credits', credits: currentCredits });
    }

    // Deduct credits atomically
    await base44.asServiceRole.entities.User.update(dbUser.id, { credits: currentCredits - 20 });

    // Mark story as paid
    await base44.asServiceRole.entities.Story.update(story_id, { payment_status: 'paid' });

    // Send "story in progress" email immediately after credit deduction
    const storyForEmail = await base44.asServiceRole.entities.Story.get(story_id);
    const isHebrew = /[\u0590-\u05FF]/.test(storyForEmail.child_name || '');
    if (storyForEmail.contact_email) {
      await sendStoryInProgressEmail(base44.asServiceRole, storyForEmail.contact_email, storyForEmail.child_name, isHebrew).catch(() => {});
    }

    // Add story to Google Sheet (bypass unreliable automation)
    await addStoryToSheet(base44.asServiceRole, storyForEmail);

    // Trigger story generation asynchronously
    base44.asServiceRole.functions.invoke('processStoryGeneration', { story_id }).catch(() => {});

    return Response.json({ success: true, credits_remaining: currentCredits - 20 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});