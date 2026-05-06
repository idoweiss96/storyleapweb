import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const RECIPIENT_EMAIL = 'hello@storyleapai.com';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      formType = 'טופס כללי',
      name = '',
      email = '',
      phone = '',
      message = '',
      childName = '',
      childAge = '',
      gender = '',
      setting = '',
      challengeType = '',
      hobbies = '',
      additionalFields = {},
    } = body;

    const now = new Date();
    const dateStr = now.toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' });
    const timeStr = now.toLocaleTimeString('he-IL', { timeZone: 'Asia/Jerusalem' });

    let fieldsHtml = `
      <tr><td style="padding:8px 12px;font-weight:bold;color:#374151;width:160px;">סוג הטופס</td><td style="padding:8px 12px;color:#1f2937;">${formType}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">תאריך ושעה</td><td style="padding:8px 12px;color:#1f2937;">${dateStr} ${timeStr}</td></tr>
    `;

    if (name) fieldsHtml += `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">שם</td><td style="padding:8px 12px;color:#1f2937;">${name}</td></tr>`;
    if (email) fieldsHtml += `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">אימייל</td><td style="padding:8px 12px;color:#1f2937;">${email}</td></tr>`;
    if (phone) fieldsHtml += `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">טלפון</td><td style="padding:8px 12px;color:#1f2937;">${phone}</td></tr>`;
    if (childName) fieldsHtml += `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">שם הילד/ה</td><td style="padding:8px 12px;color:#1f2937;">${childName}</td></tr>`;
    if (childAge) fieldsHtml += `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">גיל</td><td style="padding:8px 12px;color:#1f2937;">${childAge}</td></tr>`;
    if (gender) fieldsHtml += `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">מגדר</td><td style="padding:8px 12px;color:#1f2937;">${gender}</td></tr>`;
    if (setting) fieldsHtml += `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">תפאורה</td><td style="padding:8px 12px;color:#1f2937;">${setting}</td></tr>`;
    if (challengeType) fieldsHtml += `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">אתגר רגשי</td><td style="padding:8px 12px;color:#1f2937;">${challengeType}</td></tr>`;
    if (hobbies) fieldsHtml += `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">תחביבים</td><td style="padding:8px 12px;color:#1f2937;">${hobbies}</td></tr>`;
    if (message) fieldsHtml += `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">הודעה</td><td style="padding:8px 12px;color:#1f2937;">${message}</td></tr>`;

    for (const [key, value] of Object.entries(additionalFields)) {
      if (value) fieldsHtml += `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">${key}</td><td style="padding:8px 12px;color:#1f2937;">${value}</td></tr>`;
    }

    const htmlBody = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;direction:rtl;">
        <div style="background:linear-gradient(135deg,#1e293b,#334155);padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">StoryLeap AI — הגשה חדשה 📬</h1>
          <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;">${formType}</p>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:24px 32px;">
          <table style="width:100%;border-collapse:collapse;">
            ${fieldsHtml}
          </table>
        </div>
        <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:16px;">StoryLeap AI • hello@storyleapai.com</p>
      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'StoryLeap AI <onboarding@resend.dev>',
        to: [RECIPIENT_EMAIL],
        subject: `[StoryLeap] ${formType} — ${name || email}`,
        html: htmlBody,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      return Response.json({ error: err }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});