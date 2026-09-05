import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import ComingSoonDialog from './ComingSoonDialog';
import LoginRequiredDialog from './LoginRequiredDialog';

// Renders one activity card according to its access tier:
// - 'free': open to everyone, links straight to the activity.
// - 'coming_soon': not clickable, shows a "Coming soon" badge + dialog.
//   Admins bypass this and get a normal link, so the team can preview it early.
// - 'auth' (default): requires login. Locked with a small padlock for guests,
//   who see a login prompt on click; authenticated users get a normal link.
export default function ActivityGameCard({ game, isHe }) {
  const { isAuthenticated, navigateToLogin, user } = useAuth();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const access = game.access || 'auth';
  const isAdmin = user?.role === 'admin';
  const locked = access === 'auth' && !isAuthenticated;

  const cardBody = (
    <Card className="h-full border-0 shadow-lg shadow-slate-100 hover:shadow-xl transition-all rounded-2xl relative">
      {access === 'coming_soon' && (
        <span className="absolute top-3 end-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-white z-10">
          {isHe ? 'בקרוב' : 'Coming soon'}
        </span>
      )}
      {locked && (
        <div className="absolute top-3 end-3 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center z-10">
          <Lock className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <CardContent className="p-6 text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,111,181,0.12), rgba(79,195,232,0.12))' }}>
          {game.icon && <game.icon className="w-7 h-7 text-slate-700" strokeWidth={1.75} />}
        </div>
        <h2 className="text-base font-bold text-slate-800 mb-2">{isHe ? game.title.he : game.title.en}</h2>
        <p className="text-slate-500 text-sm">{isHe ? game.desc.he : game.desc.en}</p>
      </CardContent>
    </Card>
  );

  if (access === 'coming_soon' && !isAdmin) {
    return (
      <>
        <div className="group cursor-not-allowed opacity-70" onClick={() => setShowComingSoon(true)}>
          {cardBody}
        </div>
        <ComingSoonDialog open={showComingSoon} onClose={() => setShowComingSoon(false)} isHe={isHe} />
      </>
    );
  }

  if (locked) {
    return (
      <>
        <div className="group cursor-pointer" onClick={() => setShowLoginPrompt(true)}>
          {cardBody}
        </div>
        <LoginRequiredDialog
          open={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          onLogin={navigateToLogin}
          isHe={isHe}
        />
      </>
    );
  }

  return (
    <Link to={game.path} className="group">
      {cardBody}
    </Link>
  );
}