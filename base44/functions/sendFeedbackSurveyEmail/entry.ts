import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

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

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { to, childName, isHebrew, story_id, entity_type } = await req.json();
    if (!to || !story_id || !entity_type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lang = isHebrew ? 'he' : 'en';
    const surveyUrl = `https://storyleapai.com/FeedbackSurvey?id=${story_id}&type=${entity_type}&lang=${lang}&name=${encodeURIComponent(childName || '')}`;

    const subject = isHebrew
      ? `איך היה הסיפור של ${childName}? 🎉`
      : `How was ${childName}'s story? 🎉`;

    const body = isHebrew
      ? `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.8;">
          <p style="font-size:18px;font-weight:bold;">איך היה הסיפור? 🎉</p>
          <p style="font-size:15px;">נשמח לשמוע איך היה, זה עוזר לנו ליצור סיפורים טובים יותר לילדים נוספים.</p>
          <p><a href="${surveyUrl}" style="display:inline-block;background:#4A3FB5;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:16px;">למילוי המשוב (2 דקות) ←</a></p>
          <p style="font-size:14px;color:#64748b;margin-top:24px;">תודה,<br/>צוות StoryLeap</p>
        </div>`
      : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.8;">
          <p style="font-size:18px;font-weight:bold;">How was the story? 🎉</p>
          <p style="font-size:15px;">We'd love to hear how it went. It helps us create better stories for more children.</p>
          <p><a href="${surveyUrl}" style="display:inline-block;background:#4A3FB5;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:16px;">Share Feedback (2 min) →</a></p>
          <p style="font-size:14px;color:#64748b;margin-top:24px;">Thank you,<br/>The StoryLeap Team</p>
        </div>`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const raw = buildRawMessage(to, subject, body);
    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });
    if (!gmailRes.ok) {
      const err = await gmailRes.text();
      return Response.json({ error: 'Gmail send failed', details: err }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}