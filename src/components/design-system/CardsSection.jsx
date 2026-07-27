import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, BookOpen } from 'lucide-react';
import DSSection from './DSSection';

export default function CardsSection() {
  return (
    <DSSection id="cards" title="5. Cards & Containers" description="Reusable card patterns found across the app.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg shadow-slate-100">
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <Star className="w-7 h-7 text-blue-600" />
            </div>
            <p className="font-bold text-slate-800">Feature card</p>
            <p className="text-slate-500 text-sm">Home.jsx features section</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer overflow-hidden border-0 shadow-lg shadow-violet-50">
          <div className="h-2 bg-gradient-to-r from-violet-400 via-violet-500 to-amber-400" />
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-violet-600" />
              </div>
              <p className="font-bold text-gray-800">Story card</p>
            </div>
            <p className="text-sm text-gray-500">MyStories.jsx grid</p>
          </CardContent>
        </Card>

        <div className="rounded-3xl overflow-hidden border bg-white" style={{ borderColor: '#F0E8F5', boxShadow: '0 4px 20px rgba(255,111,181,0.08), 0 2px 10px rgba(79,195,232,0.06)' }}>
          <div className="p-4" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-[20px] text-white text-xs font-medium" style={{ background: 'linear-gradient(135deg, #4FC3E8, #6BB6E8)' }}>💛 Together</span>
            <p className="font-semibold mt-2" style={{ color: '#1a1a2e' }}>Kita Alef question card</p>
          </div>
          <div className="bg-white p-4 text-sm text-slate-500">QuestionCard.jsx</div>
        </div>

        <Card className="border-0 shadow-xl shadow-slate-100">
          <CardContent className="p-6 text-center text-sm text-slate-500">
            Testimonial card — Home.jsx TestimonialsCarousel
          </CardContent>
        </Card>

        <div className="rounded-2xl border p-4" style={{ background: '#FFF8EC', borderColor: '#F5C842' }}>
          <p className="text-xs" style={{ color: '#7A5000' }}>Info / parent-note card — HomeScreen.jsx</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Form card — Contact.jsx, CreateStory.jsx wrap fields in a plain Card
        </div>
      </div>
    </DSSection>
  );
}