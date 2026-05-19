import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
const PAYPAL_BASE = 'https://api-m.paypal.com';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const CREDITS_AMOUNT = 20;

async function getPaypalAccessToken() {
  const credentials = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

async function sendStoryInProgressEmail(email, childName, isHebrew) {
  if (!email || !RESEND_API_KEY) return;
  const subject = isHebrew
    ? 'הקסם מתחיל! אנחנו כבר עובדים על הסיפור שלך 📝✨'
    : "The magic begins! We're working on your story 📝✨";
  const html = isHebrew
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
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'StoryLeap AI <stories@storyleapai.com>', to: email, subject, html }),
  });
}

async function addStoryToSheet(story, accessToken) {
  const SPREADSHEET_ID_EN = '1-LZ-ai2LdJ4BoTTdSacDRl-L0LpcIEg5JrCKK6txLxg';
  const SPREADSHEET_ID_HE = '1yT2WdAlyjpp8gciT4iZYEL122FyrliTin3MEcTvvr20';
  const isHebrewText = /[\u0590-\u05FF]/.test(story.child_name || '');
  const lang = isHebrewText ? 'he' : 'en';
  const spreadsheetId = lang === 'he' ? SPREADSHEET_ID_HE : SPREADSHEET_ID_EN;

  const genderMap = lang === 'he' ? { boy: 'בן', girl: 'בת', other: 'אחר' } : { boy: 'Boy', girl: 'Girl', other: 'Other' };
  const settingMap = lang === 'he' ? { space: 'חלל', forest: 'יער קסום', castle: 'ארמון', sports: 'ספורט', real_life: 'חיים אמיתיים' } : { space: 'Space', forest: 'Enchanted Forest', castle: 'Castle', sports: 'Sports', real_life: 'Real Life' };
  const challengeMap = lang === 'he' ? { fears: 'פחדים', social_difficulty: 'קושי חברתי', changes: 'שינויים', emotional_regulation: 'ויסות רגשי', separation_anxiety: 'חרדת נטישה', self_confidence: 'ביטחון עצמי', sleep_issues: 'קשיי שינה' } : { fears: 'Fears', social_difficulty: 'Social Difficulty', changes: 'Changes', emotional_regulation: 'Emotional Regulation', separation_anxiety: 'Separation Anxiety', self_confidence: 'Self Confidence', sleep_issues: 'Sleep Issues' };
  const reactionMap = lang === 'he' ? { outburst: 'התפרצות', withdrawal: 'הסתגרות', attention_seeking: 'חיפוש תשומת לב', crying: 'בכי', aggression: 'תוקפנות', avoidance: 'הימנעות' } : { outburst: 'Outburst', withdrawal: 'Withdrawal', attention_seeking: 'Attention Seeking', crying: 'Crying', aggression: 'Aggression', avoidance: 'Avoidance' };

  const createdDate = story.created_date ? new Date(story.created_date).toLocaleDateString('he-IL') : '';
  const row = [
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

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] }),
    }
  );
}

async function processPendingStories(base44, userEmail, userCredits) {
  // Find all pending_payment stories for this user
  const pendingStories = await base44.asServiceRole.entities.Story.filter({
    created_by: userEmail,
    payment_status: 'pending_payment',
  });

  let remainingCredits = userCredits;
  let processed = 0;

  // Get Google Sheets access token
  let sheetsToken = null;
  try {
    const conn = await base44.asServiceRole.connectors.getConnection('googlesheets');
    sheetsToken = conn.accessToken;
  } catch (_) {}

  for (const story of pendingStories) {
    if (remainingCredits < 20) break;

    // Deduct 20 credits and mark story as paid
    remainingCredits -= 20;
    await base44.asServiceRole.entities.Story.update(story.id, { payment_status: 'paid' });

    // Add to Google Sheets
    if (sheetsToken) {
      try { await addStoryToSheet(story, sheetsToken); } catch (_) {}
    }

    // Send "in progress" email
    const isHebrewName = /[\u0590-\u05FF]/.test(story.child_name || '');
    if (story.contact_email) {
      try { await sendStoryInProgressEmail(story.contact_email, story.child_name, isHebrewName); } catch (_) {}
    }

    // Trigger async story generation
    base44.asServiceRole.functions.invoke('processStoryGeneration', { story_id: story.id }).catch(() => {});

    processed++;
  }

  return { processed, remainingCredits };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { paypal_order_id, credits, coupon } = await req.json();
    if (!paypal_order_id) return Response.json({ error: 'paypal_order_id required' }, { status: 400 });

    const creditsToAdd = credits || CREDITS_AMOUNT;

    if (!coupon) {
      // Capture payment with PayPal
      const accessToken = await getPaypalAccessToken();
      const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypal_order_id}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': `capture-credits-${paypal_order_id}`,
        },
      });

      const captureData = await captureRes.json();
      if (!captureRes.ok || captureData.status !== 'COMPLETED') {
        return Response.json({ error: 'Payment capture failed', details: captureData }, { status: 400 });
      }
    }

    // Add credits to user
    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const currentUser = users[0];
    if (!currentUser) return Response.json({ error: 'User not found' }, { status: 404 });

    const newCredits = (currentUser.credits || 0) + creditsToAdd;
    await base44.asServiceRole.entities.User.update(currentUser.id, { credits: newCredits });

    // Process any pending_payment stories automatically
    const { processed, remainingCredits } = await processPendingStories(base44, user.email, newCredits);

    // Save final credits after story deductions
    if (processed > 0) {
      await base44.asServiceRole.entities.User.update(currentUser.id, { credits: remainingCredits });
    }

    return Response.json({
      success: true,
      credits_added: creditsToAdd,
      new_total: remainingCredits,
      stories_activated: processed,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});