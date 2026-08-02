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

// Public endpoint (no login required — parents open this from an email link and may be signed out).
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { story_id, entity_type, child_name, lang, answers } = payload;

    if (!child_name || !answers) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const record = await base44.asServiceRole.entities.FeedbackSurvey.create({
      story_id: story_id || null,
      entity_type: entity_type || null,
      child_name,
      lang: lang || null,
      overall_rating: answers.overall_rating,
      fit_rating: answers.fit_rating,
      opened_conversation: answers.opened_conversation,
      child_enjoyment: answers.child_enjoyment,
      best_part: answers.best_part,
      improvement: answers.improvement,
      nps_score: answers.nps_score,
      use_again: answers.use_again,
      other_comments: answers.other_comments,
    });

    const submittedDate = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jerusalem' });

    const subject = `New feedback survey response: ${child_name}`;
    const body = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;line-height:1.7;">
      <p style="font-size:16px;font-weight:bold;">New parent feedback survey response</p>
      <p><strong>Child's name:</strong> ${child_name}</p>
      <p><strong>Submitted:</strong> ${submittedDate}</p>
      <hr/>
      <p><strong>Overall rating (1-5):</strong> ${answers.overall_rating ?? '-'}</p>
      <p><strong>Fit with child/challenge:</strong> ${answers.fit_rating ?? '-'}</p>
      <p><strong>Opened a meaningful conversation:</strong> ${answers.opened_conversation ?? '-'}</p>
      <p><strong>Child enjoyment (1-5):</strong> ${answers.child_enjoyment ?? '-'}</p>
      <p><strong>What worked best:</strong> ${answers.best_part || '-'}</p>
      <p><strong>What could improve:</strong> ${answers.improvement || '-'}</p>
      <p><strong>Recommend likelihood (0-10):</strong> ${answers.nps_score ?? '-'}</p>
      <p><strong>Would use again:</strong> ${answers.use_again ?? '-'}</p>
      <p><strong>Additional comments:</strong> ${answers.other_comments || '-'}</p>
    </div>`;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const raw = buildRawMessage('hello@storyleapai.com', subject, body);
    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });

    return Response.json({ success: true, id: record.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}