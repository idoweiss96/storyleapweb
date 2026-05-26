import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { Sparkles, BookOpen, Wallet, Home, Menu, X, Star, LogOut, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingTour from './components/onboarding/OnboardingTour';
import { LanguageProvider, useLanguage } from './components/LanguageContext';

// New brand logo URL
const LOGO_URL = 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/e41c4f352_Storyleap.svg';

function LayoutInner({ children, currentPageName }) {
  const { t, lang, toggleLang, isRTL } = useLanguage();
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    loadUser();
    // Refresh credits on custom event (e.g. after story creation)
    const handleCreditsUpdate = () => loadUser();
    window.addEventListener('credits-updated', handleCreditsUpdate);
    return () => window.removeEventListener('credits-updated', handleCreditsUpdate);
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      // Always read credits from DB (source of truth) — never rely on session for credits
      let displayCredits = currentUser.credits || 0;
      try {
        const users = await base44.entities.User.filter({ email: currentUser.email });
        if (users[0] && users[0].credits !== undefined) {
          displayCredits = users[0].credits;
          // Sync session only if different
          if (users[0].credits !== currentUser.credits) {
            await base44.auth.updateMe({ credits: users[0].credits });
          }
        }
      } catch (_) {}
      setUser(currentUser);
      setCredits(displayCredits);
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

  const publicNavItems = [
    { name: 'Home', label: t('nav_home'), icon: Home },
    { name: 'Pricing', label: t('nav_pricing'), icon: Star },
    { name: 'Contact', label: t('nav_contact'), icon: Mail },
  ];

  const authNavItems = [
    { name: 'Home', label: t('nav_home'), icon: Home },
    { name: 'CreateStory', label: t('nav_new_story'), icon: Sparkles },
    { name: 'MyStories', label: t('nav_my_stories'), icon: BookOpen },
    { name: 'Pricing', label: t('nav_pricing'), icon: Star },
    { name: 'Contact', label: t('nav_contact'), icon: Mail },
    ...(user?.role === 'admin' ? [{ name: 'Admin', label: t('nav_admin'), icon: Home }] : []),
  ];

  const navItems = user ? authNavItems : publicNavItems;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen" style={{backgroundImage: 'url(https://media.base44.com/images/public/697f4b704975c71e9cf56f59/f7f81b5a7_generated_image.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        .star-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .star-twinkle-delay { animation: twinkle 2s ease-in-out infinite 0.5s; }
        .star-twinkle-delay-2 { animation: twinkle 2s ease-in-out infinite 1s; }
      `}</style>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
              <img src={LOGO_URL} alt="StoryLeap AI" className="h-10 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.name;
                return (
                  <Link key={item.name} to={createPageUrl(item.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
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
                className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                title={lang === 'he' ? 'English' : 'עברית'}
              >
                <Globe className="w-5 h-5" />
              </button>

              {user && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 rounded-full border border-amber-200">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span className="text-sm font-semibold text-amber-700">{credits}</span>
                </div>
              )}

              {user ? (
                <Button variant="ghost" size="sm" onClick={() => base44.auth.logout()} className="text-slate-500 hover:text-slate-700">
                  <LogOut className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={() => base44.auth.redirectToLogin()} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl">
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
              className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl">
              <nav className="flex flex-col p-4 gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.name;
                  return (
                    <Link key={item.name} to={createPageUrl(item.name)} onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
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

      <footer className="border-t border-slate-200/60 bg-white/60 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-slate-400">{t('footer')}</p>
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