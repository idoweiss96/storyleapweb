import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Sparkles, ExternalLink, Clock } from 'lucide-react';
import { format } from 'date-fns';
import StoryReadyNotification from '../components/story/StoryReadyNotification';
import { useLanguage } from '../components/LanguageContext';

export default function MyStories() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [readyNotification, setReadyNotification] = useState(null);

  useEffect(() => { loadStories(); }, []);

  const loadStories = async () => {
    try {
      const user = await base44.auth.me();
      const userStories = await base44.entities.Story.filter({ created_by: user.email }, '-created_date');
      setStories(userStories);
    } catch (e) {
      base44.auth.redirectToLogin(window.location.href);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = base44.entities.Story.subscribe((event) => {
      if (event.type === 'update' && event.data.story_link) {
        const updatedStory = stories.find(s => s.id === event.id);
        if (updatedStory && !updatedStory.story_link && event.data.story_link) {
          setReadyNotification({ ...updatedStory, ...event.data });
          setStories(prev => prev.map(s => s.id === event.id ? { ...s, ...event.data } : s));
        }
      }
    });
    return () => unsubscribe();
  }, [stories]);

  const genderLabels = { boy: t('gender_boy_label') || t('gender_boy'), girl: t('gender_girl_label') || t('gender_girl'), other: t('gender_other') };
  const settingLabels = { space: `${t('setting_space')} 🚀`, forest: `${t('setting_forest')} 🌳`, castle: `${t('setting_castle')} 🏰`, sports: `${t('setting_sports')} ⚽`, real_life: `${t('setting_real_life')} 🏠` };
  const challengeLabels = { fears: t('ch_fears'), social_difficulty: t('ch_social'), changes: t('ch_changes'), emotional_regulation: t('ch_emotional'), separation_anxiety: t('ch_separation'), self_confidence: t('ch_confidence'), sleep_issues: t('ch_sleep') };
  const reactionLabels = { outburst: t('r_outburst'), withdrawal: t('r_withdrawal'), attention_seeking: t('r_attention'), crying: t('r_crying'), aggression: t('r_aggression'), avoidance: t('r_avoidance') };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="text-center mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg shadow-slate-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('my_stories_title')}</h1>
        <p className="text-gray-600">{t('my_stories_subtitle')}</p>
      </div>

      {stories.length === 0 ? (
        <Card className="border-0 shadow-xl shadow-violet-50 max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-violet-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('my_stories_empty_title')}</h3>
            <p className="text-gray-500 mb-6">{t('my_stories_empty_msg')}</p>
            <Button onClick={() => navigate(createPageUrl('CreateStory'))} className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 rounded-xl">
              <Plus className="w-4 h-4 ml-2" />
              {t('my_stories_new')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-end mb-6">
            <Button onClick={() => navigate(createPageUrl('CreateStory'))} className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 rounded-xl">
              <Plus className="w-4 h-4 ml-2" />
              {t('my_stories_new')}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stories.map((story, index) => (
              <motion.div key={story.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="border-0 shadow-lg shadow-violet-50 hover:shadow-xl hover:shadow-violet-100 transition-all cursor-pointer group" onClick={() => setSelectedStory(story)}>
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-7 h-7 text-slate-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{story.child_name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{t('my_story_age')} {story.child_age}</p>
                    {story.story_link ? (
                      <Badge className="bg-green-100 text-green-700">{t('my_story_ready')}</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700">
                        <Clock className="w-3 h-3 ml-1" />{t('my_story_pending')}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">
              {t('dialog_title_prefix')} {selectedStory?.child_name}
            </DialogTitle>
          </DialogHeader>
          {selectedStory && (
            <div className="mt-4">
              <Table>
                <TableBody>
                  {[
                    [t('field_name'), selectedStory.child_name],
                    [t('field_age'), selectedStory.child_age],
                    [t('field_gender'), genderLabels[selectedStory.gender] || selectedStory.gender],
                    [t('field_setting'), settingLabels[selectedStory.setting] || selectedStory.setting],
                    [t('field_challenge'), challengeLabels[selectedStory.challenge_type] || selectedStory.challenge_type],
                    ...(selectedStory.trigger_desc ? [[t('field_trigger'), selectedStory.trigger_desc]] : []),
                    ...(selectedStory.reaction_type ? [[t('field_reaction'), reactionLabels[selectedStory.reaction_type] || selectedStory.reaction_type]] : []),
                    ...(selectedStory.hobbies ? [[t('field_hobbies'), selectedStory.hobbies]] : []),
                    [t('field_date'), selectedStory.created_date ? format(new Date(selectedStory.created_date), 'dd/MM/yyyy HH:mm') : '-'],
                  ].map(([label, value], i) => (
                    <tr key={i} className="border-b">
                      <td className="font-medium text-gray-600 w-1/3 py-3 px-4">{label}</td>
                      <td className="py-3 px-4">{value}</td>
                    </tr>
                  ))}
                  <tr className="border-b">
                    <td className="font-medium text-gray-600 w-1/3 py-3 px-4">{t('field_link')}</td>
                    <td className="py-3 px-4">
                      {selectedStory.story_link ? (
                        <a href={selectedStory.story_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-800 font-medium">
                          <ExternalLink className="w-4 h-4" />{t('view_story')}
                        </a>
                      ) : (
                        <span className="text-amber-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />{t('story_in_progress')}
                        </span>
                      )}
                    </td>
                  </tr>
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {readyNotification && (
        <StoryReadyNotification story={readyNotification} onClose={() => setReadyNotification(null)} />
      )}
    </div>
  );
}