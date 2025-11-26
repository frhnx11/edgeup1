import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Clock,
  TrendingUp,
  Flame,
  Sparkles,
  Search,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX
} from 'lucide-react';

// Reels data with real videos first
const reelsData = [
  {
    id: 1,
    title: "Modern Revolutions",
    tagline: "Discover the revolutionary movements that shaped the modern world - from the French Revolution to the Arab Spring, understand how people power changed history forever.",
    topic: "Modern History",
    duration: "0:24",
    views: "25.3K",
    likes: "5.8K",
    gradient: "from-rose-500 via-pink-500 to-purple-500",
    trending: true,
    videoSrc: "/videos/6258196-uhd_2160_3840_24fps.mp4",
    isRealVideo: true
  },
  {
    id: 2,
    title: "Box Jellyfish",
    tagline: "Meet one of nature's most fascinating yet dangerous creatures - the Box Jellyfish. Learn about their unique biology, habitat, and why they're crucial for marine ecosystems.",
    topic: "Environment",
    duration: "0:30",
    views: "18.7K",
    likes: "4.2K",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    trending: true,
    videoSrc: "/videos/4443825-hd_1080_1920_30fps.mp4",
    isRealVideo: true
  },
  {
    id: 3,
    title: "Humidity in Hilly Areas",
    tagline: "Explore the science behind humidity patterns in mountainous regions - how altitude, vegetation, and weather systems create unique microclimates in hilly terrains.",
    topic: "Geography",
    duration: "0:12",
    views: "21.1K",
    likes: "4.9K",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    trending: true,
    videoSrc: "/videos/14731240_720_1280_60fps.mp4",
    isRealVideo: true
  },
  {
    id: 4,
    title: "Indian Independence Movement",
    tagline: "The struggle for freedom that united a nation.",
    topic: "Modern History",
    duration: "1:30",
    views: "12.5K",
    likes: "2.3K",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    trending: false,
    isRealVideo: false
  },
  {
    id: 5,
    title: "Fundamental Rights Explained",
    tagline: "Your rights, your power - know them all.",
    topic: "Polity",
    duration: "2:15",
    views: "8.2K",
    likes: "1.8K",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    trending: false,
    isRealVideo: false
  },
  {
    id: 6,
    title: "Economic Survey 2024",
    tagline: "Key highlights from India's economic roadmap.",
    topic: "Economy",
    duration: "2:00",
    views: "9.8K",
    likes: "2.1K",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    trending: false,
    isRealVideo: false
  },
  {
    id: 7,
    title: "Parliament Sessions",
    tagline: "How laws are made in the world's largest democracy.",
    topic: "Polity",
    duration: "1:55",
    views: "11.2K",
    likes: "2.7K",
    gradient: "from-indigo-500 via-blue-500 to-cyan-500",
    trending: true,
    isRealVideo: false
  },
  {
    id: 8,
    title: "Climate Change & India",
    tagline: "Understanding our environmental challenges.",
    topic: "Environment",
    duration: "2:30",
    views: "18.3K",
    likes: "4.1K",
    gradient: "from-teal-500 via-green-500 to-lime-500",
    trending: true,
    isRealVideo: false
  },
  {
    id: 9,
    title: "Medieval Architecture",
    tagline: "The art and science of ancient builders.",
    topic: "Art & Culture",
    duration: "1:40",
    views: "6.9K",
    likes: "1.2K",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    trending: false,
    isRealVideo: false
  }
];

const categories = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'polity', label: 'Polity', icon: TrendingUp },
  { id: 'geography', label: 'Geography', icon: TrendingUp },
  { id: 'economy', label: 'Economy', icon: TrendingUp }
];

export function ReelsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const openModal = (index: number) => {
    setSelectedReelIndex(index);
  };

  const closeModal = () => {
    setSelectedReelIndex(null);
  };

  const goToPrevious = () => {
    if (selectedReelIndex !== null && selectedReelIndex > 0) {
      setSelectedReelIndex(selectedReelIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedReelIndex !== null && selectedReelIndex < reelsData.length - 1) {
      setSelectedReelIndex(selectedReelIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedReelIndex === null) return;

      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedReelIndex]);

  return (
    <>
      <div className="min-h-screen">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                UPSC Reels
              </h1>
              <p className="text-gray-600 mt-1">
                Quick lessons that hit different! Learn in 60 seconds or less
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>New drops daily!</span>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reels... (e.g., 'Constitution', 'Geography')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reelsData.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group cursor-pointer"
              onClick={() => openModal(index)}
            >
              <div className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-xl">
                {/* Video Thumbnail or Gradient Background */}
                {reel.isRealVideo && reel.videoSrc ? (
                  <video
                    src={reel.videoSrc}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${reel.gradient}`}>
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]" />
                      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.2),transparent_50%)]" />
                    </div>
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/50 transition-all"
                  >
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </motion.div>
                </div>

                {/* Trending Badge */}
                {reel.trending && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center gap-1"
                  >
                    <Flame className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">TRENDING</span>
                  </motion.div>
                )}

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg">
                  <span className="text-xs font-medium text-white">{reel.duration}</span>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="mb-3">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                      {reel.topic}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                    {reel.title}
                  </h3>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <span>{reel.views} views</span>
                    <span>•</span>
                    <span>{reel.likes} likes</span>
                  </div>
                </div>

                {/* Side Actions */}
                <div className="absolute right-3 bottom-24 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Bookmark className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-full font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all"
          >
            Load More Reels
          </motion.button>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedReelIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous Arrow */}
            {selectedReelIndex > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 md:left-8 z-50 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </motion.button>
            )}

            {/* Next Arrow */}
            {selectedReelIndex < reelsData.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 md:right-8 z-50 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </motion.button>
            )}

            {/* Video Container */}
            <motion.div
              key={selectedReelIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md mx-4 aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {reelsData[selectedReelIndex].isRealVideo && reelsData[selectedReelIndex].videoSrc ? (
                <video
                  key={reelsData[selectedReelIndex].videoSrc}
                  src={reelsData[selectedReelIndex].videoSrc}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${reelsData[selectedReelIndex].gradient} flex items-center justify-center`}>
                  <div className="text-center text-white p-6">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium opacity-75">Video coming soon</p>
                  </div>
                </div>
              )}

              {/* Mute/Unmute Button */}
              {reelsData[selectedReelIndex].isRealVideo && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              )}

              {/* Video Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <div className="mb-3">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                    {reelsData[selectedReelIndex].topic}
                  </span>
                </div>
                <h2 className="text-white font-bold text-2xl mb-3">
                  {reelsData[selectedReelIndex].title}
                </h2>
                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  {reelsData[selectedReelIndex].tagline}
                </p>
                <div className="flex items-center gap-4 text-white/70 text-sm">
                  <span>{reelsData[selectedReelIndex].views} views</span>
                  <span>•</span>
                  <span>{reelsData[selectedReelIndex].likes} likes</span>
                  <span>•</span>
                  <span>{reelsData[selectedReelIndex].duration}</span>
                </div>
              </div>

              {/* Side Actions in Modal */}
              <div className="absolute right-4 bottom-48 flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <Share2 className="w-6 h-6 text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <Bookmark className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
