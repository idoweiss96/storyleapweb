import React from 'react';
import { Star, Gem, Cloud, BookOpen, Crown } from 'lucide-react';

const STORY_COST = 60;
const ICONS = [Star, Cloud, BookOpen, Crown, Gem];
const ICON_STYLES = [
  'bg-amber-100 text-amber-500',
  'bg-sky-100 text-sky-500',
  'bg-pink-100 text-pink-500',
  'bg-amber-100 text-amber-500',
  'bg-purple-100 text-purple-500',
];

function storySubtitle(credits, isHe) {
  const stories = Math.floor(credits / STORY_COST);
  const leftover = credits % STORY_COST;
  if (stories === 0) return isHe ? 'כמעט סיפור אחד' : 'Almost one story';
  const storiesLabel = isHe
    ? `${stories} ${stories === 1 ? 'סיפור' : 'סיפורים'}`
    : `${stories} ${stories === 1 ? 'story' : 'stories'}`;
  if (leftover === 0) return storiesLabel;
  return isHe ? `${storiesLabel} + ${leftover} קרדיטים` : `${storiesLabel} + ${leftover} credits`;
}

// Grid of selectable credit packages. Highlights the "Most Popular" and
// "Best Value" packages with a colored border, badge and filled select button.
export default function PackageGrid({ packages, selectedPackage, onSelect, isHe }) {
  if (!packages?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {packages.map((pkg, idx) => {
        const isSelected = selectedPackage?.id === pkg.id;
        const perCredit = (pkg.price / pkg.credits).toFixed(2);
        const highlighted = pkg.is_popular || pkg.is_best_value;
        const Icon = ICONS[idx % ICONS.length];
        const iconStyle = pkg.is_popular
          ? 'bg-amber-100 text-amber-500'
          : pkg.is_best_value
          ? 'bg-purple-100 text-purple-500'
          : ICON_STYLES[idx % ICON_STYLES.length];
        const accentText = pkg.is_best_value ? 'text-purple-600' : pkg.is_popular ? 'text-amber-600' : 'text-slate-800';

        return (
          <button
            key={pkg.id}
            type="button"
            onClick={() => onSelect(pkg)}
            className={`relative flex flex-col items-center text-center rounded-2xl border-2 p-5 pt-7 transition-all ${
              pkg.is_best_value
                ? `border-purple-300 bg-purple-50 ${isSelected ? 'ring-2 ring-purple-400 shadow-lg' : 'shadow-md'}`
                : pkg.is_popular
                ? `border-amber-300 bg-amber-50 ${isSelected ? 'ring-2 ring-amber-400 shadow-lg' : 'shadow-md'}`
                : isSelected
                ? 'border-slate-800 bg-slate-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {pkg.is_popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-white shadow whitespace-nowrap">
                <Star className="w-3 h-3 fill-white" />
                {isHe ? 'הכי פופולרי' : 'Most Popular'}
              </span>
            )}
            {pkg.is_best_value && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500 text-white shadow whitespace-nowrap">
                <Gem className="w-3 h-3" />
                {isHe ? 'הכי משתלם' : 'Best Value'}
              </span>
            )}

            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${iconStyle}`}>
              <Icon className="w-7 h-7" />
            </div>

            <p className="text-lg font-bold text-slate-800">
              {pkg.credits} {isHe ? 'קרדיטים' : 'Credits'}
            </p>
            <p className="text-xs text-slate-500 bg-white/70 rounded-full px-2.5 py-0.5 mt-1.5 mb-3">
              ✨ {storySubtitle(pkg.credits, isHe)}
            </p>

            <p className={`text-3xl font-bold ${accentText}`}>${pkg.price}</p>
            <p className="text-xs text-slate-400 mb-4">${perCredit} {isHe ? 'לקרדיט' : 'per credit'}</p>

            <span
              className={`w-full py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                highlighted
                  ? isSelected
                    ? `${pkg.is_best_value ? 'bg-purple-600 border-purple-600' : 'bg-amber-500 border-amber-500'} text-white`
                    : `${pkg.is_best_value ? 'border-purple-400 text-purple-600' : 'border-amber-400 text-amber-600'} bg-white`
                  : isSelected
                  ? 'bg-slate-800 border-slate-800 text-white'
                  : 'border-slate-300 text-slate-600 bg-white'
              }`}
            >
              {isHe ? 'בחירה' : 'Select'}
            </span>
          </button>
        );
      })}
    </div>
  );
}