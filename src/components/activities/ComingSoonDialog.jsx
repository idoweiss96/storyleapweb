import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock } from 'lucide-react';

export default function ComingSoonDialog({ open, onClose, isHe }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-2">
            <Clock className="w-6 h-6 text-slate-500" />
          </div>
          <DialogTitle className="text-center">{isHe ? 'בקרוב!' : 'Coming soon!'}</DialogTitle>
        </DialogHeader>
        <p className="text-slate-500 text-sm">
          {isHe
            ? 'הפעילות הזו עדיין בבנייה. חזרו בקרוב :)'
            : "This activity is still being built. Check back soon :)"}
        </p>
      </DialogContent>
    </Dialog>
  );
}