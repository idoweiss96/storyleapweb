import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Upload, X } from 'lucide-react';

const genders = [
  { value: 'boy', label: 'בן' },
  { value: 'girl', label: 'בת' },
  { value: 'other', label: 'אחר' },
];

const settings = [
  { value: 'space', label: 'חלל', emoji: '🚀' },
  { value: 'forest', label: 'יער קסום', emoji: '🌳' },
  { value: 'castle', label: 'ארמון', emoji: '🏰' },
  { value: 'sports', label: 'ספורט', emoji: '⚽' },
  { value: 'real_life', label: 'חיים אמיתיים', emoji: '🏠' },
];

const challengeTypes = [
  { value: 'fears', label: 'פחדים', emoji: '😨' },
  { value: 'social_difficulty', label: 'קושי חברתי', emoji: '👥' },
  { value: 'changes', label: 'התמודדות עם שינויים', emoji: '🔄' },
  { value: 'emotional_regulation', label: 'ויסות רגשי', emoji: '💭' },
  { value: 'separation_anxiety', label: 'חרדת נטישה', emoji: '🤗' },
  { value: 'self_confidence', label: 'ביטחון עצמי', emoji: '💪' },
  { value: 'sleep_issues', label: 'קשיי שינה', emoji: '🌙' },
];

const reactionTypes = [
  { value: 'outburst', label: 'התפרצות' },
  { value: 'withdrawal', label: 'הסתגרות' },
  { value: 'attention_seeking', label: 'חיפוש תשומת לב' },
  { value: 'crying', label: 'בכי' },
  { value: 'aggression', label: 'תוקפנות' },
  { value: 'avoidance', label: 'הימנעות' },
];

export default function StoryForm({ formData, setFormData, onSubmit, isLoading }) {
  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleChange('childImage', file_url);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    handleChange('childImage', '');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Section 1: Child Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-violet-800 border-b border-violet-100 pb-2">
          פרטי הילד/ה
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="childName" className="text-gray-700 font-medium">
              שם הילד/ה *
            </Label>
            <Input
              id="childName"
              value={formData.childName}
              onChange={(e) => handleChange('childName', e.target.value)}
              placeholder="למשל: יובל"
              className="h-11 rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="childAge" className="text-gray-700 font-medium">
              גיל *
            </Label>
            <Input
              id="childAge"
              type="number"
              min="1"
              max="12"
              value={formData.childAge}
              onChange={(e) => handleChange('childAge', e.target.value)}
              placeholder="למשל: 5"
              className="h-11 rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-gray-700 font-medium">
              מגדר *
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleChange('gender', value)}
              required
            >
              <SelectTrigger className="h-11 rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400">
                <SelectValue placeholder="בחרו מגדר" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((g) => (
                  <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">תמונת הילד/ה (אופציונלי)</Label>
          {formData.childImage ? (
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-violet-200">
              <img src={formData.childImage} alt="Child" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-violet-200 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploading ? (
                <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-violet-400 mb-1" />
                  <span className="text-xs text-violet-500">העלו תמונה</span>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      {/* Section 2: Story Setting */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-violet-800 border-b border-violet-100 pb-2">
          עולם הסיפור
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="setting" className="text-gray-700 font-medium">
            נושא / תפאורה *
          </Label>
          <Select
            value={formData.setting}
            onValueChange={(value) => handleChange('setting', value)}
            required
          >
            <SelectTrigger className="h-11 rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400">
              <SelectValue placeholder="בחרו תפאורה לסיפור" />
            </SelectTrigger>
            <SelectContent>
              {settings.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  <span className="flex items-center gap-2">
                    <span>{s.emoji}</span>
                    <span>{s.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Section 3: Challenge */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-violet-800 border-b border-violet-100 pb-2">
          האתגר הרגשי
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="challengeType" className="text-gray-700 font-medium">
            האתגר שהילד/ה חווה *
          </Label>
          <Select
            value={formData.challengeType}
            onValueChange={(value) => handleChange('challengeType', value)}
            required
          >
            <SelectTrigger className="h-11 rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400">
              <SelectValue placeholder="בחרו את סוג האתגר" />
            </SelectTrigger>
            <SelectContent>
              {challengeTypes.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <span className="flex items-center gap-2">
                    <span>{c.emoji}</span>
                    <span>{c.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="triggerDesc" className="text-gray-700 font-medium">
            מתי זה קורה? (תיאור הטריגר)
          </Label>
          <Textarea
            id="triggerDesc"
            value={formData.triggerDesc}
            onChange={(e) => handleChange('triggerDesc', e.target.value)}
            placeholder="למשל: כשצריך להיפרד ממא בבוקר בגן..."
            className="rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400 resize-none"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reactionType" className="text-gray-700 font-medium">
            איך הילד/ה מגיב/ה?
          </Label>
          <Select
            value={formData.reactionType}
            onValueChange={(value) => handleChange('reactionType', value)}
          >
            <SelectTrigger className="h-11 rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400">
              <SelectValue placeholder="בחרו סוג תגובה" />
            </SelectTrigger>
            <SelectContent>
              {reactionTypes.map((r) => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Section 4: Personal Connection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-violet-800 border-b border-violet-100 pb-2">
          חיבור אישי
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="hobbies" className="text-gray-700 font-medium">
            מה הילד/ה אוהב/ת? (תחביבים, צעצועים, דמויות)
          </Label>
          <Textarea
            id="hobbies"
            value={formData.hobbies}
            onChange={(e) => handleChange('hobbies', e.target.value)}
            placeholder="למשל: דינוזאורים, לגו, כדורגל, ציור..."
            className="rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400 resize-none"
            rows={2}
          />
        </div>
      </div>

      {/* Section 5: Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-violet-800 border-b border-violet-100 pb-2">
          פרטי התקשרות
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-gray-700 font-medium">
              מייל
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder="your@email.com"
              className="h-11 rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone" className="text-gray-700 font-medium">
              טלפון
            </Label>
            <Input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              placeholder="050-0000000"
              className="h-11 rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            הפיה כותבת את הסיפור...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            צרו את הסיפור שלי
          </span>
        )}
      </Button>
    </form>
  );
}