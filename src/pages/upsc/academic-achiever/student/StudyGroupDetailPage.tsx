import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  LayoutDashboard,
  FileText,
  Video,
  Users,
  Landmark,
  BookOpen,
  Globe,
  Coins,
  Leaf,
  Scale,
  LucideIcon
} from 'lucide-react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { StudyGroupDashboard } from './study-group/StudyGroupDashboard';
import { StudyGroupNotes } from './study-group/StudyGroupNotes';
import { StudyGroupLiveStudy } from './study-group/StudyGroupLiveStudy';
import { StudyGroupMembers } from './study-group/StudyGroupMembers';

// Study groups data (should match StudyGroupsPage)
const studyGroupsData = [
  {
    id: 1,
    name: 'Constitution Study Circle',
    description: 'Deep dive into Indian Constitution, amendments, and landmark cases',
    topic: 'Polity',
    members: 45,
    online: 12,
    icon: Landmark,
    gradient: 'from-rose-500 to-pink-500',
    bgGradient: 'from-rose-50 to-pink-50',
    isHot: true,
    lastActive: '2 min ago'
  },
  {
    id: 2,
    name: 'History Enthusiasts',
    description: 'Modern India, World History, and Art & Culture discussions',
    topic: 'History',
    members: 38,
    online: 8,
    icon: BookOpen,
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50 to-orange-50',
    isHot: false,
    lastActive: '15 min ago'
  },
  {
    id: 3,
    name: 'Geography Masters',
    description: 'Physical, Human, and Indian Geography with map practice',
    topic: 'Geography',
    members: 52,
    online: 15,
    icon: Globe,
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
    isHot: true,
    lastActive: '5 min ago'
  },
  {
    id: 4,
    name: 'Economy Wizards',
    description: 'Indian Economy, Budget analysis, and current economic affairs',
    topic: 'Economy',
    members: 41,
    online: 10,
    icon: Coins,
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    isHot: false,
    lastActive: '30 min ago'
  },
  {
    id: 5,
    name: 'Environment Warriors',
    description: 'Ecology, biodiversity, climate change, and environmental policies',
    topic: 'Environment',
    members: 33,
    online: 7,
    icon: Leaf,
    gradient: 'from-teal-500 to-cyan-500',
    bgGradient: 'from-teal-50 to-cyan-50',
    isHot: false,
    lastActive: '1 hour ago'
  },
  {
    id: 6,
    name: 'Ethics & Integrity',
    description: 'GS Paper IV preparation with case studies and discussions',
    topic: 'Ethics',
    members: 29,
    online: 6,
    icon: Scale,
    gradient: 'from-purple-500 to-violet-500',
    bgGradient: 'from-purple-50 to-violet-50',
    isHot: true,
    lastActive: '10 min ago'
  }
];

type TabId = 'dashboard' | 'notes' | 'live-study' | 'members';

interface Tab {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

export function StudyGroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Find group data
  const group = studyGroupsData.find(g => g.id === Number(groupId));

  if (!group) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Group Not Found</h2>
          <button
            onClick={() => navigate('/upsc/student/study-groups')}
            className="text-indigo-600 hover:underline"
          >
            Back to Study Groups
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const tabs: Tab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'live-study', label: 'Live Study', icon: Video },
    { id: 'members', label: 'Members', icon: Users }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudyGroupDashboard group={group} />;
      case 'notes':
        return <StudyGroupNotes group={group} />;
      case 'live-study':
        return <StudyGroupLiveStudy group={group} />;
      case 'members':
        return <StudyGroupMembers group={group} />;
      default:
        return null;
    }
  };

  const GroupIcon = group.icon;

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        {/* Back Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/upsc/student/study-groups')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Study Groups</span>
        </motion.button>

        {/* Group Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-r ${group.gradient} rounded-2xl p-6 text-white mb-6 shadow-lg`}
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <GroupIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{group.name}</h1>
                {group.isHot && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                    HOT
                  </span>
                )}
              </div>
              <p className="text-white/90 mt-1">{group.description}</p>
              <div className="flex items-center gap-6 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{group.members} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>{group.online} online</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content with Inner Sidebar */}
        <div className="flex gap-6">
          {/* Inner Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-56 shrink-0"
          >
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 sticky top-6">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${group.gradient} text-white shadow-lg`
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
