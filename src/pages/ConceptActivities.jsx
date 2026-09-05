import React from 'react';
import '@/styles/storyleap-landing.css';
import SLHeader from '@/components/storyleap-landing/SLHeader';
import SLFooter from '@/components/storyleap-landing/SLFooter';
import SLFloatingClouds from '@/components/storyleap-landing/SLFloatingClouds';
import { LanguageProvider, useLanguage } from '@/components/LanguageContext';
import PageMeta from '@/components/SEO/PageMeta';
import ActivityGameCard from '@/components/activities/ActivityGameCard';
import { GAMES } from '@/pages/Activities';

const META = {
  en: {
    title: 'The Activity Place | Free Games for Kids | StoryLeap',
    description: 'A collection of short, free games children can play on their own or together with a parent. From StoryLeap.',
  },
  he: {
    title: 'מקום הפעילויות | משחקים חינמיים לילדים | StoryLeap',
    description: 'אוסף משחקים קצרים וחינמיים שילדים יכולים לשחק לבד או יחד עם ההורים. מבית StoryLeap.',
  },
};

export default function ConceptActivities() {
  return (
    <LanguageProvider>
      <ConceptActivitiesInner />
    </LanguageProvider>
  );
}

function ConceptActivitiesInner() {
  const { lang } = useLanguage();
  const isHe = lang === 'he';
  const meta = isHe ? META.he : META.en;

  return (
    <div className="sl-page" style={{ position: 'relative' }}>
      <PageMeta title={meta.title} description={meta.description} />
      <SLFloatingClouds />
      <SLHeader />

      <section style={{ position: 'relative', maxWidth: 1120, margin: '0 auto', padding: '72px 32px 40px', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fafdff', borderRadius: 9999, padding: '11px 22px', fontSize: 16, color: '#535862', marginBottom: 36 }}>
          <span style={{ width: 9, height: 9, borderRadius: 9999, background: '#d3f6e3', display: 'block' }}></span>
          {isHe ? 'חינם לגמרי' : 'Completely free'}
        </div>
        <h1 style={{ margin: 0, fontSize: 'clamp(38px,7.2vw,72px)', lineHeight: 1.06, letterSpacing: '-0.03em', fontWeight: 500 }}>
          {isHe ? 'מקום הפעילויות' : 'The Activity Place'}
        </h1>
        <p style={{ maxWidth: 700, margin: '28px auto 0', fontSize: 20, lineHeight: 1.6, color: '#535862', fontWeight: 400 }}>
          {isHe
            ? 'אוסף משחקים קצרים לילדים, לשחק לבד או יחד איתכם, בכמה דקות של חיבור.'
            : 'A collection of short games for kids, to play alone or together with you, in a few minutes of connection.'}
        </p>
      </section>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 96px' }}>
        <div className="sl-grid-3">
          {GAMES.map((game) => (
            <div key={game.path} className="sl-tile" style={{ background: '#fafdff', borderRadius: 32, overflow: 'hidden' }}>
              <ActivityGameCard game={game} isHe={isHe} />
            </div>
          ))}
        </div>
      </section>

      <SLFooter />
    </div>
  );
}