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
- End with a clear moral/lesson about overcoming the challenge
- Write entirely in ${lang}`;

  const storyContent = await base44ServiceRole.integrations.Core.InvokeLLM({ prompt, model: 'gpt_5_4' });
  return storyContent;
}

async function sendReadyEmail(email, childName) {
  if (!email || !RESEND_API_KEY) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'StoryLeap AI <stories@storyleapai.com>',
      to: email,
      subject: `✨ הסיפור של ${childName} מוכן!`,
      html: `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h1 style="color:#1e293b;">הסיפור של ${childName} מוכן! ✨</h1>
        <p style="color:#475569;font-size:16px;">הסיפור המותאם אישית נוצר בהצלחה.</p>
        <a href="https://storyleapai.com/MyStories" style="display:inline-block;background:#1e293b;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">לצפייה בסיפור →</a>
      </div>`,
    }),
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

    // Generate story async (don't block response)
    (async () => {
      try {
        const story = await base44.asServiceRole.entities.Story.get(story_id);
        const storyContent = await generateStoryWithAI(story, base44.asServiceRole);
        await base44.asServiceRole.entities.Story.update(story_id, { content: storyContent });
        if (story.contact_email) {
          await sendReadyEmail(story.contact_email, story.child_name);
        }
        // Notify admin
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'storyleapai@gmail.com',
          subject: `✅ סיפור נוצר: ${story.child_name}`,
          body: `סיפור חדש נוצר ל-${story.child_name}! Story ID: ${story_id}`,
        }).catch(() => {});
      } catch (err) {
        console.error('Story generation error:', err.message);
      }
    })();

    return Response.json({ success: true, credits_remaining: currentCredits - 20 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});