import React, { useState, useEffect } from 'react';
import HomeScreen from '@/components/kita-alef/HomeScreen';
import ContactScreen from '@/components/kita-alef/ContactScreen';
import Questionnaire from '@/components/kita-alef/Questionnaire';

export default function KitaAlef() {
  const [step, setStep] = useState('home');
  const [answers, setAnswers] = useState({});

  // Always open each new screen (home/contact/questionnaire) scrolled to the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  return (
    <div>
      {step === 'home' && <HomeScreen onStart={() => setStep('contact')} />}
      {step === 'contact' && <ContactScreen answers={answers} setAnswers={setAnswers} onSubmit={() => setStep('questionnaire')} />}
      {step === 'questionnaire' && (
        <Questionnaire answers={answers} setAnswers={setAnswers} />
      )}
    </div>
  );
}