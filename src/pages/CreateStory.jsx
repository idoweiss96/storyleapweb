import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle } from 'lucide-react';
import StoryForm from '../components/story/StoryForm';
import { useLanguage } from '../components/LanguageContext';

export default function CreateStory() {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    // Restore saved form data if returning from Pricing
    const saved = localStorage.getItem('storyFormDraft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        localStorage.removeItem('storyFormDraft');
      } catch (_) {}
    }
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      // Give 20 credits to new users on first visit
      if (currentUser.credits === undefined || currentUser.credits === null) {
        await base44.auth.updateMe({ credits: 20 });
        currentUser.credits = 20;
      }
      setUser(currentUser);
    } catch (e) {
      base44.auth.redirectToLogin(window.location.href);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.childName || !formData.childAge || !formData.gender || !formData.setting || !formData.challengeType) {
      setError(t('create_error_required'));
      return;
    }
    setIsLoading(true);
    try {
      // Save story as draft first
      const savedStory = await base44.entities.Story.create({
        child_name: formData.childName, child_age: parseInt(formData.childAge), gender: formData.gender,
        child_image_url: formData.childImage || null, setting: formData.setting,
        challenge_type: formData.challengeType, trigger_desc: formData.triggerDesc || null,
        reaction_type: formData.reactionType || null, hobbies: formData.hobbies || null,
        contact_email: formData.contactEmail || null, contact_phone: formData.contactPhone || null,
        content: null, story_link: null,
      });

      base44.analytics.track({ eventName: 'questionnaire_submitted', properties: { story_id: savedStory.id } });

      // Server-side credit check + deduction (secure)
      const result = await base44.functions.invoke('submitStoryWithCredits', { story_id: savedStory.id });

      if (result.data?.success) {
        // Credits deducted, story generation started
        const newCredits = result.data.credits_remaining;
        await base44.auth.updateMe({ credits: newCredits });
        setUser(prev => ({ ...prev, credits: newCredits }));
        window.dispatchEvent(new Event('credits-updated'));
        base44.analytics.track({ eventName: 'credits_used', properties: { story_id: savedStory.id } });
        // Notify admin only after successful payment/credits
        try {
          await base44.functions.invoke('sendFormEmail', {
            formType: 'בקשת סיפור חדש',
            name: formData.childName,
            email: formData.contactEmail || '',
            phone: formData.contactPhone || '',
            childName: formData.childName,
            childAge: formData.childAge,
            gender: formData.gender,
            setting: formData.setting,
            challengeType: formData.challengeType,
            hobbies: formData.hobbies || '',
            additionalFields: {
              'טריגר': formData.triggerDesc || '',
              'תגובה': formData.reactionType || '',
            },
          });
        } catch (_) {}
        setGeneratedStory(savedStory);
      } else {
        // Insufficient credits — save story_id for post-payment auto-trigger
        base44.analytics.track({ eventName: 'insufficient_credits_redirected', properties: { story_id: savedStory.id } });
        localStorage.setItem('pendingStoryId', savedStory.id);
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
                <StoryForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isLoading={isLoading} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}