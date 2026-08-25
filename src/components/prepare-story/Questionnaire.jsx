import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getActiveSpaceId } from '@/lib/childSpace';
import { getPages, topicKeyFromLabel } from './questionsConfig';
import { useLanguage } from '@/components/LanguageContext';
import QuestionCard from '@/components/kita-alef/QuestionCard';
import { trackEvent } from '@/lib/posthog';

// Same flow as the hero-story questionnaire, with two differences, both in handleAnswer.
// Everything else — progress bar, showIf, required checks, navigation — is identical.

function matchesShowIf(q, answers) {
  if (!q.showIf) return true;
  const dep = answers[q.showIf.dependsOn];
  if (Array.isArray(dep)) return dep.some((v) => q.showIf.values.includes(v));
  return q.showIf.values.includes(dep);
}

export default function Questionnaire({ answers, setAnswers, storyId }) {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const pages = getPages(lang);
  const [pageIdx, setPageIdx] = useState(0);
  const [creating, setCreating] = useState(false);
  const [pageError, setPageError] = useState('');
  const page = pages[pageIdx];
  const progress = ((pageIdx + 1) / pages.length) * 100;
  const isEn = lang === 'en';

  useEffect(() => {
    trackEvent('prepare_story_questionnaire_started');
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageIdx]);

  const handleAnswer = (key, val) => {
    setAnswers((prev) => {
      const next = { ...prev, [key]: val };

      // 1. The chip stores the display label, but the sheet has to carry the stable key —
      //    labels get reworded, keys do not, and perpare_child_story/topics.py looks the
      //    topic up by key. Derived here rather than in rowFromStory so that the value is
      //    already on the record if the parent abandons the form after this step.
      if (key === 'topic') next.topic_key = topicKeyFromLabel(val);

      // 2. Changing the category must clear the topic. Without this, a parent who picks
      //    "Health" → "Vaccination" and then switches to "Family" leaves the vaccination
      //    label sitting in answers.topic: the new category's chips show nothing selected,
      //    the required check passes on the stale value, and the book gets written about
      //    the wrong event entirely.
      if (key === 'topic_category') {
        next.topic = '';
        next.topic_key = '';
      }
      return next;
    });
  };

  const visibleQuestions = page.questions.filter((q) => matchesShowIf(q, answers));

  const missingQuestion = () => {
    for (const q of visibleQuestions) {
      if (!q.required) continue;
      const val = answers[q.key];
      const empty = val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
      if (empty) return q;
      if (q.consent && !answers[`${q.key}_consent`]) return q;
    }
    return null;
  };

  const errorFor = (q) => {
    if (q.type === 'photo') {
      return isEn
        ? "Please upload the child's photo and confirm the consent checkbox to continue"
        : 'נא להעלות תמונה של הילד/ה ולאשר את תיבת ההסכמה כדי להמשיך';
    }
    return isEn ? `Please answer: ${q.question}` : `נא לענות על: ${q.question}`;
  };

  const goNext = () => {
    const missing = missingQuestion();
    if (missing) { setPageError(errorFor(missing)); return; }
    setPageError('');
    trackEvent('prepare_story_questionnaire_step_completed', { step: pageIdx + 1 });
    setPageIdx(pageIdx + 1);
  };

  const goPrev = () => {
    setPageError('');
    setPageIdx(pageIdx - 1);
  };

  const handleFinish = async () => {
    if (creating) return;
    const missing = missingQuestion();
    if (missing) { setPageError(errorFor(missing)); return; }
    setPageError('');
    trackEvent('prepare_story_questionnaire_completed', { topic: answers.topic_key || 'other' });
    setCreating(true);
    try { sessionStorage.setItem('storyLeap_prepareStoryPending', JSON.stringify({ answers, lang })); } catch (_) {}
    try {
      const storyData = {
        child_name: answers.name || '',
        gender: answers.gender || '',
        child_image_url: answers.photo || null,
        answers,
        lang,
        contact_email: answers.contact_email || '',
        contact_phone: answers.contact_phone || '',
      };
      let id = storyId;
      if (id) {
        // A partial record already exists from the contact step — update it instead of duplicating.
        await base44.entities.KitaAlefStory.update(id, storyData);
      } else {
        const saved = await base44.entities.KitaAlefStory.create({ ...storyData, content: null, story_link: null, payment_status: 'draft', child_space_id: getActiveSpaceId() || undefined });
        id = saved.id;
      }
      // Nothing is written to the order sheet yet — that happens in
      // submitPrepareStoryWithCredits, after the credits are actually charged. A row written
      // here would make the watcher start producing (and paying for) a book nobody bought.
      navigate(`/PrepareStoryCheckout?story_id=${id}&lang=${lang}`);
    } catch (e) {
      navigate('/PrepareStory');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-[75vh] rounded-3xl px-4 py-6" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
      <div className="max-w-lg mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium" style={{ color: '#4FC3E8' }}>
              {isEn ? `Page ${pageIdx + 1} of ${pages.length}` : `עמוד ${pageIdx + 1} מתוך ${pages.length}`}
            </span>
            <span className="text-sm font-semibold" style={{ color: '#FF6FB5' }}>{page.title}</span>
          </div>
          <div className="h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(to left, #4FC3E8, #FF6FB5)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            />
          </div>
        </div>

        {/* Questions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pageIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {visibleQuestions.map((q, i) => (
              <QuestionCard key={`${q.key}-${i}`} question={q} answers={answers} onAnswerChange={handleAnswer} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        {pageError && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            {pageError}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 gap-3">
          {pageIdx > 0 ? (
            <button
              onClick={goPrev}
              className="px-6 py-3 rounded-[14px] bg-white border font-medium hover:opacity-80 transition-opacity"
              style={{ borderColor: '#B8EBF7', color: '#4FC3E8' }}
            >
              {isEn ? '← Back' : '→ חזור'}
            </button>
          ) : <div />}

          {pageIdx < pages.length - 1 ? (
            <button
              onClick={goNext}
              className="px-6 py-3 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #4FC3E8, #6BB6E8)' }}
            >
              {isEn ? 'Next →' : 'הבא ←'}
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={creating}
              className="px-6 py-3 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEn ? 'Saving...' : 'שומר...'}
                </>
              ) : (isEn ? 'Continue ✨' : 'ממשיכים ✨')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
