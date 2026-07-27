import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function BackLink({ label, isEn, onClick }) {
  const Icon = isEn ? ArrowLeft : ArrowRight;
  return (
    <div className="flex justify-start mb-2.5 print:hidden">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1 text-sm text-[#1a1a2e]/55 hover:text-[#1a1a2e] transition-colors px-0.5 py-1.5"
      >
        <Icon className="w-3.5 h-3.5" />
        {label}
      </button>
    </div>
  );
}