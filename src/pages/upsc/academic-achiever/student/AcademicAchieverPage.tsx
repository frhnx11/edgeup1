import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Award, Gauge, ClipboardList, Trophy } from 'lucide-react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
// Removed PreGeneratedVoiceAgent - using ElevenLabs AIVoiceAgent from DashboardLayout
import AdvancedAnalyticsPage from './AdvancedAnalyticsPage';
import LeaderboardPage from './LeaderboardPage';
import ReadinessScorePage from './ReadinessScorePage';
import TestAnalyticsPage from './TestAnalyticsPage';
import { QuizzesPage } from './QuizzesPage';

type TabType = 'advanced-analytics' | 'leaderboard' | 'readiness-score' | 'test-analytics' | 'quizzes';

const AcademicAchieverPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('advanced-analytics');

  const tabs = [
    {
      id: 'advanced-analytics' as TabType,
      label: 'Advanced Analytics',
      icon: BarChart3,
      color: 'blue'
    },
    {
      id: 'leaderboard' as TabType,
      label: 'Leaderboard',
      icon: Award,
      color: 'purple'
    },
    {
      id: 'readiness-score' as TabType,
      label: 'Readiness Score',
      icon: Gauge,
      color: 'green'
    },
    {
      id: 'test-analytics' as TabType,
      label: 'Mock Test Analysis',
      icon: ClipboardList,
      color: 'orange'
    },
    {
      id: 'quizzes' as TabType,
      label: 'Quizzes',
      icon: Trophy,
      color: 'pink'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'advanced-analytics':
        return <AdvancedAnalyticsPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'readiness-score':
        return <ReadinessScorePage />;
      case 'test-analytics':
        return <TestAnalyticsPage />;
      case 'quizzes':
        return <QuizzesPage />;
      default:
        return <AdvancedAnalyticsPage />;
    }
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    if (isActive) {
      switch (color) {
        case 'blue':
          return 'bg-blue-500 text-white';
        case 'purple':
          return 'bg-purple-500 text-white';
        case 'green':
          return 'bg-green-500 text-white';
        case 'orange':
          return 'bg-orange-500 text-white';
        case 'pink':
          return 'bg-pink-500 text-white';
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
      </div>

      {/* AI Voice Agent is provided by DashboardLayout with ElevenLabs */}

    </DashboardLayout>
  );
};

export default AcademicAchieverPage;
