import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getPages } from './questionsConfig';
import { useLanguage } from '@/components/LanguageContext';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import SaveScreen from './SaveScreen';
import { trackEvent } from '@/lib/posthog';

export default function Questionnaire({ answers, setAnswers, onBackToContact }) {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const pages = getPages(lang);
  const [pageIdx, setPageIdx] = useState(0);
  const [creating, setCreating] = useState(false);
  const [pageError, setPageError] = useState('');
  const [contactEmail, setContactEmail] = useState(answers.contact_email || '');
  const [contactPhone, setContactPhone] = useState(answers.contact_phone || '');
  const [contactError, setContactError] = useState('');
  const [savedStoryId, setSavedStoryId] = useState(null);
  const [showSaveStep, setShowSaveStep] = useState(false);
  const page = pages[pageIdx];
  const isLastPage = pageIdx === pages.length - 1;
  const isEn = lang === 'en';

  useEffect(() => {
    trackEvent('kita_questionnaire_started');
  }, []);

  // Always scroll to the top when a new page is shown (initial load + every Next/Back).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageIdx]);

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
    if (pageIdx === 0) {
      if (onBackToContact) onBackToContact();
      return;
    }
    setPageIdx(pageIdx - 1);
  };

  const validateContactEmail = () => {
    if (contactEmail && !/\S+@\S+\.\S+/.test(contactEmail)) {
      setContactError(isEn ? 'Please enter a valid email' : 'נא למלא מייל תקין');
    }
  };

  const handleFinish = async () => {
    if (creating) return;
    if (!isPageValid()) { setPageError(pageErrorMsg); return; }
    if (!contactEmail || !/\S+@\S+\.\S+/.test(contactEmail)) {
      setContactError(isEn ? 'Please enter a valid email' : 'נא למלא מייל תקין');
      return;
    }
    if (!contactPhone) {
      setContactError(isEn ? 'Please enter a phone number' : 'נא למלא מספר טלפון');
      return;
    }
    setPageError('');
    setContactError('');
    trackEvent('kita_questionnaire_completed');
    setCreating(true);
    const mergedAnswers = { ...answers, contact_email: contactEmail, contact_phone: contactPhone };
    setAnswers(mergedAnswers);
    try { sessionStorage.setItem('storyLeap_kitaAlefPending', JSON.stringify({ answers: mergedAnswers, lang })); } catch (_) {}
    try {
      const storyData = {
        child_name: mergedAnswers.name || '',
        gender: mergedAnswers.gender || '',
        child_image_url: mergedAnswers.photo || null,
        answers: mergedAnswers,
        lang,
        contact_email: contactEmail,
        contact_phone: contactPhone,
      };
      const saved = await base44.entities.KitaAlefStory.create({ ...storyData, content: null, story_link: null, payment_status: 'draft' });
      const id = saved.id;
      const submitToSheet = () => base44.functions.invoke('submitKitaAlefAnswers', { answers: mergedAnswers, lang, story_id: id });
      submitToSheet().catch(() => submitToSheet().catch((err) => console.error('submitKitaAlefAnswers failed twice', err)));
      setSavedStoryId(id);
      setShowSaveStep(true);
    } catch (e) {
      navigate('/KitaAlefStory');
    } finally {
      setCreating(false);
    }
  };

  if (showSaveStep) {
    return (
      <SaveScreen
        childName={answers.name || ''}
        email={contactEmail}
        lang={lang}
        storyId={savedStoryId}
        onContinue={() => navigate(`/KitaAlefStory?story_id=${savedStoryId}&lang=${lang}`)}
      />
    );
  }

  return (
    <div className="min-h-[75vh] rounded-3xl px-4 py-6" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
      <div className="max-w-lg mx-auto">
        <ProgressBar step={pageIdx + 2} total={pages.length + 1} label={page.title} isEn={isEn} />

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

        {/* Contact details — collected at the end of the questionnaire, right before story creation */}
        {isLastPage && (
          <div className="mt-4 rounded-3xl border bg-white p-4 space-y-3" style={{ borderColor: '#F0E8F5', boxShadow: '0 4px 20px rgba(255,111,181,0.08), 0 2px 10px rgba(79,195,232,0.06)' }}>
            <p className="text-sm font-medium" style={{ color: '#1A1A6E' }}>
              {isEn ? 'Almost done! Where should we send the story?' : 'עוד רגע וסיימנו! לאן נשלח את הסיפור?'}
            </p>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A6E' }}>
                {isEn ? 'Email' : 'מייל'} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => { setContactEmail(e.target.value); setContactError(''); }}
                onBlur={validateContactEmail}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-[10px] border bg-kita-input-bg focus:outline-none"
                style={{ borderColor: '#F0E8F5' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A6E' }}>
                {isEn ? 'Phone' : 'טלפון'} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => { setContactPhone(e.target.value); setContactError(''); }}
                placeholder="050-0000000"
                className="w-full px-4 py-3 rounded-[10px] border bg-kita-input-bg focus:outline-none"
                style={{ borderColor: '#F0E8F5' }}
              />
            </div>
            {contactError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{contactError}</p>
            )}
          </div>
        )}

        {/* Error */}
        {pageError && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            {pageError}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 gap-3">
          <button
            onClick={goPrev}
            className="px-6 py-3 rounded-[14px] bg-white border font-medium hover:opacity-80 transition-opacity"
            style={{ borderColor: '#B8EBF7', color: '#4FC3E8' }}
          >
            {isEn ? '← Back' : '→ חזור'}
          </button>

          {!isLastPage ? (
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