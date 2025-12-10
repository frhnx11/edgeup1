import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Calendar,
  MessageCircle,
  Video,
  UserPlus,
  Award
} from 'lucide-react';

interface GroupDashboardProps {
  group: {
    id: number;
    name: string;
    members: number;
    online: number;
  };
}

// Mock activity data
const recentActivity = [
  { id: 1, user: 'Rahul S.', action: 'completed', target: 'Ancient History Quiz', time: '5 min ago', avatar: 'R' },
  { id: 2, user: 'Priya M.', action: 'started', target: 'Live Study Session', time: '15 min ago', avatar: 'P' },
  { id: 3, user: 'Amit K.', action: 'added', target: 'New study target', time: '1 hour ago', avatar: 'A' },
  { id: 4, user: 'Sneha R.', action: 'joined', target: 'the group', time: '2 hours ago', avatar: 'S' },
  { id: 5, user: 'Vikram P.', action: 'completed', target: '2 hour study streak', time: '3 hours ago', avatar: 'V' },
];

export const GroupDashboard: React.FC<GroupDashboardProps> = ({ group }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand-primary to-brand-dark rounded-2xl p-4 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 opacity-80" />
            <span className="text-sm opacity-80">Members</span>
          </div>
          <p className="text-3xl font-bold">{group.members}</p>
          <p className="text-xs opacity-70 mt-1">{group.online} online now</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-brand-secondary to-brand-accent rounded-2xl p-4 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 opacity-80" />
            <span className="text-sm opacity-80">This Week</span>
          </div>
          <p className="text-3xl font-bold">47h</p>
          <p className="text-xs opacity-70 mt-1">+12% from last week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 opacity-80" />
            <span className="text-sm opacity-80">Group Streak</span>
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-xs opacity-70 mt-1">days consecutive</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border-2 border-brand-primary rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-brand-primary" />
            <span className="text-sm text-gray-500">Targets Done</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">8/12</p>
          <p className="text-xs text-gray-500 mt-1">67% completion</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex flex-col items-center gap-2 p-4 bg-brand-primary/5 hover:bg-brand-primary/10 rounded-xl transition-colors">
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Start Session</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-brand-primary/5 hover:bg-brand-primary/10 rounded-xl transition-colors">
            <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Group Chat</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-brand-primary/5 hover:bg-brand-primary/10 rounded-xl transition-colors">
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Invite Friends</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-brand-primary/5 hover:bg-brand-primary/10 rounded-xl transition-colors">
            <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Add Target</span>
          </button>
        </div>
      </motion.div>

      {/* Progress & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Weekly Progress</h3>
            <TrendingUp className="w-5 h-5 text-brand-secondary" />
          </div>
          <div className="space-y-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const progress = [65, 80, 45, 90, 70, 85, 55][i];
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-10 text-sm text-gray-500">{day}</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                    />
                  </div>
                  <span className="w-10 text-sm font-medium text-gray-700">{progress}%</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Recent Activity</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-sm font-semibold text-brand-primary">
                  {activity.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{activity.user}</span>{' '}
                    <span className="text-gray-500">{activity.action}</span>{' '}
                    <span className="font-medium text-brand-primary">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Leaderboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h3 className="font-bold text-gray-800">Top Contributors This Week</h3>
          </div>
          <button className="text-sm text-brand-primary font-medium hover:underline">View All</button>
        </div>
        <div className="flex items-center gap-6 overflow-x-auto pb-2">
          {[
            { name: 'Priya M.', hours: 12, rank: 1, avatar: 'P' },
            { name: 'Rahul S.', hours: 10, rank: 2, avatar: 'R' },
            { name: 'Amit K.', hours: 8, rank: 3, avatar: 'A' },
            { name: 'Sneha R.', hours: 7, rank: 4, avatar: 'S' },
            { name: 'Vikram P.', hours: 6, rank: 5, avatar: 'V' },
          ].map((user) => (
            <div key={user.rank} className="flex flex-col items-center min-w-[80px]">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-lg font-semibold text-brand-primary">
                  {user.avatar}
                </div>
                {user.rank <= 3 && (
                  <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    user.rank === 1 ? 'bg-amber-400' : user.rank === 2 ? 'bg-gray-400' : 'bg-orange-400'
                  }`}>
                    {user.rank}
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-gray-800 mt-2">{user.name}</p>
              <p className="text-xs text-gray-500">{user.hours}h studied</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GroupDashboard;
