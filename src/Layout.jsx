import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { Sparkles, BookOpen, Wallet, Home, Menu, X, Star, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingTour from './components/onboarding/OnboardingTour';
import { LanguageProvider, useLanguage } from './components/LanguageContext';

function LayoutInner({ children, currentPageName }) {
  const { t, lang, toggleLang, isRTL } = useLanguage();
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setCredits(currentUser.credits || 0);
      if (!currentUser.onboarding_completed) {
        setShowOnboarding(true);
      }
    } catch (e) {}
  };

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    try { await base44.auth.updateMe({ onboarding_completed: true }); } catch (e) {}
  };

  const handleOnboardingSkip = async () => {
    setShowOnboarding(false);
    try { await base44.auth.updateMe({ onboarding_completed: true }); } catch (e) {}
  };

  const navItems = [
    { name: 'Home', label: t('nav_home'), icon: Home },
    { name: 'CreateStory', label: t('nav_new_story'), icon: Sparkles },
    { name: 'MyStories', label: t('nav_my_stories'), icon: BookOpen },
    { name: 'Credits', label: t('nav_credits'), icon: Wallet },
    ...(user?.role === 'admin' ? [{ name: 'Admin', label: t('nav_admin'), icon: Home }] : []),
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-amber-50/30">
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        .star-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .star-twinkle-delay { animation: twinkle 2s ease-in-out infinite 0.5s; }
        .star-twinkle-delay-2 { animation: twinkle 2s ease-in-out infinite 1s; }
      `}</style>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-violet-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697f4b704975c71e9cf56f59/cb127acae_unnamed.png" alt="StoryLeap" className="h-12 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.name;
                return (
                  <Link key={item.name} to={createPageUrl(item.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-violet-100 text-violet-700 font-medium' : 'text-gray-600 hover:bg-violet-50 hover:text-violet-600'}`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={toggleLang}
                className="px-3 py-1.5 text-sm font-semibold rounded-xl border border-violet-200 text-violet-700 hover:bg-violet-50 transition-colors"
              >
                {lang === 'he' ? 'EN' : 'עב'}
              </button>

              {user && (
                <Link to={createPageUrl('Credits')} className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-amber-50 rounded-full border border-amber-200">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span className="text-sm font-semibold text-amber-700">{credits}</span>
                </Link>
              )}

              {user ? (
                <Button variant="ghost" size="sm" onClick={() => base44.auth.logout()} className="text-gray-500 hover:text-gray-700">
                  <LogOut className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={() => base44.auth.redirectToLogin()} className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white rounded-xl">
                  {t('login')}
                </Button>
              )}

              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-violet-100 bg-white/90 backdrop-blur-xl">
              <nav className="flex flex-col p-4 gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.name;
                  return (
                    <Link key={item.name} to={createPageUrl(item.name)} onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-violet-100 text-violet-700 font-medium' : 'text-gray-600 hover:bg-violet-50'}`}>
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="border-t border-violet-100 bg-white/50 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-500">{t('footer')}</p>
        </div>
      </footer>

      {showOnboarding && (
        <OnboardingTour onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
      )}
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      <LayoutInner currentPageName={currentPageName}>{children}</LayoutInner>
    </LanguageProvider>
  );
}