import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Tag, X, Plus, BookOpen, Ticket, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { FIXED_TAG_OPTIONS } from '@/lib/customerTags';

export default function CustomerDetailDialog({ customer, onClose, onTagsSaved }) {
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!customer) return null;

  const saveManualTags = async (nextManualTags) => {
    setIsSaving(true);
    try {
      if (customer.tagRecordId) {
        await base44.entities.CustomerTag.update(customer.tagRecordId, { tags: nextManualTags });
      } else {
        await base44.entities.CustomerTag.create({ email: customer.email, tags: nextManualTags });
      }
      onTagsSaved();
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = (tag) => {
    const t = tag.trim();
    if (!t || customer.manualTags.includes(t)) return;
    saveManualTags([...customer.manualTags, t]);
    setNewTag('');
  };

  const removeTag = (tag) => {
    saveManualTags(customer.manualTags.filter((t) => t !== tag));
  };

  const allSubmissions = [
    ...customer.stories.map((s) => ({ ...s, source: 'Story' })),
    ...customer.kitaStories.map((s) => ({ ...s, source: 'Kita Alef' })),
  ].sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));

  return (
    <Dialog open={!!customer} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {customer.name || customer.email}
            {isSaving && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
          </DialogTitle>
          <p className="text-sm text-gray-500">{customer.email}</p>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200 w-fit">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="font-semibold text-amber-700">{customer.credits} credits</span>
          </div>

          {/* Tags */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Tag className="w-4 h-4" /> Tags</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {customer.autoTags.map((tag) => (
                <Badge key={`auto-${tag}`} className="bg-slate-100 text-slate-600 hover:bg-slate-100">{tag} (auto)</Badge>
              ))}
              {customer.manualTags.map((tag) => (
                <Badge key={`manual-${tag}`} className="bg-violet-100 text-violet-700 hover:bg-violet-100 flex items-center gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-violet-900"><X className="w-3 h-3" /></button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {FIXED_TAG_OPTIONS.filter((t) => !customer.manualTags.includes(t)).map((tag) => (
                <button key={tag} onClick={() => addTag(tag)} className="text-xs px-2 py-1 rounded-full border border-dashed border-slate-300 text-slate-500 hover:border-violet-400 hover:text-violet-600">
                  + {tag}
                </button>
              ))}
            </div>
            <div className="flex gap-2 max-w-xs">
              <Input placeholder="Custom tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addTag(newTag); }} className="h-8 text-sm" />
              <Button size="sm" variant="outline" onClick={() => addTag(newTag)} className="h-8 px-2"><Plus className="w-3.5 h-3.5" /></Button>
            </div>
          </div>

          {/* Coupons */}
          {customer.coupons.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Ticket className="w-4 h-4" /> Coupons Used</p>
              <div className="space-y-1">
                {customer.coupons.map((c, i) => (
                  <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                    <Badge variant="outline">{c.code}</Badge>
                    {c.coupon?.is_gift && <span className="text-xs text-amber-600">gift</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submissions */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> Submissions ({allSubmissions.length})</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allSubmissions.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm border border-slate-100 rounded-lg px-3 py-2">
                  <div>
                    <span className="font-medium">{s.child_name || '-'}</span>
                    <span className="text-gray-400 mx-1.5">·</span>
                    <span className="text-gray-500">{s.source}</span>
                    <span className="text-gray-400 mx-1.5">·</span>
                    <span className="text-gray-400">{s.created_date ? format(new Date(s.created_date), 'dd/MM/yyyy') : '-'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge className={s.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                      {s.payment_status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                    <Badge className={s.story_link ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}>
                      {s.story_link ? 'Ready' : 'In Progress'}
                    </Badge>
                  </div>
                </div>
              ))}
              {allSubmissions.length === 0 && <p className="text-sm text-gray-400">No submissions yet.</p>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}