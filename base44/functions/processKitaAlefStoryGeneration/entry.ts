import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

function buildPrompt(answers, lang) {
  const isEn = lang === 'en';
  const name = answers.name || (isEn ? 'the child' : 'הילד/ה');
  const gender = answers.gender || '';

  const lines = [];
  lines.push(isEn
    ? `You are a professional child therapist and storyteller. Write a personalized, heartwarming story about getting ready for kindergarten (first grade) in English.`
    : `אתה מטפל בילדים וסופר מקצועי. כתוב סיפור מרגש ומותאם אישית על הכנה לכיתה א׳ בעברית.`);

  lines.push(isEn ? `\nChild details:` : `\nפרטי הילד/ה:`);
  lines.push(`- ${isEn ? 'Name' : 'שם'}: ${name}`);
  if (gender) lines.push(`- ${isEn ? 'Gender' : 'מגדר'}: ${gender}`);

  const field = (label, val) => {
    if (val && (Array.isArray(val) ? val.length > 0 : true)) {
      const display = Array.isArray(val) ? val.join(', ') : val;
      lines.push(`- ${label}: ${display}`);
    }
  };

  if (isEn) {
    field('Biggest strength', answers.strength);
    field('Feelings about starting school', answers.feelings_before);
    field('Things that seem scary', answers.scary_things);
    field('How separations feel', answers.separation_feelings);
    field('Favorite person to spend time with', answers.favorite_person);
    field('Friends from kindergarten also going', answers.gan_friends);
    field('Older sibling experience', answers.sibling_experience);
    field('Favorite activities', answers.activities);
    field('Hero/heroine they love', answers.hero);
    field('What helps when uncomfortable', answers.comfort);
    field('Most looking forward to', answers.looking_forward);
    field('One worry', answers.one_worry);
    field('Visited school already', answers.visited_school);
    field('Wish for self', answers.wish_self);
    field('What parent wishes', answers.wish_parent);
  } else {
    field('הכוח הכי גדול', answers.strength);
    field('איך מרגיש/ה לקראת כיתה א׳', answers.feelings_before);
    field('מה נראה מפחיד', answers.scary_things);
    field('איך מרגיש/ה בפרידות', answers.separation_feelings);
    field('האדם שהכי אוהב/ת לבלות איתו', answers.favorite_person);
    field('חברים מהגן שעולים לכיתה א׳', answers.gan_friends);
    field('חווית אח/ות גדול/ה', answers.sibling_experience);
    field('פעילויות אהובות', answers.activities);
    field('גיבור/ה שאוהב/ת', answers.hero);
    field('מה עוזר כשלא בנוח', answers.comfort);
    field('למה הכי מצפה/ה בכיתה א׳', answers.looking_forward);
    field('דאגה אחת', answers.one_worry);
    field('האם ביקר/ה בבית הספר', answers.visited_school);
    field('משאלה לעצמו/לעצמה', answers.wish_self);
    field('מה ההורה מאחל/ת', answers.wish_parent);
  }

  lines.push(isEn ? `\nRequirements:` : `\nדרישות:`);
  if (isEn) {
    lines.push('- Write a complete, engaging therapeutic story (800-1200 words)');
    lines.push(`- ${name} is the hero of the story`);
    lines.push('- The story should naturally address their feelings and worries about starting school');
    lines.push('- Use warm, age-appropriate language for a young child (age 5-6)');
    lines.push('- The story should have a positive, empowering resolution');
    lines.push('- Incorporate their interests, strengths, and favorite people naturally');
    lines.push('- End with a clear message of courage, self-belief, and excitement');
    lines.push('- Write entirely in English');
  } else {
    lines.push('- כתוב סיפור טיפולי שלם ומרתק (800-1200 מילים)');
    lines.push(`- ${name} הוא/היא הגיבור/ה של הסיפור`);
    lines.push('- הסיפור צריך להתמודד באופן טבעי עם הרגשות והדאגות שלהם לקראת כיתה א׳');
    lines.push('- השתמש בשפה חמה ומותאמת גיל לילד/ה צעיר/ה (גיל 5-6)');
    lines.push('- לסיפור צריכה להיות סיומת חיובית ומעצימה');
    lines.push('- שלב באופן טבעי את התחומי עניין, הכוחות והאנשים האהובים עליהם');
    lines.push('- סיים במסר ברור על אומץ, אמונה עצמית והתרגשות');
    lines.push('- כתוב את כל הסיפור בעברית');
  }

  return lines.join('\n');
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { story_id } = await req.json();
    if (!story_id) return Response.json({ error: 'story_id required' }, { status: 400 });

    const story = await base44.asServiceRole.entities.KitaAlefStory.get(story_id);
    if (!story) return Response.json({ error: 'Story not found' }, { status: 404 });

    const lang = story.lang || 'he';
    const answers = story.answers || {};

    // 1. Generate story content with AI
    const prompt = buildPrompt(answers, lang);
    const storyContent = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'gpt_5_4',
    });

    // 2. Save content to the record
    await base44.asServiceRole.entities.KitaAlefStory.update(story_id, { content: storyContent });

    // 3. Notify admin
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'storyleapai@gmail.com',
        subject: `✅ סיפור כיתה א׳ נוצר: ${story.child_name}`,
        body: `סיפור חדש לכיתה א׳ נוצר בהצלחה ל-${story.child_name}!\nStory ID: ${story_id}`,
      });
    } catch (_) {}

    return Response.json({ success: true });
  } catch (error) {
    console.error('processKitaAlefStoryGeneration error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}