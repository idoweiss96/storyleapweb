import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import DSSection from './DSSection';

export default function ButtonsSection() {
  return (
    <DSSection id="buttons" title="4. Buttons" description="Shared shadcn Button variants (ui/button.jsx) plus the hand-rolled gradient buttons used only in the Kita Alef flow.">
      <h3 className="font-semibold text-slate-700 mb-3">Shared Button component variants</h3>
      <div className="flex flex-wrap gap-3 mb-4">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
        <Button disabled>Disabled</Button>
        <Button disabled><Loader2 className="w-4 h-4 animate-spin mr-2" />Loading</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Button size="sm">Small</Button>
        <Button size="default">Default size</Button>
        <Button size="lg">Large</Button>
        <Button size="icon"><Sparkles className="w-4 h-4" /></Button>
      </div>

      <h3 className="font-semibold text-slate-700 mb-3">Home hero one-off button</h3>
      <div className="flex flex-wrap gap-3 mb-8">
        <button className="h-12 px-6 rounded-xl text-white font-semibold shadow-lg" style={{ background: '#ffc157' }}>
          Create a New Story
        </button>
      </div>

      <h3 className="font-semibold text-slate-700 mb-3">Kita Alef inline-styled buttons (not using the shared Button component)</h3>
      <div className="flex flex-wrap gap-3">
        <button className="px-6 py-3 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}>
          Create the story ✨
        </button>
        <button className="px-6 py-3 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #4FC3E8, #6BB6E8)' }}>
          Next →
        </button>
        <button disabled className="px-6 py-3 rounded-[14px] text-white font-semibold opacity-60 flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}>
          <Loader2 className="w-4 h-4 animate-spin" /> Creating...
        </button>
        <button className="px-6 py-3 rounded-[14px] bg-white border font-medium hover:opacity-80 transition-opacity" style={{ borderColor: '#B8EBF7', color: '#4FC3E8' }}>
          ← Back
        </button>
      </div>
    </DSSection>
  );
}