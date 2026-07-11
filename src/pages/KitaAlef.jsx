import React, { useState } from 'react';
import HomeScreen from '@/components/kita-alef/HomeScreen';
import Questionnaire from '@/components/kita-alef/Questionnaire';
import CompletionScreen from '@/components/kita-alef/CompletionScreen';

export default function KitaAlef() {
  const [step, setStep] = useState('home');
  const [answers, setAnswers] = useState({});

  return (
    <div>
      {step === 'home' && <HomeScreen onStart={() => setStep('questionnaire')} />}
      {step === 'questionnaire' && (
        <Questionnaire answers={answers} setAnswers={setAnswers} onComplete={() => setStep('completion')} />
      )}
      {step === 'completion' && <CompletionScreen answers={answers} />}
    </div>
  );
}