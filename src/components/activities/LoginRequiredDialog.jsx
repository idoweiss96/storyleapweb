import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function LoginRequiredDialog({ open, onClose, onLogin, isHe }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6 text-slate-500" />
          </div>
          <DialogTitle className="text-center">
            {isHe ? 'התחברו כדי לפתוח את הפעילות הזו' : 'Log in to unlock this activity'}
          </DialogTitle>
        </DialogHeader>
        <p className="text-slate-500 text-sm mb-4">
          {isHe
            ? 'ההרשמה חינמית וקצרה, ותאפשר לכם לשמור ולעקוב אחרי הפעילויות שלכם.'
            : "It's free and quick, and lets you save and track your activities."}
        </p>
        <Button onClick={onLogin} className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-white">
          {isHe ? 'התחברות / הרשמה' : 'Log in / Sign up'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}