import React from 'react';
import { Home, Star, Mail, Menu, LogOut, Globe } from 'lucide-react';
import DSSection from './DSSection';

export default function NavigationSection() {
  return (
    <DSSection id="navigation" title="7. Navigation Components" description="Header, mobile menu and progress navigation, as implemented in Layout.jsx and Questionnaire.jsx.">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Desktop header (Layout.jsx)</p>
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/80 px-4 py-3">
            <div className="flex items-center gap-1 text-sm text-slate-500">
              {[Home, Star, Mail].map((Icon, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-50"><Icon className="w-4 h-4" /> Nav</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-slate-600" />
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-full text-xs font-semibold text-amber-700 border border-amber-200"><Star className="w-3 h-3 fill-amber-400 text-amber-500" />10</span>
              <LogOut className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Mobile header</p>
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/80 px-4 py-3 max-w-xs">
            <span className="text-sm text-slate-500">Logo</span>
            <Menu className="w-5 h-5 text-slate-600" />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Questionnaire progress nav (Kita Alef)</p>
          <div className="max-w-sm">
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: '#4FC3E8' }} className="font-medium">Page 3 of 6</span>
              <span style={{ color: '#FF6FB5' }} className="font-semibold">רגשות</span>
            </div>
            <div className="h-2.5 bg-white rounded-full overflow-hidden shadow-inner border border-slate-100 mb-2">
              <div className="h-full rounded-full" style={{ width: '50%', background: 'linear-gradient(to left, #4FC3E8, #FF6FB5)' }} />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Footer (Layout.jsx)</p>
          <div className="border-t border-slate-200 bg-white/60 rounded-b-xl px-4 py-4 text-center text-sm text-slate-400">
            © 2024 StoryLeap - Magic stories for your children ✨
          </div>
        </div>
      </div>
    </DSSection>
  );
}