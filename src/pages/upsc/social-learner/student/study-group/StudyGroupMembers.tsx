import { motion } from 'framer-motion';
import { Users, UserPlus, Shield, Star, MessageCircle } from 'lucide-react';

interface StudyGroup {
  id: number;
  name: string;
  gradient: string;
  bgGradient: string;
}

interface StudyGroupMembersProps {
  group: StudyGroup;
}

export function StudyGroupMembers({ group }: StudyGroupMembersProps) {
  // Sample members data
  const members = [
    { id: 1, name: 'Priya Sharma', role: 'Admin', xp: 2450, online: true, avatar: '👩‍🎓' },
    { id: 2, name: 'Rahul Verma', role: 'Moderator', xp: 2180, online: true, avatar: '👨‍🎓' },
    { id: 3, name: 'Anita Singh', role: 'Member', xp: 1950, online: false, avatar: '👩‍💼' },
    { id: 4, name: 'Vikram Patel', role: 'Member', xp: 1820, online: true, avatar: '👨‍💻' },
    { id: 5, name: 'Neha Gupta', role: 'Member', xp: 1650, online: false, avatar: '👩‍🔬' },
    { id: 6, name: 'Arjun Reddy', role: 'Member', xp: 1480, online: true, avatar: '👨‍🏫' }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-gradient-to-r from-purple-500 to-violet-500 text-white';
      case 'Moderator':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900">Group Members</h3>
          <p className="text-sm text-gray-600">{members.length} members</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${group.gradient} text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite</span>
        </motion.button>
      </motion.div>

      {/* Online/Offline Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-600">{members.filter(m => m.online).length} online</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-gray-400 rounded-full" />
          <span className="text-gray-600">{members.filter(m => !m.online).length} offline</span>
        </div>
      </motion.div>

      {/* Members List */}
      <div className="space-y-3">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.01, x: 5 }}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                {member.avatar}
              </div>
              {member.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{member.name}</h4>
                {member.role === 'Admin' && <Shield className="w-4 h-4 text-purple-500" />}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(member.role)}`}>
                  {member.role}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <Star className="w-3 h-3" />
                  <span>{member.xp} XP</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gray-100 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-gray-600 hover:text-indigo-600" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
