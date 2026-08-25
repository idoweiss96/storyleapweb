import React from 'react';
import { Star, Gem } from 'lucide-react';

// Grid of selectable credit packages. Highlights the "Most Popular" and
// "Best Value" packages with a badge and border accent.
export default function PackageGrid({ packages, selectedPackage, onSelect, isHe }) {
  if (!packages?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      {packages.map((pkg) => {
        const isSelected = selectedPackage?.id === pkg.id;
        const perCredit = (pkg.price / pkg.credits).toFixed(2);
        return (
          <button
            key={pkg.id}
            type="button"
            onClick={() => onSelect(pkg)}
            className={`relative text-right rtl:text-right rounded-xl border-2 p-4 transition-all ${
              isSelected ? 'border-slate-800 bg-slate-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {pkg.is_popular && (
              <span className="absolute -top-2.5 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-white shadow">
                <Star className="w-3 h-3 fill-white" />
                {isHe ? 'הכי פופולרי' : 'Most Popular'}
              </span>
            )}
            {pkg.is_best_value && (
              <span className="absolute -top-2.5 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500 text-white shadow">
                <Gem className="w-3 h-3" />
                {isHe ? 'הכי משתלם' : 'Best Value'}
              </span>
            )}
            <p className="text-lg font-bold text-slate-800 mt-2">
              {pkg.credits} {isHe ? 'קרדיטים' : 'Credits'}
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-1">${pkg.price}</p>
            <p className="text-xs text-slate-400 mt-0.5">${perCredit} {isHe ? 'לקרדיט' : 'per credit'}</p>
          </button>
        );
      })}
    </div>
  );
}