import React from 'react';
import {
  Sparkles, Star, BookOpen, Wand2, Heart, ArrowLeft, Dumbbell, ChevronRight, ChevronLeft, Quote,
  Home, Menu, X, LogOut, Mail, Globe, Loader2, Plus, Calendar,
} from 'lucide-react';
import DSSection from './DSSection';
import { icons } from './designSystemData';

const ICON_MAP = {
  Sparkles, Star, BookOpen, Wand2, Heart, ArrowLeft, Dumbbell, ChevronRight, ChevronLeft, Quote,
  Home, Menu, X, LogOut, Mail, Globe, Loader2, Plus, Calendar,
};

export default function IconsSection() {
  return (
    <DSSection id="icons" title="8. Icons & Decorative Elements" description={`Icon library: ${icons.library}. ${icons.strokeWidth}.`}>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3 mb-6">
        {icons.used.map((name) => {
          const Icon = ICON_MAP[name];
          if (!Icon) return null;
          return (
            <div key={name} className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-100 bg-white">
              <Icon className="w-5 h-5 text-slate-600" />
              <span className="text-[10px] text-slate-400 truncate max-w-full">{name}</span>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-500">
        <div>
          <p className="font-semibold text-slate-700 mb-1">Sizes in use</p>
          <ul className="list-disc pr-4 space-y-0.5">
            {icons.sizes.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-700 mb-1">Decorative elements</p>
          <ul className="list-disc pr-4 space-y-0.5">
            {icons.decorative.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
      </div>
    </DSSection>
  );
}