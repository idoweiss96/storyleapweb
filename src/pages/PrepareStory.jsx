import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HomeScreen from '@/components/prepare-story/HomeScreen';
import ContactScreen from '@/components/prepare-story/ContactScreen';
import Questionnaire from '@/components/prepare-story/Questionnaire';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/LanguageContext';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import PageMeta from '@/components/SEO/PageMeta';

// The prepare-story questionnaire. Same three-step shape as HeroStory.jsx
// (home → contact → questionnaire), storing into the shared KitaAlefStory entity, which
// all questionnaire-based products use as their record.
//
// What makes this product different from the therapeutic ones is that there is no problem
// to solve. The event has not happened yet; the book exists to make it familiar before it
// arrives. That difference lives in the questionnaire content and in the Python prompt —
// this page is only the shell.
export default function PrepareStory() {
  const { lang } = useLanguage();
  const location = useLocation();
  const [step, setStep] = useState('home');
  const [answers, setAnswers] = useState({});
  const [storyId, setStoryId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Save a partial record as soon as contact details are collected, so an abandoned
  // questionnaire still leaves a row with name/email/phone for follow-up.
  const handleContactSubmit = async (email, phone) => {
    const merged = { ...answers, contact_email: email, contact_phone: phone };
    setAnswers(merged);
    try {
      const partial = await base44.entities.KitaAlefStory.create({
        child_name: merged.name || '',
        gender: merged.gender || '',
        answers: merged,
        lang,
        contact_email: email,
        contact_phone: phone,
        content: null,
        story_link: null,
        payment_status: 'draft',
      });
      setStoryId(partial.id);
    } catch (_) {}
    setStep('questionnaire');
  };

  return (
    <div>
      <PageMeta
        title={lang === 'he'
          ? 'ספר הכנה מותאם אישית לילדים — מעבר דירה, אח חדש, רופא שיניים ועוד | StoryLeap'
          : 'Personalized Preparation Book for Children — Moving, a New Sibling, the Dentist | StoryLeap'}
        description={lang === 'he'
          ? 'ספר מותאם אישית שמכין ילד/ה למשהו חדש שעומד לקרות: מעבר דירה, אח חדש, גמילה, ביקור אצל רופא שיניים, כניסה לגן ועוד. 5 עמודים מאוירים, מוכן תוך 24 שעות.'
          : 'A personalized book that prepares your child for something new: moving house, a new sibling, potty training, a dentist visit, starting kindergarten and more. 5 illustrated pages, ready within 24 hours.'}
      />
      <BreadcrumbSchema items={[{ name: lang === 'he' ? 'סיפור הכנה' : 'Preparation Story', path: location.pathname }]} />
      {step === 'home' && <HomeScreen onStart={() => setStep('contact')} />}
      {step === 'contact' && <ContactScreen answers={answers} setAnswers={setAnswers} onSubmit={handleContactSubmit} />}
      {step === 'questionnaire' && (
        <Questionnaire answers={answers} setAnswers={setAnswers} storyId={storyId} />
      )}
    </div>
  );
}
