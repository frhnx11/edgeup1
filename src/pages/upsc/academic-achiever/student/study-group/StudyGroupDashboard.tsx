import { motion } from 'framer-motion';
import {
  Trophy,
  BarChart3,
  Flame,
  Calendar,
  TrendingUp,
  Star,
  Clock,
  Users
} from 'lucide-react';

interface StudyGroup {
  id: number;
  name: string;
  gradient: string;
  bgGradient: string;
}

interface StudyGroupDashboardProps {
  group: StudyGroup;
}

export function StudyGroupDashboard({ group }: StudyGroupDashboardProps) {
  // Sample leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Priya Sharma', xp: 2450, avatar: '👩‍🎓' },
    { rank: 2, name: 'Rahul Verma', xp: 2180, avatar: '👨‍🎓' },
    { rank: 3, name: 'Anita Singh', xp: 1950, avatar: '👩‍💼' }
  ];

  // Sample weekly activity data
  const weeklyActivity = [
    { day: 'Mon', hours: 4 },
    { day: 'Tue', hours: 6 },
    { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 7 },
    { day: 'Fri', hours: 5 },
    { day: 'Sat', hours: 8 },
    { day: 'Sun', hours: 4 }
  ];

  const maxHours = Math.max(...weeklyActivity.map(d => d.hours));

  // Sample upcoming sessions
  const upcomingSessions = [
    { title: 'Constitution Deep Dive', time: 'Today, 6:00 PM', participants: 12 },
    { title: 'Mock Test Review', time: 'Tomorrow, 4:00 PM', participants: 8 },
    { title: 'Current Affairs Discussion', time: 'Fri, 5:30 PM', participants: 15 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Leaderboard Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Top Contributors</h3>
            <p className="text-sm text-gray-600">This week's leaders</p>
          </div>
        </div>

        <div className="space-y-3">
          {leaderboard.map((member, index) => (
            <motion.div
              key={member.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-white rounded-xl"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                member.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                member.rank === 2 ? 'bg-gray-300 text-gray-700' :
                'bg-amber-600 text-white'
              }`}>
                {member.rank}
              </div>
              <span className="text-xl">{member.avatar}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <Star className="w-3 h-3" />
                  <span>{member.xp} XP</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Graph Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Weekly Activity</h3>
            <p className="text-sm text-gray-600">Study hours per day</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 h-32 mt-4">
          {weeklyActivity.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ height: 0 }}
              animate={{ height: `${(day.hours / maxHours) * 100}%` }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
              className="flex-1 flex flex-col items-center"
            >
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-lg relative group cursor-pointer"
                style={{ height: '100%' }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.hours}h
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-2 font-medium">{day.day}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-indigo-600">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">37 total hours this week</span>
        </div>
      </motion.div>

      {/* Study Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Group Streak</h3>
            <p className="text-sm text-gray-600">Keep the flame alive!</p>
          </div>
        </div>

        <div className="text-center py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-pink-500 shadow-lg mb-3"
          >
            <span className="text-3xl font-bold text-white">14</span>
          </motion.div>
          <p className="text-lg font-semibold text-gray-900">Days Active</p>
          <p className="text-sm text-gray-600">Longest streak: 21 days</p>
        </div>

        <div className="flex items-center justify-center gap-1 mt-2">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                i < 5 ? 'bg-gradient-to-br from-red-500 to-pink-500' : 'bg-gray-200'
              }`}
            >
              {i < 5 && <Flame className="w-3 h-3 text-white" />}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Sessions Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Upcoming Sessions</h3>
            <p className="text-sm text-gray-600">Next group study events</p>
          </div>
        </div>

        <div className="space-y-3">
          {upcomingSessions.map((session, index) => (
            <motion.div
              key={session.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-3 bg-white rounded-xl"
            >
              <p className="font-medium text-gray-900 text-sm">{session.title}</p>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>{session.time}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <Users className="w-3 h-3" />
                  <span>{session.participants} joined</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
