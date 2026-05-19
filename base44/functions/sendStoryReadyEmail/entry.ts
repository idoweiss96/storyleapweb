import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { to, childName, isHebrew } = await req.json();
    if (!to || !RESEND_API_KEY) return Response.json({ error: 'Missing required fields' }, { status: 400 });

    const subject = isHebrew
      ? `✨ הסיפור של ${childName} מוכן!`
      : `✨ ${childName}'s Story is Ready!`;

    const html = isHebrew
      ? `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h1 style="color:#1e293b;">הסיפור של ${childName} מוכן! ✨</h1>
          <p style="color:#475569;font-size:16px;">שלום! הסיפור המותאם אישית של ${childName} נוצר בהצלחה.</p>
          <p style="color:#475569;font-size:16px;">תוכלו לצפות בסיפור המלא באזור הסיפורים שלכם באתר.</p>
          <a href="https://storyleapai.com/MyStories" style="display:inline-block;background:#1e293b;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">לצפייה בסיפור →</a>
          <p style="color:#94a3b8;font-size:14px;margin-top:24px;">תודה שבחרתם StoryLeap 💛</p>
        </div>`
      : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
          <h1 style="color:#1e293b;">${childName}'s Story is Ready! ✨</h1>
          <p style="color:#475569;font-size:16px;">Hi there! ${childName}'s personalized story has been successfully created.</p>
          <a href="https://storyleapai.com/MyStories" style="display:inline-block;background:#1e293b;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">View Story →</a>
          <p style="color:#94a3b8;font-size:14px;margin-top:24px;">Thank you for choosing StoryLeap 💛</p>
        </div>`;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'StoryLeap AI <stories@storyleapai.com>', to, subject, html }),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});