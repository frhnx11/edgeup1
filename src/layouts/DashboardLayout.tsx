import { ReactNode, useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Sidebar } from '../components/upsc/common/Sidebar';
import { EUstaadConsentModal } from '../components/upsc/common/eUstaadConsentModal';
import { useEUstaadTracking } from '../hooks/useEUstaadTracking';
import { useEUstaadStore } from '../store/useEUstaadStore';
import { PreGeneratedVoiceAgent } from '../components/upsc/common/PreGeneratedVoiceAgent';
import { getVoiceMessageForRoute } from '../config/voiceMessages';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { consentGiven, isVisible, giveConsent } = useEUstaadStore();
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  // Get user's personality type
  const userStudentType = localStorage.getItem('userStudentType') || 'social-learner';

  // Memoize the voice message data based on current route
  const voiceMessage = useMemo(() => {
    return getVoiceMessageForRoute(location.pathname);
  }, [location.pathname]);

  // Log route changes
  useEffect(() => {
    console.log('📍 DashboardLayout v6.10: Route changed to:', location.pathname);
    console.log('🎵 Voice message key:', voiceMessage.key);
  }, [location.pathname, voiceMessage.key]);

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
      <Sidebar />
      <main className="flex-1 ml-72 p-6 md:p-8 overflow-x-hidden">
        {children}
      </main>

      {/* Robot-Bot AI Assistant v6.10 - ROBUST AUTOPLAY WITH FALLBACK MECHANISM */}
      <PreGeneratedVoiceAgent
        messageKey={voiceMessage.key}
        message={voiceMessage.text}
        autoPlay={true}
        position="bottom-right"
      />

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