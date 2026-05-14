import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const RECIPIENT_EMAIL = 'hello@storyleapai.com';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const story = body.data || {};

    const now = new Date();
    const dateStr = now.toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' });
    const timeStr = now.toLocaleTimeString('he-IL', { timeZone: 'Asia/Jerusalem' });

    const htmlBody = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;direction:rtl;">
        <div style="background:linear-gradient(135deg,#1e293b,#334155);padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">StoryLeap AI — הגשת סיפור חדש 📬</h1>
          <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;">${dateStr} ${timeStr}</p>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:24px 32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 12px;font-weight:bold;color:#374151;width:160px;">שם הילד/ה</td><td style="padding:8px 12px;color:#1f2937;">${story.child_name || ''}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">גיל</td><td style="padding:8px 12px;color:#1f2937;">${story.child_age || ''}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">מגדר</td><td style="padding:8px 12px;color:#1f2937;">${story.gender || ''}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">תפאורה</td><td style="padding:8px 12px;color:#1f2937;">${story.setting || ''}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">אתגר רגשי</td><td style="padding:8px 12px;color:#1f2937;">${story.challenge_type || ''}</td></tr>
            ${story.hobbies ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">תחביבים</td><td style="padding:8px 12px;color:#1f2937;">${story.hobbies}</td></tr>` : ''}
            ${story.trigger_desc ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">טריגר</td><td style="padding:8px 12px;color:#1f2937;">${story.trigger_desc}</td></tr>` : ''}
            ${story.reaction_type ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">תגובה</td><td style="padding:8px 12px;color:#1f2937;">${story.reaction_type}</td></tr>` : ''}
            ${story.contact_email ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">אימייל</td><td style="padding:8px 12px;color:#1f2937;">${story.contact_email}</td></tr>` : ''}
            ${story.contact_phone ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">טלפון</td><td style="padding:8px 12px;color:#1f2937;">${story.contact_phone}</td></tr>` : ''}
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
        subject: `[StoryLeap] הגשה חדשה — ${story.child_name || ''}`,
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