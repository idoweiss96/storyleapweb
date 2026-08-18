import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HomeScreen from '@/components/kita-alef/HomeScreen';
import ContactScreen from '@/components/kita-alef/ContactScreen';
import Questionnaire from '@/components/kita-alef/Questionnaire';
import { useLanguage } from '@/components/LanguageContext';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

export default function KitaAlef() {
  const [step, setStep] = useState('home');
  const [answers, setAnswers] = useState({});
  const { lang } = useLanguage();
  const location = useLocation();

  // Always open each new screen (home/contact/questionnaire) scrolled to the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  return (
    <div>
      <BreadcrumbSchema items={[{ name: lang === 'he' ? 'הכנה לכיתה א׳' : 'Getting Ready for First Grade', path: location.pathname }]} />
      {step === 'home' && <HomeScreen onStart={() => setStep('contact')} />}
      {step === 'contact' && (
        <ContactScreen
          answers={answers}
          setAnswers={setAnswers}
          onSubmit={() => setStep('questionnaire')}
          onBack={() => setStep('home')}
        />
      )}
      {step === 'questionnaire' && (
        <Questionnaire answers={answers} setAnswers={setAnswers} onBackToContact={() => setStep('contact')} />
      )}
    </div>
  );
}