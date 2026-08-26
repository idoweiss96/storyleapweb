import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, Sparkles, Plus, Clock, CreditCard, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useNavPath } from '@/lib/useNavPath';
import StoryDisplay from '@/components/story/StoryDisplay';

/**
 * The stories belonging to this space.
 *
 * Story state is read exactly the way MyStories reads it, so a story looks
 * the same in both places: a link means ready, draft means unpaid, and
 * anything else is still in the pipeline. This is now the primary place
 * parents manage story status (activation, viewing) — MyStories is no
 * longer linked to from the main nav.
 */
export default function SpaceStories({ stories, lang = 'he', onStoryUpdated }) {
  const he = lang === 'he';
  const navigate = useNavigate();
  const navPath = useNavPath();
  const [activatingId, setActivatingId] = useState(null);
  const [viewingStory, setViewingStory] = useState(null);

  const handleActivate = async (story, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActivatingId(story.id);
    try {
      const user = await base44.auth.me();
      if ((user.credits || 0) < 60) {
        navigate(navPath('Pricing'));
        return;
      }
      const fnName = story.source === 'kitaalef' ? 'submitKitaAlefStoryWithCredits' : 'submitStoryWithCredits';
      const result = await base44.functions.invoke(fnName, { story_id: story.id, lang: story.lang });
      if (result.data?.success) {
        await base44.auth.updateMe({ credits: result.data.credits_remaining });
        window.dispatchEvent(new Event('credits-updated'));
        onStoryUpdated?.(story.id, { payment_status: 'paid' });
      } else {
        toast.error(he ? 'לא הצלחנו ליצור את הסיפור' : "Couldn't create the story");
        navigate(navPath('Pricing'));
      }
    } catch (_) {
      navigate(navPath('Pricing'));
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <Card className="border-0 shadow-lg shadow-violet-50">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-400" />
            {he ? 'הסיפורים שלי' : 'My stories'}
          </h2>
        </div>

        {stories.length === 0 ? (
          <Link
            to="/CreateStory"
            className="block py-8 px-4 rounded-xl border-2 border-dashed border-slate-200 text-center hover:border-violet-300 hover:bg-violet-50/40 transition-colors"
          >
            <Plus className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              {he ? 'עוד אין סיפורים במרחב הזה. בואו ניצור את הראשון.' : "No stories here yet. Let's create the first one."}
            </p>
          </Link>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stories.map((story, index) => {
              const hasValidLink = story.story_link && story.story_link !== story.child_image_url;
              const isDraft = !hasValidLink && story.payment_status === 'draft';
              const isReadable = !hasValidLink && !isDraft && !!story.content;
              const isActivating = activatingId === story.id;

              const cardInner = (
                <div className="h-full p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all flex flex-col gap-2">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
                    {story.child_image_url
                      ? <img src={story.child_image_url} alt="" className="w-full h-full object-cover rounded-xl" />
                      : <Sparkles className="w-5 h-5 text-violet-500" />}
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 leading-tight">
                    {story.child_name}
                  </h3>

                  {story.created_date && (
                    <span className="text-xs text-slate-400 tabular-nums">
                      {format(new Date(story.created_date), 'dd/MM/yyyy')}
                    </span>
                  )}

                  <div className="mt-auto pt-1 space-y-2">
                    {hasValidLink ? (
                      <Badge className="bg-green-100 text-green-700 gap-1 text-[11px]">
                        <Sparkles className="w-3 h-3" />
                        {story.edit_pending
                          ? (he ? 'מתעדכן…' : 'Updating…')
                          : (he ? 'מוכן' : 'Ready')}
                      </Badge>
                    ) : isDraft ? (
                      <>
                        <Badge className="bg-red-100 text-red-700 gap-1 text-[11px]">
                          <CreditCard className="w-3 h-3" />
                          {he ? 'ממתין לתשלום' : 'Pending payment'}
                        </Badge>
                        <Button
                          size="sm"
                          disabled={isActivating}
                          onClick={(e) => handleActivate(story, e)}
                          className="w-full text-xs h-8 rounded-lg bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          {isActivating ? (
                            <Clock className="w-3 h-3 animate-spin" />
                          ) : (
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {he ? 'צור סיפור (60 ⭐)' : 'Create Story (60 ⭐)'}
                            </span>
                          )}
                        </Button>
                      </>
                    ) : isReadable ? (
                      <Badge className="bg-blue-100 text-blue-700 gap-1 text-[11px]">
                        <BookOpen className="w-3 h-3" />
                        {he ? 'מוכן לקריאה' : 'Ready to read'}
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        {he ? 'בהכנה' : 'In progress'}
                      </Badge>
                    )}
                  </div>

                  {/* Editing needs a story_link — without one the editor opens empty.
                      KitaAlefStory records (source set) go through a different pipeline. */}
                  {!story.source && story.order_id && story.story_link && !story.edit_pending && (
                    <a
                      href={`/EditStory?order_id=${story.order_id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1 text-[11px] font-medium text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg py-1 px-2 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      {he ? 'ערוך' : 'Edit'}
                    </a>
                  )}
                </div>
              );

              let card = cardInner;
              if (hasValidLink) {
                card = (
                  <a href={story.story_link} target="_blank" rel="noopener noreferrer" className="block h-full">
                    {cardInner}
                  </a>
                );
              } else if (isReadable) {
                card = (
                  <button type="button" onClick={() => setViewingStory(story)} className="block h-full w-full text-start">
                    {cardInner}
                  </button>
                );
              }

              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  {card}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>

      <Dialog open={!!viewingStory} onOpenChange={(v) => !v && setViewingStory(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">
              {viewingStory?.child_name}
            </DialogTitle>
          </DialogHeader>
          {viewingStory && (
            <div className="mt-4">
              <StoryDisplay story={viewingStory} onNewStory={() => setViewingStory(null)} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}