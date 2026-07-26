import React, { useState } from 'react';
import HomeScreen from '@/components/kita-alef/HomeScreen';
import Questionnaire from '@/components/kita-alef/Questionnaire';

export default function KitaAlef() {
  const [step, setStep] = useState('home');
  const [answers, setAnswers] = useState({});

  return (
    <div>
      {step === 'home' && <HomeScreen onStart={() => setStep('questionnaire')} />}
      {step === 'questionnaire' && (
        <Questionnaire answers={answers} setAnswers={setAnswers} />
      )}
    </div>
  );
}