import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Crown,
  MessageCircle,
  Video,
  Sparkles,
  Flame,
  BookOpen,
  Globe,
  Scale,
  Landmark,
  TrendingUp,
  Clock,
  ChevronRight,
  X,
  Lock,
  Unlock,
  ArrowLeft,
  LayoutDashboard,
  Target,
  Settings,
  Hash
} from 'lucide-react';
import { GroupDashboard } from '../../../../components/upsc/features/study-group/GroupDashboard';
import { GroupMembers } from '../../../../components/upsc/features/study-group/GroupMembers';
import { GroupTargets } from '../../../../components/upsc/features/study-group/GroupTargets';
import { LiveStudy } from '../../../../components/upsc/features/study-group/LiveStudy';

// Sample study groups data
const studyGroupsData = [
  {
    id: 1,
    name: "History Hustlers",
    description: "Crushing Modern & Ancient History together!",
    topic: "History",
    members: 24,
    online: 8,
    icon: BookOpen,
    gradient: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-50 to-pink-50",
    isHot: true,
    lastActive: "Active now"
  },
  {
    id: 2,
    name: "Polity Pros",
    description: "Constitutional nerds unite! Articles & amendments gang",
    topic: "Polity",
    members: 31,
    online: 12,
    icon: Scale,
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-50 to-indigo-50",
    isHot: true,
    lastActive: "Active now"
  },
  {
    id: 3,
    name: "Geography Gang",
    description: "Maps, climate, and everything in between",
    topic: "Geography",
    members: 19,
    online: 5,
    icon: Globe,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    isHot: false,
    lastActive: "2 min ago"
  },
  {
    id: 4,
    name: "Economy Elite",
    description: "Budget breakdowns & economic theories",
    topic: "Economy",
    members: 27,
    online: 9,
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
    isHot: true,
    lastActive: "Active now"
  },
  {
    id: 5,
    name: "Ethics & Essay Squad",
    description: "Perfecting answers & building perspectives",
    topic: "Ethics",
    members: 15,
    online: 3,
    icon: Sparkles,
    gradient: "from-purple-500 to-violet-500",
    bgGradient: "from-purple-50 to-violet-50",
    isHot: false,
    lastActive: "15 min ago"
  },
  {
    id: 6,
    name: "Current Affairs Daily",
    description: "Stay updated with daily news discussions",
    topic: "Current Affairs",
    members: 42,
    online: 18,
    icon: Landmark,
    gradient: "from-cyan-500 to-teal-500",
    bgGradient: "from-cyan-50 to-teal-50",
    isHot: true,
    lastActive: "Active now"
  }
];

const topicOptions = [
  { value: 'history', label: 'History', icon: BookOpen },
  { value: 'polity', label: 'Polity', icon: Scale },
  { value: 'geography', label: 'Geography', icon: Globe },
  { value: 'economy', label: 'Economy', icon: TrendingUp },
  { value: 'environment', label: 'Environment', icon: Sparkles },
  { value: 'current-affairs', label: 'Current Affairs', icon: Landmark },
  { value: 'ethics', label: 'Ethics', icon: Crown },
  { value: 'general', label: 'General', icon: Hash }
];

type GroupTabType = 'dashboard' | 'members' | 'targets' | 'live-study';

const groupTabs = [
  { id: 'dashboard' as GroupTabType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'members' as GroupTabType, label: 'Members', icon: Users },
  { id: 'targets' as GroupTabType, label: 'Targets', icon: Target },
  { id: 'live-study' as GroupTabType, label: 'Live Study', icon: Video },
];

