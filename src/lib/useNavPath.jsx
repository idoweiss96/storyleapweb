import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/components/LanguageContext';
import { navPathFor } from '@/lib/marketingRoutes';

// Centralized locale-aware marketing destination resolver for components.
// Returns a function (name) => path. Locale is Hebrew when the current route
// is /he/* OR the active LanguageContext language is Hebrew; otherwise English.
// Non-marketing names (CreateStory, MyStories, Admin) keep their createPageUrl destination.
export function useNavPath() {
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  return (name) => navPathFor(name, pathname, lang);
}