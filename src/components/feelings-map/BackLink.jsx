import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function BackLink({ label, isEn, onClick }) {
  const Icon = isEn ? ArrowLeft : ArrowRight;
  return (
    <div className="flex justify-start mb-3 print:hidden">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 text-sm font-medium bg-white border rounded-[14px] px-4 py-2 hover:opacity-80 transition-opacity"
        style={{ borderColor: '#B8EBF7', color: '#4FC3E8' }}
      >
        <Icon className="w-3.5 h-3.5" />
        {label}
      </button>
    </div>
  );
}