import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';


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

    // 4. Send "story ready" email (story_link may be set later by admin, send without it for now)
    if (story.contact_email) {
      await base44.asServiceRole.functions.invoke('sendStoryReadyEmail', {
        to: story.contact_email,
        childName: story.child_name,
        storyLink: story.story_link || '',
        isHebrew,
      }).catch(() => {});
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