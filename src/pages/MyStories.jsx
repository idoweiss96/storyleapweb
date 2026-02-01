import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, Sparkles, Plus, Star } from 'lucide-react';

import StoryCard from '../components/story/StoryCard';
import StoryDisplay from '../components/story/StoryDisplay';

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
      const userStories = await base44.entities.Story.filter(
        { created_by: user.email },
        '-created_date'
      );
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
    <div className="pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">הסיפורים שלי</h1>
          <p className="text-gray-600">כל הסיפורים שיצרתם במקום אחד</p>
        </div>
        <Link to={createPageUrl('CreateStory')}>
          <Button className="h-12 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-200">
            <Plus className="w-5 h-5 ml-2" />
            סיפור חדש
          </Button>
        </Link>
      </div>

      {stories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-xl shadow-violet-50">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 rounded-3xl bg-violet-100 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-violet-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                עדיין אין לכם סיפורים
              </h2>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                צרו את הסיפור הראשון שלכם ותנו לילדים לחוות הרפתקה קסומה
              </p>
              <Link to={createPageUrl('CreateStory')}>
                <Button className="h-12 px-8 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700">
                  <Sparkles className="w-5 h-5 ml-2" />
                  צרו את הסיפור הראשון
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <StoryCard
              key={story.id}
              story={story}
              index={index}
              onClick={() => setSelectedStory(story)}
            />
          ))}
        </div>
      )}

      {/* Story Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {selectedStory && (
            <StoryDisplay
              story={selectedStory}
              onNewStory={() => {
                setSelectedStory(null);
                navigate(createPageUrl('CreateStory'));
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}