export function StudyGroupsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<typeof studyGroupsData[0] | null>(null);
  const [activeGroupTab, setActiveGroupTab] = useState<GroupTabType>('dashboard');
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    topic: 'general',
    isPrivate: false,
    maxMembers: 25
  });

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating group:', newGroup);
    setIsCreateModalOpen(false);
    setNewGroup({
      name: '',
      description: '',
      topic: 'general',
      isPrivate: false,
      maxMembers: 25
    });
  };

  const handleEnterGroup = (group: typeof studyGroupsData[0]) => {
    setSelectedGroup(group);
    setActiveGroupTab('dashboard');
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
  };

  const renderGroupContent = () => {
    if (!selectedGroup) return null;

    switch (activeGroupTab) {
      case 'dashboard':
        return <GroupDashboard group={selectedGroup} />;
      case 'members':
        return <GroupMembers group={selectedGroup} />;
      case 'targets':
        return <GroupTargets group={selectedGroup} />;
      case 'live-study':
        return <LiveStudy group={selectedGroup} />;
      default:
        return <GroupDashboard group={selectedGroup} />;
    }
  };

  // Inner Group View
  if (selectedGroup) {
    const GroupIcon = selectedGroup.icon;

    return (
      <div className="min-h-full">
        {/* Group Header */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className={`bg-gradient-to-r ${selectedGroup.gradient} p-6 text-white`}>
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToGroups}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <GroupIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold">{selectedGroup.name}</h1>
                <p className="text-white/80 text-sm">
                  {selectedGroup.topic} • {selectedGroup.members} members • {selectedGroup.online} online
                </p>
              </div>
              <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Inner Tabs */}
          <div className="p-3 flex gap-2 overflow-x-auto">
            {groupTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveGroupTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  activeGroupTab === tab.id
                    ? 'bg-brand-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'live-study' && (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Group Content */}
        <motion.div
          key={activeGroupTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderGroupContent()}
        </motion.div>
      </div>
    );
  }

  // Groups List View
  return (
    <>
      <div className="min-h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Study Groups
              </h1>
              <p className="text-gray-600 mt-1">
                Squad up and study together! Learning hits different with friends
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Group</span>
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search study groups... (e.g., 'History', 'Polity')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all"
            />
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-brand-primary rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 opacity-80" />
              <span className="text-sm opacity-80">Total Groups</span>
            </div>
            <p className="text-2xl font-bold">6</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 opacity-80" />
              <span className="text-sm opacity-80">Online Now</span>
            </div>
            <p className="text-2xl font-bold">55</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 opacity-80" />
              <span className="text-sm opacity-80">Your Groups</span>
            </div>
            <p className="text-2xl font-bold">3</p>
          </div>
        </motion.div>

        {/* Study Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyGroupsData.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group cursor-pointer"
            >
              <div className={`relative bg-gradient-to-br ${group.bgGradient} rounded-3xl p-6 border-2 border-white shadow-lg hover:shadow-xl transition-all`}>
                {/* Hot Badge */}
                {group.isHot && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center gap-1 shadow-lg"
                  >
                    <Flame className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">HOT</span>
                  </motion.div>
                )}

                {/* Group Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${group.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <group.icon className="w-7 h-7 text-white" />
                </div>

                {/* Group Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {group.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {group.description}
                </p>

                {/* Topic Tag */}
                <div className="mb-4">
                  <span className={`px-3 py-1 bg-gradient-to-r ${group.gradient} text-white text-xs font-medium rounded-full`}>
                    {group.topic}
                  </span>
                </div>

                {/* Members & Online */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{group.members} members</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>{group.online} online</span>
                    </div>
                  </div>
                </div>

                {/* Last Active */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                  <Clock className="w-3 h-3" />
                  <span>{group.lastActive}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEnterGroup(group)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r ${group.gradient} text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all`}
                  >
                    <span>Enter Group</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <Video className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Group CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="bg-brand-primary rounded-3xl p-8 text-white text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Start Your Own Squad!</h3>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Can't find the perfect group? Create your own and invite friends to join your study journey!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-3 bg-white text-brand-primary rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Create New Group
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-brand-primary p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Create Study Group</h2>
                    <p className="text-white/80 text-sm mt-1">Build your squad and learn together!</p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleCreateGroup} className="p-6 space-y-5">
                {/* Group Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder="e.g., History Hustlers"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    placeholder="What's your group about?"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all resize-none"
                  />
                </div>

                {/* Topic Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Topic/Subject *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {topicOptions.map((topic) => (
                      <button
                        key={topic.value}
                        type="button"
                        onClick={() => setNewGroup({ ...newGroup, topic: topic.value })}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                          newGroup.topic === topic.value
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <topic.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{topic.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Members */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Members
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={newGroup.maxMembers}
                      onChange={(e) => setNewGroup({ ...newGroup, maxMembers: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                    <span className="w-12 text-center font-semibold text-brand-primary">
                      {newGroup.maxMembers}
                    </span>
                  </div>
                </div>

                {/* Privacy Toggle */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Privacy
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setNewGroup({ ...newGroup, isPrivate: false })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                        !newGroup.isPrivate
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Unlock className="w-4 h-4" />
                      <span className="font-medium">Public</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewGroup({ ...newGroup, isPrivate: true })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                        newGroup.isPrivate
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      <span className="font-medium">Private</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {newGroup.isPrivate
                      ? "Only invited members can join this group"
                      : "Anyone can find and join this group"
                    }
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Create Group
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
