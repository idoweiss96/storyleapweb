import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Sparkles, ExternalLink, Clock, CreditCard, Star } from 'lucide-react';
import { format } from 'date-fns';
import StoryReadyNotification from '../components/story/StoryReadyNotification';
import { useLanguage } from '../components/LanguageContext';
import { useNavPath } from '@/lib/useNavPath';
import { toast } from 'sonner';

export default function MyStories() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const navPath = useNavPath();
  const [stories, setStories] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [readyNotification, setReadyNotification] = useState(null);
  const [activatingStoryId, setActivatingStoryId] = useState(null);

  const [creditsAddedPopup, setCreditsAddedPopup] = useState(null); // { added, total, pendingStory }

  // Handle PayPal redirect return (mobile hosted button flow)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    // PayPal hosted buttons return 'tx' (transaction ID), regular orders return 'token'
    const paypalToken = urlParams.get('token') || urlParams.get('tx');
    if (!paypalToken) return;

    // Clean URL immediately
    window.history.replaceState({}, '', window.location.pathname);

    const capture = async () => {
      try {
        const res = await base44.functions.invoke('captureCreditsOrder', {
          paypal_order_id: paypalToken,
          credits: 100,
          coupon: true,
        });
        if (res.data?.success) {
          try { await base44.auth.updateMe({ credits: res.data.new_total }); } catch (_) {}
          window.dispatchEvent(new Event('credits-updated'));
          // After refresh, find pending story and show popup
          const refreshedRes = await base44.functions.invoke('getUserStories', {});
          const refreshedStories = refreshedRes.data?.stories || [];
          setStories(refreshedStories);
          const pendingStory = refreshedStories.find(s => s.payment_status === 'pending_payment');
          setCreditsAddedPopup({ added: 100, total: res.data.new_total, pendingStory });
        } else {
          toast.error(lang === 'he' ? 'שגיאה בעיבוד התשלום' : 'Payment processing error');
        }
      } catch (err) {
        console.error('[PayPal] capture error:', err);
        toast.error(lang === 'he' ? 'שגיאה בעיבוד התשלום' : 'Payment processing error');
      }
    };
    capture();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { loadStories(); }, []);

  const loadStories = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      let userStories = [];
      try {
        const res = await base44.functions.invoke('getUserStories', {});
        userStories = res.data?.stories || [];
        console.log('[MyStories] getUserStories response, count:', userStories.length);
      } catch (fnErr) {
        console.error('[MyStories] function error, falling back to direct query:', fnErr);
      }
      // Fallback: direct entity query (works if RLS allows it)
      if (userStories.length === 0) {
        userStories = await base44.entities.Story.filter({ created_by_id: currentUser.id }, '-created_date');
        console.log('[MyStories] direct query fallback, count:', userStories.length);
      }
      setStories(userStories);
    } catch (e) {
      console.error('[MyStories] loadStories error:', e);
      base44.auth.redirectToLogin(window.location.href);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateStory = async (story, e) => {
    e.stopPropagation();
    const credits = user?.credits || 0;
    if (credits < 100) {
      navigate(navPath('Pricing'));
      return;
    }
    setActivatingStoryId(story.id);
    try {
      const result = await base44.functions.invoke('submitStoryWithCredits', { story_id: story.id });
      if (result.data?.success) {
        const newCredits = result.data.credits_remaining;
        await base44.auth.updateMe({ credits: newCredits });
        setUser(prev => ({ ...prev, credits: newCredits }));
        window.dispatchEvent(new Event('credits-updated'));
        setStories(prev => prev.map(s => s.id === story.id ? { ...s, payment_status: 'paid' } : s));
      } else {
        navigate(navPath('Pricing'));
      }
    } catch (err) {
      navigate(navPath('Pricing'));
    } finally {
      setActivatingStoryId(null);
    }
  };

  useEffect(() => {
    const handler = (event) => {
      if (event.type === 'update' && event.data.story_link) {
        const updatedStory = stories.find(s => s.id === event.id);
        if (updatedStory && !updatedStory.story_link && event.data.story_link) {
          setReadyNotification({ ...updatedStory, ...event.data });
          setStories(prev => prev.map(s => s.id === event.id ? { ...s, ...event.data } : s));
        }
      }
    };
    const unsubStory = base44.entities.Story.subscribe(handler);
    const unsubKita = base44.entities.KitaAlefStory.subscribe(handler);
    return () => { unsubStory(); unsubKita(); };
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
                <Card className="border-0 shadow-lg shadow-violet-50 hover:shadow-xl hover:shadow-violet-100 transition-all cursor-pointer group" onClick={() => story.story_link ? window.open(story.story_link, '_blank') : setSelectedStory(story)}>
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-7 h-7 text-slate-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{story.child_name}</h3>
                    {story.child_age ? (
                      <p className="text-sm text-gray-500 mb-2">{t('my_story_age')} {story.child_age}</p>
                    ) : null}
                    {story.story_link ? (
                      <Badge className="bg-green-100 text-green-700 gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {t('my_story_ready')}
                      </Badge>
                    ) : story.payment_status === 'pending_payment' ? (
                      <div className="space-y-2">
                        <Badge className="bg-red-100 text-red-700">
                          <CreditCard className="w-3 h-3 ml-1" />{lang === 'he' ? 'ממתין לתשלום' : 'Pending payment'}
                        </Badge>
                        <Button
                          size="sm"
                          disabled={activatingStoryId === story.id}
                          onClick={(e) => handleActivateStory(story, e)}
                          className="w-full text-xs h-8 rounded-lg bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          {activatingStoryId === story.id ? (
                            <Clock className="w-3 h-3 animate-spin" />
                          ) : (
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {lang === 'he' ? 'צור סיפור (100 ⭐)' : 'Create Story (100 ⭐)'}
                            </span>
                          )}
                        </Button>
                      </div>
                    ) : (
                       <Badge className="bg-amber-100 text-amber-700">
                          <Clock className="w-3 h-3 ml-1" />{lang === 'he' ? `${story.child_name} נמצא בהכנה` : t('my_story_pending')}
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
                      ) : selectedStory.payment_status === 'pending_payment' ? (
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-red-600 flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />{lang === 'he' ? 'ממתין לתשלום' : 'Pending payment'}
                          </span>
                          <Button size="sm" disabled={activatingStoryId === selectedStory.id}
                            onClick={(e) => { handleActivateStory(selectedStory, e); setSelectedStory(null); }}
                            className="h-8 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs">
                            {activatingStoryId === selectedStory.id ? <Clock className="w-3 h-3 animate-spin" /> : (
                              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" />{lang === 'he' ? 'צור סיפור (100 ⭐)' : 'Create Story (100 ⭐)'}</span>
                            )}
                          </Button>
                        </div>
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

      {/* Credits added popup after purchase */}
      <AnimatePresence>
        {creditsAddedPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCreditsAddedPopup(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-amber-500 fill-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                {lang === 'he' ? '🎉 הקרדיטים נוספו!' : '🎉 Credits Added!'}
              </h2>
              <p className="text-slate-600 text-sm mb-1">
                {lang === 'he'
                  ? `נוספו לך ${creditsAddedPopup.added} קרדיטים לחשבון.`
                  : `${creditsAddedPopup.added} credits were added to your account.`}
              </p>
              <p className="text-slate-500 text-sm mb-4">
                {lang === 'he'
                  ? `סה"כ יש לך כעת ${creditsAddedPopup.total} קרדיטים.`
                  : `You now have ${creditsAddedPopup.total} credits total.`}
              </p>

              {creditsAddedPopup.pendingStory ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-right">
                  <p className="text-amber-800 text-sm font-medium">
                    {lang === 'he'
                      ? `יש לך סיפור ממתין עבור ${creditsAddedPopup.pendingStory.child_name} — לחץ ליצירה עכשיו!`
                      : `You have a pending story for ${creditsAddedPopup.pendingStory.child_name} — click to create now!`}
                  </p>
                </div>
              ) : null}

              <div className="space-y-2">
                {creditsAddedPopup.pendingStory && (
                  <Button
                    onClick={async () => {
                      const story = creditsAddedPopup.pendingStory;
                      setCreditsAddedPopup(null);
                      setActivatingStoryId(story.id);
                      try {
                        const result = await base44.functions.invoke('submitStoryWithCredits', { story_id: story.id });
                        if (result.data?.success) {
                          const newCredits = result.data.credits_remaining;
                          await base44.auth.updateMe({ credits: newCredits });
                          setUser(prev => ({ ...prev, credits: newCredits }));
                          window.dispatchEvent(new Event('credits-updated'));
                          setStories(prev => prev.map(s => s.id === story.id ? { ...s, payment_status: 'paid' } : s));
                          toast.success(lang === 'he' ? '✨ הסיפור נשלח ליצירה!' : '✨ Story sent for creation!');
                        }
                      } catch (_) {
                        toast.error(lang === 'he' ? 'שגיאה ביצירת הסיפור' : 'Error creating story');
                      } finally {
                        setActivatingStoryId(null);
                      }
                    }}
                    className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {lang === 'he' ? 'צור את הסיפור עכשיו!' : 'Create Story Now!'}
                    </span>
                  </Button>
                )}
                <button
                  onClick={() => setCreditsAddedPopup(null)}
                  className="w-full text-sm text-slate-400 hover:text-slate-600 py-2"
                >
                  {lang === 'he' ? 'סגור' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}