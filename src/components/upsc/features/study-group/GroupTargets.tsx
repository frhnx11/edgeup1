import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  TrendingUp,
  X,
  Flame,
  Award,
  AlertCircle
} from 'lucide-react';

interface GroupTargetsProps {
  group: {
    id: number;
    name: string;
  };
}

// Mock targets data
const targetsData = [
  {
    id: 1,
    title: 'Complete Ancient History Syllabus',
    description: 'Cover all chapters from Indus Valley to Gupta Period',
    deadline: '2024-12-20',
    progress: 75,
    status: 'active' as const,
    contributors: 18,
    category: 'History'
  },
  {
    id: 2,
    title: 'Weekly Mock Test',
    description: 'Complete 50 MCQs every week',
    deadline: '2024-12-15',
    progress: 60,
    status: 'active' as const,
    contributors: 22,
    category: 'Practice'
  },
  {
    id: 3,
    title: 'Current Affairs December',
    description: 'Read and discuss daily news for December',
    deadline: '2024-12-31',
    progress: 40,
    status: 'active' as const,
    contributors: 24,
    category: 'Current Affairs'
  },
  {
    id: 4,
    title: 'Medieval History Notes',
    description: 'Collaborative notes on Mughal Empire',
    deadline: '2024-12-10',
    progress: 100,
    status: 'completed' as const,
    contributors: 15,
    category: 'History'
  },
  {
    id: 5,
    title: 'Map Practice - India',
    description: 'Master all important locations on Indian map',
    deadline: '2024-11-30',
    progress: 100,
    status: 'completed' as const,
    contributors: 20,
    category: 'Geography'
  },
];

const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'from-brand-secondary to-brand-accent';
  if (progress >= 50) return 'from-brand-primary to-brand-secondary';
  if (progress >= 25) return 'from-yellow-500 to-orange-500';
  return 'from-red-500 to-pink-500';
};

const getDaysRemaining = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

export const GroupTargets: React.FC<GroupTargetsProps> = ({ group }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeTargets = targetsData.filter(t => t.status === 'active');
  const completedTargets = targetsData.filter(t => t.status === 'completed');

  const filteredTargets = targetsData.filter(target => {
    if (filter === 'all') return true;
    return target.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand-primary to-brand-dark rounded-2xl p-4 text-white"
        >
          <Target className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{activeTargets.length}</p>
          <p className="text-sm opacity-80">Active Targets</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-brand-secondary to-brand-accent rounded-2xl p-4 text-white"
        >
          <CheckCircle2 className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{completedTargets.length}</p>
          <p className="text-sm opacity-80">Completed</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 text-white"
        >
          <Flame className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">67%</p>
          <p className="text-sm opacity-80">Avg Completion</p>
        </motion.div>
      </div>

      {/* Filter & Add */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                filter === f
                  ? 'bg-brand-primary text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
              }`}
            >
              {f === 'all' ? 'All Targets' : f === 'active' ? 'Active' : 'Completed'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Target</span>
        </button>
      </motion.div>

      {/* Targets List */}
      <div className="space-y-4">
        {filteredTargets.map((target, index) => {
          const daysRemaining = getDaysRemaining(target.deadline);
          const isOverdue = daysRemaining < 0 && target.status === 'active';
          const isUrgent = daysRemaining <= 3 && daysRemaining >= 0 && target.status === 'active';

          return (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${
                target.status === 'completed' ? 'border-brand-secondary/30 bg-brand-secondary/5' :
                isOverdue ? 'border-red-200 bg-red-50/30' :
                isUrgent ? 'border-orange-200 bg-orange-50/30' :
                'border-transparent'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  target.status === 'completed' ? 'bg-brand-secondary/10' :
                  isOverdue ? 'bg-red-100' :
                  'bg-brand-primary/10'
                }`}>
                  {target.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-brand-secondary" />
                  ) : isOverdue ? (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  ) : (
                    <Target className="w-6 h-6 text-brand-primary" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{target.title}</h3>
                      <p className="text-gray-500 text-sm">{target.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      target.status === 'completed' ? 'bg-brand-secondary/10 text-brand-secondary' :
                      isOverdue ? 'bg-red-100 text-red-700' :
                      isUrgent ? 'bg-orange-100 text-orange-700' :
                      'bg-brand-primary/10 text-brand-primary'
                    }`}>
                      {target.category}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-semibold text-gray-700">{target.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${target.progress}%` }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className={`h-full bg-gradient-to-r ${getProgressColor(target.progress)} rounded-full`}
                      />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {target.status === 'completed' ? (
                        <span className="text-brand-secondary">Completed</span>
                      ) : isOverdue ? (
                        <span className="text-red-600">Overdue by {Math.abs(daysRemaining)} days</span>
                      ) : (
                        <span>{daysRemaining} days left</span>
                      )}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      {target.contributors} contributors
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTargets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <Target className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No targets found</h3>
          <p className="text-gray-500 mb-4">Start by adding a new study target</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-brand-primary text-white rounded-xl font-medium"
          >
            Add Target
          </button>
        </div>
      )}

      {/* Add Target Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-5 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Add New Target</h2>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Complete Geography Syllabus"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Brief description of the target..."
                    rows={3}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-medium">
                    Create Target
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupTargets;
