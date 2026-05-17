import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, BookOpen, Loader2, ShieldAlert, Pencil, Check, ExternalLink, RefreshCw, Star, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../components/LanguageContext';

export default function Admin() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [storyLink, setStoryLink] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [isSyncingLinks, setIsSyncingLinks] = useState(false);
  const [syncLinksMsg, setSyncLinksMsg] = useState('');
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [creditsToAdd, setCreditsToAdd] = useState('');
  const [isSavingCredits, setIsSavingCredits] = useState(false);

  const settingLabels = { space: t('setting_space'), forest: t('setting_forest'), castle: t('setting_castle'), sports: t('setting_sports'), real_life: t('setting_real_life') };
  const challengeLabels = { fears: t('ch_fears'), social_difficulty: t('ch_social'), changes: t('ch_changes'), emotional_regulation: t('ch_emotional'), separation_anxiety: t('ch_separation'), self_confidence: t('ch_confidence'), sleep_issues: t('ch_sleep') };
  const genderLabels = { boy: t('gender_boy'), girl: t('gender_girl'), other: t('gender_other') };
  const reactionLabels = { outburst: t('r_outburst'), withdrawal: t('r_withdrawal'), attention_seeking: t('r_attention'), crying: t('r_crying'), aggression: t('r_aggression'), avoidance: t('r_avoidance') };

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      if (currentUser.role === 'admin') {
        setIsAdmin(true);
        const [allStories, allUsers] = await Promise.all([
          base44.entities.Story.list('-created_date'),
          base44.entities.User.list('-created_date')
        ]);
        setStories(allStories);
        setUsers(allUsers);
      }
    } catch (e) {
      base44.auth.redirectToLogin(window.location.href);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const headers = [t('field_date'), t('field_name'), t('field_age'), t('field_gender'), t('field_setting'), t('field_challenge'), t('field_trigger'), t('field_reaction'), t('field_hobbies'), t('form_email'), t('form_phone'), 'Content'];
      const rows = stories.map(story => [
        story.created_date ? format(new Date(story.created_date), 'dd/MM/yyyy HH:mm') : '',
        story.child_name || '', story.child_age || '',
        genderLabels[story.gender] || story.gender || '',
        settingLabels[story.setting] || story.setting || '',
        challengeLabels[story.challenge_type] || story.challenge_type || '',
        story.trigger_desc || '', reactionLabels[story.reaction_type] || story.reaction_type || '',
        story.hobbies || '', story.contact_email || '', story.contact_phone || '',
        (story.content || '').replace(/"/g, '""').replace(/\n/g, ' ')
      ]);
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `storyleap-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSyncSheet = async () => {
    setIsSyncing(true);
    setSyncMsg('');
    try {
      const res = await base44.functions.invoke('initSheet', {});
      setSyncMsg(`✓ סונכרן: ${res.data?.hebrew || 0} עברית, ${res.data?.english || 0} אנגלית`);
    } catch (err) {
      setSyncMsg('שגיאה בסנכרון');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncLinks = async () => {
    setIsSyncingLinks(true);
    setSyncLinksMsg('');
    try {
      const res = await base44.functions.invoke('syncLinksFromSheet', {});
      setSyncLinksMsg(`✓ עודכנו ${res.data?.updated || 0} לינקים`);
      if (res.data?.updated > 0) {
        const allStories = await base44.entities.Story.list('-created_date');
        setStories(allStories);
      }
    } catch (err) {
      setSyncLinksMsg('שגיאה בסנכרון לינקים');
    } finally {
      setIsSyncingLinks(false);
    }
  };

  const handleEditStory = (story) => { setEditingStory(story); setStoryLink(story.story_link || ''); };

  const handleSaveCredits = async () => {
    if (!editingUser || creditsToAdd === '') return;
    setIsSavingCredits(true);
    try {
      const amount = parseInt(creditsToAdd);
      const newCredits = (editingUser.credits || 0) + amount;
      await base44.entities.User.update(editingUser.id, { credits: newCredits });
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, credits: newCredits } : u));
      setEditingUser(null);
      setCreditsToAdd('');
    } finally {
      setIsSavingCredits(false);
    }
  };

  const handleSaveStoryLink = async () => {
    if (!editingStory || !storyLink.trim()) return;
    setIsSaving(true);
    try {
      await base44.entities.Story.update(editingStory.id, { story_link: storyLink.trim() });
      if (editingStory.contact_email) {
        await base44.integrations.Core.SendEmail({
          to: editingStory.contact_email,
          subject: `${editingStory.child_name}'s Story is Ready! ✨`,
          body: `Hi there! ✨<br><br>${editingStory.child_name} personalized story is ready.<br><br>You can read it here: ${storyLink.trim()}<br><br>Please open this in a landscape mode.<br><br>Thanks for choosing StoryLeap 💛<br><br>The StoryLeap Team`
        });
      }
      setStories(stories.map(s => s.id === editingStory.id ? { ...s, story_link: storyLink.trim() } : s));
      setEditingStory(null);
      setStoryLink('');
    } catch (err) {
      console.error('Error saving story link:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('admin_no_access')}</h2>
            <p className="text-gray-600">{t('admin_no_access_msg')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('admin_title')}</h1>
          <p className="text-gray-600">{t('admin_subtitle')}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="border-0 shadow-lg shadow-slate-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('admin_total')}</p>
              <p className="text-2xl font-bold text-gray-900">{stories.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-slate-100">
          <CardContent className="p-6 space-y-3">
            <Button onClick={exportToCSV} disabled={isExporting || stories.length === 0}
              className="w-full h-12 bg-slate-700 hover:bg-slate-600 rounded-xl">
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : <FileSpreadsheet className="w-5 h-5 ml-2" />}
              {t('admin_export')}
            </Button>
            <Button onClick={handleSyncSheet} disabled={isSyncing} variant="outline"
              className="w-full h-12 rounded-xl">
              {isSyncing ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : <RefreshCw className="w-5 h-5 ml-2" />}
              סנכרן לגיליון Google
            </Button>
            {syncMsg && <p className="text-sm text-center text-green-600">{syncMsg}</p>}
            <Button onClick={handleSyncLinks} disabled={isSyncingLinks} variant="outline"
              className="w-full h-12 rounded-xl border-green-300 text-green-700 hover:bg-green-50">
              {isSyncingLinks ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : <RefreshCw className="w-5 h-5 ml-2" />}
              סנכרן לינקים מהגיליון
            </Button>
            {syncLinksMsg && <p className="text-sm text-center text-green-600">{syncLinksMsg}</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-xl shadow-slate-100 mb-8">
        <CardHeader>
          <CardTitle className="text-lg">{t('admin_table_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {stories.length === 0 ? (
            <p className="text-center text-gray-500 py-8">{t('admin_no_stories')}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">{t('admin_col_date')}</TableHead>
                    <TableHead className="text-right">{t('admin_col_name')}</TableHead>
                    <TableHead className="text-right">{t('admin_col_age')}</TableHead>
                    <TableHead className="text-right">{t('admin_col_setting')}</TableHead>
                    <TableHead className="text-right">{t('admin_col_challenge')}</TableHead>
                    <TableHead className="text-right">{t('admin_col_email')}</TableHead>
                    <TableHead className="text-right">{t('admin_col_status')}</TableHead>
                    <TableHead className="text-right">{t('admin_col_actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stories.map((story) => (
                    <TableRow key={story.id}>
                      <TableCell className="text-sm">{story.created_date ? format(new Date(story.created_date), 'dd/MM/yyyy') : '-'}</TableCell>
                      <TableCell className="font-medium">{story.child_name}</TableCell>
                      <TableCell>{story.child_age}</TableCell>
                      <TableCell>{settingLabels[story.setting] || story.setting}</TableCell>
                      <TableCell>{challengeLabels[story.challenge_type] || story.challenge_type}</TableCell>
                      <TableCell className="text-sm text-gray-500">{story.contact_email || '-'}</TableCell>
                      <TableCell>
                        {story.story_link ? (
                          <Badge className="bg-green-100 text-green-700"><Check className="w-3 h-3 ml-1" />{t('admin_done')}</Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700">{t('admin_pending')}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditStory(story)} className="h-8 px-2">
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
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl shadow-slate-100 mt-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" /> ניהול קרדיטים למשתמשים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">שם</TableHead>
                  <TableHead className="text-right">אימייל</TableHead>
                  <TableHead className="text-right">קרדיטים</TableHead>
                  <TableHead className="text-right">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name || '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">{u.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                        <span className="font-semibold">{u.credits ?? 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => { setEditingUser(u); setCreditsToAdd(''); }}>
                        <Star className="w-3 h-3 ml-1" /> הוסף קרדיטים
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>הוסף קרדיטים ל-{editingUser?.full_name || editingUser?.email}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              קרדיטים נוכחיים: <span className="font-bold">{editingUser?.credits ?? 0}</span>
            </div>
            <div>
              <Label htmlFor="creditsToAdd">כמות קרדיטים להוסיף</Label>
              <Input
                id="creditsToAdd"
                type="number"
                value={creditsToAdd}
                onChange={(e) => setCreditsToAdd(e.target.value)}
                placeholder="לדוגמה: 10"
                className="mt-2"
                dir="ltr"
              />
            </div>
            {creditsToAdd !== '' && !isNaN(parseInt(creditsToAdd)) && (
              <p className="text-sm text-gray-500">
                לאחר הוספה: <span className="font-bold text-green-600">{(editingUser?.credits ?? 0) + parseInt(creditsToAdd)}</span> קרדיטים
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingUser(null)}>ביטול</Button>
            <Button onClick={handleSaveCredits} disabled={isSavingCredits || creditsToAdd === ''} className="bg-amber-500 hover:bg-amber-600 text-white">
              {isSavingCredits ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Star className="w-4 h-4 ml-2" />}
              שמור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingStory} onOpenChange={() => setEditingStory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('admin_edit_title_prefix')} {editingStory?.child_name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="storyLink" className="text-sm font-medium text-gray-700">{t('admin_link_label')}</Label>
            <Input id="storyLink" value={storyLink} onChange={(e) => setStoryLink(e.target.value)} placeholder="https://..." className="mt-2" dir="ltr" />
            {editingStory?.contact_email && (
              <p className="text-sm text-gray-500 mt-3">{t('admin_email_note_prefix')} {editingStory.contact_email}</p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingStory(null)}>{t('admin_cancel')}</Button>
            <Button onClick={handleSaveStoryLink} disabled={isSaving || !storyLink.trim()} className="bg-slate-800 hover:bg-slate-700">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
              {t('admin_save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}