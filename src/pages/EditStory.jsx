import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, CheckCircle2, AlertTriangle, ImageOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StoryPageEditor from '@/components/story/StoryPageEditor';
import EditSaveBar from '@/components/story/EditSaveBar';
import NoIndexMeta from '@/components/SEO/NoIndexMeta';

export default function EditStory() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('order_id');
  // Which product this order belongs to. Defaults to 'stories' so every link that was
  // already sent to a customer keeps working; the questionnaire-based products
  // (first_grade / moving / hero_story) pass ?product= explicitly and keep their records
  // in KitaAlefStory rather than Story.
  const product = urlParams.get('product') || 'stories';
  const ENTITY_BY_PRODUCT = { stories: 'Story', first_grade: 'KitaAlefStory', moving: 'KitaAlefStory', hero_story: 'KitaAlefStory' };
  const entityName = ENTITY_BY_PRODUCT[product] || 'Story';

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [story, setStory] = useState(null);
  const [cover, setCover] = useState(null);
  const [pages, setPages] = useState([]); // { page, text, originalText, image_url }
  const [saveState, setSaveState] = useState('idle'); // idle | saving | updating | done | no-change | error
  const [noteMessage, setNoteMessage] = useState('');
  const [newStoryUrl, setNewStoryUrl] = useState('');
  const pollRef = useRef(null);

  const isHe = (story?.lang || 'he') !== 'en';

  useEffect(() => {
    load();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    if (!orderId) { setLoadError('missing_order_id'); setLoading(false); return; }
    setLoading(true);
    try {
      let currentUser = null;
      try { currentUser = await base44.auth.me(); } catch (_) { currentUser = null; }
      if (!currentUser) {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }

      const stories = await base44.entities[entityName].filter({ order_id: orderId });
      const s = stories[0];
      if (!s) { setLoadError('not_found'); setLoading(false); return; }
      setStory(s);

      const res = await base44.functions.invoke('getStoryPages', { order_id: orderId, product, language: s.lang || 'he' });
      setCover(res.data?.cover || null);
      const loaded = res.data?.pages || [];
      // סיפור שנוצר לפני שהעריכה עלתה לאוויר — יש לו order_id אבל אין
      // לו טקסטים בגיליון. עדיף להגיד את זה מאשר להציג מסך ריק.
      if (loaded.length === 0) { setLoadError('no_pages'); setLoading(false); return; }
      setPages(loaded.map((p) => ({ ...p, originalText: p.text })));
    } catch (e) {
      setLoadError('load_failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (pageNum, newText) => {
    setPages((prev) => prev.map((p) => (p.page === pageNum ? { ...p, text: newText } : p)));
  };

  const handleRestore = (pageNum) => {
    setPages((prev) => prev.map((p) => (p.page === pageNum ? { ...p, text: p.originalText } : p)));
  };

  const changedPages = pages.filter((p) => p.text !== p.originalText);

  const startPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(checkStatus, 15000);
    checkStatus();
  };

  const checkStatus = async () => {
    if (!story) return;
    try {
      const res = await base44.functions.invoke('getStoryEditStatus', {
        order_id: story.order_id, product, language: story.lang || 'he',
      });
      const data = res.data || {};
      if (data.status === 'done') {
        clearInterval(pollRef.current);
        setNewStoryUrl(data.story_url || '');
        if (data.story_url) {
          try { await base44.entities[entityName].update(story.id, { story_link: data.story_url }); } catch (_) {}
        }
        setSaveState('done');
      } else if (data.status === 'no-change') {
        clearInterval(pollRef.current);
        setSaveState('no-change');
      } else if (data.status === 'error') {
        clearInterval(pollRef.current);
        setSaveState('error');
        setNoteMessage(data.note || (isHe ? 'קרתה שגיאה בעדכון הסיפור' : 'An error occurred while updating the story'));
      }
      // status 'edit' — pipeline still working, keep polling
    } catch (_) {}
  };

  const handleSave = async () => {
    if (!story || changedPages.length === 0) return;
    setSaveState('saving');
    try {
      const res = await base44.functions.invoke('saveStoryEdit', {
        order_id: story.order_id,
        product,
        language: story.lang || 'he',
        pages: changedPages.map((p) => ({ page: p.page, text: p.text })),
      });
      if (res.data?.success) {
        setPages((prev) => prev.map((p) => ({ ...p, originalText: p.text })));
        setSaveState('updating');
        startPolling();
      } else {
        setSaveState('error');
        setNoteMessage(isHe ? 'שגיאה בשמירת השינויים' : 'Error saving changes');
      }
    } catch (e) {
      setSaveState('error');
      setNoteMessage(isHe ? 'שגיאה בשמירת השינויים' : 'Error saving changes');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <NoIndexMeta />
        <div className="animate-spin w-8 h-8 border-4 border-violet-300 border-t-violet-600 rounded-full" />
      </div>
    );
  }

  if (loadError || !story) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <NoIndexMeta />
        <ImageOff className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">
          {loadError === 'no_pages'
            ? (isHe
                ? 'הסיפור הזה נוצר לפני שאפשרות העריכה נוספה, ולכן אי אפשר לערוך אותו. כתבו לנו ונשמח לעזור.'
                : 'This story was created before editing was available. Contact us and we will help.')
            : (isHe ? 'לא הצלחנו למצוא את הסיפור לעריכה' : "We couldn't find this story to edit")}
        </p>
      </div>
    );
  }

  const locked = saveState === 'saving' || saveState === 'updating';

  return (
    <div dir={isHe ? 'rtl' : 'ltr'} className="max-w-3xl mx-auto pb-32">
      <NoIndexMeta />
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          {isHe ? `עריכת הסיפור של ${story.child_name}` : `Editing ${story.child_name}'s story`}
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          {isHe
            ? 'אפשר לשנות את המילים בכל עמוד. האיורים לא ישתנו, רק הטקסט.'
            : "You can change the words on each page. The illustrations won't change, only the text."}
        </p>
      </div>

      {saveState === 'updating' && (
        <Card className="border-0 bg-amber-50 mb-6">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-amber-400 border-t-amber-600 rounded-full" />
            <p className="text-amber-800 text-sm font-medium">{isHe ? 'הסיפור מתעדכן…' : 'The story is being updated…'}</p>
          </CardContent>
        </Card>
      )}

      {saveState === 'done' && (
        <Card className="border-0 bg-green-50 mb-6">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 text-sm font-medium">{isHe ? 'הסיפור עודכן בהצלחה!' : 'The story was updated successfully!'}</p>
              {newStoryUrl && (
                <a href={newStoryUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-green-700 underline">
                  {isHe ? 'לצפייה בסיפור המעודכן' : 'View the updated story'}
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {saveState === 'no-change' && (
        <Card className="border-0 bg-slate-50 mb-6">
          <CardContent className="p-4">
            <p className="text-slate-600 text-sm">{isHe ? 'הטקסט היה זהה למקור, לא נבנה ספר חדש.' : 'The text was the same as before, no new book was built.'}</p>
          </CardContent>
        </Card>
      )}

      {saveState === 'error' && (
        <Card className="border-0 bg-red-50 mb-6">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 text-sm">{noteMessage}</p>
          </CardContent>
        </Card>
      )}

      {cover?.image_url && (
        <div className="rounded-3xl overflow-hidden mb-6 shadow-lg shadow-violet-50 max-w-xs mx-auto">
          <img src={cover.image_url} alt="cover" className="w-full h-auto object-cover" />
        </div>
      )}

      <div className="space-y-6">
        {pages.map((p) => (
          <StoryPageEditor
            key={p.page}
            pageNum={p.page}
            text={p.text}
            originalText={p.originalText}
            imageUrl={p.image_url}
            isHe={isHe}
            disabled={locked}
            onChange={handleChange}
            onRestore={handleRestore}
          />
        ))}
      </div>

      <EditSaveBar changedCount={changedPages.length} isSaving={saveState === 'saving'} isHe={isHe} onSave={handleSave} />
    </div>
  );
}