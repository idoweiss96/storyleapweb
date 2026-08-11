import React, { useState, useEffect } from 'react';
import HomeScreen from '@/components/kita-alef/HomeScreen';
import ContactScreen from '@/components/kita-alef/ContactScreen';
import Questionnaire from '@/components/kita-alef/Questionnaire';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/LanguageContext';

export default function KitaAlef() {
  const { lang } = useLanguage();
  const [step, setStep] = useState('home');
  const [answers, setAnswers] = useState({});
  const [storyId, setStoryId] = useState(null);

  // Always open each new screen (home/contact/questionnaire) scrolled to the top.
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
      {step === 'home' && <HomeScreen onStart={() => setStep('contact')} />}
      {step === 'contact' && <ContactScreen answers={answers} setAnswers={setAnswers} onSubmit={handleContactSubmit} />}
      {step === 'questionnaire' && (
        <Questionnaire answers={answers} setAnswers={setAnswers} storyId={storyId} />
      )}
    </div>
  );
}