import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { to, childName, storyLink, isHebrew } = await req.json();
    if (!to) return Response.json({ error: 'Missing required fields' }, { status: 400 });

    const subject = isHebrew
      ? `✨ הסיפור האישי של ${childName} מוכן!`
      : `✨ ${childName}'s personalized story is ready!`;

    const linkSection = storyLink
      ? (isHebrew
          ? `<p style="font-size:15px;font-weight:bold;">לקריאת הסיפור:</p><p><a href="${storyLink}" style="display:inline-block;background:#1e293b;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:16px;">לקריאת הסיפור ←</a></p><p style="font-size:14px;color:#64748b;">מומלץ לפתוח את הסיפור במצב אופקי 📖</p>`
          : `<p style="font-size:15px;font-weight:bold;">Read the story here:</p><p><a href="${storyLink}" style="display:inline-block;background:#1e293b;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:16px;">Read the story here →</a></p><p style="font-size:14px;color:#64748b;">For the best experience, please open the story in landscape mode 📖</p>`)
      : '';

    const body = isHebrew
      ? `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.8;">
          <p style="font-size:18px;">היי ✨</p>
          <p style="font-size:18px;font-weight:bold;">הסיפור האישי של ${childName} מוכן 💛</p>

          <p style="font-size:15px;">🤍 אחרי הקריאה, אפשר לעצור רגע יחד ולפתוח בשיחה קטנה ונעימה.<br/>
          לא צריך לשאול את כל השאלות, לפעמים גם שאלה אחת מספיקה.</p>

          <p style="font-size:15px;font-weight:bold;">אפשר לשאול:</p>
          <ul style="font-size:15px;padding-right:20px;">
            <li>איזה חלק הכי אהבת?</li>
            <li>היה רגע שהרגיש לך ממש מוכר?</li>
            <li>איזו תמונה או רגע הכי אהבת?</li>
            <li>מה הרגשת בזמן שהקראנו את הסיפור?</li>
            <li>יש משהו שאתה רוצה שנעשה יחד בפעם הבאה?</li>
          </ul>

          <p style="font-size:15px;font-weight:bold;">חשוב לזכור:</p>
          <p style="font-size:15px;">לא חייבים לדבר על הכול אחרי הקריאה, ואם הילד לא משתף זה בסדר גמור.<br/>
          לפעמים עצם ההקשבה לסיפור כבר עושה עבודה רגשית משמעותית.<br/>
          נסו לא למהר לפתור או להסביר, אלא פשוט להיות יחד בתוך הרגש גם אם הוא לא נעים.<br/>
          המטרה היא חיבור וביטחון רגשי, לא "שיחה טיפולית".</p>

          <p style="font-size:15px;font-weight:bold;">משפטים קטנים שיכולים לעזור במהלך השיחה:</p>
          <ul style="font-size:15px;padding-right:20px;">
            <li>"אנחנו יכולים להבין למה זה הרגיש ככה."</li>
            <li>"זה בטח היה רגע לא פשוט."</li>
            <li>"אהבנו את איך שהתמודדת עם זה."</li>
            <li>"גם כשקשה, אנחנו יחד איתך."</li>
            <li>"מותר להרגיש ככה."</li>
          </ul>

          ${linkSection}

          <p style="font-size:15px;margin-top:24px;">תודה שבחרתם ב-StoryLeap 💛<br/><br/>צוות StoryLeap</p>
        </div>`
      : `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.8;">
          <p style="font-size:18px;">Hi there ✨</p>
          <p style="font-size:18px;font-weight:bold;">${childName}'s personalized story is ready 💛</p>

          <p style="font-size:15px;">🤍 After reading, you can take a small quiet moment together and open a gentle conversation.<br/>
          You don't have to ask every question — sometimes even one is enough.</p>

          <p style="font-size:15px;font-weight:bold;">You can ask:</p>
          <ul style="font-size:15px;padding-left:20px;">
            <li>What was it like hearing the story?</li>
            <li>Which part did you love the most?</li>
            <li>Was there a moment that felt really familiar to you?</li>
            <li>Is there an image or moment that stayed in your mind?</li>
            <li>How did you feel while we were reading the story?</li>
            <li>What helps you feel safe when things are hard?</li>
            <li>Is there something you'd like us to do together next time?</li>
          </ul>

          <p style="font-size:15px;font-weight:bold;">Important to remember:</p>
          <p style="font-size:15px;">You don't have to talk about everything after reading, and if your child doesn't want to share, that's completely okay.<br/>
          Sometimes simply listening to the story already creates meaningful emotional processing.<br/>
          Try not to rush into solving or explaining things — just be together inside the feeling, even when it's uncomfortable.<br/>
          The goal is connection and emotional safety, not a "therapy conversation."</p>

          <p style="font-size:15px;font-weight:bold;">Helpful phrases during the conversation:</p>
          <ul style="font-size:15px;padding-left:20px;">
            <li>"I can understand why that felt that way."</li>
            <li>"That was not an easy moment."</li>
            <li>"I loved how you handled that."</li>
            <li>"Even when things are hard, we're in this together."</li>
            <li>"It's okay to feel this way."</li>
          </ul>

          ${linkSection}

          <p style="font-size:15px;margin-top:24px;">Thank you for choosing StoryLeap 💛<br/><br/>The StoryLeap Team</p>
        </div>`;

    await base44.asServiceRole.integrations.Core.SendEmail({ to, subject, body, from_name: 'StoryLeap' });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});