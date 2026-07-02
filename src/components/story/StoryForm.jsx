import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Upload, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

async function convertHeicToJpeg(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' }));else
          reject(new Error('Conversion failed'));
        }, 'image/jpeg', 0.92);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Brand colors
const PURPLE = '#4A3FB5';
const LIGHT_PURPLE = '#9B8FE0';
const GOLD = '#FAC775';
const DARK = '#1E293B';

export default function StoryForm({ formData, setFormData, onSubmit, isLoading }) {
  const { t, lang } = useLanguage();
  const isHe = lang === 'he';
  const [uploading, setUploading] = useState(false);
  const [formStep, setFormStep] = useState(0); // 0-3 for 4 steps

  const genders = [
  { value: 'boy', label: t('gender_boy'), emoji: '👦' },
  { value: 'girl', label: t('gender_girl'), emoji: '👧' },
  { value: 'other', label: t('gender_other'), emoji: '🧒' }];


  const settings = [
  { value: 'space', label: t('setting_space'), emoji: '🚀' },
  { value: 'forest', label: t('setting_forest'), emoji: '🌳' },
  { value: 'castle', label: t('setting_castle'), emoji: '🏰' },
  { value: 'sports', label: t('setting_sports'), emoji: '⚽' },
  { value: 'real_life', label: t('setting_real_life'), emoji: '🏠' }];


  const challengeTypes = [
  { value: 'fears', label: t('ch_fears'), emoji: '😨' },
  { value: 'social_difficulty', label: t('ch_social'), emoji: '👥' },
  { value: 'changes', label: t('ch_changes'), emoji: '🔄' },
  { value: 'emotional_regulation', label: t('ch_emotional'), emoji: '💭' },
  { value: 'separation_anxiety', label: t('ch_separation'), emoji: '🤗' },
  { value: 'self_confidence', label: t('ch_confidence'), emoji: '💪' },
  { value: 'sleep_issues', label: t('ch_sleep'), emoji: '🌙' },
  { value: 'other', label: isHe ? 'אחר' : 'Other', emoji: '✏️' }];


  const reactionTypes = [
  { value: 'outburst', label: t('r_outburst') },
  { value: 'withdrawal', label: t('r_withdrawal') },
  { value: 'attention_seeking', label: t('r_attention') },
  { value: 'crying', label: t('r_crying') },
  { value: 'aggression', label: t('r_aggression') },
  { value: 'avoidance', label: t('r_avoidance') }];


  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    let file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      if (/\.(heic|heif)$/i.test(file.name) || file.type === 'image/heic' || file.type === 'image/heif') {
        file = await convertHeicToJpeg(file);
      }
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleChange('childImage', file_url);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => handleChange('childImage', '');

  // Validation per step
  const isStepValid = (step) => {
    if (step === 0) return formData.childName && formData.childAge && formData.gender && formData.childImage && formData.imageConsent;
    if (step === 1) return !!formData.setting;
    if (step === 2) {
      if (!formData.challengeType) return false;
      if (formData.challengeType === 'other') return !!formData.customChallenge && formData.customChallenge.trim().length > 0;
      return true;
    }
    if (step === 3) return !!formData.contactEmail && /\S+@\S+\.\S+/.test(formData.contactEmail);
    return false;
  };

  const nextStep = () => {
    if (formStep < 3) setFormStep(formStep + 1);
  };
  const prevStep = () => {
    if (formStep > 0) setFormStep(formStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formStep < 3) {
      nextStep();
      return;
    }
    onSubmit(e);
  };

  const stepLabels = isHe ?
  ['פרטי הילד/ה', 'עולם הסיפור', 'האתגר הרגשי', 'סיכום ופרטים'] :
  ['Child Details', 'Story World', 'Emotional Challenge', 'Summary & Contact'];

  // Slide direction
  const slideVariants = {
    enter: (direction) => ({ opacity: 0, x: direction > 0 ? isHe ? -40 : 40 : isHe ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (direction) => ({ opacity: 0, x: direction > 0 ? isHe ? 40 : -40 : isHe ? -40 : 40 })
  };
  const [direction, setDirection] = useState(1);
  const goToStep = (newStep) => {
    setDirection(newStep > formStep ? 1 : -1);
    setFormStep(newStep);
  };
  const handleNext = () => {setDirection(1);nextStep();};
  const handlePrev = () => {setDirection(-1);prevStep();};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {stepLabels.map((label, i) =>
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full h-2 rounded-full overflow-hidden bg-slate-100">
              <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${LIGHT_PURPLE}, ${GOLD})` }}
              initial={{ width: 0 }}
              animate={{ width: i <= formStep ? '100%' : '0%' }}
              transition={{ duration: 0.4 }} />
            
            </div>
            <button
            type="button"
            onClick={() => goToStep(i)}
            className="flex items-center gap-1.5">
            
              <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: i < formStep ? LIGHT_PURPLE : i === formStep ? GOLD : '#e2e8f0',
                color: i < formStep ? '#fff' : i === formStep ? DARK : '#94a3b8'
              }}>
              
                {i < formStep ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
              className="text-xs font-medium hidden sm:block transition-colors"
              style={{ color: i === formStep ? PURPLE : '#94a3b8' }}>
              
                {label}
              </span>
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        {/* STEP 1: Child Info */}
        {formStep === 0 &&
        <motion.div
          key="step1"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="space-y-5">
          
            <h3 className="text-lg font-bold pb-2" style={{ color: DARK, borderBottom: `2px solid ${GOLD}40` }}>
              {t('form_child_info')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-medium" style={{ color: DARK }}>{t('form_child_name')}</Label>
                <Input
                value={formData.childName}
                onChange={(e) => handleChange('childName', e.target.value)}
                placeholder={t('form_child_name_ph')}
                className="h-12 rounded-xl"
                style={{ borderColor: `${PURPLE}40` }}
                required />
              
              </div>
              <div className="space-y-2">
                <Label className="font-medium" style={{ color: DARK }}>{t('form_age')}</Label>
                <Input
                type="number" min="1" max="12"
                value={formData.childAge}
                onChange={(e) => handleChange('childAge', e.target.value)}
                placeholder={t('form_age_ph')}
                className="h-12 rounded-xl"
                style={{ borderColor: `${PURPLE}40` }}
                required />
              
              </div>
              <div className="space-y-2">
                <Label className="font-medium" style={{ color: DARK }}>{t('form_gender')}</Label>
                <div className="grid grid-cols-3 gap-2">
                  {genders.map((g) =>
                <button
                  key={g.value}
                  type="button"
                  onClick={() => handleChange('gender', g.value)}
                  className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: formData.gender === g.value ? PURPLE : '#e2e8f0',
                    background: formData.gender === g.value ? `${PURPLE}10` : '#fff'
                  }}>
                  
                      <span className="text-2xl">{g.emoji}</span>
                      <span className="text-xs font-medium" style={{ color: formData.gender === g.value ? PURPLE : '#64748b' }}>{g.label}</span>
                    </button>
                )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-medium" style={{ color: DARK }}>
                {t('form_image')} <span className="text-red-500">*</span>
              </Label>
              {formData.childImage ?
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2" style={{ borderColor: PURPLE }}>
                  <img src={formData.childImage} alt="Child" className="w-full h-full object-cover" />
                  <button type="button" onClick={removeImage} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div> :

            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
            style={{ borderColor: uploading ? '#cbd5e1' : `${PURPLE}60`, background: uploading ? '#f8fafc' : `${PURPLE}05` }}>
              
                  <input type="file" accept="image/jpeg,image/png,image/jpg,.heic,.heif" onChange={handleImageUpload} className="hidden" />
                  {uploading ?
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: PURPLE }} /> :

              <>
                      <Upload className="w-6 h-6 mb-1" style={{ color: PURPLE }} />
                      <span className="text-xs font-medium" style={{ color: PURPLE }}>{t('form_upload')}</span>
                    </>
              }
                </label>
            }
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {isHe ?
              'העלו תמונה של הילד/ה כדי שהסיפור יהיה אישי ומיוחד 📸' :
              "Upload a photo to make the story personal and unique 📸"}
              </p>

              {/* Image consent checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer mt-3 p-3 rounded-xl border" style={{ borderColor: formData.imageConsent ? `${PURPLE}40` : '#e2e8f0', background: formData.imageConsent ? `${PURPLE}05` : '#fff' }}>
                <input
                  type="checkbox"
                  checked={formData.imageConsent || false}
                  onChange={(e) => handleChange('imageConsent', e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: PURPLE }}
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  {isHe ? (
                    <>
                      אני מאשר/ת את העלאת תמונת הילד/ה ליצירת סיפור אישי, ומסכים/ה ל-{' '}
                      <span className="font-medium" style={{ color: PURPLE }}>תנאי השימוש</span>.
                      אנו מתחייבים למחוק את התמונה מהמאגר שלנו תוך חודש ממועד ההעלאה. 🔒
                    </>
                  ) : (
                    <>
                      I consent to uploading my child's photo for a personalized story and agree to the{' '}
                      <span className="font-medium" style={{ color: PURPLE }}>Terms of Use</span>.
                      We commit to deleting the photo from our database within one month of upload. 🔒
                    </>
                  )}
                </span>
              </label>
            </div>
          </motion.div>
        }

        {/* STEP 2: Story Setting */}
        {formStep === 1 &&
        <motion.div
          key="step2"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="space-y-5">
          
            <h3 className="text-lg font-bold pb-2" style={{ color: DARK, borderBottom: `2px solid ${GOLD}40` }}>
              {t('form_story_world')}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {settings.map((s) => {
              const isSelected = formData.setting === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => handleChange('setting', s.value)}
                  className="flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border-2 transition-all hover:scale-[1.03]"
                  style={{
                    borderColor: isSelected ? PURPLE : '#e2e8f0',
                    background: isSelected ? `linear-gradient(135deg, ${PURPLE}10, ${GOLD}10)` : '#fff',
                    boxShadow: isSelected ? `0 8px 24px ${PURPLE}20` : 'none'
                  }}>
                  
                    <span className="text-4xl">{s.emoji}</span>
                    <span className="text-sm font-bold" style={{ color: isSelected ? PURPLE : DARK }}>{s.label}</span>
                  </button>);

            })}
            </div>
          </motion.div>
        }

        {/* STEP 3: Challenge */}
        {formStep === 2 &&
        <motion.div
          key="step3"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="space-y-5">
          
            <h3 className="text-lg font-bold pb-2" style={{ color: DARK, borderBottom: `2px solid ${GOLD}40` }}>
              {t('form_challenge_section')}
            </h3>

            <div className="space-y-2">
              <Label className="font-medium" style={{ color: DARK }}>{t('form_challenge')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {challengeTypes.map((c) => {
                const isSelected = formData.challengeType === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleChange('challengeType', c.value)}
                    className="flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all hover:scale-[1.02]"
                    style={{
                      borderColor: isSelected ? PURPLE : '#e2e8f0',
                      background: isSelected ? `${PURPLE}08` : '#fff',
                      boxShadow: isSelected ? `0 6px 20px ${PURPLE}15` : 'none'
                    }}>
                    
                      <span className="text-2xl">{c.emoji}</span>
                      <span className="text-sm font-medium text-right" style={{ color: isSelected ? PURPLE : DARK }}>{c.label}</span>
                    </button>);

              })}
              </div>
            </div>

            {/* Custom challenge input when "Other" is selected */}
            {formData.challengeType === 'other' &&
          <div className="space-y-2">
                <Label className="font-medium" style={{ color: DARK }}>
                  {isHe ? 'תארו את האתגר (עד 4 מילים)' : 'Describe the challenge (up to 4 words)'} <span className="text-red-500">*</span>
                </Label>
                <Input
              value={formData.customChallenge || ''}
              onChange={(e) => {
                const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                if (words.length <= 4) {
                  handleChange('customChallenge', e.target.value);
                } else {
                  // Allow only first 4 words
                  handleChange('customChallenge', words.slice(0, 4).join(' '));
                }
              }}
              placeholder={isHe ? 'למשל: קנאה באח, מעבר גן...' : 'e.g.: sibling rivalry, new school...'}
              className="h-12 rounded-xl"
              style={{ borderColor: `${PURPLE}40` }} />
            
                <p className="text-xs text-slate-400">
                  {isHe ?
              `${(formData.customChallenge || '').trim().split(/\s+/).filter(Boolean).length}/4 מילים` :
              `${(formData.customChallenge || '').trim().split(/\s+/).filter(Boolean).length}/4 words`}
                </p>
              </div>
          }

            <div className="space-y-2">
              <Label className="font-medium" style={{ color: DARK }}>{t('form_trigger')}</Label>
              <Textarea
              value={formData.triggerDesc}
              onChange={(e) => handleChange('triggerDesc', e.target.value)}
              placeholder={t('form_trigger_ph')}
              className="rounded-xl resize-none"
              style={{ borderColor: `${PURPLE}30` }}
              rows={2} />
            
            </div>

            <div className="space-y-2">
              <Label className="font-medium" style={{ color: DARK }}>{t('form_reaction')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {reactionTypes.map((r) => {
                const isSelected = formData.reactionType === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => handleChange('reactionType', r.value)}
                    className="px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all"
                    style={{
                      borderColor: isSelected ? PURPLE : '#e2e8f0',
                      background: isSelected ? `${PURPLE}10` : '#fff',
                      color: isSelected ? PURPLE : DARK
                    }}>
                    
                      {r.label}
                    </button>);

              })}
              </div>
            </div>
          </motion.div>
        }

        {/* STEP 4: Hobbies + Contact + Summary */}
        {formStep === 3 &&
        <motion.div
          key="step4"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="space-y-5">
          
            <h3 className="text-lg font-bold pb-2" style={{ color: DARK, borderBottom: `2px solid ${GOLD}40` }}>
              {t('form_personal')}
            </h3>

            <div className="space-y-2">
              <Label className="font-medium" style={{ color: DARK }}>{t('form_hobbies')}</Label>
              <Textarea
              value={formData.hobbies}
              onChange={(e) => handleChange('hobbies', e.target.value)}
              placeholder={t('form_hobbies_ph')}
              className="rounded-xl resize-none"
              style={{ borderColor: `${PURPLE}30` }}
              rows={2} />
            
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-base font-semibold pb-1 border-b border-slate-100" style={{ color: DARK }}>
                {isHe ? 'פרטי התקשרות' : 'Contact Details'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-medium" style={{ color: DARK }}>{t('form_email')} <span className="text-red-500">*</span></Label>
                  <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="your@email.com"
                  className="h-11 rounded-xl"
                  style={{ borderColor: `${PURPLE}30` }}
                  required />
                
                </div>
                <div className="space-y-2">
                  <Label className="font-medium" style={{ color: DARK }}>{t('form_phone')}</Label>
                  <Input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="050-0000000"
                  className="h-11 rounded-xl"
                  style={{ borderColor: `${PURPLE}30` }} />
                
                </div>
              </div>
            </div>

            {/* Summary */}
            








          
          </motion.div>
        }
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        {formStep > 0 &&
        <Button
          type="button"
          variant="outline"
          onClick={handlePrev}
          className="h-12 px-6 rounded-xl"
          disabled={isLoading || uploading}>
          
            {isHe ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            <span className="ml-1">{isHe ? 'חזור' : 'Back'}</span>
          </Button>
        }

        <div className="flex-1" />

        {formStep < 3 ?
        <Button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid(formStep) || isLoading || uploading}
          className="h-12 px-8 rounded-xl text-white font-semibold shadow-lg transition-all"
          style={{ background: PURPLE, boxShadow: `0 8px 24px ${PURPLE}30` }}>
          
            <span className="mr-1">{isHe ? 'המשך' : 'Next'}</span>
            {isHe ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </Button> :

        <Button
          type="submit"
          disabled={isLoading || uploading}
          className="h-14 px-8 text-lg rounded-xl text-white font-bold shadow-lg transition-all"
          style={{ background: `linear-gradient(135deg, ${LIGHT_PURPLE}, ${GOLD})`, boxShadow: `0 8px 24px ${LIGHT_PURPLE}30` }}>
          
            {isLoading ?
          <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />{t('form_writing')}</span> :

          <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {isHe ? 'המשך ליצירת הספר ←' : 'Continue to Create Book →'}
              </span>
          }
          </Button>
        }
      </div>
    </form>);

}