import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function buildRawMessage(to, subject, html) {
  const encodedSubject = `=?UTF-8?B?${utf8ToBase64(subject)}?=`;
  const message = [
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    html
  ].join('\r\n');
  return utf8ToBase64(message)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export default async function(req) {
  try {
    const body = await req.json();
    const story = body.data || {};

    const { accessToken } = await createClientFromRequest(req).asServiceRole.connectors.getConnection('gmail');

    // Resolve the connected Gmail account's own address so we can notify it.
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!profileRes.ok) {
      const err = await profileRes.text();
      return Response.json({ error: 'Failed to resolve Gmail account', details: err }, { status: 500 });
    }
    const profile = await profileRes.json();
    const to = profile.email;
    if (!to) return Response.json({ error: 'No Gmail address found' }, { status: 500 });

    const now = new Date();
    const dateStr = now.toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' });
    const timeStr = now.toLocaleTimeString('he-IL', { timeZone: 'Asia/Jerusalem' });
    const paymentLabel = story.payment_status === 'paid' ? 'שולם ✅' : 'ממתין לתשלום ⏳';

    const htmlBody = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;direction:rtl;">
        <div style="background:linear-gradient(135deg,#1e293b,#334155);padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">StoryLeap - הרשמה חדשה לכיתה א׳ 📬</h1>
          <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;">${dateStr} ${timeStr}</p>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:24px 32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 12px;font-weight:bold;color:#374151;width:160px;">שם הילד/ה</td><td style="padding:8px 12px;color:#1f2937;">${story.child_name || ''}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">מגדר</td><td style="padding:8px 12px;color:#1f2937;">${story.gender || ''}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">סטטוס תשלום</td><td style="padding:8px 12px;color:#1f2937;">${paymentLabel}</td></tr>
            ${story.contact_email ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">אימייל</td><td style="padding:8px 12px;color:#1f2937;">${story.contact_email}</td></tr>` : ''}
            ${story.contact_phone ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">טלפון</td><td style="padding:8px 12px;color:#1f2937;">${story.contact_phone}</td></tr>` : ''}
          </table>
        </div>
        <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">StoryLeap - הודעה אוטומטית</p>
      </div>
    `;

    const raw = buildRawMessage(to, `[StoryLeap] הרשמה חדשה לכיתה א׳ - ${story.child_name || ''} (${paymentLabel})`, htmlBody);

    const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!sendRes.ok) {
      const err = await sendRes.text();
      return Response.json({ error: 'Gmail send failed', details: err }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}