import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, AlertCircle, Loader2, ShoppingCart, Tag, Mail } from 'lucide-react';
import { toast } from 'sonner';
import StoryForm from '../components/story/StoryForm';
import LoginPromptModal from '../components/story/LoginPromptModal';
import FreePreviewOffer from '../components/story/FreePreviewOffer';
import { useLanguage } from '../components/LanguageContext';
import { useNavPath } from '@/lib/useNavPath';
import { trackEvent } from '@/lib/posthog';

// Uses localStorage (not sessionStorage) so the saved questionnaire survives a
// registration/email-verification flow that continues in a new tab.
const PENDING_FORM_KEY = 'storyLeap_pendingFormData';

// Steps: 'form' | 'credits_check' | 'success'
export default function CreateStory() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const navPath = useNavPath();
  const isHe = lang === 'he';
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'credits_check' | 'success'
  const [generatedStory, setGeneratedStory] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [couponStatus, setCouponStatus] = useState(null); // null | 'validating' | 'valid' | 'invalid'
  const [couponMessage, setCouponMessage] = useState('');
  const [previewState, setPreviewState] = useState(null); // null | 'sending' | 'sent' | 'already_used' | 'error'
  const [fromChip] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const val = urlParams.get('from');
    const validKeys = ['chip_new', 'chip_fear', 'chip_moving', 'chip_friendship', 'chip_separation', 'chip_emotions', 'chip_other'];
    return validKeys.includes(val) ? val : null;
  });
  const [formData, setFormData] = useState({
    childName: '', childAge: '', gender: '', childImage: '',
    parentImage: '', parentRelation: '',
    setting: '', challengeType: '', customChallenge: '', triggerDesc: '',
    reactionType: '', hobbies: '', contactEmail: '', contactPhone: '',
    couponCode: '',
  });

  useEffect(() => {
    initPage();
    trackEvent('questionnaire_started');
  }, []);

  const initPage = async () => {
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const previewId = urlParams.get('previewId');

      let currentUser = null;
      try {
        currentUser = await base44.auth.me();
      } catch (_) {
        currentUser = null;
      }

      // Guest arriving from a "Continue the story" preview email link — send them to
      // login/register first, then return here with the same previewId so they land
      // straight on the purchase flow for that story instead of a blank questionnaire.
      if (previewId && !currentUser) {
        const returnUrl = `${window.location.origin}${window.location.pathname}?previewId=${previewId}`;
        base44.auth.redirectToLogin(returnUrl);
        return;
      }

      if (currentUser) {
        // Sync credits from DB via backend function
        try {
          const res = await base44.functions.invoke('getUserCredits', {});
          if (res.data?.credits !== undefined) {
            currentUser.credits = res.data.credits;
          }
        } catch (_) {}
        if (currentUser.credits === undefined || currentUser.credits === null) {
          await base44.auth.updateMe({ credits: 0 });
          currentUser.credits = 0;
        }
      }
      setUser(currentUser);

      // "Continue the story" from a preview email / My Stories — prefill the questionnaire
      // from the saved preview record so the parent never has to re-enter their answers.
      if (previewId) {
        window.history.replaceState({}, '', window.location.pathname);
        try {
          const res = await base44.functions.invoke('getStoryPreview', { id: previewId });
          const p = res.data?.preview;
          if (p) {
            setFormData({
              childName: p.child_name || '', childAge: p.child_age ? String(p.child_age) : '', gender: p.gender || '',
              childImage: p.child_image_url || '', parentImage: p.parent_image_url || '', parentRelation: p.parent_relation || '',
              setting: p.setting || '', challengeType: p.challenge_type || '', customChallenge: p.custom_challenge || '',
              triggerDesc: p.trigger_desc || '', reactionType: p.reaction_type || '', hobbies: p.hobbies || '',
              contactEmail: p.contact_email || '', contactPhone: p.contact_phone || '', couponCode: '',
            });
            setStep('credits_check');
            setIsLoading(false);
            return;
          }
        } catch (_) {}
      }

      if (urlParams.get('resume') === '1') {
        window.history.replaceState({}, '', window.location.pathname);
      }

      // Restore any questionnaire saved before a login/registration redirect.
      // Checked on every visit (not just when a resume=1 param is present) so the
      // answers are recovered even if verification finished in a different tab.
      // Skipped when arriving fresh from a Hero chip, so the user always lands on
      // the actual questionnaire form instead of an old saved summary.
      const saved = urlParams.get('from') ? null : localStorage.getItem(PENDING_FORM_KEY);
      if (saved) {
        try {
          const savedForm = JSON.parse(saved);
          setFormData(savedForm);
          // Don't remove yet — will remove after the story is created or saved as pending payment
          setStep('credits_check');
        } catch (_) {}
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.childName || !formData.childAge || !formData.gender || !formData.setting || !formData.challengeType) {
      setError(t('create_error_required'));
      return false;
    }
    if (!formData.childImage) {
      setError(isHe ? 'חובה להעלות תמונה של הילד/ה לפני שליחת הטופס 📸' : 'Please upload a photo of your child before submitting 📸');
      return false;
    }
    return true;
  };

  const buildStoryData = (paymentStatus) => ({
    child_name: formData.childName, child_age: parseInt(formData.childAge), gender: formData.gender,
    child_image_url: formData.childImage || null,
    parent_image_url: formData.parentImage || null, parent_relation: formData.parentImage ? (formData.parentRelation || null) : null,
    setting: formData.setting,
    challenge_type: formData.challengeType, custom_challenge: formData.challengeType === 'other' ? (formData.customChallenge || null) : null, trigger_desc: formData.triggerDesc || null,
    reaction_type: formData.reactionType || null, hobbies: formData.hobbies || null,
    contact_email: formData.contactEmail || null, contact_phone: formData.contactPhone || null,
    content: null, story_link: null, payment_status: paymentStatus, lang,
  });

  // Step 1: User clicks "המשך ליצירת הספר"
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    if (!user) {
      // Guest: save form data and show a recap before asking to sign in
      localStorage.setItem(PENDING_FORM_KEY, JSON.stringify(formData));
      trackEvent('questionnaire_recap_reached');
      setStep('recap');
      return;
    }

    // Logged in → go to credits check step
    setStep('credits_check');
  };

  const settingLabels = { space: t('setting_space'), forest: t('setting_forest'), castle: t('setting_castle'), sports: t('setting_sports'), real_life: t('setting_real_life') };
  const challengeLabels = { fears: t('ch_fears'), social_difficulty: t('ch_social'), changes: t('ch_changes'), emotional_regulation: t('ch_emotional'), separation_anxiety: t('ch_separation'), self_confidence: t('ch_confidence'), sleep_issues: t('ch_sleep'), other: formData.customChallenge };

  // Step 2: User clicks "צור ספר" (has credits)
  const handleCreateStory = async () => {
    setError('');
    setIsCreating(true);
    try {
      const savedStory = await base44.entities.Story.create(buildStoryData('draft'));
      base44.analytics.track({ eventName: 'questionnaire_submitted', properties: { story_id: savedStory.id } });

      const result = await base44.functions.invoke('submitStoryWithCredits', { story_id: savedStory.id });
      if (result.data?.success) {
        const newCredits = result.data.credits_remaining;
        await base44.auth.updateMe({ credits: newCredits });
        setUser(prev => ({ ...prev, credits: newCredits }));
        window.dispatchEvent(new Event('credits-updated'));
        localStorage.removeItem(PENDING_FORM_KEY);
        base44.analytics.track({ eventName: 'credits_used', properties: { story_id: savedStory.id } });
        setGeneratedStory(savedStory);
        setStep('success');
      } else {
        setError(t('create_error_save'));
      }
    } catch (err) {
      setError(t('create_error_save'));
    } finally {
      setIsCreating(false);
    }
  };

  // Low-friction alternative to purchasing: email the first two pages of the story for free.
  // Limited to one per email address, enforced server-side.
  const handleRequestPreview = async () => {
    setPreviewState('sending');
    try {
      const res = await base44.functions.invoke('requestStoryPreview', {
        childName: formData.childName, childAge: formData.childAge, gender: formData.gender,
        childImageUrl: formData.childImage || null, parentImageUrl: formData.parentImage || null,
        parentRelation: formData.parentImage ? (formData.parentRelation || null) : null,
        setting: formData.setting, challengeType: formData.challengeType,
        customChallenge: formData.challengeType === 'other' ? (formData.customChallenge || null) : null,
        triggerDesc: formData.triggerDesc || null, reactionType: formData.reactionType || null,
        hobbies: formData.hobbies || null, contactEmail: formData.contactEmail, contactPhone: formData.contactPhone || null,
        lang,
      });
      if (res.data?.success) {
        setPreviewState('sent');
        trackEvent('free_preview_requested');
      } else if (res.data?.reason === 'already_used') {
        setPreviewState('already_used');
      } else {
        setPreviewState('error');
      }
    } catch (err) {
      setPreviewState('error');
    }
  };

  // Redeem coupon code — free coupons add credits, discount coupons redirect to Pricing
  const handleRedeemCoupon = async () => {
    if (!formData.couponCode) return;
    setCouponStatus('validating');
    setCouponMessage('');
    try {
      const result = await base44.functions.invoke('validateCoupon', { code: formData.couponCode });
      if (result.data?.valid) {
        if (result.data.type === 'discount') {
          // Discount coupon — redirect to Pricing page with code pre-filled
          navigate(navPath('Pricing') + '?code=' + encodeURIComponent(formData.couponCode));
        } else {
          // Free coupon — credits added
          const newCredits = result.data.new_total;
          await base44.auth.updateMe({ credits: newCredits });
          setUser(prev => ({ ...prev, credits: newCredits }));
          window.dispatchEvent(new Event('credits-updated'));
          setCouponStatus('valid');
          setCouponMessage(isHe ? `🎉 הקופון מומש! קיבלת ${result.data.credits_added} קרדיטים` : `🎉 Coupon redeemed! You got ${result.data.credits_added} credits`);
          toast.success(isHe ? 'הקופון מומש בהצלחה!' : 'Coupon redeemed successfully!');
        }
      } else {
        setCouponStatus('invalid');
        setCouponMessage(result.data?.error || (isHe ? 'קוד קופון לא תקין' : 'Invalid coupon code'));
      }
    } catch (err) {
      setCouponStatus('invalid');
      setCouponMessage(isHe ? 'שגיאה במימוש הקופון' : 'Error redeeming coupon');
    }
  };

  // Step 2 alt: User clicks "רכישת קרדיטים" (no credits)
  const handleBuyCredits = async () => {
    setError('');
    setIsCreating(true);
    try {
      // Save story as pending_payment so it appears in MyStories after purchase
      const savedStory = await base44.entities.Story.create(buildStoryData('pending_payment'));
      base44.analytics.track({ eventName: 'story_saved_pending_payment', properties: { story_id: savedStory.id } });
      localStorage.removeItem(PENDING_FORM_KEY);
      navigate(navPath('Pricing'));
    } catch (err) {
      setError(t('create_error_save'));
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    localStorage.removeItem(PENDING_FORM_KEY);
    setGeneratedStory(null);
    setStep('form');
    setFormData({ childName: '', childAge: '', gender: '', childImage: '', parentImage: '', parentRelation: '', setting: '', challengeType: '', customChallenge: '', triggerDesc: '', reactionType: '', hobbies: '', contactEmail: '', contactPhone: '', couponCode: '' });
    setCouponStatus(null);
    setCouponMessage('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full" />
      </div>
    );
  }

  const userCredits = user?.credits || 0;
  const hasCredits = userCredits >= 110;

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="text-center mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg shadow-slate-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </motion.div>
        {fromChip && (
          <p className="text-sm font-semibold text-blue-600 mb-2">{t('helping_with')} {t(fromChip)}</p>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('create_title')}</h1>
        <p className="text-gray-600">{t('create_subtitle')}</p>
      </div>

      <AnimatePresence initial={false}>

        {/* SUCCESS */}
        {step === 'success' && generatedStory && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Card className="border-0 shadow-xl shadow-slate-100">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{isHe ? `✨ הספר של ${generatedStory.child_name} בהכנה 🎬` : `✨ ${generatedStory.child_name}'s story is being created 🎬`}</h2>
                <p className="text-gray-600 mb-6">
                  {isHe ? `אנחנו יוצרים עכשיו את הסיפור של ${generatedStory.child_name}. אתה תקבל מייל כשהסיפור יהיה מוכן לקריאה!` : `We're creating ${generatedStory.child_name}'s story now. You'll receive an email when the story is ready to read!`}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => navigate(createPageUrl('MyStories'))} className="rounded-xl">
                    {t('create_to_stories')}
                  </Button>
                  <Button onClick={resetForm} className="bg-slate-800 hover:bg-slate-700 rounded-xl">
                    {t('create_another')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* RECAP — guest confirms their answers before being asked to sign in */}
        {step === 'recap' && (
          <motion.div key="recap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-0 shadow-xl shadow-slate-100">
              <CardContent className="p-8">
                <h3 className="font-semibold text-slate-700 mb-4 text-sm">
                  {isHe ? '✅ בואו נאשר את הפרטים לפני שממשיכים' : "✅ Let's confirm your details before continuing"}
                </h3>
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  {formData.childImage && (
                    <div className="flex justify-center pb-2 ph-no-capture">
                      <img src={formData.childImage} alt={formData.childName} className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow" />
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t('form_child_name')}</span>
                    <span className="font-semibold text-slate-800">{formData.childName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t('form_age')}</span>
                    <span className="font-semibold text-slate-800">{formData.childAge}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t('form_setting')}</span>
                    <span className="font-semibold text-slate-800">{settingLabels[formData.setting] || formData.setting}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t('form_challenge')}</span>
                    <span className="font-semibold text-slate-800">{challengeLabels[formData.challengeType] || formData.challengeType}</span>
                  </div>
                  {formData.triggerDesc && (
                    <div className="flex justify-between text-sm gap-4">
                      <span className="text-slate-500 shrink-0">{t('form_trigger')}</span>
                      <span className="font-semibold text-slate-800 text-right">{formData.triggerDesc}</span>
                    </div>
                  )}
                  {formData.hobbies && (
                    <div className="flex justify-between text-sm gap-4">
                      <span className="text-slate-500 shrink-0">{t('form_hobbies')}</span>
                      <span className="font-semibold text-slate-800 text-right">{formData.hobbies}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                    <span className="text-slate-500">{t('form_email')}</span>
                    <span className="font-semibold text-slate-800 ph-mask">{formData.contactEmail}</span>
                  </div>
                </div>

                <Button
                  onClick={() => { trackEvent('login_register_reached'); setShowLoginModal(true); }}
                  className="w-full h-14 text-lg rounded-xl bg-slate-800 hover:bg-slate-700 shadow-lg transition-all mb-3"
                >
                  {isHe ? 'הכל נכון, המשך להתחברות' : "Looks good, continue to Sign In"}
                </Button>

                <FreePreviewOffer previewState={previewState} onRequest={handleRequestPreview} isHe={isHe} childName={formData.childName} />

                <button
                  onClick={() => setStep('form')}
                  className="w-full text-sm text-slate-400 hover:text-slate-600"
                >
                  {isHe ? '← חזרה לעריכת השאלון' : '← Back to edit questionnaire'}
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CREDITS CHECK — shown after login/form, user is logged in */}
        {step === 'credits_check' && user && (
          <motion.div key="credits" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-0 shadow-xl shadow-slate-100">
              <CardContent className="p-8">
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Summary of what they filled */}
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-700 mb-2 text-sm">
                    {isHe ? '✅ השאלון מולא עבור:' : '✅ Questionnaire filled for:'}
                  </h3>
                  <p className="text-slate-800 font-bold text-lg">{formData.childName}</p>
                  <p className="text-slate-500 text-sm">{isHe ? `גיל ${formData.childAge}` : `Age ${formData.childAge}`}</p>
                </div>

                {/* Coupon redemption section */}
                {couponStatus !== 'valid' && (
                  <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">
                        {isHe ? 'יש לך קוד קופון? הזן/י אותו כאן' : 'Have a coupon code? Enter it here'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={formData.couponCode || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, couponCode: e.target.value }))}
                        placeholder={isHe ? 'הזן קוד קופון' : 'Enter coupon code'}
                        className="flex-1 h-10 rounded-xl border-purple-300"
                      />
                      <Button
                        onClick={handleRedeemCoupon}
                        disabled={couponStatus === 'validating' || !formData.couponCode}
                        variant="outline"
                        className="h-10 rounded-xl border-purple-300 text-purple-700 hover:bg-purple-100"
                      >
                        {couponStatus === 'validating' ? (
                          <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />{isHe ? '...' : '...'}</span>
                        ) : (
                          isHe ? 'ממש 🎁' : 'Redeem 🎁'
                        )}
                      </Button>
                    </div>
                    {couponStatus === 'invalid' && couponMessage && (
                      <p className="text-sm text-red-600 mt-2">{couponMessage}</p>
                    )}
                  </div>
                )}

                {couponStatus === 'valid' && couponMessage && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-center">
                    <p className="text-sm text-green-700 font-medium">{couponMessage}</p>
                  </div>
                )}

                {hasCredits ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-center">
                      <p className="text-sm text-green-700 font-medium">
                        ⭐ {isHe ? `יש לך ${userCredits} קרדיטים, מספיק ליצירת הספר!` : `You have ${userCredits} credits, enough to create the book!`}
                      </p>
                    </div>
                    <Button
                      onClick={handleCreateStory}
                      disabled={isCreating}
                      className="w-full h-14 text-lg rounded-xl bg-slate-800 hover:bg-slate-700 shadow-lg transition-all"
                    >
                      {isCreating ? (
                        <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />{t('form_writing')}</span>
                      ) : (
                        <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" />{isHe ? 'צור ספר (110 ⭐)' : 'Create Book (110 ⭐)'}</span>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                      <p className="text-amber-800 font-semibold mb-1">
                        {isHe ? '⚠️ נדרשים 110 קרדיטים ליצירת ספר' : '⚠️ 110 credits required to create a book'}
                      </p>
                      <p className="text-amber-600 text-sm">
                        {isHe ? `יש לך כרגע ${userCredits} קרדיטים` : `You currently have ${userCredits} credits`}
                      </p>
                    </div>
                    <Button
                      onClick={handleBuyCredits}
                      disabled={isCreating}
                      className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base"
                    >
                      {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <span className="flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5" />
                          {isHe ? 'רכישת קרדיטים והמשך' : 'Buy Credits & Continue'}
                        </span>
                      )}
                    </Button>
                  </div>
                )}

                <FreePreviewOffer previewState={previewState} onRequest={handleRequestPreview} isHe={isHe} childName={formData.childName} />

                <button
                  onClick={() => { setStep('form'); setError(''); }}
                  className="w-full text-sm text-slate-400 hover:text-slate-600 pt-4 mt-2 border-t border-slate-100"
                >
                  {isHe ? '← חזרה לעריכת השאלון' : '← Back to edit questionnaire'}
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* FORM — always shown to guests + logged-in users who haven't submitted yet */}
        {step === 'form' && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="border-0 shadow-xl shadow-slate-100">
              <CardContent className="p-6 md:p-8">
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}
                <StoryForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleFormSubmit}
                  isLoading={false}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

      </AnimatePresence>

      <AnimatePresence>
        {showLoginModal && (
          <LoginPromptModal onClose={() => setShowLoginModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}