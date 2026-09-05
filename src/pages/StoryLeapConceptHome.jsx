import React, { useState } from 'react';
import '@/styles/storyleap-landing.css';
import SLHeader from '@/components/storyleap-landing/SLHeader';
import SLHero from '@/components/storyleap-landing/SLHero';
import SLSituations from '@/components/storyleap-landing/SLSituations';
import SLHowItWorks from '@/components/storyleap-landing/SLHowItWorks';
import SLGallery from '@/components/storyleap-landing/SLGallery';
import SLActivities from '@/components/storyleap-landing/SLActivities';
import SLParentSupport from '@/components/storyleap-landing/SLParentSupport';
import SLTestimonials from '@/components/storyleap-landing/SLTestimonials';
import SLTrust from '@/components/storyleap-landing/SLTrust';
import SLFAQ from '@/components/storyleap-landing/SLFAQ';
import SLCTA from '@/components/storyleap-landing/SLCTA';
import SLFooter from '@/components/storyleap-landing/SLFooter';
import SLQuestionnaireModal from '@/components/storyleap-landing/SLQuestionnaireModal';

export default function StoryLeapConceptHome() {
  const [modalOpen, setModalOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [startStep, setStartStep] = useState(0);

  const openFlow = () => { setStartStep(0); setModalOpen(true); };
  const pickSituation = (t) => { setTopic(t); setStartStep(1); setModalOpen(true); };

  return (
    <div className="sl-page">
      <SLHeader onStart={openFlow} />
      <SLHero onStart={openFlow} />
      <SLSituations onPick={pickSituation} onStart={openFlow} />
      <SLHowItWorks onStart={openFlow} />
      <SLGallery />
      <SLActivities />
      <SLParentSupport />
      <SLTestimonials />
      <SLTrust />
      <SLFAQ />
      <SLCTA onStart={openFlow} />
      <SLFooter />
      <SLQuestionnaireModal open={modalOpen} initialTopic={topic} initialStep={startStep} onClose={() => setModalOpen(false)} />
    </div>
  );
}