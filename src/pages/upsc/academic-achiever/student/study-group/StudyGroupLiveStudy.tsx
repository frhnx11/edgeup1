import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  ChevronRight,
  PhoneOff,
  Mic,
  Camera,
  Monitor,
  MessageSquare,
  MoreVertical,
  // Topic-specific icons
  ScrollText,
  Shield,
  Building2,
  Gavel,
  Network,
  Home,
  Clock,
  Flag,
  Globe,
  Palette,
  Mountain,
  Users,
  MapPin,
  Map,
  Coins,
  Landmark,
  Receipt,
  ArrowRightLeft,
  Target,
  TreePine,
  Leaf,
  Thermometer,
  Factory,
  Scale,
  Heart,
  Brain,
  Lightbulb,
  Sparkles,
  FileSearch,
  CheckCircle,
  LucideIcon
} from 'lucide-react';

interface StudyGroup {
  id: number;
  name: string;
  gradient: string;
  bgGradient: string;
  topic?: string;
}

interface Subtopic {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

interface StudyGroupLiveStudyProps {
  group: StudyGroup;
}

// Subtopics for each study group topic
const topicSubtopics: Record<string, Subtopic[]> = {
  'Polity': [
    { id: 'constitution', name: 'Constitution', icon: ScrollText, description: 'Preamble, Articles & Schedules', color: 'from-rose-400 to-pink-500' },
    { id: 'fundamental-rights', name: 'Fundamental Rights', icon: Shield, description: 'Articles 12-35', color: 'from-purple-400 to-violet-500' },
    { id: 'parliament', name: 'Parliament', icon: Building2, description: 'Lok Sabha & Rajya Sabha', color: 'from-blue-400 to-indigo-500' },
    { id: 'judiciary', name: 'Judiciary', icon: Gavel, description: 'Supreme Court & High Courts', color: 'from-amber-400 to-orange-500' },
    { id: 'federalism', name: 'Federalism', icon: Network, description: 'Centre-State Relations', color: 'from-teal-400 to-cyan-500' },
    { id: 'local-govt', name: 'Local Government', icon: Home, description: 'Panchayati Raj & Municipalities', color: 'from-green-400 to-emerald-500' }
  ],
  'History': [
    { id: 'ancient-india', name: 'Ancient India', icon: Clock, description: 'Indus Valley to Gupta Period', color: 'from-amber-400 to-yellow-500' },
    { id: 'medieval-india', name: 'Medieval India', icon: Building2, description: 'Sultanate & Mughal Era', color: 'from-orange-400 to-red-500' },
    { id: 'modern-india', name: 'Modern India', icon: Flag, description: 'Colonial Period & Freedom Struggle', color: 'from-green-400 to-teal-500' },
    { id: 'world-history', name: 'World History', icon: Globe, description: 'World Wars & Revolutions', color: 'from-blue-400 to-purple-500' },
    { id: 'art-culture', name: 'Art & Culture', icon: Palette, description: 'Architecture, Music & Dance', color: 'from-pink-400 to-rose-500' }
  ],
  'Geography': [
    { id: 'physical-geo', name: 'Physical Geography', icon: Mountain, description: 'Landforms & Climatology', color: 'from-green-400 to-emerald-500' },
    { id: 'human-geo', name: 'Human Geography', icon: Users, description: 'Population & Settlements', color: 'from-blue-400 to-cyan-500' },
    { id: 'indian-geo', name: 'Indian Geography', icon: MapPin, description: 'Rivers, Soils & Resources', color: 'from-amber-400 to-orange-500' },
    { id: 'world-geo', name: 'World Geography', icon: Globe, description: 'Continents & Oceans', color: 'from-teal-400 to-blue-500' },
    { id: 'maps', name: 'Map Skills', icon: Map, description: 'Map Reading & Analysis', color: 'from-purple-400 to-violet-500' }
  ],
  'Economy': [
    { id: 'indian-economy', name: 'Indian Economy', icon: Coins, description: 'GDP, Inflation & Growth', color: 'from-blue-400 to-indigo-500' },
    { id: 'banking', name: 'Banking & Finance', icon: Landmark, description: 'RBI, Banks & Markets', color: 'from-green-400 to-teal-500' },
    { id: 'fiscal-policy', name: 'Fiscal Policy', icon: Receipt, description: 'Budget & Taxation', color: 'from-amber-400 to-orange-500' },
    { id: 'external-sector', name: 'External Sector', icon: ArrowRightLeft, description: 'Trade & BOP', color: 'from-purple-400 to-pink-500' },
    { id: 'planning', name: 'Planning & Development', icon: Target, description: 'Five Year Plans & NITI Aayog', color: 'from-cyan-400 to-blue-500' }
  ],
  'Environment': [
    { id: 'ecology', name: 'Ecology', icon: TreePine, description: 'Ecosystems & Food Chains', color: 'from-green-400 to-emerald-500' },
    { id: 'biodiversity', name: 'Biodiversity', icon: Leaf, description: 'Species & Conservation', color: 'from-teal-400 to-cyan-500' },
    { id: 'climate-change', name: 'Climate Change', icon: Thermometer, description: 'Global Warming & Mitigation', color: 'from-orange-400 to-red-500' },
    { id: 'pollution', name: 'Pollution', icon: Factory, description: 'Air, Water & Soil Pollution', color: 'from-gray-400 to-slate-500' },
    { id: 'env-laws', name: 'Environmental Laws', icon: Scale, description: 'Acts & International Agreements', color: 'from-blue-400 to-indigo-500' }
  ],
  'Ethics': [
    { id: 'ethics-basics', name: 'Ethics Basics', icon: Heart, description: 'Values & Principles', color: 'from-purple-400 to-violet-500' },
    { id: 'attitude', name: 'Attitude', icon: Brain, description: 'Formation & Change', color: 'from-pink-400 to-rose-500' },
    { id: 'aptitude', name: 'Aptitude', icon: Lightbulb, description: 'Civil Service Values', color: 'from-amber-400 to-yellow-500' },
    { id: 'emotional-iq', name: 'Emotional Intelligence', icon: Sparkles, description: 'EQ in Administration', color: 'from-cyan-400 to-teal-500' },
    { id: 'case-studies', name: 'Case Studies', icon: FileSearch, description: 'Ethical Dilemmas', color: 'from-indigo-400 to-blue-500' },
    { id: 'probity', name: 'Probity', icon: CheckCircle, description: 'Integrity in Governance', color: 'from-green-400 to-emerald-500' }
  ],
  // Default subtopics for topics not in the list
  'Current Affairs': [
    { id: 'national', name: 'National Affairs', icon: Flag, description: 'Indian News & Events', color: 'from-orange-400 to-red-500' },
    { id: 'international', name: 'International', icon: Globe, description: 'World News & Diplomacy', color: 'from-blue-400 to-indigo-500' },
    { id: 'economy-ca', name: 'Economic News', icon: Coins, description: 'Markets & Policy Changes', color: 'from-green-400 to-teal-500' },
    { id: 'science-tech', name: 'Science & Tech', icon: Lightbulb, description: 'Innovations & Discoveries', color: 'from-purple-400 to-violet-500' },
    { id: 'sports', name: 'Sports', icon: Target, description: 'Sports News & Events', color: 'from-amber-400 to-orange-500' }
  ]
};

// Participants in the video call
const participants = [
  { name: 'You', isSelf: true },
  { name: 'Priya Sharma', isSelf: false },
  { name: 'Rahul Verma', isSelf: false },
  { name: 'Anita Singh', isSelf: false },
  { name: 'Vikram Patel', isSelf: false },
  { name: 'Neha Gupta', isSelf: false }
];

export function StudyGroupLiveStudy({ group }: StudyGroupLiveStudyProps) {
  const [isInVideoCall, setIsInVideoCall] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);

