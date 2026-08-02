import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Heart, Loader2 } from 'lucide-react';

const PURPLE = '#4A3FB5';

const content = {
  he: {
    title: 'איך היה הסיפור?',
    subtitle: "נשמח לשמוע איך היה, זה עוזר לנו ליצור סיפורים טובים יותר לילדים נוספים.",
    q1: 'איך הייתם מדרגים את הסיפור באופן כללי?',
    q2: 'עד כמה הסיפור התאים לילד/ה שלכם ולאתגר הספציפי שלו/שלה?',
    q2opts: ['בכלל לא מתאים', 'מעט מתאים', 'מתאים', 'מתאים מאוד', 'מדויק בול'],
    q3: 'האם קריאת הסיפור פתחה שיחה משמעותית עם הילד/ה?',
    q3opts: [['yes', 'כן'], ['somewhat', 'חלקית'], ['no', 'לא']],
    q4: 'עד כמה הילד/ה נהנה/תה מהסיפור?',
    q5: 'מה עבד הכי טוב בסיפור?',
    q6: 'מה היינו יכולים לשפר?',
    q6b: 'מה היה חסר לכם בחוויה, או מה הייתם ממליצים לנו להוסיף?',
    q7: 'עד כמה סביר שתמליצו על StoryLeap להורה אחר? (0-10)',
    q8: 'האם תרצו להשתמש שוב ב-StoryLeap לאתגר או אירוע אחר בעתיד?',
    q8opts: [['yes', 'כן'], ['maybe', 'אולי'], ['no', 'לא']],
    q9: 'משהו נוסף שתרצו לשתף?',
    submit: 'שליחת המשוב',
    submitting: 'שולח...',
    thanksTitle: 'תודה על המשוב! 💛',
    thanksMsg: 'עזרתם לנו ליצור סיפורים טובים יותר לילדים נוספים.',
  },
  en: {
    title: 'How was the story?',
    subtitle: "We'd love to hear how it went. It helps us create better stories for more children.",
    q1: 'How would you rate the story overall?',
    q2: 'How well did the story match your child and their specific challenge?',
    q2opts: ['Not at all', 'A little', 'Fairly well', 'Very well', 'Spot on'],
    q3: 'Did reading the story open up a meaningful conversation with your child?',
    q3opts: [['yes', 'Yes'], ['somewhat', 'Somewhat'], ['no', 'No']],
    q4: 'How much did your child enjoy the story?',
    q5: 'What worked best about the story?',
    q6: 'What could we improve?',
    q6b: 'What was missing for you, or what would you recommend we add to the experience?',
    q7: 'How likely are you to recommend StoryLeap to another parent? (0-10)',
    q8: 'Would you like to use StoryLeap again for a different challenge or milestone?',
    q8opts: [['yes', 'Yes'], ['maybe', 'Maybe'], ['no', 'No']],
    q9: "Anything else you'd like to share?",
    submit: 'Submit Feedback',
    submitting: 'Submitting...',
    thanksTitle: 'Thank you for your feedback! 💛',
    thanksMsg: "You've helped us create better stories for more children.",
  },
};

function StarPicker({ value, onChange, max = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} className="p-0.5">
          <Star className={`w-8 h-8 ${n <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
        </button>
      ))}
    </div>
  );
}

function ChoiceGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const [val, label] = Array.isArray(opt) ? opt : [opt, opt];
        const selected = value === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className="px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all"
            style={{
              borderColor: selected ? PURPLE : '#e2e8f0',
              background: selected ? `${PURPLE}10` : '#fff',
              color: selected ? PURPLE : '#1e293b',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function FeedbackSurvey() {
  const urlParams = new URLSearchParams(window.location.search);
  const storyId = urlParams.get('id') || '';
  const entityType = urlParams.get('type') || 'story';
  const lang = urlParams.get('lang') === 'en' ? 'en' : 'he';
  const childName = urlParams.get('name') || '';
  const isRTL = lang === 'he';
  const c = content[lang];

  const [answers, setAnswers] = useState({
    overall_rating: 0,
    fit_rating: '',
    opened_conversation: '',
    child_enjoyment: 0,
    best_part: '',
    improvement: '',
    missing_or_recommendation: '',
    nps_score: null,
    use_again: '',
    other_comments: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field, value) => setAnswers((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await base44.functions.invoke('submitFeedbackSurvey', {
        story_id: storyId,
        entity_type: entityType,
        child_name: childName || (isRTL ? 'לא ידוע' : 'Unknown'),
        lang,
        answers,
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-amber-500 fill-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{c.thanksTitle}</h1>
        <p className="text-slate-600">{c.thanksMsg}</p>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{c.title} 🎉</h1>
        <p className="text-slate-600">{c.subtitle}</p>
      </div>

      <div className="bg-white/90 rounded-3xl shadow-lg p-6 sm:p-8 space-y-8">
        <div className="space-y-2">
          <p className="font-semibold text-slate-800">{c.q1}</p>
          <StarPicker value={answers.overall_rating} onChange={(v) => update('overall_rating', v)} />
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-800">{c.q2}</p>
          <ChoiceGroup options={c.q2opts} value={answers.fit_rating} onChange={(v) => update('fit_rating', v)} />
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-800">{c.q3}</p>
          <ChoiceGroup options={c.q3opts} value={answers.opened_conversation} onChange={(v) => update('opened_conversation', v)} />
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-800">{c.q4}</p>
          <StarPicker value={answers.child_enjoyment} onChange={(v) => update('child_enjoyment', v)} />
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-800">{c.q5}</p>
          <Textarea value={answers.best_part} onChange={(e) => update('best_part', e.target.value)} className="rounded-xl" rows={2} />
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-800">{c.q6}</p>
          <Textarea value={answers.improvement} onChange={(e) => update('improvement', e.target.value)} className="rounded-xl" rows={2} />
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-800">{c.q6b}</p>
          <Textarea value={answers.missing_or_recommendation} onChange={(e) => update('missing_or_recommendation', e.target.value)} className="rounded-xl" rows={2} />
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-800">{c.q7}</p>
          <ChoiceGroup options={Array.from({ length: 11 }, (_, i) => String(i))} value={answers.nps_score !== null ? String(answers.nps_score) : ''} onChange={(v) => update('nps_score', Number(v))} />
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-800">{c.q8}</p>
          <ChoiceGroup options={c.q8opts} value={answers.use_again} onChange={(v) => update('use_again', v)} />
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-800">{c.q9}</p>
          <Textarea value={answers.other_comments} onChange={(e) => update('other_comments', e.target.value)} className="rounded-xl" rows={2} />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-12 rounded-xl text-white font-semibold"
          style={{ background: PURPLE }}
        >
          {submitting ? (
            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />{c.submitting}</span>
          ) : c.submit}
        </Button>
      </div>
    </div>
  );
}