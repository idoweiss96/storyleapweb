import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Pencil, Check, ExternalLink, Search, Mail } from 'lucide-react';
import { format } from 'date-fns';

export default function StoryPreviewList({ onSelectCustomer }) {
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPreview, setEditingPreview] = useState(null);
  const [previewLink, setPreviewLink] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { loadPreviews(); }, []);

  const loadPreviews = async () => {
    setIsLoading(true);
    try {
      const all = await base44.entities.StoryPreview.list('-created_date');
      setPreviews(all);
    } catch (e) {
      console.error('Failed to load story previews:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (preview) => { setEditingPreview(preview); setPreviewLink(preview.preview_link || ''); };

  const handleSaveLink = async () => {
    if (!editingPreview || !previewLink.trim()) return;
    setIsSaving(true);
    try {
      await base44.entities.StoryPreview.update(editingPreview.id, { preview_link: previewLink.trim() });
      // The "preview ready" email is sent automatically by the onPreviewLinkAdded automation
      setPreviews(previews.map(p => p.id === editingPreview.id ? { ...p, preview_link: previewLink.trim(), status: 'ready' } : p));
      setEditingPreview(null);
      setPreviewLink('');
    } catch (err) {
      console.error('Error saving preview link:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = previews.filter(p =>
    (p.child_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.contact_email || '').toLowerCase().includes(search.toLowerCase())
  );
  const visible = showAll ? filtered : filtered.slice(0, 10);

  return (
    <Card className="border-0 shadow-xl shadow-slate-100 mb-8">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Mail className="w-5 h-5" /> Free Story Previews
          <Badge className="mr-2 bg-slate-100 text-slate-600">{previews.length}</Badge>
        </CardTitle>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by child name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
          </div>
        ) : previews.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No preview requests yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Child Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Lang</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm">{p.created_date ? format(new Date(p.created_date), 'dd/MM/yyyy HH:mm') : '-'}</TableCell>
                    <TableCell className="font-medium">{p.child_name || '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {p.contact_email ? (
                        <button onClick={() => onSelectCustomer?.(p.contact_email)} className="underline hover:text-slate-800">
                          {p.contact_email}
                        </button>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-sm uppercase text-gray-500">{p.lang || '-'}</TableCell>
                    <TableCell>
                      {p.status === 'ready' ? (
                        <Badge className="bg-green-100 text-green-700"><Check className="w-3 h-3 ml-1" />Preview Sent</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700">Preview Requested</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(p)} className="h-8 px-2">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        {p.preview_link && (
                          <a href={p.preview_link} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {filtered.length > 10 && (
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => setShowAll(!showAll)} className="rounded-xl">
              {showAll ? 'Show less' : `Show all previews (${filtered.length})`}
            </Button>
          </div>
        )}
      </CardContent>

      {/* Edit preview link dialog */}
      <Dialog open={!!editingPreview} onOpenChange={() => setEditingPreview(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set preview flipbook link for {editingPreview?.child_name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="previewLink" className="text-sm font-medium text-gray-700">Heyzine Preview Link</Label>
            <Input id="previewLink" value={previewLink} onChange={(e) => setPreviewLink(e.target.value)} placeholder="https://..." className="mt-2" dir="ltr" />
            {editingPreview?.contact_email && (
              <p className="text-sm text-gray-500 mt-3">📧 After saving, the preview email will be sent automatically to: {editingPreview.contact_email}</p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingPreview(null)}>Cancel</Button>
            <Button onClick={handleSaveLink} disabled={isSaving || !previewLink.trim()} className="bg-slate-800 hover:bg-slate-700">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
              Save & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}