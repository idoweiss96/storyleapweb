import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getPages } from './questionsConfig';
import { useLanguage } from '@/components/LanguageContext';
import QuestionCard from './QuestionCard';
import { trackEvent } from '@/lib/posthog';

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
    trackEvent('kita_questionnaire_started');
  }, []);

  const handleAnswer = (key, val) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const isPageValid = () => {
    for (const q of page.questions) {
      if (q.required) {
        if (!answers[q.key]) return false;
        if (q.consent && !answers[`${q.key}_consent`]) return false;
      }
    }
    return true;
  };

  const pageErrorMsg = isEn
    ? "Please upload your child's photo and confirm the consent checkbox to continue"
    : 'נא להעלות תמונה של הילד/ה ולאשר את תיבת ההסכמה כדי להמשיך';

  const goNext = () => {
    if (!isPageValid()) { setPageError(pageErrorMsg); return; }
    setPageError('');
    trackEvent('kita_questionnaire_step_completed', { step: pageIdx + 1 });
    setPageIdx(pageIdx + 1);
  };

  const goPrev = () => {
    setPageError('');
    setPageIdx(pageIdx - 1);
  };

  const handleFinish = async () => {
    if (creating) return;
    if (!isPageValid()) { setPageError(pageErrorMsg); return; }
    setPageError('');
    trackEvent('kita_questionnaire_completed');
    setCreating(true);
    try { sessionStorage.setItem('storyLeap_kitaAlefPending', JSON.stringify({ answers, lang })); } catch (_) {}
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
        const saved = await base44.entities.KitaAlefStory.create({ ...storyData, content: null, story_link: null, payment_status: 'draft' });
        id = saved.id;
      }
      base44.functions.invoke('submitKitaAlefAnswers', { answers, lang, story_id: id }).catch(() => {});
      navigate(`/KitaAlefStory?story_id=${id}&lang=${lang}`);
    } catch (e) {
      navigate('/KitaAlefStory');
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
            {page.questions.filter(q => {
              if (!q.showIf) return true;
              const dep = answers[q.showIf.dependsOn];
              return q.showIf.values.includes(dep);
            }).map(q => (
              <QuestionCard key={q.key} question={q} answers={answers} onAnswerChange={handleAnswer} />
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
                  {isEn ? 'Creating...' : 'יוצר...'}
                </>
              ) : (isEn ? 'Create the story ✨' : 'צור את הסיפור ✨')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}