import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  LayoutDashboard,
  Users,
  Target,
  Video,
  Settings,
  BookOpen,
  Scale,
  Globe,
  TrendingUp,
  Sparkles,
  Landmark
} from 'lucide-react';
import { GroupDashboard } from './study-group/GroupDashboard';
import { GroupMembers } from './study-group/GroupMembers';
import { GroupTargets } from './study-group/GroupTargets';
import { LiveStudy } from './study-group/LiveStudy';

// Mock study groups data (same as in StudyGroupsPage)
const studyGroupsData = [
  { id: 1, name: "History Hustlers", topic: "History", members: 24, online: 8, icon: BookOpen, gradient: "from-rose-500 to-pink-500" },
  { id: 2, name: "Polity Pros", topic: "Polity", members: 31, online: 12, icon: Scale, gradient: "from-blue-500 to-indigo-500" },
  { id: 3, name: "Geography Gang", topic: "Geography", members: 19, online: 5, icon: Globe, gradient: "from-green-500 to-emerald-500" },
  { id: 4, name: "Economy Elite", topic: "Economy", members: 27, online: 9, icon: TrendingUp, gradient: "from-amber-500 to-orange-500" },
  { id: 5, name: "Ethics & Essay Squad", topic: "Ethics", members: 15, online: 3, icon: Sparkles, gradient: "from-purple-500 to-violet-500" },
  { id: 6, name: "Current Affairs Daily", topic: "Current Affairs", members: 42, online: 18, icon: Landmark, gradient: "from-cyan-500 to-teal-500" },
];

type TabType = 'dashboard' | 'members' | 'targets' | 'live-study';

const tabs = [
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'members' as TabType, label: 'Members', icon: Users },
  { id: 'targets' as TabType, label: 'Targets', icon: Target },
  { id: 'live-study' as TabType, label: 'Live Study', icon: Video },
];

export const StudyGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Find the group data
  const group = studyGroupsData.find(g => g.id === Number(groupId)) || studyGroupsData[0];
  const GroupIcon = group.icon;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <GroupDashboard group={group} />;
      case 'members':
        return <GroupMembers group={group} />;
      case 'targets':
        return <GroupTargets group={group} />;
      case 'live-study':
        return <LiveStudy group={group} />;
      default:
        return <GroupDashboard group={group} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${group.gradient} text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <GroupIcon className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{group.name}</h1>
                  <p className="text-white/80 text-sm">{group.topic} • {group.members} members • {group.online} online</p>
                </div>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${group.gradient} text-white shadow-lg`
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {tab.id === 'live-study' && (
                      <span className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Study Time</span>
                    <span className="font-semibold text-gray-800">12h 30m</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Rank</span>
                    <span className="font-semibold text-gray-800">#4</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Streak</span>
                    <span className="font-semibold text-orange-500">🔥 7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudyGroupPage;
