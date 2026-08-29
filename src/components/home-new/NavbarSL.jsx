import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, BookOpen, Menu, X, Globe, LogOut, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/LanguageContext';

/**
 * NavbarSL - navigation for the HomeNew prototype ONLY.
 *
 * A DUPLICATE of the live header in src/Layout.jsx: same StoryLeap styling
 * (backdrop blur, pill links, globe toggle, login button, mobile drawer).
 * Only the INFORMATION ARCHITECTURE changes, per the latest strategic direction:
 *
 *   Primary:  Experiences · How it works · Our approach
 *   Personal: My Space  (distinct Leapy-avatar capsule, right side)
 *
 * - "Moments" and "Activities" are folded into one concept: Experiences.
 * - "Our approach" is the single home for method + broader vision.
 * - "For Professionals" is NOT in the universal nav at this stage; it lives as a
 *   soft section lower on the page.
 * src/Layout.jsx is not touched.
 */
const LOGO_URL = 'https://media.base44.com/images/public/697f4b704975c71e9cf56f59/e41c4f352_Storyleap.svg';

/**
 * Leapy avatar placeholder for "My Space" - a small, warm mark in Leapy's
 * lavender / blush / sky palette. Swap for the hosted Leapy asset when available,
 * and later for the child's own avatar image.
 */
export function LeapyAvatar({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Leapy">
      <defs>
        <linearGradient id="sl-leapy-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#CBBFF0" />
          <stop offset="55%" stopColor="#E9C9E6" />
          <stop offset="100%" stopColor="#C2E1F4" />
        </linearGradient>
      </defs>
      <ellipse cx="14" cy="7" rx="2.4" ry="4.6" fill="#D7BEEA" transform="rotate(-18 14 7)" />
      <ellipse cx="26" cy="7" rx="2.4" ry="4.6" fill="#C6DEF3" transform="rotate(18 26 7)" />
      <circle cx="20" cy="21" r="15" fill="url(#sl-leapy-grad)" />
      <ellipse cx="20" cy="24" rx="9" ry="10" fill="#FFF8FB" opacity="0.85" />
      <circle cx="16.6" cy="21" r="1.6" fill="#4B3E63" />
      <circle cx="23.4" cy="21" r="1.6" fill="#4B3E63" />
      <path d="M17 25.4 Q20 28 23 25.4" stroke="#B08AC0" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function NavbarSL() {
  const { t, lang, toggleLang } = useLanguage();
  const isHe = lang === 'he';
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const items = [
    { label: isHe ? 'חוויות' : 'Experiences', href: '#experiences', icon: Sparkles },
    { label: isHe ? 'איך זה עובד' : 'How it works', href: '#how', icon: Heart },
    { label: isHe ? 'הגישה שלנו' : 'Our approach', to: '/our-methods', icon: BookOpen },
  ];

  const mySpaceLabel = isHe ? 'המרחב שלי' : 'My Space';

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

  const MySpaceCapsule = ({ onClick, full = true }) => (
    <Link
      to="/space"
      onClick={onClick}
      title={mySpaceLabel}
      className="flex items-center gap-2 ps-1.5 pe-3.5 py-1.5 rounded-full border border-violet-200/70 shadow-sm hover:shadow-md hover:-translate-y-px transition-all"
      style={{ background: 'linear-gradient(135deg, #F2ECFB 0%, #FDEDF4 100%)' }}
    >
      <span className="w-7 h-7 rounded-full bg-white/70 flex items-center justify-center shrink-0">
        <LeapyAvatar className="w-6 h-6" />
      </span>
      {full && <span className="text-sm font-semibold text-slate-700">{mySpaceLabel}</span>}
    </Link>
  );

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
            <div className="hidden sm:block">
              <MySpaceCapsule />
            </div>

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
              <div className="px-4 py-3">
                <MySpaceCapsule onClick={() => setMobileOpen(false)} />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
