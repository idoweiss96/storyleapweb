import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

export default function EditSaveBar({ changedCount, isSaving, isHe, onSave }) {
  if (changedCount === 0) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center px-4 pb-4 pointer-events-none">
      <div className="bg-white shadow-2xl shadow-violet-200 rounded-2xl border border-violet-100 px-5 py-3 flex items-center gap-4 pointer-events-auto">
        <span className="text-sm font-medium text-slate-600">
          {isHe ? `${changedCount} עמודים שונו` : `${changedCount} page${changedCount > 1 ? 's' : ''} changed`}
        </span>
        <Button onClick={onSave} disabled={isSaving} className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 rounded-xl">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <span className="flex items-center gap-2"><Save className="w-4 h-4" />{isHe ? 'שמירה' : 'Save'}</span>
          )}
        </Button>
      </div>
    </div>
  );
}