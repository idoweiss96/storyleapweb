import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

// Scheduled: finds stories whose link was opened (link_opened_at set) at least 2 days ago and
// that haven't received the feedback survey yet, sends it in the submission's language, and
// marks feedback_survey_sent so it never fires twice for the same story.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const now = Date.now();

    const [stories, kitaStories] = await Promise.all([
      base44.asServiceRole.entities.Story.filter({ feedback_survey_sent: false }, '-created_date', 500),
      base44.asServiceRole.entities.KitaAlefStory.filter({ feedback_survey_sent: false }, '-created_date', 500),
    ]);

    const candidates = [
      ...stories.map((s) => ({ ...s, _entityType: 'story' })),
      ...kitaStories.map((s) => ({ ...s, _entityType: 'kita' })),
    ];

    const due = candidates.filter((s) => s.link_opened_at && (now - new Date(s.link_opened_at).getTime()) >= TWO_DAYS_MS);

    let sent = 0;
    let skipped = 0;

    for (const s of due) {
      if (!s.contact_email) { skipped++; continue; }
      const isHebrew = s.lang ? s.lang === 'he' : /[\u0590-\u05FF]/.test(s.child_name || '');
      const entityName = s._entityType === 'kita' ? 'KitaAlefStory' : 'Story';
      try {
        await base44.asServiceRole.functions.invoke('sendFeedbackSurveyEmail', {
          to: s.contact_email,
          childName: s.child_name,
          isHebrew,
          story_id: s.id,
          entity_type: s._entityType,
        });
        await base44.asServiceRole.entities[entityName].update(s.id, { feedback_survey_sent: true });
        sent++;
      } catch (e) {
        console.error('[sendFeedbackSurveys] Failed to send survey for', s.id, e.message);
        skipped++;
      }
    }

    return Response.json({ success: true, checked: candidates.length, due: due.length, sent, skipped });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}