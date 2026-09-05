import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import SLFloatingClouds from '@/components/storyleap-landing/SLFloatingClouds';

export default function StoryLeapConceptHome() {
  const navigate = useNavigate();

  const openFlow = () => navigate('/concept-questionnaire');
  const pickSituation = (t) => navigate(`/concept-questionnaire?topic=${encodeURIComponent(t)}`);

  return (
    <div className="sl-page" style={{ position: 'relative' }}>
      <SLFloatingClouds />
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
    </div>
  );
}