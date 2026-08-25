import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Plus, Pencil, Heart } from 'lucide-react';
import { getAvatar, getTheme, ageFromBirthDate } from '@/lib/childSpace';

/**
 * The top of the space: who this is, and the two things a parent
 * most often comes here to do.
 */
export default function SpaceHero({ space, lang = 'he', onEdit, onAddActivity }) {
  const he = lang === 'he';
  const avatar = getAvatar(space.avatar_id);
  const theme = getTheme(space.color_theme);
  const age = ageFromBirthDate(space.birth_date);

  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 mb-8">
      {/* Welcome card — first in DOM so it reads first on mobile */}
      <Card className="border-0 shadow-lg shadow-violet-50 order-2 md:order-1 w-full md:max-w-xs">
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">👋</span>
            <h2 className="font-bold text-slate-800">
              {he ? `היי ${space.name}!` : `Hi ${space.name}!`}
            </h2>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            {space.tagline || (he
              ? 'כל יום צעד קטן, כל סיפור כוח גדול'
              : 'A small step each day, a big story each time')}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className={`rounded-xl w-full ${theme.border} ${theme.text} hover:${theme.soft}`}
          >
            <Pencil className="w-3.5 h-3.5 me-2" />
            {he ? 'עריכת הפרופיל' : 'Edit profile'}
          </Button>
        </CardContent>
      </Card>

      {/* Avatar + title */}
      <div className="flex flex-col items-center gap-3 order-1 md:order-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label={he ? 'עריכת הפרופיל' : 'Edit profile'}
          className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-5xl ring-4 ring-white shadow-xl hover:scale-105 transition-transform`}
        >
          {space.avatar_url
            ? <img src={space.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
            : avatar.emoji}
          <span className="absolute -bottom-1 -end-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
            <Pencil className="w-3.5 h-3.5 text-slate-500" />
          </span>
        </button>

        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            {he ? `המרחב של ${space.name}` : `${space.name}'s Space`}
          </h1>
          <p className="text-slate-500 mt-1 max-w-md">
            {he
              ? `כל הסיפורים, הפעילויות והצעדים הקטנים שעוזרים ל${space.name} לגדול בביטחון`
              : `Every story, activity and small step helping ${space.name} grow`}
            {age !== null && (he ? ` · בן/בת ${age}` : ` · age ${age}`)}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 rounded-xl">
            <Link to="/CreateStory">
              <Sparkles className="w-4 h-4 me-2" />
              {he ? 'צור סיפור חדש' : 'Create a story'}
            </Link>
          </Button>
          <Button variant="outline" onClick={onAddActivity} className="rounded-xl border-slate-200">
            <Plus className="w-4 h-4 me-2" />
            {he ? 'הוסף פעילות' : 'Add activity'}
          </Button>
        </div>
      </div>

      {/* Balances the grid on desktop; carries the parent note on mobile */}
      <Card className="border-0 shadow-lg shadow-amber-50 bg-gradient-to-br from-amber-50 to-white order-3 w-full md:max-w-xs md:justify-self-end">
        <CardContent className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-300" />
            <h2 className="font-bold text-slate-800 text-sm">
              {he ? 'הורים יקרים' : 'Dear parents'}
            </h2>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            {he
              ? 'כל סיפור, כל חיבוק, כל צעד קטן — בונים את הביטחון כאן, יחד.'
              : 'Every story, every hug, every small step builds confidence here, together.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
