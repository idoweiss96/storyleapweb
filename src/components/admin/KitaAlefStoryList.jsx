import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Pencil, Check, ExternalLink, Search, Image, Download, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export default function KitaAlefStoryList() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStory, setEditingStory] = useState(null);
  const [storyLink, setStoryLink] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);

  useEffect(() => { loadStories(); }, []);

  const loadStories = async () => {
    setIsLoading(true);
    try {
      const all = await base44.entities.KitaAlefStory.list('-created_date');
      setStories(all);
    } catch (e) {
      console.error('Failed to load KitaAlef stories:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (story) => { setEditingStory(story); setStoryLink(story.story_link || ''); };

  const handleSaveLink = async () => {
    if (!editingStory || !storyLink.trim()) return;
    setIsSaving(true);
    try {
      await base44.entities.KitaAlefStory.update(editingStory.id, { story_link: storyLink.trim() });
      setStories(stories.map(s => s.id === editingStory.id ? { ...s, story_link: storyLink.trim() } : s));
      setEditingStory(null);
      setStoryLink('');
    } catch (err) {
      console.error('Error saving story link:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadImage = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = stories.filter(story =>
    (story.child_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (story.contact_email || '').toLowerCase().includes(search.toLowerCase())
  );
  const visible = showAll ? filtered : filtered.slice(0, 10);

  return (
    <Card className="border-0 shadow-xl shadow-slate-100 mb-8" style={{ boxShadow: '0 4px 30px rgba(107,92,231,0.08)' }}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#1A1A6E' }}>
          <BookOpen className="w-5 h-5" /> ניהול הגשות — כיתה א׳
          <Badge className="mr-2 bg-purple-100 text-purple-700">{stories.length}</Badge>
        </CardTitle>
        <div className="mt-4 relative">
          <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="חפש לפי שם ילד או אימייל..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4 pr-10"
            dir="rtl"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          </div>
        ) : stories.length === 0 ? (
          <p className="text-center text-gray-500 py-8">אין הגשות עדיין</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">תאריך</TableHead>
                  <TableHead className="text-right">שם</TableHead>
                  <TableHead className="text-right">תמונה</TableHead>
                  <TableHead className="text-right">מייל</TableHead>
                  <TableHead className="text-right">תשלום</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                  <TableHead className="text-right">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell className="text-sm">
                      {story.created_date ? format(new Date(story.created_date), 'dd/MM/yyyy HH:mm') : '-'}
                    </TableCell>
                    <TableCell className="font-medium">{story.child_name || '-'}</TableCell>
                    <TableCell>
                      {story.child_image_url ? (
                        <button onClick={() => setViewingImage({ url: story.child_image_url, name: story.child_name })}
                          className="hover:opacity-80 transition-opacity">
                          <img src={story.child_image_url} alt={story.child_name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                        </button>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Image className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{story.contact_email || '-'}</TableCell>
                    <TableCell>
                      {story.payment_status === 'paid' ? (
                        <Badge className="bg-green-100 text-green-700"><Check className="w-3 h-3 ml-1" />שולם</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700">טיוטה</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {story.story_link ? (
                        <Badge className="bg-green-100 text-green-700"><Check className="w-3 h-3 ml-1" />הושלם</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700">ממתין</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(story)} className="h-8 px-2">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        {story.story_link && (
                          <a href={story.story_link} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-800">
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
              {showAll ? 'הצג פחות' : `הצג את כל ההגשות (${filtered.length})`}
            </Button>
          </div>
        )}
      </CardContent>

      {/* Image viewer dialog */}
      <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>תמונת {viewingImage?.name}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadImage(viewingImage.url, viewingImage.name)}
              className="h-8 w-8 p-0"
            >
              <Download className="w-4 h-4" />
            </Button>
          </DialogHeader>
          <div className="py-2 flex justify-center">
            {viewingImage && (
              <img src={viewingImage.url} alt={viewingImage.name}
                className="max-w-full max-h-96 rounded-xl object-contain" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit story link dialog */}
      <Dialog open={!!editingStory} onOpenChange={() => setEditingStory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>עדכון קישור לסיפור של {editingStory?.child_name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="kitaStoryLink" className="text-sm font-medium text-gray-700">קישור לסיפור</Label>
            <Input id="kitaStoryLink" value={storyLink} onChange={(e) => setStoryLink(e.target.value)} placeholder="https://..." className="mt-2" dir="ltr" />
            {editingStory?.contact_email && (
              <p className="text-sm text-gray-500 mt-3">📧 לאחר השמירה, יישלח עדכון למייל: {editingStory.contact_email}</p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingStory(null)}>ביטול</Button>
            <Button onClick={handleSaveLink} disabled={isSaving || !storyLink.trim()} className="bg-slate-800 hover:bg-slate-700">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
              שמור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}