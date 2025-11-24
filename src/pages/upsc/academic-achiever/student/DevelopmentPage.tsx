import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, FileText, ClipboardCheck } from 'lucide-react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { PreGeneratedVoiceAgent } from '../../../../components/upsc/common/PreGeneratedVoiceAgent';
import { PAGE_VOICE_MESSAGES } from '../../../../config/voiceMessages';
import { SkillsPage } from './SkillsPage';
import { QuestionGenerationPage } from './QuestionGenerationPage';
import { ExamCorrectionPage } from './ExamCorrectionPage';

type TabType = 'skills' | 'question-generation' | 'exam-correction';

const DevelopmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('skills');
  const [showTabAudio, setShowTabAudio] = useState(false);

  // Show tab-specific audio after initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTabAudio(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Get voice message for current tab
  const currentVoiceMessage = PAGE_VOICE_MESSAGES[activeTab] || PAGE_VOICE_MESSAGES['skills'];

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeTab]);

  const tabs = [
    {
      id: 'skills' as TabType,
      label: 'Skills',
      icon: Target,
      color: 'purple'
    },
    {
      id: 'question-generation' as TabType,
      label: 'Question Generation',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'exam-correction' as TabType,
      label: 'Exam Correction',
      icon: ClipboardCheck,
      color: 'green'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'skills':
        return <SkillsPage />;
      case 'question-generation':
        return <QuestionGenerationPage />;
      case 'exam-correction':
        return <ExamCorrectionPage />;
      default:
        return <SkillsPage />;
    }
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    if (isActive) {
      switch (color) {
        case 'purple':
          return 'bg-purple-500 text-white';
        case 'blue':
          return 'bg-blue-500 text-white';
        case 'green':
          return 'bg-green-500 text-white';
        default:
          return 'bg-brand-primary text-white';
      }
    }
    return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200';
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navbar */}
        <div className="bg-white shadow-md rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${getColorClasses(
                  tab.color,
                  activeTab === tab.id
                )}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  scale: activeTab === tab.id ? 1 : 0.98
                }}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>

        {/* Tab-specific voice agent - plays when tabs change */}
        {showTabAudio && (
          <PreGeneratedVoiceAgent
            key={activeTab}
            messageKey={currentVoiceMessage.key}
            message={currentVoiceMessage.text}
            autoPlay={true}
            position="bottom-right"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DevelopmentPage;
