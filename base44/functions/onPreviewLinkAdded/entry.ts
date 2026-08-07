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
    const payload = await req.json();
    const preview = payload.data;
    const previewId = payload.event?.entity_id;
    if (!preview || !preview.preview_link || !previewId) return Response.json({ skipped: true });
    if (!preview.contact_email) return Response.json({ skipped: true, reason: 'no_email' });

    const isHebrew = preview.lang ? preview.lang === 'he' : /[\u0590-\u05FF]/.test(preview.child_name || '');
    const childName = preview.child_name || '';
    const continueUrl = `https://storyleapai.com/CreateStory?previewId=${previewId}`;

    const subject = isHebrew ? `✨ התצוגה המקדימה של הסיפור של ${childName} מוכנה!` : `✨ ${childName}'s story preview is ready!`;

    const body = isHebrew
      ? `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.8;">
          <p style="font-size:18px;">היי ✨</p>
          <p style="font-size:18px;font-weight:bold;">שני העמודים הראשונים של הסיפור של ${childName} מוכנים לקריאה!</p>
          <p style="font-size:15px;">לחצו כאן כדי לדפדף בתצוגה המקדימה:</p>
          <p><a href="${preview.preview_link}" style="display:inline-block;background:#1e293b;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:16px;">לתצוגה המקדימה ←</a></p>
          <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:12px;">
            <p style="font-size:15px;font-weight:bold;margin:0 0 6px;">💬 מה חשבתם עד כה?</p>
            <p style="font-size:14px;color:#475569;margin:0;">נשמח מאוד אם תשיבו למייל הזה ותספרו לנו בקצרה מה הרושם הראשוני, זה עוזר לנו מאוד!</p>
          </div>
          <p style="font-size:15px;margin-top:24px;">רוצים לדעת איך הסיפור נגמר?</p>
          <p><a href="${continueUrl}" style="display:inline-block;background:#FDB654;color:#1e293b;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:16px;">להמשך הסיפור ←</a></p>
          <p style="font-size:15px;margin-top:24px;">תודה שבחרתם ב-StoryLeap 💛<br/><br/>צוות StoryLeap</p>
        </div>`
      : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.8;">
          <p style="font-size:18px;">Hi there ✨</p>
          <p style="font-size:18px;font-weight:bold;">The first two pages of ${childName}'s story are ready to read!</p>
          <p style="font-size:15px;">Click here to flip through the preview:</p>
          <p><a href="${preview.preview_link}" style="display:inline-block;background:#1e293b;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:16px;">View the preview →</a></p>
          <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:12px;">
            <p style="font-size:15px;font-weight:bold;margin:0 0 6px;">💬 What did you think so far?</p>
            <p style="font-size:14px;color:#475569;margin:0;">We'd love it if you replied to this email with your first impression, it really helps us!</p>
          </div>
          <p style="font-size:15px;margin-top:24px;">Want to find out how the story continues?</p>
          <p><a href="${continueUrl}" style="display:inline-block;background:#FDB654;color:#1e293b;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:16px;">Continue the story →</a></p>
          <p style="font-size:15px;margin-top:24px;">Thank you for choosing StoryLeap 💛<br/><br/>The StoryLeap Team</p>
        </div>`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const raw = buildRawMessage(preview.contact_email, subject, body);
    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });
    if (!gmailRes.ok) {
      const err = await gmailRes.text();
      return Response.json({ error: 'Gmail send failed', details: err }, { status: 500 });
    }

    await base44.asServiceRole.entities.StoryPreview.update(previewId, { status: 'ready' });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}