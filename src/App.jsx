import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import OurMethods from './pages/OurMethods';
import KitaAlef from './pages/KitaAlef';
import KitaAlefStory from './pages/KitaAlefStory';
import HeroStory from './pages/HeroStory';
import HeroStoryCheckout from './pages/HeroStoryCheckout';
import PrepareStory from './pages/PrepareStory';
import PrepareStoryCheckout from './pages/PrepareStoryCheckout';
import FeelingsMap from './pages/FeelingsMap';
import DesignSystem from './pages/DesignSystem';
import ExportSamples from './pages/ExportSamples';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import FAQ from './pages/FAQ';
import FeedbackSurvey from './pages/FeedbackSurvey';
import HeFAQ from './pages/HeFAQ';
import FreeActivityGoodbye from './pages/FreeActivityGoodbye';
import FreeActivityMorningEvening from './pages/FreeActivityMorningEvening';
import FreeActivityLittleHeart from './pages/FreeActivityLittleHeart';
import EditStory from './pages/EditStory';
import StoryRedirect from './pages/StoryRedirect';
import Activities from './pages/Activities';
import ChildSpace from './pages/ChildSpace';
import ActivityEmotionWheel from './pages/ActivityEmotionWheel';
import ActivityStrengthCards from './pages/ActivityStrengthCards';
import ActivityCopingCards from './pages/ActivityCopingCards';
import ActivityEmotionDrawing from './pages/ActivityEmotionDrawing';
import ActivityEmotionThermometer from './pages/ActivityEmotionThermometer';
import ActivityFeelingsExplorer from './pages/ActivityFeelingsExplorer';
import ActivityRoutineBoard from './pages/ActivityRoutineBoard';
import ActivityFirstThen from './pages/ActivityFirstThen';
import ActivityChoiceBoard from './pages/ActivityChoiceBoard';
import ActivityBreakCard from './pages/ActivityBreakCard';
import ActivityBodyMap from './pages/ActivityBodyMap';
import ActivityEmotionCards from './pages/ActivityEmotionCards';
import ActivityEmotionCheckin from './pages/ActivityEmotionCheckin';
import ActivityTaskAnalysis from './pages/ActivityTaskAnalysis';
import ActivityAdlSequence from './pages/ActivityAdlSequence';
import ActivityRoutineChecklist from './pages/ActivityRoutineChecklist';
import ActivityVisualTimer from './pages/ActivityVisualTimer';
import ActivityBreathing from './pages/ActivityBreathing';
import ActivitySafePlace from './pages/ActivitySafePlace';
import ActivityVisualRules from './pages/ActivityVisualRules';
import ActivityCalmCorner from './pages/ActivityCalmCorner';
// --- Redesign prototype (additive, isolated, noindex). Not in production nav. ---
import HomeNew from './pages/HomeNew';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

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
      <Route path="/our-methods" element={<LayoutWrapper currentPageName="OurMethods"><OurMethods /></LayoutWrapper>} />
      <Route path="/KitaAlef" element={<LayoutWrapper currentPageName="KitaAlef"><KitaAlef /></LayoutWrapper>} />
      <Route path="/KitaAlefStory" element={<LayoutWrapper currentPageName="KitaAlefStory"><KitaAlefStory /></LayoutWrapper>} />
      <Route path="/HeroStory" element={<LayoutWrapper currentPageName="HeroStory"><HeroStory /></LayoutWrapper>} />
      <Route path="/HeroStoryCheckout" element={<LayoutWrapper currentPageName="HeroStoryCheckout"><HeroStoryCheckout /></LayoutWrapper>} />
      <Route path="/PrepareStory" element={<LayoutWrapper currentPageName="PrepareStory"><PrepareStory /></LayoutWrapper>} />
      <Route path="/PrepareStoryCheckout" element={<LayoutWrapper currentPageName="PrepareStoryCheckout"><PrepareStoryCheckout /></LayoutWrapper>} />
      <Route path="/FeelingsMap" element={<LayoutWrapper currentPageName="FeelingsMap"><FeelingsMap /></LayoutWrapper>} />
      <Route path="/design-system" element={<LayoutWrapper currentPageName="DesignSystem"><DesignSystem /></LayoutWrapper>} />
      <Route path="/ExportSamples" element={<LayoutWrapper currentPageName="ExportSamples"><ExportSamples /></LayoutWrapper>} />
      <Route path="/PrivacyPolicy" element={<LayoutWrapper currentPageName="PrivacyPolicy"><PrivacyPolicy /></LayoutWrapper>} />
      <Route path="/TermsOfUse" element={<LayoutWrapper currentPageName="TermsOfUse"><TermsOfUse /></LayoutWrapper>} />
      <Route path="/FAQ" element={<LayoutWrapper currentPageName="FAQ"><FAQ /></LayoutWrapper>} />
      <Route path="/he/faq" element={<LayoutWrapper currentPageName="HeFAQ"><HeFAQ /></LayoutWrapper>} />
      <Route path="/FeedbackSurvey" element={<LayoutWrapper currentPageName="FeedbackSurvey"><FeedbackSurvey /></LayoutWrapper>} />
      <Route path="/FreeActivityGoodbye" element={<LayoutWrapper currentPageName="FreeActivityGoodbye"><FreeActivityGoodbye /></LayoutWrapper>} />
      <Route path="/FreeActivityMorningEvening" element={<LayoutWrapper currentPageName="FreeActivityMorningEvening"><FreeActivityMorningEvening /></LayoutWrapper>} />
      <Route path="/FreeActivityLittleHeart" element={<LayoutWrapper currentPageName="FreeActivityLittleHeart"><FreeActivityLittleHeart /></LayoutWrapper>} />
      <Route path="/EditStory" element={<LayoutWrapper currentPageName="EditStory"><EditStory /></LayoutWrapper>} />
      <Route path="/story/:order_id" element={<LayoutWrapper currentPageName="StoryRedirect"><StoryRedirect /></LayoutWrapper>} />
      <Route path="/space" element={<LayoutWrapper currentPageName="ChildSpace"><ChildSpace /></LayoutWrapper>} />
      <Route path="/activities" element={<LayoutWrapper currentPageName="Activities"><Activities /></LayoutWrapper>} />
      <Route path="/activities/emotion-wheel" element={<LayoutWrapper currentPageName="ActivityEmotionWheel"><ActivityEmotionWheel /></LayoutWrapper>} />
      <Route path="/activities/strength-cards" element={<LayoutWrapper currentPageName="ActivityStrengthCards"><ActivityStrengthCards /></LayoutWrapper>} />
      <Route path="/activities/coping-cards" element={<LayoutWrapper currentPageName="ActivityCopingCards"><ActivityCopingCards /></LayoutWrapper>} />
      <Route path="/activities/emotion-drawing" element={<LayoutWrapper currentPageName="ActivityEmotionDrawing"><ActivityEmotionDrawing /></LayoutWrapper>} />
      <Route path="/activities/emotion-thermometer" element={<LayoutWrapper currentPageName="ActivityEmotionThermometer"><ActivityEmotionThermometer /></LayoutWrapper>} />
      <Route path="/activities/feelings-explorer" element={<LayoutWrapper currentPageName="ActivityFeelingsExplorer"><ActivityFeelingsExplorer /></LayoutWrapper>} />
      <Route path="/activities/routine-board" element={<LayoutWrapper currentPageName="ActivityRoutineBoard"><ActivityRoutineBoard /></LayoutWrapper>} />
      <Route path="/activities/first-then" element={<LayoutWrapper currentPageName="ActivityFirstThen"><ActivityFirstThen /></LayoutWrapper>} />
      <Route path="/activities/choice-board" element={<LayoutWrapper currentPageName="ActivityChoiceBoard"><ActivityChoiceBoard /></LayoutWrapper>} />
      <Route path="/activities/break-card" element={<LayoutWrapper currentPageName="ActivityBreakCard"><ActivityBreakCard /></LayoutWrapper>} />
      <Route path="/activities/body-map" element={<LayoutWrapper currentPageName="ActivityBodyMap"><ActivityBodyMap /></LayoutWrapper>} />
      <Route path="/activities/emotion-cards" element={<LayoutWrapper currentPageName="ActivityEmotionCards"><ActivityEmotionCards /></LayoutWrapper>} />
      <Route path="/activities/emotion-checkin" element={<LayoutWrapper currentPageName="ActivityEmotionCheckin"><ActivityEmotionCheckin /></LayoutWrapper>} />
      <Route path="/activities/task-analysis" element={<LayoutWrapper currentPageName="ActivityTaskAnalysis"><ActivityTaskAnalysis /></LayoutWrapper>} />
      <Route path="/activities/adl-sequence" element={<LayoutWrapper currentPageName="ActivityAdlSequence"><ActivityAdlSequence /></LayoutWrapper>} />
      <Route path="/activities/routine-checklist" element={<LayoutWrapper currentPageName="ActivityRoutineChecklist"><ActivityRoutineChecklist /></LayoutWrapper>} />
      <Route path="/activities/visual-timer" element={<LayoutWrapper currentPageName="ActivityVisualTimer"><ActivityVisualTimer /></LayoutWrapper>} />
      <Route path="/activities/breathing" element={<LayoutWrapper currentPageName="ActivityBreathing"><ActivityBreathing /></LayoutWrapper>} />
      <Route path="/activities/safe-place" element={<LayoutWrapper currentPageName="ActivitySafePlace"><ActivitySafePlace /></LayoutWrapper>} />
      <Route path="/activities/visual-rules" element={<LayoutWrapper currentPageName="ActivityVisualRules"><ActivityVisualRules /></LayoutWrapper>} />
      <Route path="/activities/calm-corner" element={<LayoutWrapper currentPageName="ActivityCalmCorner"><ActivityCalmCorner /></LayoutWrapper>} />
      <Route path="/HomeNew" element={<LayoutWrapper currentPageName="HomeNew"><HomeNew /></LayoutWrapper>} />
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
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App