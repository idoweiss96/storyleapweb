import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '@/styles/storyleap-landing.css';
import { Pencil, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { GENDERS, WORLDS, CHALLENGES, REACTIONS, PLANS } from '@/components/storyleap-landing/landingContent';
import QuestionnaireIntroModal from '@/components/storyleap-landing/QuestionnaireIntroModal';

const STEP_LABELS = ['Child Details', 'Emotional Challenge', 'Story World', 'Summary & Contact', 'Payment'];
const LAST_STEP = 5;

export default function ConceptQuestionnaire() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic') || '';

  const [step, setStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [form, setForm] = useState({
    name: '', ageText: '', gender: '', loves: '',
    world: '', topic: initialTopic, trigger: '', feelings: [],
    email: '', phone: '', plan: 'Single story',
    childPhotoUrl: '',
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm((p) => ({ ...p, childPhotoUrl: file_url }));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const toggleReaction = (f) => {
    setForm((prev) => ({
      ...prev,
      feelings: prev.feelings.includes(f) ? prev.feelings.filter((x) => x !== f) : [...prev.feelings, f],
    }));
  };

  const handleNext = () => (step >= LAST_STEP ? navigate('/concept-home') : setStep(step + 1));
  const handleBack = () => (step === 0 ? navigate('/concept-home') : setStep(step - 1));

  const child = form.name.trim() || 'your child';
  const stepLabel = step >= LAST_STEP ? 'Done' : `Step ${step + 1} of ${LAST_STEP} · ${STEP_LABELS[step]}`;

  const chip = (active, onClick, label, extraStyle = {}) => (
    <button key={label} type="button" className={`sl-chip${active ? ' active' : ''}`} onClick={onClick} style={extraStyle}>{label}</button>
  );

  const nextLabel = step === 3 ? 'Continue to payment' : step === 4 ? 'Pay & create book' : step >= LAST_STEP ? 'Close' : 'Next';
  const backLabel = step === 0 ? 'Cancel' : step >= LAST_STEP ? '' : 'Back';
  const doneTitle = form.name.trim() ? `We're writing ${form.name.trim()}'s story` : "We're writing the story";

  return (
    <div className="sl-page" style={{ minHeight: '100vh' }}>
      {showIntro && <QuestionnaireIntroModal onClose={() => setShowIntro(false)} />}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 32px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
          <a href="/concept-home" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="https://media.base44.com/images/public/697f4b704975c71e9cf56f59/449f3427e_Storyleap.jpg" alt="StoryLeap" style={{ height: 28, width: 'auto', mixBlendMode: 'multiply' }} />
          </a>
          <span style={{ fontSize: 16, color: '#93979f', fontWeight: 400 }}>{stepLabel}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {STEP_LABELS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 9999, background: i <= step ? '#181d27' : '#dbe9fb', transition: 'background 0.2s' }} />
          ))}
        </div>

        <div style={{ background: '#fafdff', borderRadius: 32, padding: 40 }}>

          {step === 0 && (
            <div>
              <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>Child details</h3>
              <p style={{ margin: '10px 0 24px', fontSize: 18, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>Basics first, this is who the story is about, and what your child loves usually matters more than the situation itself.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 18, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Child's name</label>
                  <input type="text" placeholder="Maya" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 18, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Age</label>
                  <input type="text" placeholder="5" value={form.ageText} onChange={(e) => setForm((p) => ({ ...p, ageText: e.target.value }))} />
                </div>
              </div>
              <label style={{ display: 'block', fontSize: 18, color: '#535862', fontWeight: 400, margin: '36px 0 8px' }}>Gender</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {GENDERS.map((g) => chip(form.gender === g, () => setForm((p) => ({ ...p, gender: g })), g))}
              </div>
              <label style={{ display: 'block', fontSize: 18, color: '#535862', fontWeight: 400, margin: '36px 0 8px' }}>What does your child love?</label>
              <input type="text" placeholder="Dinosaurs, her cat Luna, the park near us" value={form.loves} onChange={(e) => setForm((p) => ({ ...p, loves: e.target.value }))} />
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>The challenge {child} faces</h3>
              <p style={{ margin: '10px 0 24px', fontSize: 18, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>Choose the closest one, or describe it below.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {CHALLENGES.map((c) => chip(form.topic === c, () => setForm((p) => ({ ...p, topic: c })), c))}
              </div>
              <input type="text" placeholder="Or describe it in your own words" style={{ marginTop: 16 }} value={form.topic} onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))} />
              <label style={{ display: 'block', fontSize: 18, color: '#535862', fontWeight: 400, margin: '36px 0 8px' }}>When does it usually happen?</label>
              <input type="text" placeholder="When she needs to say goodbye in the morning" value={form.trigger} onChange={(e) => setForm((p) => ({ ...p, trigger: e.target.value }))} />
              <label style={{ display: 'block', fontSize: 18, color: '#535862', fontWeight: 400, margin: '36px 0 8px' }}>How does your child react?</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {REACTIONS.map((f) => chip(form.feelings.includes(f), () => toggleReaction(f), f))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>Story world</h3>
              <p style={{ margin: '10px 0 24px', fontSize: 18, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>Where should the story take place?</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {WORLDS.map((w) => (
                  <button key={w} type="button" className={`sl-chip${form.world === w ? ' active' : ''}`} style={{ padding: '22px 12px', borderRadius: 20, fontWeight: 500 }} onClick={() => setForm((p) => ({ ...p, world: w }))}>{w}</button>
                ))}
              </div>
              <label style={{ display: 'block', fontSize: 18, color: '#535862', fontWeight: 400, margin: '36px 0 8px' }}>Child's photo (optional)</label>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />
              <div
                onClick={() => !uploadingPhoto && fileInputRef.current?.click()}
                style={{ border: '1.5px dashed #cfe0f4', borderRadius: 20, padding: 26, textAlign: 'center', color: '#7d8794', fontSize: 16, cursor: 'pointer' }}
              >
                {uploadingPhoto ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Loader2 size={18} className="animate-spin" /> Uploading...
                  </span>
                ) : form.childPhotoUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <img src={form.childPhotoUrl} alt="Child" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }} />
                    <span>Photo added, tap to change</span>
                  </div>
                ) : (
                  'Upload a photo to make the story personal, used only for illustration, deleted within 30 days'
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>Summary &amp; contact</h3>
              <p style={{ margin: '10px 0 24px', fontSize: 18, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>You can change anything before we start.</p>
              <div style={{ background: '#ebf5ff', borderRadius: 24, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
                {[
                  ['Child', (form.name.trim() || 'Not set yet') + (form.ageText ? `, age ${form.ageText}` : '') + (form.gender ? ` · ${form.gender}` : ''), 0],
                  ['Loves', form.loves || '-', 0],
                  ['Story world', form.world || 'Not set yet', 2],
                  ['Challenge', form.topic || 'Not set yet', 1],
                  ['When it happens', form.trigger || '-', 1],
                  ['Reaction', form.feelings.length ? form.feelings.join(', ') : 'Not set yet', 1],
                ].map(([label, value, editStep]) => (
                  <div key={label} style={{ display: 'flex', gap: 16, justifyContent: 'space-between', alignItems: 'center', fontSize: 17 }}>
                    <span style={{ color: '#93979f', fontWeight: 400 }}>{label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ textAlign: 'right' }}>{value}</span>
                      <button type="button" onClick={() => setStep(editStep)} style={{ border: 0, background: 'transparent', color: '#0069e0', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 0 }}>
                        <Pencil size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 18, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Email</label>
                  <input type="text" placeholder="your@email.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 18, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Phone (optional)</label>
                  <input type="text" placeholder="050-0000000" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginTop: 18, background: '#f1e6ff', borderRadius: 16, padding: '16px 18px', fontSize: 16, lineHeight: 1.5, color: '#4a4d55' }}>
                A peek at the magic, before purchasing you'll see the first two pages of the story, no commitment.
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{ margin: 0, fontSize: 30, letterSpacing: '-0.025em', fontWeight: 500 }}>Choose a plan &amp; pay</h3>
              <p style={{ margin: '10px 0 24px', fontSize: 18, lineHeight: 1.55, color: '#535862', fontWeight: 400 }}>{doneTitle} once payment is complete.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                {PLANS.map(([name, price]) => (
                  <button key={name} type="button" className={`sl-plan${form.plan === name ? ' active' : ''}`} onClick={() => setForm((p) => ({ ...p, plan: name }))}>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>{name}</div>
                    <div style={{ fontSize: 24, fontWeight: 500, marginTop: 6 }}>{price}</div>
                  </button>
                ))}
              </div>
              <label style={{ display: 'block', fontSize: 18, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Card number</label>
              <input type="text" placeholder="4242 4242 4242 4242" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 18, color: '#535862', fontWeight: 400, marginBottom: 8 }}>Expiry</label>
                  <input type="text" placeholder="MM/YY" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 18, color: '#535862', fontWeight: 400, marginBottom: 8 }}>CVC</label>
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
            <button type="button" onClick={handleBack} style={{ border: 0, fontFamily: 'inherit', fontWeight: 400, fontSize: 17, background: 'transparent', color: '#93979f', padding: '12px 0' }}>
              {backLabel}
            </button>
            <button type="button" onClick={handleNext} style={{ border: 0, fontFamily: 'inherit', fontWeight: 500, fontSize: 16, letterSpacing: '-0.01em', background: '#181d27', color: '#fff', padding: '14px 32px', borderRadius: 9999, boxShadow: '0 1px 2px rgba(10,13,18,0.4)' }}>
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}