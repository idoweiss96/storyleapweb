import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, AlertCircle, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

import StoryForm from '../components/story/StoryForm';

const settingLabels = {
  space: 'חלל',
  forest: 'יער קסום',
  castle: 'ארמון',
  sports: 'עולם הספורט',
  real_life: 'חיים אמיתיים',
};

const challengeLabels = {
  fears: 'פחדים',
  social_difficulty: 'קושי חברתי',
  changes: 'התמודדות עם שינויים',
  emotional_regulation: 'ויסות רגשי',
  separation_anxiety: 'חרדת נטישה',
  self_confidence: 'ביטחון עצמי',
  sleep_issues: 'קשיי שינה',
};

const reactionLabels = {
  outburst: 'התפרצות',
  withdrawal: 'הסתגרות',
  attention_seeking: 'חיפוש תשומת לב',
  crying: 'בכי',
  aggression: 'תוקפנות',
  avoidance: 'הימנעות',
};

const genderLabels = {
  boy: 'בן',
  girl: 'בת',
  other: '',
};

export default function CreateStory() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedStory, setGeneratedStory] = useState(null);
  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    gender: '',
    childImage: '',
    setting: '',
    challengeType: '',
    triggerDesc: '',
    reactionType: '',
    hobbies: '',
    contactEmail: '',
    contactPhone: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setCredits(currentUser.credits ?? 3);
    } catch (e) {
      base44.auth.redirectToLogin(window.location.href);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (credits < 1) {
      setError('אין לכם מספיק קרדיטים. רכשו עוד כדי להמשיך.');
      return;
    }

    if (!formData.childName || !formData.childAge || !formData.gender || !formData.setting || !formData.challengeType) {
      setError('נא למלא את כל השדות הנדרשים');
      return;
    }

    setIsLoading(true);

    try {
      // Save story request to database (without generating story)
      const savedStory = await base44.entities.Story.create({
        child_name: formData.childName,
        child_age: parseInt(formData.childAge),
        gender: formData.gender,
        child_image_url: formData.childImage || null,
        setting: formData.setting,
        challenge_type: formData.challengeType,
        trigger_desc: formData.triggerDesc || null,
        reaction_type: formData.reactionType || null,
        hobbies: formData.hobbies || null,
        contact_email: formData.contactEmail || null,
        contact_phone: formData.contactPhone || null,
        content: null,
        story_link: null,
      });

      setGeneratedStory(savedStory);
    } catch (err) {
      console.error('Error saving story:', err);
      setError('אירעה שגיאה בשמירת הבקשה. נסו שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">יצירת סיפור לגיבור/ה</h1>
        <p className="text-gray-600">מלאו את הפרטים והקסם יעשה את השאר ✨</p>
      </div>

      {/* Credits Warning */}
      {credits < 1 && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <Coins className="w-4 h-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            אין לכם קרדיטים. {' '}
            <Link to={createPageUrl('Credits')} className="font-semibold underline">
              רכשו עכשיו
            </Link>
            {' '} כדי להמשיך ליצור סיפורים.
          </AlertDescription>
        </Alert>
      )}

      {/* Credits Display */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-50 rounded-full border border-amber-200">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          <span className="font-semibold text-amber-700">
            {credits} קרדיטים זמינים
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {generatedStory ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-0 shadow-xl shadow-violet-100">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">הבקשה נשלחה בהצלחה! 🎉</h2>
                <p className="text-gray-600 mb-6">
                  הסיפור של {generatedStory.child_name} נמצא בהכנה.<br />
                  תקבלו עדכון כשהסיפור יהיה מוכן.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate(createPageUrl('MyStories'))}
                    className="rounded-xl"
                  >
                    לסיפורים שלי
                  </Button>
                  <Button
                    onClick={() => {
                      setGeneratedStory(null);
                      setFormData({
                        childName: '',
                        childAge: '',
                        gender: '',
                        childImage: '',
                        setting: '',
                        challengeType: '',
                        triggerDesc: '',
                        reactionType: '',
                        hobbies: '',
                        contactEmail: '',
                        contactPhone: '',
                      });
                    }}
                    className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 rounded-xl"
                  >
                    סיפור נוסף
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-0 shadow-xl shadow-violet-100">
              <CardContent className="p-6 md:p-8">
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                <StoryForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}