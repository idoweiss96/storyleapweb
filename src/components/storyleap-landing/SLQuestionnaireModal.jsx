import React, { useEffect, useState } from 'react';
import { GENDERS, WORLDS, CHALLENGES, REACTIONS, PLANS } from './landingContent';

const STEP_LABELS = ['Child Details', 'Story World', 'Emotional Challenge', 'Summary & Contact', 'Payment'];
const LAST_STEP = 5;

const emptyForm = (topic) => ({
  name: '', ageText: '', gender: '', loves: '',
  world: '', topic: topic || '', trigger: '', feelings: [],
  email: '', phone: '', plan: 'Single story',
});

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

  const toggleReaction = (f) => {
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

  const nextLabel = step === 3 ? 'Continue to payment' : step === 4 ? 'Pay & create book' : step >= LAST_STEP ? 'Close' : 'Next';
  const backLabel = step === 0 ? 'Cancel' : step >= LAST_STEP ? '' : 'Back';
  const doneTitle = form.name.trim() ? `We're writing ${form.name.trim()}'s story` : "We're writing the story";

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
            <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>Child details</h3>
            <p style={{ margin: '10px 0 24px', fontSize: 16, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>Basics first — this is who the story is about, and what your child loves usually matters more than the situation itself.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Child's name</label>
                <input type="text" placeholder="Maya" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Age</label>
                <input type="text" placeholder="5" value={form.ageText} onChange={(e) => setForm((p) => ({ ...p, ageText: e.target.value }))} />
              </div>
            </div>
            <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, margin: '22px 0 8px' }}>Gender</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {GENDERS.map((g) => chip(form.gender === g, () => setForm((p) => ({ ...p, gender: g })), g))}
            </div>
            <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, margin: '22px 0 8px' }}>What does your child love?</label>
            <input type="text" placeholder="Dinosaurs, her cat Luna, the park near us" value={form.loves} onChange={(e) => setForm((p) => ({ ...p, loves: e.target.value }))} />
            <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, margin: '22px 0 8px' }}>Child's photo (optional)</label>
            <div style={{ border: '1.5px dashed #cfe0f4', borderRadius: 20, padding: 26, textAlign: 'center', color: '#7d8794', fontSize: 14 }}>
              Upload a photo to make the story personal — used only for illustration, deleted within 30 days
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>Story world</h3>
            <p style={{ margin: '10px 0 24px', fontSize: 16, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>Where should the story take place?</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {WORLDS.map((w) => (
                <button key={w} type="button" className={`sl-chip${form.world === w ? ' active' : ''}`} style={{ padding: '22px 12px', borderRadius: 20, fontWeight: 500 }} onClick={() => setForm((p) => ({ ...p, world: w }))}>{w}</button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>The challenge {child} faces</h3>
            <p style={{ margin: '10px 0 24px', fontSize: 16, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>Choose the closest one, or describe it below.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {CHALLENGES.map((c) => chip(form.topic === c, () => setForm((p) => ({ ...p, topic: c })), c))}
            </div>
            <input type="text" placeholder="Or describe it in your own words" style={{ marginTop: 16 }} value={form.topic} onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))} />
            <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, margin: '22px 0 8px' }}>When does it usually happen?</label>
            <input type="text" placeholder="When she needs to say goodbye in the morning" value={form.trigger} onChange={(e) => setForm((p) => ({ ...p, trigger: e.target.value }))} />
            <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, margin: '22px 0 8px' }}>How does your child react?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {REACTIONS.map((f) => chip(form.feelings.includes(f), () => toggleReaction(f), f))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>Summary &amp; contact</h3>
            <p style={{ margin: '10px 0 24px', fontSize: 16, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>You can change anything before we start.</p>
            <div style={{ background: '#ebf5ff', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
              {[
                ['Child', (form.name.trim() || 'Not set yet') + (form.ageText ? `, age ${form.ageText}` : '') + (form.gender ? ` · ${form.gender}` : '')],
                ['Loves', form.loves || '—'],
                ['Story world', form.world || 'Not set yet'],
                ['Challenge', form.topic || 'Not set yet'],
                ['When it happens', form.trigger || '—'],
                ['Reaction', form.feelings.length ? form.feelings.join(', ') : 'Not set yet'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: 16, justifyContent: 'space-between', fontSize: 15 }}>
                  <span style={{ color: '#93979f', fontWeight: 400 }}>{label}</span>
                  <span style={{ textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Email</label>
                <input type="text" placeholder="your@email.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Phone (optional)</label>
                <input type="text" placeholder="050-0000000" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div style={{ marginTop: 18, background: '#f1e6ff', borderRadius: 16, padding: '16px 18px', fontSize: 14, lineHeight: 1.5, color: '#4a4d55' }}>
              A peek at the magic — before purchasing you'll see the first two pages of the story, no commitment.
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>Choose a plan &amp; pay</h3>
            <p style={{ margin: '10px 0 24px', fontSize: 16, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>{doneTitle} once payment is complete.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {PLANS.map(([name, price]) => (
                <button key={name} type="button" className={`sl-plan${form.plan === name ? ' active' : ''}`} onClick={() => setForm((p) => ({ ...p, plan: name }))}>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{name}</div>
                  <div style={{ fontSize: 24, fontWeight: 500, marginTop: 6 }}>{price}</div>
                </button>
              ))}
            </div>
            <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Card number</label>
            <input type="text" placeholder="4242 4242 4242 4242" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Expiry</label>
                <input type="text" placeholder="MM/YY" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: '#535862', fontWeight: 400, marginBottom: 8 }}>CVC</label>
                <input type="text" placeholder="123" />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 9999, background: '#d3f6e3', margin: '0 auto 24px' }}></div>
            <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>{doneTitle}</h3>
            <p style={{ margin: '12px auto 0', maxWidth: 420, fontSize: 16, lineHeight: 1.6, color: '#535862', fontWeight: 400 }}>Payment received. We'll email you when it's ready, usually within a few minutes. It will be waiting in My Stories, together with the conversation questions for you.</p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 32 }}>
          <button type="button" onClick={handleBack} style={{ border: 0, fontFamily: 'inherit', fontWeight: 400, fontSize: 15, background: 'transparent', color: '#93979f', padding: '12px 0' }}>
            {backLabel}
          </button>
          <button type="button" onClick={handleNext} style={{ border: 0, fontFamily: 'inherit', fontWeight: 500, fontSize: 16, letterSpacing: '-0.01em', background: '#181d27', color: '#fff', padding: '14px 32px', borderRadius: 9999, boxShadow: '0 1px 2px rgba(10,13,18,0.4)' }}>
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}