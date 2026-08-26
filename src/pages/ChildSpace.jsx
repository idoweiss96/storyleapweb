import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus, Loader2, Users } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import PageMeta from '@/components/SEO/PageMeta';
import NoIndexMeta from '@/components/SEO/NoIndexMeta';
import {
  getAvatar, getTheme, resolveActiveSpace, setActiveSpaceId,
} from '@/lib/childSpace';
import SpaceHero from '@/components/space/SpaceHero';
import SpaceStories from '@/components/space/SpaceStories';
import ActivityFeed from '@/components/space/ActivityFeed';
import ReminderList from '@/components/space/ReminderList';
import MoodCheckIn from '@/components/space/MoodCheckIn';
import ParentInsights from '@/components/space/ParentInsights';
import SpaceDialog from '@/components/space/SpaceDialog';
import AdoptStoriesPrompt from '@/components/space/AdoptStoriesPrompt';

export default function ChildSpace() {
  const { lang } = useLanguage();
  const he = lang === 'he';

  const [isLoading, setIsLoading] = useState(true);
  const [spaces, setSpaces] = useState([]);
  const [activeSpace, setActiveSpace] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [entries, setEntries] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [moods, setMoods] = useState([]);

  const [spaceDialogOpen, setSpaceDialogOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);
  const [adoptDismissed, setAdoptDismissed] = useState(false);

  /* ---------------- data ---------------- */

  const loadSpaces = useCallback(async () => {
    // Archived spaces are filtered here rather than in the query: RLS already
    // scopes this to the parent's own rows, and there are never many of them.
    const all = await base44.entities.ChildSpace.list('-created_date');
    const list = (all || []).filter((s) => !s.is_archived);
    setSpaces(list);
    return list;
  }, []);

  /** Stories come from the function that already merges Story + KitaAlefStory. */
  const loadStories = useCallback(async () => {
    try {
      const res = await base44.functions.invoke('getUserStories', {});
      setAllStories(res.data?.stories || []);
    } catch (e) {
      console.error('[ChildSpace] getUserStories failed:', e);
      setAllStories([]);
    }
  }, []);

  const loadSpaceData = useCallback(async (spaceId) => {
    if (!spaceId) {
      setEntries([]);
      setReminders([]);
      setMoods([]);
      return;
    }
    const [act, rem, mood] = await Promise.all([
      base44.entities.ActivityEntry.filter({ child_space_id: spaceId }, '-created_date').catch(() => []),
      base44.entities.Reminder.filter({ child_space_id: spaceId }).catch(() => []),
      base44.entities.MoodEntry.filter({ child_space_id: spaceId }, '-date').catch(() => []),
    ]);
    setEntries(act || []);
    setReminders(rem || []);
    setMoods(mood || []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        await base44.auth.me();
        const list = await loadSpaces();
        if (cancelled) return;
        const active = resolveActiveSpace(list);
        setActiveSpace(active);
        // Persist on first visit too, so the header can label itself.
        setActiveSpaceId(active?.id || null, active?.name);
        await Promise.all([loadStories(), loadSpaceData(active?.id)]);
      } catch (e) {
        console.error('[ChildSpace] init failed:', e);
        base44.auth.redirectToLogin(window.location.href);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    init();
    return () => { cancelled = true; };
  }, [loadSpaces, loadStories, loadSpaceData]);

  const selectSpace = useCallback(async (space) => {
    setActiveSpace(space);
    setActiveSpaceId(space?.id || null, space?.name);
    await loadSpaceData(space?.id);
  }, [loadSpaceData]);

  const refreshSpaceData = useCallback(async () => {
    await loadSpaceData(activeSpace?.id);
  }, [loadSpaceData, activeSpace]);

  const handleStoryUpdated = useCallback((storyId, patch) => {
    setAllStories((prev) => prev.map((s) => (s.id === storyId ? { ...s, ...patch } : s)));
  }, []);

  const handleSpaceSaved = useCallback(async (saved) => {
    const list = await loadSpaces();
    const fresh = list.find((s) => s.id === saved?.id) || saved;
    await selectSpace(fresh);
  }, [loadSpaces, selectSpace]);

  const handleAdopted = useCallback(async (space) => {
    const list = await loadSpaces();
    await loadStories();
    const fresh = list.find((s) => s.id === space.id) || space;
    await selectSpace(fresh);
  }, [loadSpaces, loadStories, selectSpace]);

  /* ---------------- derived ---------------- */

  const spaceStories = activeSpace
    ? allStories.filter((s) => s.child_space_id === activeSpace.id)
    : [];
  const unassignedStories = allStories.filter((s) => !s.child_space_id);

  const meta = he
    ? { title: 'המרחב האישי | StoryLeap', description: 'המרחב האישי של הילד/ה — סיפורים, פעילויות, תזכורות וצ׳ק-אין יומי.' }
    : { title: 'Personal Space | StoryLeap', description: "Your child's personal space — stories, activities, reminders and a daily check-in." };

  /* ---------------- render ---------------- */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  // No spaces yet — one clear invitation, plus adoption if there's history.
  if (!activeSpace) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <PageMeta title={meta.title} description={meta.description} />
        <NoIndexMeta />

        {unassignedStories.length > 0 && !adoptDismissed && (
          <AdoptStoriesPrompt
            stories={unassignedStories}
            spaces={spaces}
            lang={lang}
            onAdopted={handleAdopted}
            onDismiss={() => setAdoptDismissed(true)}
          />
        )}

        <Card className="border-0 shadow-lg shadow-violet-50">
          <CardContent className="py-16 px-6 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-violet-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {he ? 'בואו ניצור מרחב אישי' : "Let's create a personal space"}
            </h1>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {he
                ? 'מרחב אחד לכל ילד/ה — הסיפורים, הפעילויות שעשיתם, התזכורות והרגשות, במקום אחד. אפשר ליצור כמה מרחבים שתרצו.'
                : 'One space per child — stories, the activities you did, reminders and feelings, all in one place. Create as many as you need.'}
            </p>
            <Button
              onClick={() => { setEditingSpace(null); setSpaceDialogOpen(true); }}
              className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 rounded-xl"
            >
              <Plus className="w-4 h-4 me-2" />
              {he ? 'יצירת מרחב' : 'Create a space'}
            </Button>
          </CardContent>
        </Card>

        <SpaceDialog
          open={spaceDialogOpen}
          onOpenChange={setSpaceDialogOpen}
          space={editingSpace}
          lang={lang}
          onSaved={handleSpaceSaved}
        />
      </div>
    );
  }

  const theme = getTheme(activeSpace.color_theme);

  return (
    <div className="max-w-6xl mx-auto py-6">
      <PageMeta title={meta.title} description={meta.description} />
      <NoIndexMeta />

      {/* Space switcher — only earns its place once there are two */}
      {spaces.length > 1 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <Users className="w-4 h-4 text-slate-400 flex-none" />
          {spaces.map((space) => {
            const avatar = getAvatar(space.avatar_id);
            const isActive = space.id === activeSpace.id;
            return (
              <button
                key={space.id}
                type="button"
                onClick={() => selectSpace(space)}
                aria-pressed={isActive}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition-all
                  ${isActive
                    ? `${getTheme(space.color_theme).soft} ${getTheme(space.color_theme).text} ${getTheme(space.color_theme).border} font-medium`
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                <span className="text-base leading-none">{avatar.emoji}</span>
                {space.name}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => { setEditingSpace(null); setSpaceDialogOpen(true); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-slate-200 text-sm text-slate-400 hover:text-slate-600 hover:border-slate-300 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            {he ? 'מרחב חדש' : 'New space'}
          </button>
        </div>
      )}

      <SpaceHero
        space={activeSpace}
        lang={lang}
        onEdit={() => { setEditingSpace(activeSpace); setSpaceDialogOpen(true); }}
      />

      {unassignedStories.length > 0 && !adoptDismissed && (
        <AdoptStoriesPrompt
          stories={unassignedStories}
          spaces={spaces}
          lang={lang}
          onAdopted={handleAdopted}
          onDismiss={() => setAdoptDismissed(true)}
        />
      )}

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 mb-4">
        <div className="flex flex-col gap-4">
          <SpaceStories stories={spaceStories} lang={lang} onStoryUpdated={handleStoryUpdated} />
          <ActivityFeed
            entries={entries}
            lang={lang}
            onChanged={refreshSpaceData}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ParentInsights
            space={activeSpace}
            stories={spaceStories}
            entries={entries}
            moods={moods}
            lang={lang}
          />
          <ReminderList
            spaceId={activeSpace.id}
            reminders={reminders}
            lang={lang}
            onChanged={refreshSpaceData}
          />
        </div>
      </div>

      <MoodCheckIn
        spaceId={activeSpace.id}
        space={activeSpace}
        moods={moods}
        lang={lang}
        onChanged={refreshSpaceData}
      />

      {/* A single space still needs a way to add a second */}
      {spaces.length === 1 && (
        <button
          type="button"
          onClick={() => { setEditingSpace(null); setSpaceDialogOpen(true); }}
          className={`mt-4 w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-400 hover:border-violet-300 hover:${theme.soft} transition-colors flex items-center justify-center gap-1.5`}
        >
          <Plus className="w-4 h-4" />
          {he ? 'הוספת מרחב לילד/ה נוסף/ת' : 'Add a space for another child'}
        </button>
      )}

      <SpaceDialog
        open={spaceDialogOpen}
        onOpenChange={setSpaceDialogOpen}
        space={editingSpace}
        lang={lang}
        onSaved={handleSpaceSaved}
      />
    </div>
  );
}