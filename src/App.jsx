import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { useEffect } from 'react';
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Pricing from './pages/Pricing';
import { LanguageProvider } from './components/LanguageContext';
import Contact from './pages/Contact';
import MayaStory from './pages/MayaStory';
import PaymentCheckout from './pages/PaymentCheckout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Vision from './pages/Vision';
import KitaAlef from './pages/KitaAlef';
import KitaAlefStory from './pages/KitaAlefStory';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// Temporary SEO safety: noindex the exact /he route (duplicate Hebrew content) until multilingual migration completes
function HeRouteMeta() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== '/he') return;

    let meta = document.querySelector('meta[name="robots"]');
    let created = false;
    let originalContent = null;

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
      created = true;
    } else {
      originalContent = meta.getAttribute('content');
    }

    meta.setAttribute('content', 'noindex,follow');

    return () => {
      if (created && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      } else if (meta) {
        if (originalContent === null) {
          meta.removeAttribute('content');
        } else {
          meta.setAttribute('content', originalContent);
        }
      }
    };
  }, [location.pathname]);

  return null;
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/Pricing" element={<LayoutWrapper currentPageName="Pricing"><Pricing /></LayoutWrapper>} />
      <Route path="/Contact" element={<LayoutWrapper currentPageName="Contact"><Contact /></LayoutWrapper>} />
      <Route path="/MayaStory" element={<LayoutWrapper currentPageName="MayaStory"><MayaStory /></LayoutWrapper>} />
      <Route path="/PaymentCheckout" element={<LayoutWrapper currentPageName="PaymentCheckout"><PaymentCheckout /></LayoutWrapper>} />
      <Route path="/PaymentSuccess" element={<LayoutWrapper currentPageName="PaymentSuccess"><PaymentSuccess /></LayoutWrapper>} />
      <Route path="/PaymentCancel" element={<LayoutWrapper currentPageName="PaymentCancel"><PaymentCancel /></LayoutWrapper>} />
      <Route path="/Vision" element={<LayoutWrapper currentPageName="Vision"><Vision /></LayoutWrapper>} />
      <Route path="/KitaAlef" element={<LayoutWrapper currentPageName="KitaAlef"><KitaAlef /></LayoutWrapper>} />
      <Route path="/KitaAlefStory" element={<LayoutWrapper currentPageName="KitaAlefStory"><KitaAlefStory /></LayoutWrapper>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <HeRouteMeta />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App