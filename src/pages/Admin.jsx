import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileSpreadsheet, Users, BookOpen, Loader2, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

const genderLabels = { boy: 'בן', girl: 'בת', other: 'אחר' };
const settingLabels = { space: 'חלל', forest: 'יער', castle: 'ארמון', sports: 'ספורט', real_life: 'חיים אמיתיים' };
const challengeLabels = { fears: 'פחדים', social_difficulty: 'קושי חברתי', changes: 'שינויים', emotional_regulation: 'ויסות רגשי', separation_anxiety: 'חרדת נטישה', self_confidence: 'ביטחון עצמי', sleep_issues: 'קשיי שינה' };
const reactionLabels = { outburst: 'התפרצות', withdrawal: 'הסתגרות', attention_seeking: 'תשומת לב', crying: 'בכי', aggression: 'תוקפנות', avoidance: 'הימנעות' };

export default function Admin() {
  const [user, setUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      // בדיקה האם המשתמש אדמין
      if (currentUser.role === 'admin') {
        setIsAdmin(true);
        const allStories = await base44.entities.Story.list('-created_date');
        setStories(allStories);
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
      const headers = [
        'תאריך יצירה',
        'שם הילד/ה',
        'גיל',
        'מגדר',
        'תפאורה',
        'אתגר',
        'טריגר',
        'תגובה',
        'תחביבים',
        'מייל',
        'טלפון',
        'תוכן הסיפור'
      ];

      const rows = stories.map(story => [
        story.created_date ? format(new Date(story.created_date), 'dd/MM/yyyy HH:mm') : '',
        story.child_name || '',
        story.child_age || '',
        genderLabels[story.gender] || story.gender || '',
        settingLabels[story.setting] || story.setting || '',
        challengeLabels[story.challenge_type] || story.challenge_type || '',
        story.trigger_desc || '',
        reactionLabels[story.reaction_type] || story.reaction_type || '',
        story.hobbies || '',
        story.contact_email || '',
        story.contact_phone || '',
        (story.content || '').replace(/"/g, '""').replace(/\n/g, ' ')
      ]);

      const csvContent = '\uFEFF' + [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

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
            <h2 className="text-xl font-bold text-gray-800 mb-2">אין גישה</h2>
            <p className="text-gray-600">הדף הזה מיועד למנהלים בלבד.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ניהול המערכת</h1>
          <p className="text-gray-600">צפייה וייצוא נתוני הסיפורים</p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="border-0 shadow-lg shadow-violet-50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">סה"כ סיפורים</p>
              <p className="text-2xl font-bold text-gray-900">{stories.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-violet-50">
          <CardContent className="p-6">
            <Button
              onClick={exportToCSV}
              disabled={isExporting || stories.length === 0}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl"
            >
              {isExporting ? (
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
              ) : (
                <FileSpreadsheet className="w-5 h-5 ml-2" />
              )}
              ייצוא לאקסל (CSV)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stories Table */}
      <Card className="border-0 shadow-xl shadow-violet-50">
        <CardHeader>
          <CardTitle className="text-lg">רשימת סיפורים</CardTitle>
        </CardHeader>
        <CardContent>
          {stories.length === 0 ? (
            <p className="text-center text-gray-500 py-8">אין סיפורים עדיין</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">תאריך</TableHead>
                    <TableHead className="text-right">שם</TableHead>
                    <TableHead className="text-right">גיל</TableHead>
                    <TableHead className="text-right">תפאורה</TableHead>
                    <TableHead className="text-right">אתגר</TableHead>
                    <TableHead className="text-right">מייל</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stories.map((story) => (
                    <TableRow key={story.id}>
                      <TableCell className="text-sm">
                        {story.created_date ? format(new Date(story.created_date), 'dd/MM/yyyy') : '-'}
                      </TableCell>
                      <TableCell className="font-medium">{story.child_name}</TableCell>
                      <TableCell>{story.child_age}</TableCell>
                      <TableCell>{settingLabels[story.setting] || story.setting}</TableCell>
                      <TableCell>{challengeLabels[story.challenge_type] || story.challenge_type}</TableCell>
                      <TableCell className="text-sm text-gray-500">{story.contact_email || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}