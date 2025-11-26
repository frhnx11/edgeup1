import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';
import { Sidebar } from '../components/upsc/common/Sidebar';
import { EUstaadConsentModal } from '../components/upsc/common/eUstaadConsentModal';
import { useEUstaadTracking } from '../hooks/useEUstaadTracking';
import { useEUstaadStore } from '../store/useEUstaadStore';
import { PreGeneratedVoiceAgent } from '../components/upsc/common/PreGeneratedVoiceAgent';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { consentGiven, isVisible, giveConsent } = useEUstaadStore();
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // Closed by default on mobile
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Smooth scroll animation
    });
  }, [location.pathname]);

  // Get user's personality type
  const userStudentType = localStorage.getItem('userStudentType') || 'social-learner';

  // Determine current tab from route for voice agent
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/social-learner/student/social-learner')) return 'social-learner';
    return null; // Pages with internal tabs handle their own voice agent
  };

  const currentTab = getCurrentTab();

  // Pages with internal tabs handle their own voice agent
  const hasInternalTabs =
    location.pathname.includes('/study') ||
    location.pathname.includes('/development') ||
    location.pathname.includes('/personal') ||
    location.pathname.includes('/social-learner/student/social-learner');

  // Initialize activity tracking
  useEUstaadTracking();

  // Show consent modal on first visit
  useEffect(() => {
    console.log('🤖 eUstaad: DashboardLayout mounted');
    console.log('🤖 eUstaad: consentGiven =', consentGiven);
    console.log('🤖 eUstaad: isVisible =', isVisible);

    const hasAskedThisSession = sessionStorage.getItem('eustaad-consent-asked');
    console.log('🤖 eUstaad: hasAskedThisSession =', hasAskedThisSession);

    if (!consentGiven && !hasAskedThisSession) {
      console.log('🤖 eUstaad: Will show consent modal in 1 second...');
      const timer = setTimeout(() => {
        console.log('🤖 eUstaad: Showing consent modal NOW');
        setShowConsentModal(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      console.log('🤖 eUstaad: Not showing modal. Reason:', consentGiven ? 'Already consented' : 'Already asked this session');
    }
  }, [consentGiven, isVisible]);

  const handleAcceptConsent = () => {
    console.log('🤖 eUstaad: User accepted consent');
    giveConsent();
    setShowConsentModal(false);
    sessionStorage.setItem('eustaad-consent-asked', 'true');
  };

  const handleDeclineConsent = () => {
    console.log('🤖 eUstaad: User declined consent');
    setShowConsentModal(false);
    sessionStorage.setItem('eustaad-consent-asked', 'true');
  };

  // Disabled welcome message - was interfering with AIVoiceAgent
  useEffect(() => {
    setShowWelcomeMessage(false);
  }, []);

  // Handle click anywhere to dismiss welcome message
  const handleDismissWelcome = () => {
    setShowWelcomeMessage(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Hamburger Menu Button - Mobile Only */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 p-3 bg-white rounded-lg shadow-lg lg:hidden hover:bg-gray-50 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden transition-all duration-300 ${
        isMobile ? 'ml-0' : 'lg:ml-72'
      }`}>
        {/* Add top padding on mobile to avoid overlap with hamburger menu */}
        <div className={isMobile ? 'mt-16' : ''}>
          {children}
        </div>
      </main>

      {/* Robot-Bot AI Assistant - Only for pages without internal tabs */}
      {!hasInternalTabs && currentTab && (
        <PreGeneratedVoiceAgent
          currentTab={currentTab}
          position="bottom-right"
        />
      )}

      {/* eUstaad Consent Modal */}
      <EUstaadConsentModal
        isOpen={showConsentModal}
        onAccept={handleAcceptConsent}
        onDecline={handleDeclineConsent}
      />

      {/* Welcome Message Tooltip */}
      <AnimatePresence>
        {showWelcomeMessage && (
            <motion.div
              className="fixed bottom-52 right-20 z-40 max-w-sm cursor-pointer"
              onClick={handleDismissWelcome}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
            >
              {/* Speech bubble container with vibrant gradient background */}
              <div
                className="relative rounded-2xl shadow-2xl p-5 pr-10"
                style={{
                  background: 'linear-gradient(135deg, #8B7FF8 0%, #7B6FE8 50%, #6B5FD8 100%)',
                  boxShadow: '0 8px 32px rgba(107, 95, 216, 0.4), 0 4px 16px rgba(139, 127, 248, 0.3)'
                }}
              >
                {/* Close button */}
                <button
                  onClick={handleDismissWelcome}
                  className="absolute top-3 right-3 text-white/90 hover:text-white transition-colors"
                  aria-label="Close welcome message"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Welcome text */}
                <motion.p
                  className="font-semibold text-base leading-relaxed"
                  style={{
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  Hello {userStudentType === 'academic-achiever' ? 'Academic Achiever' : 'Social Learner'}! Welcome to your Dashboard
                </motion.p>

                {/* Speech bubble tail pointing down-right */}
                <div
                  className="absolute -bottom-3 right-16 w-6 h-6 transform rotate-45"
                  style={{
                    background: '#6B5FD8'
                  }}
                ></div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}