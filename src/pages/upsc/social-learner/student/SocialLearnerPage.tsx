import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, MessageCircle, Users, Trophy } from 'lucide-react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { ReelsPage } from './ReelsPage';
import { MessagesPage } from './MessagesPage';
import { StudyGroupsPage } from './StudyGroupsPage';
import { QuizzesPage } from './QuizzesPage';

type TabType = 'reels' | 'messages' | 'study-groups' | 'quizzes';

const SocialLearnerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('reels');

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeTab]);

  const tabs = [
    {
      id: 'reels' as TabType,
      label: 'Reels',
      icon: Play,
      color: 'red'
    },
    {
      id: 'messages' as TabType,
      label: 'Messages',
      icon: MessageCircle,
      color: 'blue'
    },
    {
      id: 'study-groups' as TabType,
      label: 'Study Groups',
      icon: Users,
      color: 'green'
    },
    {
      id: 'quizzes' as TabType,
      label: 'Quizzes',
      icon: Trophy,
      color: 'purple'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'reels':
        return <ReelsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'study-groups':
        return <StudyGroupsPage />;
      case 'quizzes':
        return <QuizzesPage />;
      default:
        return <ReelsPage />;
    }
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    if (isActive) {
      switch (color) {
        case 'red':
          return 'bg-red-500 text-white';
        case 'blue':
          return 'bg-blue-500 text-white';
        case 'green':
          return 'bg-green-500 text-white';
        case 'purple':
          return 'bg-purple-500 text-white';
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
    </DashboardLayout>
  );
};

export default SocialLearnerPage;
