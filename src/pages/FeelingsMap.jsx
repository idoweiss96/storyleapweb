import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getFeelingsMapContent } from '@/components/feelings-map/feelingsMapContent';
import ProgressDots from '@/components/feelings-map/ProgressDots';
import IntroScreen from '@/components/feelings-map/screens/IntroScreen';
import EmotionsScreen from '@/components/feelings-map/screens/EmotionsScreen';
import BodyScreen from '@/components/feelings-map/screens/BodyScreen';
import StoryScreen from '@/components/feelings-map/screens/StoryScreen';
import SupportsScreen from '@/components/feelings-map/screens/SupportsScreen';
import PowerScreen from '@/components/feelings-map/screens/PowerScreen';
import ActionScreen from '@/components/feelings-map/screens/ActionScreen';
import SummaryScreen from '@/components/feelings-map/screens/SummaryScreen';

const INITIAL_STATE = {
  emotions: [], emotionCustom: '', bodyFeelings: [], storyCards: [], storyText: '',
  supports: [], supportCustom: '', powerSentence: '', powerCustom: '', actionChoice: '',
};

export default function FeelingsMap() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang') === 'en' ? 'en' : 'he';
  const isEn = lang === 'en';
  const content = useMemo(() => getFeelingsMapContent(lang), [lang]);
  const { text } = content;

  const [screen, setScreen] = useState(1);
  const [state, setState] = useState(INITIAL_STATE);

  const toggle = (field, id) => {
    setState((prev) => {
      const arr = prev[field];
      const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
      return { ...prev, [field]: next };
    });
  };
  const selectSingle = (field, value) => {
    setState((prev) => ({ ...prev, [field]: prev[field] === value ? '' : value }));
  };
  const updateCustom = (field, value) => {
    setState((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'powerCustom') {
        next.powerSentence = value.trim().length > 0 ? '__custom__' : (prev.powerSentence === '__custom__' ? '' : prev.powerSentence);
      }
      return next;
    });
  };

  const goNext = () => { setScreen((s) => s + 1); window.scrollTo(0, 0); };
  const goBack = () => { setScreen((s) => s - 1); window.scrollTo(0, 0); };
  const restart = () => { setState(INITIAL_STATE); setScreen(1); window.scrollTo(0, 0); };
  const returnToStories = () => navigate('/MyStories');

  const screens = {
    1: <IntroScreen text={text} onStart={goNext} />,
    2: <EmotionsScreen text={text} isEn={isEn} emotions={content.emotions} state={state} toggle={toggle} updateCustom={updateCustom} onBack={goBack} onNext={goNext} />,
    3: <BodyScreen text={text} isEn={isEn} body={content.body} state={state} toggle={toggle} onBack={goBack} onNext={goNext} />,
    4: <StoryScreen text={text} isEn={isEn} storyCards={content.storyCards} state={state} toggle={toggle} updateCustom={updateCustom} onBack={goBack} onNext={goNext} />,
    5: <SupportsScreen text={text} isEn={isEn} supports={content.supports} state={state} toggle={toggle} updateCustom={updateCustom} onBack={goBack} onNext={goNext} />,
    6: <PowerScreen text={text} isEn={isEn} powerSentences={content.powerSentences} state={state} selectSingle={selectSingle} updateCustom={updateCustom} onBack={goBack} onNext={goNext} />,
    7: <ActionScreen text={text} isEn={isEn} actions={content.actions} state={state} selectSingle={selectSingle} onBack={goBack} onNext={goNext} />,
    8: <SummaryScreen text={text} content={content} state={state} onRestart={restart} onReturn={returnToStories} />,
  };

  return (
    <div dir={isEn ? 'ltr' : 'rtl'} className="min-h-screen" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
      <div className="max-w-lg mx-auto px-4 py-6">
        <ProgressDots screen={screen} />
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {screens[screen]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}