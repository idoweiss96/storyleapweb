import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Heart, BookOpen, Sparkles } from 'lucide-react';
import { buildInsights } from '@/lib/childSpace';

const ICONS = { sparkles: Sparkles, heart: Heart, book: BookOpen };

/**
 * Insights are derived on every render from data already on the page —
 * nothing here is stored. See buildInsights() for the rules.
 */
export default function ParentInsights({ space, stories, activities, moods, lang = 'he' }) {
  const he = lang === 'he';
  const insights = buildInsights({ space, stories, activities, moods, lang });

  return (
    <Card className="border-0 shadow-lg shadow-violet-50">
      <CardContent className="p-5">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          {he ? 'אינסייט להורים' : 'Parent insights'}
        </h2>

        <p className="text-xs text-slate-400 mb-3">
          {he ? `מה לומדים על ${space.name} לאחרונה` : `What we're learning about ${space.name}`}
        </p>

        <ul className="flex flex-col gap-3">
          {insights.map((insight, i) => {
            const Icon = ICONS[insight.icon] || Sparkles;
            return (
              <li key={i} className="flex items-start gap-2.5">
                <Icon className="w-4 h-4 text-violet-400 mt-0.5 flex-none" />
                <span className="text-sm text-slate-600 leading-relaxed">{insight.text}</span>
              </li>
            );
          })}
        </ul>

        <Link
          to="/activities"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg py-2 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {he ? 'לכל הפעילויות וההמלצות' : 'All activities and suggestions'}
        </Link>
      </CardContent>
    </Card>
  );
}
