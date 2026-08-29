import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Puzzle, BookOpen, Heart, Users, LayoutGrid, Menu, X, Globe, LogOut, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/LanguageContext';

/**
 * NavbarSL - navigation for the HomeNew prototype ONLY.
 *
 * A DUPLICATE of the live header in src/Layout.jsx: same StoryLeap styling
 * (backdrop blur, pill links, globe toggle, login button, mobile drawer).
 * Only the INFORMATION ARCHITECTURE changes:
 *
 *   Primary:  Moments · Activities · How it works · Our approach · For Professionals
 *   Personal: My Space  (kept as an account-area item, right side)
 *
 * "Our approach" is the single home for both the method and the broader vision
 * ("Vision" is no longer a separate top-level concept). "Purchase Credits" is
 * not a primary item. src/Layout.jsx is not touched.
 */
const LOGO_URL = 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/e41c4f352_Storyleap.svg';

export default function NavbarSL() {
  const { t, lang, toggleLang } = useLanguage();
  const isHe = lang === 'he';
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const items = [
    { label: isHe ? 'רגעים' : 'Moments', href: '#moments', icon: Sparkles },
    { label: isHe ? 'פעילויות' : 'Activities', to: '/activities', icon: Puzzle },
    { label: isHe ? 'איך זה עובד' : 'How it works', href: '#how', icon: Heart },
    { label: isHe ? 'הגישה שלנו' : 'Our approach', to: '/our-methods', icon: BookOpen },
    { label: isHe ? 'לאנשי מקצוע' : 'For Professionals', href: '#professionals', icon: Users },
  ];

  const mySpace = { label: isHe ? 'המרחב שלי' : 'My Space', to: '/space', icon: LayoutGrid };

  const linkClass = (extra = '') =>
    `flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-slate-500 hover:bg-slate-50 hover:text-slate-700 ${extra}`;

  const renderItem = (item, onClick, extra = '') => {
    const Icon = item.icon;
    const inner = (
      <>
        <Icon className="w-4 h-4" />
        <span className="text-sm">{item.label}</span>
      </>
    );
    return item.to ? (
      <Link key={item.label} to={item.to} onClick={onClick} className={linkClass(extra)}>{inner}</Link>
    ) : (
      <a key={item.label} href={item.href} onClick={onClick} className={linkClass(extra)}>{inner}</a>
    );
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to={isHe ? '/he' : '/'} className="flex items-center gap-2 group">
            <img src={LOGO_URL} alt="StoryLeap AI" className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {items.map((item) => renderItem(item))}
          </nav>

          <div className="flex items-center gap-1.5">
            {/* Personal space - account-area utility, kept separate from primary nav */}
            <Link
              to={mySpace.to}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all"
              title={mySpace.label}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm font-medium">{mySpace.label}</span>
            </Link>

            <button
              onClick={toggleLang}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              title={isHe ? 'English' : 'עברית'}
            >
              <Globe className="w-5 h-5" />
            </button>

            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 rounded-full border border-amber-200">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span className="text-sm font-semibold text-amber-700">{user.credits ?? 0}</span>
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

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen((v) => !v)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-pink-200 bg-gradient-to-b from-pink-50/80 to-white/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col p-4 gap-1">
              {items.map((item) => renderItem(item, () => setMobileOpen(false), 'px-4 py-3'))}
              {renderItem(mySpace, () => setMobileOpen(false), 'px-4 py-3')}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
