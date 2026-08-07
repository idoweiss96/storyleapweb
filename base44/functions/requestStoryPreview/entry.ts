import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

async function generatePreviewContent(story, base44ServiceRole) {
  const settingMap = { space: 'Space', forest: 'Magical Forest', castle: 'Castle', sports: 'Sports', real_life: 'Real Life' };
  const challengeMap = { fears: 'Fears', social_difficulty: 'Social Difficulty', changes: 'Changes', emotional_regulation: 'Emotional Regulation', separation_anxiety: 'Separation Anxiety', self_confidence: 'Self Confidence', sleep_issues: 'Sleep Issues', other: story.custom_challenge || 'a personal challenge' };
  const isHebrew = story.lang === 'he' || /[\u0590-\u05FF]/.test(story.child_name || '');
  const lang = isHebrew ? 'Hebrew' : 'English';

  const prompt = `You are a professional child therapist and storyteller. Write ONLY the first two pages (roughly 250-350 words total) of a personalized therapeutic story in ${lang} for a child. Do NOT resolve the story or its emotional challenge, end on a gentle hook that makes the reader want to continue.

Child details:
- Name: ${story.child_name}
- Age: ${story.child_age || ''}
- Gender: ${story.gender || ''}
- Story setting/world: ${settingMap[story.setting] || story.setting || ''}
- Emotional challenge: ${challengeMap[story.challenge_type] || story.challenge_type || ''}
${story.trigger_desc ? `- What triggers the challenge: ${story.trigger_desc}` : ''}
${story.hobbies ? `- Child's hobbies and interests: ${story.hobbies}` : ''}

Requirements:
- The child (${story.child_name}) is the hero of the story
- Age-appropriate language for a ${story.child_age || ''}-year-old
- Introduce the setting, the child, and the beginning of the emotional challenge
- Incorporate their interests/hobbies naturally
- Write entirely in ${lang}
- Stop after two short pages, do not resolve the challenge`;

  return await base44ServiceRole.integrations.Core.InvokeLLM({ prompt });
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const {
      childName, childAge, gender, childImageUrl, parentImageUrl, parentRelation,
      setting, challengeType, customChallenge, triggerDesc, reactionType, hobbies,
      contactEmail, contactPhone, lang,
    } = body;

    if (!childName || !contactEmail) {
      return Response.json({ success: false, error: 'childName and contactEmail are required' }, { status: 400 });
    }

    const normalizedEmail = contactEmail.trim().toLowerCase();

    // One free preview per email
    const existing = await base44.asServiceRole.entities.StoryPreview.filter({ contact_email: normalizedEmail });
    if (existing.length > 0) {
      const latest = existing[0];
      return Response.json({ success: false, reason: 'already_used', status: latest.status, preview_link: latest.preview_link || null });
    }

    const storyForGen = { child_name: childName, child_age: childAge, gender, setting, challenge_type: challengeType, custom_challenge: customChallenge, trigger_desc: triggerDesc, hobbies, lang };
    const content = await generatePreviewContent(storyForGen, base44.asServiceRole);

    const created = await base44.asServiceRole.entities.StoryPreview.create({
      child_name: childName,
      child_age: childAge ? parseInt(childAge) : null,
      gender: gender || null,
      child_image_url: childImageUrl || null,
      parent_image_url: parentImageUrl || null,
      parent_relation: parentRelation || null,
      setting: setting || null,
      challenge_type: challengeType || null,
      custom_challenge: customChallenge || null,
      trigger_desc: triggerDesc || null,
      reaction_type: reactionType || null,
      hobbies: hobbies || null,
      contact_email: normalizedEmail,
      contact_phone: contactPhone || null,
      content,
      status: 'requested',
      lang: lang || null,
    });

    return Response.json({ success: true, preview_id: created.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}