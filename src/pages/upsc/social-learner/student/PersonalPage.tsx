import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Laptop, Gauge } from 'lucide-react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { MentorPage } from './MentorPage';
import { SmartGadgetsPage } from './SmartGadgetsPage';
import { PASCOPage } from './PASCOPage';

type TabType = 'mentor' | 'smart-gadgets' | 'pasco';

const PersonalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('mentor');

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeTab]);

  const tabs = [
    {
      id: 'mentor' as TabType,
      label: 'Mentor',
      icon: GraduationCap,
      color: 'blue'
    },
    {
      id: 'smart-gadgets' as TabType,
      label: 'Smart Gadgets',
      icon: Laptop,
      color: 'purple'
    },
    {
      id: 'pasco' as TabType,
      label: 'PASCO',
      icon: Gauge,
      color: 'green'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'mentor':
        return <MentorPage />;
      case 'smart-gadgets':
        return <SmartGadgetsPage />;
      case 'pasco':
        return <PASCOPage />;
      default:
        return <MentorPage />;
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

export default PersonalPage;
