import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { sendGmailRawEmail } from '../../shared/gmailRawEmail.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { story_id, email, lang } = await req.json();
    if (!story_id || !email) return Response.json({ error: 'story_id and email required' }, { status: 400 });

    const story = await base44.asServiceRole.entities.KitaAlefStory.get(story_id);
    if (!story) return Response.json({ error: 'Story not found' }, { status: 404 });

    const isEn = lang === 'en';
    const effectiveLang = lang || story.lang || 'he';
    const resumeUrl = `https://storyleapai.com/KitaAlefStory?story_id=${story_id}&lang=${effectiveLang}`;

    const subject = isEn ? `Continue ${story.child_name}'s story` : `להמשיך את הסיפור של ${story.child_name}`;

    const body = isEn
      ? `<div dir="ltr" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.7;">
          <p style="font-size:16px;">Hi, here's your link to continue where you left off with ${story.child_name}'s story:</p>
          <p style="margin:24px 0;"><a href="${resumeUrl}" style="display:inline-block;background:linear-gradient(135deg,#FF6FB5,#4FC3E8);color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold;">Continue the story</a></p>
          <p style="font-size:14px;color:#64748b;">Thank you,<br/>The StoryLeap Team</p>
        </div>`
      : `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.7;">
          <p style="font-size:16px;">היי, הנה הקישור להמשיך מהמקום שבו הפסקתם עם הסיפור של ${story.child_name}:</p>
          <p style="margin:24px 0;"><a href="${resumeUrl}" style="display:inline-block;background:linear-gradient(135deg,#FF6FB5,#4FC3E8);color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold;">להמשיך את הסיפור</a></p>
          <p style="font-size:14px;color:#64748b;">תודה,<br/>צוות StoryLeap</p>
        </div>`;

    await sendGmailRawEmail(base44.asServiceRole, email, subject, body);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}