import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, AlertCircle, Loader2, ShoppingCart, Tag } from 'lucide-react';
import { toast } from 'sonner';
import StoryForm from '../components/story/StoryForm';
import LoginPromptModal from '../components/story/LoginPromptModal';
import { useLanguage } from '../components/LanguageContext';

const PENDING_FORM_KEY = 'storyLeap_pendingFormData';

// Steps: 'form' | 'credits_check' | 'success'
export default function CreateStory() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
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
  const [formData, setFormData] = useState({
    childName: '', childAge: '', gender: '', childImage: '',
    setting: '', challengeType: '', customChallenge: '', triggerDesc: '',
    reactionType: '', hobbies: '', contactEmail: '', contactPhone: '',
    couponCode: '',
  });

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    setIsLoading(true);
    try {
      const currentUser = await base44.auth.me();
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
      setUser(currentUser);

      const urlParams = new URLSearchParams(window.location.search);

      // Returning after login — restore form and go to credits check
      if (urlParams.get('resume') === '1') {
        window.history.replaceState({}, '', window.location.pathname);
        const saved = sessionStorage.getItem(PENDING_FORM_KEY);
        if (saved) {
          const savedForm = JSON.parse(saved);
          setFormData(savedForm);
          // Don't remove from sessionStorage yet — will remove after story created
          setStep('credits_check');
        }
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
    child_image_url: formData.childImage || null, setting: formData.setting,
    challenge_type: formData.challengeType, custom_challenge: formData.challengeType === 'other' ? (formData.customChallenge || null) : null, trigger_desc: formData.triggerDesc || null,
    reaction_type: formData.reactionType || null, hobbies: formData.hobbies || null,
    contact_email: formData.contactEmail || null, contact_phone: formData.contactPhone || null,
    content: null, story_link: null, payment_status: paymentStatus,
  });

  // Step 1: User clicks "המשך ליצירת הספר"
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    if (!user) {
      // Save form data and prompt login
      sessionStorage.setItem(PENDING_FORM_KEY, JSON.stringify(formData));
      setShowLoginModal(true);
      return;
    }

    // Logged in → go to credits check step
    setStep('credits_check');
  };

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
        sessionStorage.removeItem(PENDING_FORM_KEY);
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
          navigate('/Pricing?code=' + encodeURIComponent(formData.couponCode));
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
      sessionStorage.removeItem(PENDING_FORM_KEY);
      navigate('/Pricing');
    } catch (err) {
      setError(t('create_error_save'));
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    sessionStorage.removeItem(PENDING_FORM_KEY);
    setGeneratedStory(null);
    setStep('form');
    setFormData({ childName: '', childAge: '', gender: '', childImage: '', setting: '', challengeType: '', customChallenge: '', triggerDesc: '', reactionType: '', hobbies: '', contactEmail: '', contactPhone: '', couponCode: '' });
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
  const hasCredits = userCredits >= 20;

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="text-center mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg shadow-slate-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('create_title')}</h1>
        <p className="text-gray-600">{t('create_subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">

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
                        ⭐ {isHe ? `יש לך ${userCredits} קרדיטים — מספיק ליצירת הספר!` : `You have ${userCredits} credits — enough to create the book!`}
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
                        <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" />{isHe ? 'צור ספר (20 ⭐)' : 'Create Book (20 ⭐)'}</span>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                      <p className="text-amber-800 font-semibold mb-1">
                        {isHe ? '⚠️ נדרשים 20 קרדיטים ליצירת ספר' : '⚠️ 20 credits required to create a book'}
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