import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import NoIndexMeta from '@/components/SEO/NoIndexMeta';
import '@/styles/design-tokens.css';
import '@/styles/typography.css';
import '@/styles/components.css';
import ColorsSection from '@/components/design-system/ColorsSection';
import TypographySection from '@/components/design-system/TypographySection';
import SpacingSection from '@/components/design-system/SpacingSection';
import ButtonsSection from '@/components/design-system/ButtonsSection';
import CardsSection from '@/components/design-system/CardsSection';
import FormsSection from '@/components/design-system/FormsSection';
import NavigationSection from '@/components/design-system/NavigationSection';
import IconsSection from '@/components/design-system/IconsSection';
import AssetsSection from '@/components/design-system/AssetsSection';
import ResponsiveSection from '@/components/design-system/ResponsiveSection';
import TokensSection from '@/components/design-system/TokensSection';
import ComponentInventory from '@/components/design-system/ComponentInventory';
import QualityAudit from '@/components/design-system/QualityAudit';

const NAV_ITEMS = [
  ['colors', 'Colors'], ['typography', 'Typography'], ['spacing', 'Spacing'], ['buttons', 'Buttons'],
  ['cards', 'Cards'], ['forms', 'Forms'], ['navigation', 'Navigation'], ['icons', 'Icons'],
  ['assets', 'Assets'], ['responsive', 'Responsive'], ['tokens', 'Tokens'], ['inventory', 'Inventory'], ['audit', 'Audit'],
];

export default function DesignSystem() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then((user) => setIsAdmin(user.role === 'admin'))
      .catch(() => setIsAdmin(false))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <NoIndexMeta />
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <NoIndexMeta />
        <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">No access</h2>
        <p className="text-gray-600">This page is for administrators only.</p>
      </div>
    );
  }

  return (
    <div className="ds-root max-w-6xl mx-auto px-4 py-8">
      <NoIndexMeta />
      <div className="mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium mb-3">Internal — not for production use</span>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">StoryLeap Design System</h1>
        <p className="text-slate-500 max-w-2xl">
          A living reference of every color, type style, spacing value, component, and asset currently used across the app,
          documented directly from the codebase. Recommendations only appear in the Quality Audit section — everything
          above it reflects the app exactly as it is today.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 sticky top-16 z-10 bg-white/90 backdrop-blur py-2 rounded-xl border border-slate-100 px-2">
        {NAV_ITEMS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="text-xs px-3 py-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            {label}
          </a>
        ))}
      </div>

      <ColorsSection />
      <TypographySection />
      <SpacingSection />
      <ButtonsSection />
      <CardsSection />
      <FormsSection />
      <NavigationSection />
      <IconsSection />
      <AssetsSection />
      <ResponsiveSection />
      <TokensSection />
      <ComponentInventory />
      <QualityAudit />

      <div className="py-8 text-center text-xs text-slate-400">
        See DESIGN_SYSTEM.md at the project root for the full written reference.
      </div>
    </div>
  );
}