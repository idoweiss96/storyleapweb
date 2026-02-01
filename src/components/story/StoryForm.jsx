import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

const themes = [
  { value: 'adventure', label: 'הרפתקאות', emoji: '🗺️' },
  { value: 'friendship', label: 'חברות', emoji: '🤝' },
  { value: 'courage', label: 'אומץ', emoji: '🦁' },
  { value: 'kindness', label: 'חסד ונתינה', emoji: '💝' },
  { value: 'dreams', label: 'חלומות', emoji: '🌙' },
  { value: 'nature', label: 'טבע', emoji: '🌳' },
  { value: 'space', label: 'חלל', emoji: '🚀' },
  { value: 'underwater', label: 'מתחת למים', emoji: '🐠' },
  { value: 'magic', label: 'קסם', emoji: '✨' },
  { value: 'animals', label: 'חיות', emoji: '🐾' },
];

export default function StoryForm({ formData, setFormData, onSubmit, isLoading }) {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="childName" className="text-gray-700 font-medium">
            שם הילד/ה
          </Label>
          <Input
            id="childName"
            value={formData.childName}
            onChange={(e) => handleChange('childName', e.target.value)}
            placeholder="למשל: יובל"
            className="h-12 rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="childAge" className="text-gray-700 font-medium">
            גיל
          </Label>
          <Input
            id="childAge"
            type="number"
            min="1"
            max="12"
            value={formData.childAge}
            onChange={(e) => handleChange('childAge', e.target.value)}
            placeholder="למשל: 5"
            className="h-12 rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme" className="text-gray-700 font-medium">
          נושא הסיפור
        </Label>
        <Select
          value={formData.theme}
          onValueChange={(value) => handleChange('theme', value)}
          required
        >
          <SelectTrigger className="h-12 rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400">
            <SelectValue placeholder="בחרו נושא לסיפור" />
          </SelectTrigger>
          <SelectContent>
            {themes.map((theme) => (
              <SelectItem key={theme.value} value={theme.value}>
                <span className="flex items-center gap-2">
                  <span>{theme.emoji}</span>
                  <span>{theme.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="characters" className="text-gray-700 font-medium">
          דמויות נוספות (אופציונלי)
        </Label>
        <Textarea
          id="characters"
          value={formData.characters}
          onChange={(e) => handleChange('characters', e.target.value)}
          placeholder="למשל: חתול בשם מיאו, סבתא רחל..."
          className="rounded-xl border-violet-200 focus:border-violet-400 focus:ring-violet-400 resize-none"
          rows={3}
        />
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