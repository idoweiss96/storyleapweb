import React, { useEffect, useState } from 'react';
import { QUICK_SITUATIONS, AGES, FEELINGS } from './landingContent';

const STEP_LABELS = ['Situation', 'Your child', 'Feelings', 'Details', 'Review'];
const LAST_STEP = 5;

const emptyForm = (topic) => ({ topic: topic || '', name: '', age: '', feelings: [], loves: '', helps: '' });

export default function SLQuestionnaireModal({ open, initialTopic, initialStep, onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm(''));

  useEffect(() => {
    if (open) {
      setForm(emptyForm(initialTopic));
      setStep(initialStep || 0);
    }
  }, [open, initialTopic, initialStep]);

  if (!open) return null;

  const toggleFeeling = (f) => {
    setForm((prev) => ({
      ...prev,
      feelings: prev.feelings.includes(f) ? prev.feelings.filter((x) => x !== f) : [...prev.feelings, f],
    }));
  };

  const handleNext = () => (step >= LAST_STEP ? onClose() : setStep(step + 1));
  const handleBack = () => (step === 0 ? onClose() : setStep(step - 1));

  const child = form.name.trim() || 'your child';
  const progress = Math.min(100, Math.round(((step + 1) / LAST_STEP) * 100));
  const stepLabel = step >= LAST_STEP ? 'Done' : `Step ${step + 1} of ${LAST_STEP} · ${STEP_LABELS[step]}`;

  const chip = (active, onClick, label, extraStyle = {}) => (
    <button key={label} type="button" className={`sl-chip${active ? ' active' : ''}`} onClick={onClick} style={extraStyle}>{label}</button>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(10,13,18,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: 640, maxHeight: '88vh', overflowY: 'auto', background: '#fafdff', borderRadius: 32, padding: 40 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
          <span style={{ fontSize: 13, color: '#93979f', fontWeight: 400 }}>{stepLabel}</span>
          <button type="button" onClick={onClose} style={{ border: 0, background: '#ebf5ff', width: 34, height: 34, borderRadius: 9999, color: '#535862', fontFamily: 'inherit', fontSize: 16 }}>×</button>
        </div>
        <div style={{ height: 4, borderRadius: 9999, background: '#ebf5ff', marginBottom: 32 }}>
          <div style={{ height: 4, borderRadius: 9999, background: '#181d27', width: `${progress}%` }}></div>
        </div>

        {step === 0 && (
          <div>
            <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>What is your child going through?</h3>
            <p style={{ margin: '10px 0 24px', fontSize: 16, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>Choose the closest one, or write it in your own words.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {QUICK_SITUATIONS.map((s) => chip(false, () => { setForm((p) => ({ ...p, topic: s })); setStep(1); }, s))}
            </div>
            <input type="text" placeholder="Or describe it yourself" style={{ marginTop: 20 }} value={form.topic} onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))} />
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>Tell us about your child</h3>
            <p style={{ margin: '10px 0 24px', fontSize: 16, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>The main character of the story.</p>
            <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, marginBottom: 8 }}>First name</label>
            <input type="text" placeholder="Maya" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, margin: '22px 0 8px' }}>Age</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {AGES.map((a) => chip(form.age === a, () => setForm((p) => ({ ...p, age: a })), a, { width: 48, height: 48, padding: 0 }))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>How does {child} feel about it?</h3>
            <p style={{ margin: '10px 0 24px', fontSize: 16, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>Pick as many as fit. There are no wrong answers here.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {FEELINGS.map((f) => chip(form.feelings.includes(f), () => toggleFeeling(f), f))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>What helps, and who matters</h3>
            <p style={{ margin: '10px 0 24px', fontSize: 16, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>These details are what make the story sound like your family.</p>
            <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Things they love</label>
            <input type="text" placeholder="Dinosaurs, her cat Luna, the park near us" value={form.loves} onChange={(e) => setForm((p) => ({ ...p, loves: e.target.value }))} />
            <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, margin: '22px 0 8px' }}>What usually helps them feel better</label>
            <textarea rows={3} placeholder="Holding my hand, knowing exactly what happens next" style={{ resize: 'vertical' }} value={form.helps} onChange={(e) => setForm((p) => ({ ...p, helps: e.target.value }))}></textarea>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>This is what we'll build the story from</h3>
            <p style={{ margin: '10px 0 24px', fontSize: 16, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>You can change anything before we start.</p>
            <div style={{ background: '#ebf5ff', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Situation', form.topic || 'Not set yet'],
                ['Child', (form.name.trim() || 'Not set yet') + (form.age ? `, age ${form.age}` : '')],
                ['Feelings', form.feelings.length ? form.feelings.join(', ') : 'Not set yet'],
                ['Loves', form.loves || '—'],
                ['What helps', form.helps || '—'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: 16, justifyContent: 'space-between', fontSize: 15 }}>
                  <span style={{ color: '#93979f', fontWeight: 400 }}>{label}</span>
                  <span style={{ textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 9999, background: '#d3f6e3', margin: '0 auto 24px' }}></div>
            <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>{form.name.trim() ? `We're writing ${form.name.trim()}'s story` : "We're writing the story"}</h3>
            <p style={{ margin: '12px auto 0', maxWidth: 420, fontSize: 16, lineHeight: 1.6, color: '#535862', fontWeight: 400 }}>We'll email you when it's ready, usually within a few minutes. It will be waiting in My Stories, together with the conversation questions for you.</p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 32 }}>
          <button type="button" onClick={handleBack} style={{ border: 0, fontFamily: 'inherit', fontWeight: 400, fontSize: 15, background: 'transparent', color: '#93979f', padding: '12px 0' }}>
            {step === 0 ? 'Cancel' : step >= LAST_STEP ? '' : 'Back'}
          </button>
          <button type="button" onClick={handleNext} style={{ border: 0, fontFamily: 'inherit', fontWeight: 500, fontSize: 16, letterSpacing: '-0.01em', background: '#181d27', color: '#fff', padding: '14px 32px', borderRadius: 9999, boxShadow: '0 1px 2px rgba(10,13,18,0.4)' }}>
            {step === 4 ? 'Create the story' : step >= LAST_STEP ? 'Close' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}