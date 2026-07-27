import React from 'react';

export default function OptionCard({ item, selected, onClick, dashed, singleCol }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-2xl border-2 px-4 py-3.5 text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${singleCol ? 'text-start' : ''} ${
        selected
          ? 'border-transparent bg-[#FFD6EC]'
          : `bg-white border-[#ede9f8] ${dashed ? 'border-dashed' : ''}`
      }`}
      style={selected ? { boxShadow: '0 4px 20px rgba(255,111,181,0.18)', borderColor: '#1A1A6E' } : undefined}
    >
      {item.emoji && <span className="text-xl leading-none flex-none">{item.emoji}</span>}
      <span className="flex-1 text-[#1a1a2e]">{item.label}</span>
      {selected && (
        <span className="flex-none w-[18px] h-[18px] rounded-full flex items-center justify-center text-[11px] text-white" style={{ background: '#1A1A6E' }}>
          ✓
        </span>
      )}
    </button>
  );
}