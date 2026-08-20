import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HomeScreen from '@/components/moving-house/HomeScreen';
import ContactScreen from '@/components/moving-house/ContactScreen';
import Questionnaire from '@/components/moving-house/Questionnaire';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/LanguageContext';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import PageMeta from '@/components/SEO/PageMeta';

// Duplicated from src/pages/KitaAlef.jsx (same flow/template), with moving-house content.
// The original KitaAlef page and entity usage are untouched.
export default function MovingHouse() {
  const { lang } = useLanguage();
  const location = useLocation();
  const [step, setStep] = useState('home');
  const [answers, setAnswers] = useState({});
  const [storyId, setStoryId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Save a partial record as soon as contact details are collected, so an abandoned
  // questionnaire still leaves a row with email/phone for remarketing/follow-up.
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
        title={lang === 'he' ? 'הכנה רגשית למעבר דירה | כלים להורים ולילדים | StoryLeap' : 'Moving House | Emotional Prep for Kids | StoryLeap'}
        description={lang === 'he' ? 'המעבר לבית חדש מביא איתו הרבה רגשות, גם להורים וגם לילדים. StoryLeap מציעה הדרכה וסיפור מותאם אישית לילד להרגיש מוכן ובטוח.' : 'Moving house brings big feelings for kids and parents alike. StoryLeap offers guidance and a personalized story to help your child feel ready and supported through the move.'}
      />
      <BreadcrumbSchema items={[{ name: lang === 'he' ? 'מעבר דירה' : 'Moving House', path: location.pathname }]} />
      {step === 'home' && <HomeScreen onStart={() => setStep('contact')} />}
      {step === 'contact' && <ContactScreen answers={answers} setAnswers={setAnswers} onSubmit={handleContactSubmit} />}
      {step === 'questionnaire' && (
        <Questionnaire answers={answers} setAnswers={setAnswers} storyId={storyId} />
      )}
    </div>
  );
}