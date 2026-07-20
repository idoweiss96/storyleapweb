import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, AlertCircle, Loader2, ShoppingCart, Tag, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/LanguageContext';

const PENDING_KEY = 'storyLeap_kitaAlefPending';

export default function KitaAlefStory() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState('details');
  const [createdStory, setCreatedStory] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [couponStatus, setCouponStatus] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [answers, setAnswers] = useState(null);

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    setIsLoading(true);
    try {
      const saved = sessionStorage.getItem(PENDING_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setAnswers(data.answers || {});
        setContactEmail(data.contactEmail || '');
        setContactPhone(data.contactPhone || '');
      }

      const currentUser = await base44.auth.me();
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
      if (urlParams.get('resume') === '1') {
        window.history.replaceState({}, '', window.location.pathname);
        if (saved) setStep('credits_check');
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const name = answers?.name || '';

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!contactEmail || !/\S+@\S+\.\S+/.test(contactEmail)) {
      setError(isEn ? 'Please enter a valid email' : 'נא למלא מייל תקין');
      return;
    }

    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ answers, contactEmail, contactPhone, lang }));

    if (!user) {
      base44.auth.redirectToLogin('/KitaAlefStory?resume=1');
      return;
    }

    setStep('credits_check');
  };

  const handleCreateStory = async () => {
    setError('');
    setIsCreating(true);
    try {
      const savedStory = await base44.entities.KitaAlefStory.create({
        child_name: answers.name || '',
        gender: answers.gender || '',
        child_image_url: answers.photo || null,
        answers: answers,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        content: null,
        story_link: null,
        payment_status: 'draft',
      });

      base44.analytics.track({ eventName: 'kita_alef_story_submitted', properties: { story_id: savedStory.id } });

      const result = await base44.functions.invoke('submitKitaAlefStoryWithCredits', { story_id: savedStory.id, lang });
      if (result.data?.success) {
        const newCredits = result.data.credits_remaining;
        await base44.auth.updateMe({ credits: newCredits });
        setUser(prev => ({ ...prev, credits: newCredits }));
        window.dispatchEvent(new Event('credits-updated'));
        sessionStorage.removeItem(PENDING_KEY);
        base44.analytics.track({ eventName: 'kita_alef_credits_used', properties: { story_id: savedStory.id } });
        setCreatedStory(savedStory);
        setStep('success');
      } else {
        setError(isEn ? 'An error occurred. Please try again.' : 'אירעה שגיאה ביצירת הסיפור. נסו שוב.');
      }
    } catch (err) {
      setError(isEn ? 'An error occurred. Please try again.' : 'אירעה שגיאה ביצירת הסיפור. נסו שוב.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleBuyCredits = async () => {
    setError('');
    setIsCreating(true);
    try {
      const savedStory = await base44.entities.KitaAlefStory.create({
        child_name: answers.name || '',
        gender: answers.gender || '',
        child_image_url: answers.photo || null,
        answers: answers,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        content: null,
        story_link: null,
        payment_status: 'draft',
      });
      base44.analytics.track({ eventName: 'kita_alef_story_saved_pending_payment', properties: { story_id: savedStory.id } });
      sessionStorage.removeItem(PENDING_KEY);
      navigate('/Pricing');
    } catch (err) {
      setError(isEn ? 'An error occurred. Please try again.' : 'אירעה שגיאה. נסו שוב.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRedeemCoupon = async () => {
    if (!couponCode) return;
    setCouponStatus('validating');
    setCouponMessage('');
    try {
      const result = await base44.functions.invoke('validateCoupon', { code: couponCode });
      if (result.data?.valid) {
        if (result.data.type === 'discount') {
          navigate('/Pricing?code=' + encodeURIComponent(couponCode));
        } else {
          const newCredits = result.data.new_total;
          await base44.auth.updateMe({ credits: newCredits });
          setUser(prev => ({ ...prev, credits: newCredits }));
          window.dispatchEvent(new Event('credits-updated'));
          setCouponStatus('valid');
          setCouponMessage(isEn
            ? `🎉 Coupon redeemed! You got ${result.data.credits_added} credits`
            : `🎉 הקופון מומש! קיבלת ${result.data.credits_added} קרדיטים`);
          toast.success(isEn ? 'Coupon redeemed successfully!' : 'הקופון מומש בהצלחה!');
        }
      } else {
        setCouponStatus('invalid');
        setCouponMessage(result.data?.error || (isEn ? 'Invalid coupon code' : 'קוד קופון לא תקין'));
      }
    } catch (err) {
      setCouponStatus('invalid');
      setCouponMessage(isEn ? 'Error redeeming coupon' : 'שגיאה במימוש הקופון');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full" />
      </div>
    );
  }

  if (!answers) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <p className="text-slate-500 mb-4">
          {isEn ? 'No questionnaire answers found. Please complete the questionnaire first.' : 'לא נמצאו תשובות שאלון. אנא מלאו את השאלון תחילה.'}
        </p>
        <Button onClick={() => navigate('/KitaAlef')} className="rounded-xl bg-slate-800 hover:bg-slate-700">
          {isEn ? 'To 1st Grade questionnaire' : 'לשאלון כיתה א׳'}
        </Button>
      </div>
    );
  }

  const userCredits = user?.credits || 0;
  const hasCredits = userCredits >= 20;

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="text-center mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A1A6E' }}>
          {isEn ? `${name}'s story 🎒✨` : `הסיפור של ${name} 🎒✨`}
        </h1>
        <p className="text-slate-600">
          {isEn ? 'Getting ready for 1st grade — a personal, heartwarming story' : 'הכנה לכיתה א׳ ביחד — סיפור אישי ומרגש'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* SUCCESS */}
        {step === 'success' && createdStory && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Card className="border-0 shadow-xl" style={{ boxShadow: '0 4px 30px rgba(255,111,181,0.12)' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1A1A6E' }}>
                  {isEn ? `✨ ${name}'s book is being created 🎬` : `✨ הספר של ${name} בהכנה 🎬`}
                </h2>
                <p className="text-slate-600 mb-6">
                  {isEn
                    ? `We're now creating ${name}'s special story. You'll get an email when it's ready to read!`
                    : `אנחנו יוצרים עכשיו את הסיפור המיוחד של ${name}. תקבלו מייל כשהסיפור יהיה מוכן לקריאה!`}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => navigate('/MyStories')} className="rounded-xl">
                    {isEn ? 'My Stories' : 'הסיפורים שלי'}
                  </Button>
                  <Button onClick={() => navigate('/KitaAlef')} className="rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}>
                    {isEn ? 'Another questionnaire' : 'שאלון נוסף'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CREDITS CHECK */}
        {step === 'credits_check' && user && (
          <motion.div key="credits" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-0 shadow-xl" style={{ boxShadow: '0 4px 30px rgba(255,111,181,0.12)' }}>
              <CardContent className="p-8">
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="mb-6 p-4 rounded-xl border" style={{ background: 'linear-gradient(135deg, #EAF8FD, #FFF0F7)', borderColor: '#F0E8F5' }}>
                  <h3 className="font-semibold mb-2 text-sm" style={{ color: '#1A1A6E' }}>
                    {isEn ? '✅ Questionnaire completed for:' : '✅ השאלון הושלם עבור:'}
                  </h3>
                  <p className="font-bold text-lg" style={{ color: '#1A1A6E' }}>{name}</p>
                  <p className="text-sm text-slate-500">{contactEmail}</p>
                </div>

                {/* Coupon redemption */}
                {couponStatus !== 'valid' && (
                  <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">
                        {isEn ? 'Have a coupon code? Enter it here' : 'יש לך קוד קופון? הזן/י אותו כאן'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder={isEn ? 'Enter coupon code' : 'הזן קוד קופון'}
                        className="flex-1 h-10 rounded-xl border-purple-300"
                      />
                      <Button
                        onClick={handleRedeemCoupon}
                        disabled={couponStatus === 'validating' || !couponCode}
                        variant="outline"
                        className="h-10 rounded-xl border-purple-300 text-purple-700 hover:bg-purple-100"
                      >
                        {couponStatus === 'validating' ? (
                          <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />...</span>
                        ) : (isEn ? 'Redeem 🎁' : 'ממש 🎁')}
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
                      <p className="text-sm text-green-700 font-medium flex items-center justify-center gap-2">
                        <Star className="w-4 h-4 fill-green-500 text-green-500" />
                        {isEn
                          ? `You have ${userCredits} credits — enough to create the book!`
                          : `יש לך ${userCredits} קרדיטים — מספיק ליצירת הספר!`}
                      </p>
                    </div>
                    <Button
                      onClick={handleCreateStory}
                      disabled={isCreating}
                      className="w-full h-14 text-lg rounded-xl text-white shadow-lg transition-all"
                      style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
                    >
                      {isCreating ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {isEn ? 'Creating story...' : 'הפיה כותבת את הסיפור...'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          {isEn ? 'Create Book (20 ⭐)' : 'צור ספר (20 ⭐)'}
                        </span>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                      <p className="text-amber-800 font-semibold mb-1">
                        {isEn ? '⚠️ 20 credits required to create a book' : '⚠️ נדרשים 20 קרדיטים ליצירת ספר'}
                      </p>
                      <p className="text-amber-600 text-sm">
                        {isEn ? `You currently have ${userCredits} credits` : `יש לך כרגע ${userCredits} קרדיטים`}
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
                          {isEn ? 'Buy Credits & Continue' : 'רכישת קרדיטים והמשך'}
                        </span>
                      )}
                    </Button>
                  </div>
                )}

                <button
                  onClick={() => { setStep('details'); setError(''); }}
                  className="w-full text-sm text-slate-400 hover:text-slate-600 pt-4 mt-2 border-t border-slate-100"
                >
                  {isEn ? '← Back to edit details' : '← חזרה לעריכת פרטים'}
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* DETAILS STEP */}
        {step === 'details' && (
          <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="border-0 shadow-xl" style={{ boxShadow: '0 4px 30px rgba(255,111,181,0.12)' }}>
              <CardContent className="p-6 md:p-8">
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Photo + name preview */}
                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #EAF8FD, #FFF0F7)' }}>
                  {answers.photo ? (
                    <img src={answers.photo} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" />
                  ) : (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white shadow" style={{ background: 'linear-gradient(135deg, #B8EBF7, #FFD6EC)' }}>
                      <span className="text-2xl">🧒</span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-lg" style={{ color: '#1A1A6E' }}>{name}</p>
                    <p className="text-sm text-slate-500">
                      {isEn ? 'Getting ready for 1st grade' : 'הכנה לכיתה א׳'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A6E' }}>
                      {isEn ? 'Email' : 'מייל'} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-12 rounded-xl"
                      required
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      {isEn ? "The story will be sent here when it's ready" : 'לכאן יישלח הסיפור כשיהיה מוכן'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A6E' }}>
                      {isEn ? 'Phone' : 'טלפון'}
                    </label>
                    <Input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="050-0000000"
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg rounded-xl text-white font-bold shadow-lg transition-all"
                    style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      {isEn ? 'Continue to book creation' : 'המשך ליצירת הספר'}
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}