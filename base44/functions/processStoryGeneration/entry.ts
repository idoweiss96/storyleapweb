import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

async function generateStoryWithAI(story, base44ServiceRole) {
  const settingMap = { space: 'חלל', forest: 'יער קסום', castle: 'ארמון', sports: 'אצטדיון הספורט', real_life: 'עולם אמיתי' };
  const challengeMap = { fears: 'פחדים', social_difficulty: 'קשיים חברתיים', changes: 'שינויים בחיים', emotional_regulation: 'ויסות רגשי', separation_anxiety: 'חרדת נטישה', self_confidence: 'ביטחון עצמי', sleep_issues: 'קשיי שינה' };
  const isHebrew = /[\u0590-\u05FF]/.test(story.child_name || '');
  const lang = isHebrew ? 'Hebrew' : 'English';

  const prompt = `You are a professional child therapist and storyteller. Write a personalized therapeutic story in ${lang} for a child.

Child details:
- Name: ${story.child_name}
- Age: ${story.child_age}
- Gender: ${story.gender}
- Story setting/world: ${settingMap[story.setting] || story.setting}
- Emotional challenge: ${challengeMap[story.challenge_type] || story.challenge_type}
${story.trigger_desc ? `- What triggers the challenge: ${story.trigger_desc}` : ''}
${story.reaction_type ? `- How the child typically reacts: ${story.reaction_type}` : ''}
${story.hobbies ? `- Child's hobbies and interests: ${story.hobbies}` : ''}

Requirements:
- Write a complete, engaging therapeutic story (800-1200 words)
- The child (${story.child_name}) is the hero of the story
- The story should naturally address their emotional challenge
- Include age-appropriate language for a ${story.child_age}-year-old
- The story should have a positive, empowering resolution
- Incorporate their interests/hobbies naturally
- Use the ${settingMap[story.setting] || story.setting} as the backdrop
- End with a clear moral/lesson about overcoming the challenge
- Write entirely in ${lang}`;

  const storyContent = await base44ServiceRole.integrations.Core.InvokeLLM({ prompt, model: 'gpt_5_4' });
  return storyContent;
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

async function sendStoryReadyEmail(email, childName, isHebrew) {
  if (!email || !RESEND_API_KEY) return;
  const subject = isHebrew
    ? `✨ הסיפור של ${childName} מוכן!`
    : `✨ ${childName}'s Story is Ready!`;
  const html = isHebrew
    ? `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h1 style="color:#1e293b;">הסיפור של ${childName} מוכן! ✨</h1>
        <p style="color:#475569;font-size:16px;">שלום! הסיפור המותאם אישית של ${childName} נוצר בהצלחה.</p>
        <p style="color:#475569;font-size:16px;">תוכלו לצפות בסיפור המלא באזור הסיפורים שלכם באתר.</p>
        <a href="https://storyleapai.com/MyStories" style="display:inline-block;background:#1e293b;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">לצפייה בסיפור →</a>
        <p style="color:#94a3b8;font-size:14px;margin-top:24px;">תודה שבחרתם StoryLeap 💛</p>
      </div>`
    : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
        <h1 style="color:#1e293b;">${childName}'s Story is Ready! ✨</h1>
        <p style="color:#475569;font-size:16px;">Hi there! ${childName}'s personalized story has been successfully created.</p>
        <p style="color:#475569;font-size:16px;">You can read the full story in your stories area on the website.</p>
        <a href="https://storyleapai.com/MyStories" style="display:inline-block;background:#1e293b;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">View Story →</a>
        <p style="color:#94a3b8;font-size:14px;margin-top:24px;">Thank you for choosing StoryLeap 💛</p>
      </div>`;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'StoryLeap AI <stories@storyleapai.com>', to: email, subject, html }),
  });
}

// Main handler: receives story_id and order_id, generates story, updates DB, sends emails, adds to sheet
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { story_id, order_id } = await req.json();
    if (!story_id) return Response.json({ error: 'story_id required' }, { status: 400 });

    const story = await base44.asServiceRole.entities.Story.get(story_id);
    if (!story) return Response.json({ error: 'Story not found' }, { status: 404 });

    const isHebrew = /[\u0590-\u05FF]/.test(story.child_name || '');

    // Mark as generating
    await base44.asServiceRole.entities.Story.update(story_id, { payment_status: 'story_generating' });

    // 1. Generate story content with AI
    const storyContent = await generateStoryWithAI(story, base44.asServiceRole);

    // 2. Save content + mark story ready
    await base44.asServiceRole.entities.Story.update(story_id, { content: storyContent, payment_status: 'story_ready' });

    // 3. Update order status to story_ready
    if (order_id) {
      await base44.asServiceRole.entities.Order.update(order_id, { status: 'story_ready' });
    }

    // 4. Add to Google Sheets
    try {
      const conn = await base44.asServiceRole.connectors.getConnection('googlesheets');
      await addStoryToSheet(story, conn.accessToken);
    } catch (_) {}

    // 5. Send "story ready" email
    if (story.contact_email) {
      await sendStoryReadyEmail(story.contact_email, story.child_name, isHebrew).catch(() => {});
    }

    // 6. Notify admin
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'storyleapai@gmail.com',
        subject: `✅ סיפור נוצר: ${story.child_name}`,
        body: `סיפור חדש נוצר בהצלחה ל-${story.child_name}!\nStory ID: ${story_id}${order_id ? `\nOrder ID: ${order_id}` : ''}`,
      });
    } catch (_) {}

    return Response.json({ success: true });
  } catch (error) {
    console.error('processStoryGeneration error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});