  // Get subtopics for the current group's topic
  const groupTopic = group.topic || 'Current Affairs';
  const subtopics = topicSubtopics[groupTopic] || topicSubtopics['Current Affairs'];

  // Handler for joining video call
  const handleJoinCall = (subtopicId: string) => {
    setSelectedSubtopic(subtopicId);
    setIsInVideoCall(true);
  };

  // Handler for leaving video call
  const handleLeaveCall = () => {
    setIsInVideoCall(false);
    setSelectedSubtopic(null);
  };

  // Get current subtopic details
  const currentSubtopic = subtopics.find(s => s.id === selectedSubtopic);

  // Video Call Interface
  if (isInVideoCall && currentSubtopic) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 ml-72 bg-gray-900 flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLeaveCall}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Call</span>
            </motion.button>

            <div className="text-white">
              <h3 className="font-bold text-lg">{currentSubtopic.name}</h3>
              <p className="text-gray-400 text-sm">{group.name}</p>
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors">
              <Camera className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors">
              <Monitor className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3x2 Video Grid */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full">
            {participants.map((participant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-black rounded-2xl overflow-hidden group"
              >
                {/* Black placeholder for video */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />

                {/* Participant Avatar/Initial */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${
                    participant.isSelf ? group.gradient : 'from-gray-600 to-gray-700'
                  } flex items-center justify-center shadow-lg`}>
                    <span className="text-2xl font-bold text-white">
                      {participant.name.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Name Tag */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
                    <span className="text-white text-sm font-medium">
                      {participant.isSelf ? 'You' : participant.name}
                    </span>
                    {participant.isSelf && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                        Host
                      </span>
                    )}
                  </div>

                  {/* Audio indicator */}
                  <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Hover overlay for actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Subtopics Grid View (Default)
  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Choose a Subtopic to Study
        </h3>
        <p className="text-gray-600">
          Pick a topic and join a live video study session with your group members
        </p>
      </motion.div>

      {/* Subtopics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subtopics.map((subtopic, index) => (
          <motion.button
            key={subtopic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleJoinCall(subtopic.id)}
            className={`relative bg-gradient-to-br ${subtopic.color} rounded-2xl p-5 text-white text-left shadow-lg hover:shadow-xl transition-all group overflow-hidden`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 right-2 w-20 h-20 rounded-full bg-white/30 blur-xl" />
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <subtopic.icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <h4 className="font-bold text-lg mb-1">{subtopic.name}</h4>
            <p className="text-white/80 text-sm mb-3">{subtopic.description}</p>

            {/* Join Button Hint */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <Video className="w-4 h-4" />
              <span>Join Live Study</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Online indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span>{Math.floor(Math.random() * 5) + 2} online</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
