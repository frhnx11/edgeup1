import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Clock, Calendar } from 'lucide-react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { MindMapStudio } from '../../../../components/upsc/creative-explorer/MindMapStudio';
import { FocusTimer } from '../../../../components/upsc/creative-explorer/FocusTimer';
import { SmartCalendar } from '../../../../components/upsc/creative-explorer/SmartCalendar';

type TabType = 'mind-maps' | 'focus-timer' | 'calendar';

const CreativeExplorerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('mind-maps');

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeTab]);

  const tabs = [
    {
      id: 'mind-maps' as TabType,
      label: 'Mind Maps',
      icon: Map,
      color: 'blue'
    },
    {
      id: 'focus-timer' as TabType,
      label: 'Focus Timer',
      icon: Clock,
      color: 'green'
    },
    {
      id: 'calendar' as TabType,
      label: 'Calendar',
      icon: Calendar,
      color: 'gray'
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    if (isActive) {
      return 'bg-brand-primary text-white';
    }
    return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200';
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navbar - Tabs */}
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'mind-maps' && <MindMapStudio />}
            {activeTab === 'focus-timer' && <FocusTimer />}
            {activeTab === 'calendar' && <SmartCalendar />}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default CreativeExplorerPage;
