import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Video,
  Calendar,
  Clock,
  Users,
  Plus,
  ExternalLink,
  X,
  History,
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  User,
  CalendarPlus
} from 'lucide-react';

interface LiveStudyProps {
  group: {
    id: number;
    name: string;
    gradient?: string;
  };
}

// Mock data for live session
const liveSession = {
  id: 1,
  title: "History Deep Dive - Ancient Civilizations",
  host: "Priya M.",
  hostAvatar: "P",
  startedAt: "25 min ago",
  participants: [
    { id: 1, name: "Priya M.", avatar: "P" },
    { id: 2, name: "Rahul S.", avatar: "R" },
    { id: 3, name: "Amit K.", avatar: "A" },
    { id: 4, name: "Sneha R.", avatar: "S" },
    { id: 5, name: "Vikram P.", avatar: "V" },
  ],
  meetLink: "https://meet.google.com/abc-defg-hij"
};

// Mock upcoming sessions
const upcomingSessions = [
  { id: 1, title: "Polity Revision - Fundamental Rights", date: "Tomorrow", time: "6:00 PM", host: "Rahul S.", hostAvatar: "R", participants: 8 },
  { id: 2, title: "Mock Test Discussion - Prelims 2024", date: "Dec 15", time: "4:00 PM", host: "Amit K.", hostAvatar: "A", participants: 12 },
  { id: 3, title: "Current Affairs Weekly Review", date: "Dec 16", time: "10:00 AM", host: "Sneha R.", hostAvatar: "S", participants: 15 },
  { id: 4, title: "Geography Maps Practice", date: "Dec 18", time: "5:00 PM", host: "Vikram P.", hostAvatar: "V", participants: 6 },
];

// Mock past sessions
const pastSessions = [
  { id: 1, title: "Geography Maps Practice", duration: "2h 15m", attended: 8, date: "Dec 10", host: "Vikram P." },
  { id: 2, title: "Economics Basics - Inflation & Monetary Policy", duration: "1h 45m", attended: 12, date: "Dec 8", host: "Amit K." },
  { id: 3, title: "Essay Writing Workshop", duration: "3h 00m", attended: 18, date: "Dec 5", host: "Priya M." },
  { id: 4, title: "Ethics Case Studies Discussion", duration: "2h 30m", attended: 10, date: "Dec 3", host: "Rahul S." },
];

export const LiveStudy: React.FC<LiveStudyProps> = ({ group }) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isJoinPreviewOpen, setIsJoinPreviewOpen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const handleJoinSession = () => {
    // In real app, this would open the meet link
    window.open(liveSession.meetLink, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4"
      >
        <button
          onClick={() => setIsJoinPreviewOpen(true)}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Video className="w-6 h-6" />
          <span>Start Instant Session</span>
        </button>
        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-brand-primary text-brand-primary rounded-2xl font-semibold shadow-lg hover:bg-brand-primary/5 transition-all"
        >
          <CalendarPlus className="w-6 h-6" />
          <span>Schedule Session</span>
        </button>
      </motion.div>

      {/* Live Now Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-red-200"
      >
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-3 flex items-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          <span className="text-white font-bold">LIVE NOW</span>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{liveSession.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Started {liveSession.startedAt}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Hosted by {liveSession.host}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-5 h-5 text-brand-primary" />
              <span className="font-bold text-brand-primary">{liveSession.participants.length}</span>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {liveSession.participants.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="w-10 h-10 rounded-full bg-brand-primary/10 border-2 border-white flex items-center justify-center text-sm font-semibold text-brand-primary"
                  title={p.name}
                >
                  {p.avatar}
                </div>
              ))}
              {liveSession.participants.length > 4 && (
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-sm font-semibold text-gray-600">
                  +{liveSession.participants.length - 4}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              {liveSession.participants.slice(0, 2).map(p => p.name.split(' ')[0]).join(', ')} and others are studying
            </span>
          </div>

          {/* Join Button */}
          <button
            onClick={() => setIsJoinPreviewOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Play className="w-5 h-5" />
            <span>Join Now</span>
          </button>
        </div>
      </motion.div>

      {/* Upcoming Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-primary" />
            Upcoming Sessions
          </h3>
          <span className="text-sm text-gray-500">{upcomingSessions.length} scheduled</span>
        </div>
        <div className="space-y-3">
          {upcomingSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-brand-primary/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <Video className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{session.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {session.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {session.host}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{session.participants}</span>
                </div>
                <button className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-lg font-medium hover:bg-brand-primary/20 transition-all">
                  Set Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Past Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            Past Sessions
          </h3>
          <button className="text-sm text-brand-primary font-medium hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {pastSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                  <Video className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{session.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{session.date}</span>
                    <span>•</span>
                    <span>Hosted by {session.host}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-gray-800">{session.duration}</p>
                  <p className="text-gray-500">Duration</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800">{session.attended}</p>
                  <p className="text-gray-500">Attended</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Join Preview Modal */}
      <AnimatePresence>
        {isJoinPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsJoinPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Video Preview */}
              <div className="relative aspect-video bg-gray-800 flex items-center justify-center">
                {isVideoOn ? (
                  <div className="w-32 h-32 rounded-full bg-brand-primary flex items-center justify-center text-6xl text-white font-bold">
                    U
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <VideoOff className="w-16 h-16" />
                    <span>Camera is off</span>
                  </div>
                )}

                {/* Controls overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                  <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {isMicOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                  </button>
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {isVideoOn ? <VideoIcon className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
                  </button>
                </div>
              </div>

              {/* Join Info */}
              <div className="p-6 bg-white">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Ready to join?</h3>
                <p className="text-gray-500 text-sm mb-4">{liveSession.title}</p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-2">
                    {liveSession.participants.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        className="w-8 h-8 rounded-full bg-brand-primary/10 border-2 border-white flex items-center justify-center text-xs font-semibold text-brand-primary"
                      >
                        {p.avatar}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {liveSession.participants.length} people in this session
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsJoinPreviewOpen(false)}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleJoinSession}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Join on Google Meet
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Session Modal */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsScheduleModalOpen(false)}
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
                  <h2 className="text-xl font-bold">Schedule Study Session</h2>
                  <button
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Polity Chapter 5 Discussion"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    placeholder="What will you study in this session?"
                    rows={2}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20">
                    <option value="30">30 minutes</option>
                    <option value="60" selected>1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-medium">
                    <Plus className="w-5 h-5" />
                    Schedule
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

export default LiveStudy;
