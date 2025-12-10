import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Crown,
  Shield,
  Search,
  MoreVertical,
  UserPlus,
  Clock,
  TrendingUp,
  MessageCircle,
  Video
} from 'lucide-react';

interface GroupMembersProps {
  group: {
    id: number;
    name: string;
  };
}

// Mock members data
const membersData = [
  { id: 1, name: 'Priya Mehta', role: 'admin', isOnline: true, studyHours: 156, joinedAt: '2024-01-15', streak: 28, avatar: 'P' },
  { id: 2, name: 'Rahul Sharma', role: 'moderator', isOnline: true, studyHours: 142, joinedAt: '2024-01-18', streak: 21, avatar: 'R' },
  { id: 3, name: 'Amit Kumar', role: 'member', isOnline: true, studyHours: 98, joinedAt: '2024-02-01', streak: 14, avatar: 'A' },
  { id: 4, name: 'Sneha Reddy', role: 'member', isOnline: false, studyHours: 87, joinedAt: '2024-02-10', streak: 7, avatar: 'S' },
  { id: 5, name: 'Vikram Patel', role: 'member', isOnline: true, studyHours: 76, joinedAt: '2024-02-15', streak: 12, avatar: 'V' },
  { id: 6, name: 'Ananya Singh', role: 'member', isOnline: false, studyHours: 65, joinedAt: '2024-03-01', streak: 5, avatar: 'A' },
  { id: 7, name: 'Deepak Joshi', role: 'member', isOnline: true, studyHours: 54, joinedAt: '2024-03-10', streak: 9, avatar: 'D' },
  { id: 8, name: 'Kavya Nair', role: 'member', isOnline: false, studyHours: 43, joinedAt: '2024-03-20', streak: 3, avatar: 'K' },
];

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin':
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
          <Crown className="w-3 h-3" /> Admin
        </span>
      );
    case 'moderator':
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium">
          <Shield className="w-3 h-3" /> Mod
        </span>
      );
    default:
      return null;
  }
};

export const GroupMembers: React.FC<GroupMembersProps> = ({ group }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'admins'>('all');

  const filteredMembers = membersData.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'online' ? member.isOnline :
      filter === 'admins' ? (member.role === 'admin' || member.role === 'moderator') : true;
    return matchesSearch && matchesFilter;
  });

  const onlineCount = membersData.filter(m => m.isOnline).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-lg text-center"
        >
          <Users className="w-8 h-8 mx-auto text-brand-primary mb-2" />
          <p className="text-2xl font-bold text-gray-800">{membersData.length}</p>
          <p className="text-sm text-gray-500">Total Members</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-lg text-center"
        >
          <div className="w-8 h-8 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{onlineCount}</p>
          <p className="text-sm text-gray-500">Online Now</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-lg text-center"
        >
          <Clock className="w-8 h-8 mx-auto text-brand-secondary mb-2" />
          <p className="text-2xl font-bold text-gray-800">721h</p>
          <p className="text-sm text-gray-500">Total Study Time</p>
        </motion.div>
      </div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-4 shadow-lg"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'online', 'admins'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  filter === f
                    ? 'bg-brand-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All' : f === 'online' ? 'Online' : 'Admins/Mods'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
            <UserPlus className="w-5 h-5" />
            <span>Invite</span>
          </button>
        </div>
      </motion.div>

      {/* Members List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="divide-y divide-gray-100">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center text-xl font-semibold text-brand-primary">
                    {member.avatar}
                  </div>
                  {member.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{member.name}</h3>
                    {getRoleBadge(member.role)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {member.studyHours}h studied
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-orange-500" />
                      {member.streak} day streak
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-brand-primary/10 flex items-center justify-center text-gray-600 hover:text-brand-primary transition-all">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-brand-secondary/10 flex items-center justify-center text-gray-600 hover:text-brand-secondary transition-all">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No members found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default GroupMembers;
