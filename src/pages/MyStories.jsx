import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Sparkles, ExternalLink, Clock } from 'lucide-react';
import { format } from 'date-fns';

const genderLabels = { boy: 'בן', girl: 'בת', other: 'אחר' };
const settingLabels = { space: 'חלל 🚀', forest: 'יער קסום 🌳', castle: 'ארמון 🏰', sports: 'ספורט ⚽', real_life: 'חיים אמיתיים 🏠' };
const challengeLabels = { fears: 'פחדים', social_difficulty: 'קושי חברתי', changes: 'שינויים', emotional_regulation: 'ויסות רגשי', separation_anxiety: 'חרדת נטישה', self_confidence: 'ביטחון עצמי', sleep_issues: 'קשיי שינה' };
const reactionLabels = { outburst: 'התפרצות', withdrawal: 'הסתגרות', attention_seeking: 'תשומת לב', crying: 'בכי', aggression: 'תוקפנות', avoidance: 'הימנעות' };

export default function MyStories() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    loadStories();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">הסיפורים שלי</h1>
        <p className="text-gray-600">כל הבקשות לסיפורים שיצרתם</p>
      </div>

      {stories.length === 0 ? (
        <Card className="border-0 shadow-xl shadow-violet-50 max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-violet-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">עדיין אין סיפורים</h3>
            <p className="text-gray-500 mb-6">צרו את הסיפור הראשון שלכם!</p>
            <Button
              onClick={() => navigate(createPageUrl('CreateStory'))}
              className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 rounded-xl"
            >
              <Plus className="w-4 h-4 ml-2" />
              סיפור חדש
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => navigate(createPageUrl('CreateStory'))}
              className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 rounded-xl"
            >
              <Plus className="w-4 h-4 ml-2" />
              סיפור חדש
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="border-0 shadow-lg shadow-violet-50 hover:shadow-xl hover:shadow-violet-100 transition-all cursor-pointer group"
                  onClick={() => setSelectedStory(story)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-7 h-7 text-violet-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{story.child_name}</h3>
                    <p className="text-sm text-gray-500 mb-2">גיל {story.child_age}</p>
                    {story.story_link ? (
                      <Badge className="bg-green-100 text-green-700">הסיפור מוכן</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700">
                        <Clock className="w-3 h-3 ml-1" />
                        בהכנה
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Story Details Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-violet-800">
              פרטי הסיפור של {selectedStory?.child_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedStory && (
            <div className="mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-gray-600 w-1/3">שם הילד/ה</TableCell>
                    <TableCell>{selectedStory.child_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-gray-600">גיל</TableCell>
                    <TableCell>{selectedStory.child_age}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-gray-600">מגדר</TableCell>
                    <TableCell>{genderLabels[selectedStory.gender] || selectedStory.gender}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-gray-600">תפאורה</TableCell>
                    <TableCell>{settingLabels[selectedStory.setting] || selectedStory.setting}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-gray-600">אתגר רגשי</TableCell>
                    <TableCell>{challengeLabels[selectedStory.challenge_type] || selectedStory.challenge_type}</TableCell>
                  </TableRow>
                  {selectedStory.trigger_desc && (
                    <TableRow>
                      <TableCell className="font-medium text-gray-600">טריגר</TableCell>
                      <TableCell>{selectedStory.trigger_desc}</TableCell>
                    </TableRow>
                  )}
                  {selectedStory.reaction_type && (
                    <TableRow>
                      <TableCell className="font-medium text-gray-600">תגובה</TableCell>
                      <TableCell>{reactionLabels[selectedStory.reaction_type] || selectedStory.reaction_type}</TableCell>
                    </TableRow>
                  )}
                  {selectedStory.hobbies && (
                    <TableRow>
                      <TableCell className="font-medium text-gray-600">תחביבים</TableCell>
                      <TableCell>{selectedStory.hobbies}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-medium text-gray-600">תאריך יצירה</TableCell>
                    <TableCell>{selectedStory.created_date ? format(new Date(selectedStory.created_date), 'dd/MM/yyyy HH:mm') : '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-gray-600">קישור לסיפור</TableCell>
                    <TableCell>
                      {selectedStory.story_link ? (
                        <a
                          href={selectedStory.story_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-800 font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          צפייה בסיפור
                        </a>
                      ) : (
                        <span className="text-amber-600 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          הסיפור בהכנה...
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}