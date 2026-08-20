import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HomeScreen from '@/components/hero-story/HomeScreen';
import ContactScreen from '@/components/hero-story/ContactScreen';
import Questionnaire from '@/components/hero-story/Questionnaire';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/LanguageContext';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import PageMeta from '@/components/SEO/PageMeta';

// The hero_story gift-book questionnaire. Same three-step shape as MovingHouse.jsx
// (home → contact → questionnaire), storing into the shared KitaAlefStory entity, which
// all questionnaire-based products use as their record.
export default function HeroStory() {
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
          ? 'ספר מותאם אישית לילדים — הילד/ה הוא הגיבור | StoryLeap'
          : 'Personalized Children\'s Book — Your Child is the Hero | StoryLeap'}
        description={lang === 'he'
          ? 'ספר מתנה מותאם אישית שבו הילד/ה הוא/היא הגיבור/ה של הרפתקה בעולם שבחרתם, עם הפנים שלו/ה מתוך תמונה אמיתית. 7 עמודים מאוירים, מוכן תוך 24 שעות.'
          : 'A personalized gift book where your child is the hero of an adventure in the world you choose, illustrated from their real photo. 7 illustrated pages, ready within 24 hours.'}
      />
      <BreadcrumbSchema items={[{ name: lang === 'he' ? 'ספר הגיבור/ה' : 'Hero Story', path: location.pathname }]} />
      {step === 'home' && <HomeScreen onStart={() => setStep('contact')} />}
      {step === 'contact' && <ContactScreen answers={answers} setAnswers={setAnswers} onSubmit={handleContactSubmit} />}
      {step === 'questionnaire' && (
        <Questionnaire answers={answers} setAnswers={setAnswers} storyId={storyId} />
      )}
    </div>
  );
}
