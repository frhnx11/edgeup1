import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  ClipboardCheck as ChalkboardTeacher,
  TrendingUp,
  CheckSquare,
  BookOpen,
  Map,
  ClipboardCheck
} from 'lucide-react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { CalendarPage } from './CalendarPage';
import { ClassesPage } from './ClassesPage';
import { PerformancePage } from './PerformancePage';
import { TasksPage } from './TasksPage';
import { ResourcesPage } from './ResourcesPage';
import { SyllabusPage } from './SyllabusPage';
import { TestSuitePage } from './TestSuitePage';

type TabType =
  | 'calendar'
  | 'classes'
  | 'performance'
  | 'tasks'
  | 'resources'
  | 'syllabus'
  | 'tests';

const StudyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeTab]);

  const tabs = [
    {
      id: 'calendar' as TabType,
      label: 'Calendar',
      icon: Calendar,
      color: 'blue'
    },
    {
      id: 'classes' as TabType,
      label: 'Classes',
      icon: ChalkboardTeacher,
      color: 'purple'
    },
    {
      id: 'performance' as TabType,
      label: 'Performance',
      icon: TrendingUp,
      color: 'orange'
    },
    {
      id: 'tasks' as TabType,
      label: 'Tasks',
      icon: CheckSquare,
      color: 'pink'
    },
    {
      id: 'resources' as TabType,
      label: 'Study Resources',
      icon: BookOpen,
      color: 'indigo'
    },
    {
      id: 'syllabus' as TabType,
      label: 'Syllabus',
      icon: Map,
      color: 'teal'
    },
    {
      id: 'tests' as TabType,
      label: 'Tests',
      icon: ClipboardCheck,
      color: 'red'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarPage />;
      case 'classes':
        return <ClassesPage />;
      case 'performance':
        return <PerformancePage />;
      case 'tasks':
        return <TasksPage />;
      case 'resources':
        return <ResourcesPage />;
      case 'syllabus':
        return <SyllabusPage />;
      case 'tests':
        return <TestSuitePage />;
      default:
        return <CalendarPage />;
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
        case 'indigo':
          return 'bg-indigo-500 text-white';
        case 'teal':
          return 'bg-teal-500 text-white';
        case 'red':
          return 'bg-red-500 text-white';
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
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap ${getColorClasses(
                  tab.color,
                  activeTab === tab.id
                )}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  scale: activeTab === tab.id ? 1 : 0.98
                }}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
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

export default StudyPage;
