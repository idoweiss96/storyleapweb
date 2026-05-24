import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import StoryForm from '../components/story/StoryForm';
import { useLanguage } from '../components/LanguageContext';

const PENDING_FORM_KEY = 'storyLeap_pendingFormData';

export default function CreateStory() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const isHe = lang === 'he';
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatedStory, setGeneratedStory] = useState(null);
  const [formData, setFormData] = useState(() => {
    // Restore saved form data if returning from Pricing
    try {
      const saved = sessionStorage.getItem(PENDING_FORM_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      childName: '', childAge: '', gender: '', childImage: '',
      setting: '', challengeType: '', triggerDesc: '',
      reactionType: '', hobbies: '', contactEmail: '', contactPhone: '',
    };
  });

  useEffect(() => {
    initPage();
  }, []);

  // Persist form data to sessionStorage whenever it changes (so it survives Pricing redirect)
  useEffect(() => {
    const hasData = formData.childName || formData.childAge || formData.childImage;
    if (hasData) {
      sessionStorage.setItem(PENDING_FORM_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const initPage = async () => {
    setIsLoading(true);
    try {
      const currentUser = await base44.auth.me();
      // Sync credits from DB
      try {
        const users = await base44.entities.User.filter({ email: currentUser.email });
        if (users[0]?.credits !== undefined) {
          currentUser.credits = users[0].credits;
          await base44.auth.updateMe({ credits: users[0].credits });
        }
      } catch (_) {}
      if (currentUser.credits === undefined || currentUser.credits === null) {
        await base44.auth.updateMe({ credits: 0 });
        currentUser.credits = 0;
      }
      setUser(currentUser);

      const urlParams = new URLSearchParams(window.location.search);

      // Returning after login — proceed automatically
      if (urlParams.get('resume') === '1') {
        window.history.replaceState({}, '', window.location.pathname);
        // Form data already restored from sessionStorage in useState initializer
        // Just load the user and show the form (already logged in)
      }

      // Returning from Pricing after buying credits
      if (urlParams.get('payment') === 'success') {
        window.history.replaceState({}, '', window.location.pathname);
        toast.success(isHe
          ? '🎉 הקרדיטים התווספו! כעת תוכלו ליצור את הסיפור.'
          : '🎉 Credits added! You can now create your story.',
          { duration: 5000 }
        );
      }
    } catch (e) {
      // Not logged in
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    // Save form before redirecting to login
    sessionStorage.setItem(PENDING_FORM_KEY, JSON.stringify(formData));
    const returnUrl = window.location.href.split('?')[0] + '?resume=1';
    base44.auth.redirectToLogin(returnUrl);
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
    challenge_type: formData.challengeType, trigger_desc: formData.triggerDesc || null,
    reaction_type: formData.reactionType || null, hobbies: formData.hobbies || null,
    contact_email: formData.contactEmail || null, contact_phone: formData.contactPhone || null,
    content: null, story_link: null, payment_status: paymentStatus,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    // Not logged in → redirect to login (form is saved in sessionStorage)
    if (!user) {
      handleLogin();
      return;
    }

    const currentCredits = user.credits || 0;
    if (currentCredits < 20) {
      // Save and go buy credits
      handleSaveAndPay();
      return;
    }

    setIsLoading(true);
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
      } else {
        handleSaveAndPay();
      }
    } catch (err) {
      setError(t('create_error_save'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndPay = async () => {
    setError('');
    if (!validateForm()) return;
    if (!user) { handleLogin(); return; }

    setIsLoading(true);
    try {
      const savedStory = await base44.entities.Story.create(buildStoryData('pending_payment'));
      base44.analytics.track({ eventName: 'story_saved_pending_payment', properties: { story_id: savedStory.id } });
      // Keep form data in sessionStorage so it's available if user returns
      navigate('/Pricing');
    } catch (err) {
      setError(t('create_error_save'));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    sessionStorage.removeItem(PENDING_FORM_KEY);
    setGeneratedStory(null);
    setFormData({ childName: '', childAge: '', gender: '', childImage: '', setting: '', challengeType: '', triggerDesc: '', reactionType: '', hobbies: '', contactEmail: '', contactPhone: '' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full" />
      </div>
    );
  }

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
        {generatedStory ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Card className="border-0 shadow-xl shadow-slate-100">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('create_success_title')}</h2>
                <p className="text-gray-600 mb-6 whitespace-pre-line">
                  {generatedStory.child_name} {t('create_success_msg_suffix')}
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

        ) : !user ? (
          /* Not logged in — show login prompt inline */
          <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-0 shadow-xl shadow-slate-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-5">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">
                  {isHe ? 'כניסה / הרשמה' : 'Sign in / Register'}
                </h2>
                <p className="text-slate-500 mb-6 leading-relaxed">
                  {isHe
                    ? 'כדי ליצור סיפור אישי לילד/ה שלך, יש להתחבר או להירשם תחילה.'
                    : 'To create a personalized story, please sign in or register first.'}
                </p>
                <Button
                  onClick={handleLogin}
                  className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base"
                >
                  <LogIn className="w-5 h-5 ml-2" />
                  {isHe ? 'התחבר / הירשם עם מייל' : 'Sign in / Register with email'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

        ) : (
          /* Logged in — show form */
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
                  onSubmit={handleSubmit}
                  onSaveAndPay={handleSaveAndPay}
                  isLoading={isLoading}
                  userCredits={user.credits || 0}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}