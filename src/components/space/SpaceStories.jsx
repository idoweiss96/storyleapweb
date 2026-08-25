import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, Plus, Clock, CreditCard, Pencil } from 'lucide-react';
import { format } from 'date-fns';

/**
 * The stories belonging to this space.
 *
 * Story state is read exactly the way MyStories reads it, so a story looks
 * the same in both places: a link means ready, draft means unpaid, and
 * anything else is still in the pipeline.
 */
export default function SpaceStories({ stories, lang = 'he' }) {
  const he = lang === 'he';

  return (
    <Card className="border-0 shadow-lg shadow-violet-50">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-400" />
            {he ? 'הסיפורים שלי' : 'My stories'}
          </h2>
          <Button asChild variant="ghost" size="sm" className="text-xs text-slate-500 rounded-lg">
            <Link to="/MyStories">{he ? 'הצג הכל' : 'View all'}</Link>
          </Button>
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
              const isDraft = !story.story_link && story.payment_status === 'draft';

              const card = (
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

                  <div className="mt-auto pt-1">
                    {hasValidLink ? (
                      <Badge className="bg-emerald-100 text-emerald-700 gap-1 text-[11px]">
                        <Sparkles className="w-3 h-3" />
                        {story.edit_pending
                          ? (he ? 'מתעדכן…' : 'Updating…')
                          : (he ? 'מוכן' : 'Ready')}
                      </Badge>
                    ) : isDraft ? (
                      <Badge className="bg-amber-100 text-amber-700 gap-1 text-[11px]">
                        <CreditCard className="w-3 h-3" />
                        {he ? 'ממתין לתשלום' : 'Pending payment'}
                      </Badge>
                    ) : (
                      <Badge className="bg-sky-100 text-sky-700 gap-1 text-[11px]">
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

              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  {hasValidLink ? (
                    <a href={story.story_link} target="_blank" rel="noopener noreferrer" className="block h-full">
                      {card}
                    </a>
                  ) : (
                    <Link to="/MyStories" className="block h-full">{card}</Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
