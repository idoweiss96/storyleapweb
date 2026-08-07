import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Clock, Sparkles } from 'lucide-react';

// Shows a free preview request in "My Stories" so parents can find it there too,
// not only via the email that was sent when it became ready.
export default function PreviewCard({ preview, lang, onContinue }) {
  const isHe = lang === 'he';
  return (
    <Card className="border-0 shadow-lg shadow-amber-50 hover:shadow-xl transition-all">
      <CardContent className="p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mx-auto mb-3">
          <Mail className="w-7 h-7 text-amber-600" />
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-1">{preview.child_name}</h3>
        <p className="text-xs text-slate-500 mb-2">{isHe ? 'תצוגה מקדימה חינמית' : 'Free Preview'}</p>
        {preview.status === 'ready' ? (
          <div className="space-y-2">
            <Badge className="bg-green-100 text-green-700 gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {isHe ? 'התצוגה המקדימה מוכנה' : 'Preview Ready'}
            </Badge>
            <a href={preview.preview_link} target="_blank" rel="noopener noreferrer" className="block">
              <Button size="sm" variant="outline" className="w-full text-xs h-8 rounded-lg">
                {isHe ? 'צפו בתצוגה המקדימה' : 'View Preview'}
              </Button>
            </a>
            <Button size="sm" onClick={() => onContinue(preview)} className="w-full text-xs h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white">
              {isHe ? 'המשך לסיפור המלא' : 'Continue the story'}
            </Button>
          </div>
        ) : (
          <Badge className="bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3 ml-1" />{isHe ? 'התצוגה המקדימה בהכנה' : 'Preview in progress'}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}