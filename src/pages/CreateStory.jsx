import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import StoryForm from '../components/story/StoryForm';
import { useLanguage } from '../components/LanguageContext';

export default function CreateStory() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedStory, setGeneratedStory] = useState(null);
  const [formData, setFormData] = useState({
    childName: '', childAge: '', gender: '', childImage: '',
    setting: '', challengeType: '', triggerDesc: '',
    reactionType: '', hobbies: '', contactEmail: '', contactPhone: '',
  });

  useEffect(() => {
    loadUser();
    // Show success toast if coming back from payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      const isHe = lang === 'he';
      toast.success(isHe
        ? '🎉 הקרדיטים התווספו! כעת תוכלו למלא את השאלון וליצור את הסיפור שלכם.'
        : '🎉 Credits added! You can now fill the questionnaire and create your story.',
        { duration: 7000 }
      );
    }
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      // Sync credits from DB (source of truth)
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
    } catch (e) {
      base44.auth.redirectToLogin(window.location.href);
    }
  };

  const validateForm = () => {
    if (!formData.childName || !formData.childAge || !formData.gender || !formData.setting || !formData.challengeType) {
      setError(t('create_error_required'));
      return false;
    }
    if (!formData.childImage) {
      setError(lang === 'he' ? 'חובה להעלות תמונה של הילד/ה לפני שליחת הטופס 📸' : 'Please upload a photo of your child before submitting 📸');
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

  // Save story as pending_payment and go to Pricing to buy credits
  const handleSaveAndPay = async () => {
    setError('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const savedStory = await base44.entities.Story.create(buildStoryData('pending_payment'));
      base44.analytics.track({ eventName: 'story_saved_pending_payment', properties: { story_id: savedStory.id } });
      navigate('/Pricing');
    } catch (err) {
      setError(t('create_error_save'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Check credits first before saving anything
      const currentUser = await base44.auth.me();
      const currentCredits = currentUser.credits || 0;

      // Save story — status depends on whether user has enough credits
      const hasCredits = currentCredits >= 20;
      const savedStory = await base44.entities.Story.create(buildStoryData(hasCredits ? 'draft' : 'pending_payment'));

      base44.analytics.track({ eventName: 'questionnaire_submitted', properties: { story_id: savedStory.id } });

      if (!hasCredits) {
        // No credits — save as pending_payment and navigate to Pricing
        base44.analytics.track({ eventName: 'story_saved_pending_payment', properties: { story_id: savedStory.id } });
        navigate('/Pricing');
        return;
      }

      // Has credits — process immediately via server-side function
      const result = await base44.functions.invoke('submitStoryWithCredits', { story_id: savedStory.id });

      if (result.data?.success) {
        const newCredits = result.data.credits_remaining;
        await base44.auth.updateMe({ credits: newCredits });
        setUser(prev => ({ ...prev, credits: newCredits }));
        window.dispatchEvent(new Event('credits-updated'));
        base44.analytics.track({ eventName: 'credits_used', properties: { story_id: savedStory.id } });
        setGeneratedStory(savedStory);
      } else {
        navigate('/Pricing');
      }
    } catch (err) {
      setError(t('create_error_save'));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setGeneratedStory(null);
    setFormData({ childName: '', childAge: '', gender: '', childImage: '', setting: '', challengeType: '', triggerDesc: '', reactionType: '', hobbies: '', contactEmail: '', contactPhone: '' });
  };

  if (!user) {
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
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="border-0 shadow-xl shadow-slate-100">
              <CardContent className="p-8 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-slate-200 border-t-slate-700 rounded-full mx-auto mb-4" />
                <p className="text-gray-600">{t('create_saving')}</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : generatedStory ? (
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
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="border-0 shadow-xl shadow-slate-100">
              <CardContent className="p-6 md:p-8">
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}
                <StoryForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} onSaveAndPay={handleSaveAndPay} isLoading={isLoading} userCredits={user?.credits || 0} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}