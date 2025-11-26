import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Globe, TrendingUp, Newspaper, Leaf } from 'lucide-react';
import Lottie from 'lottie-react';

interface ReviewClassesPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ReviewClassesPopup({ isVisible, onClose }: ReviewClassesPopupProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const lottieRef = useRef<any>(null);

  // Load Lottie animation
  useEffect(() => {
    fetch('/robot-bot-animation.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Failed to load animation:', error));
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(12px)'
          }}
          onClick={onClose}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              width: '85vw',
              height: '85vh',
              maxWidth: '1600px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>

            {/* Header with Avatar */}
            <div className="relative p-6 pb-4">
              <div className="flex items-start gap-4">
                {/* Avatar Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, x: -50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
                  className="relative flex-shrink-0"
                >
                  {/* Floating Animation Wrapper */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {/* Avatar Circle */}
                    <div
                      className="w-20 h-20 rounded-full overflow-hidden shadow-xl"
                      style={{
                        background: 'radial-gradient(circle at center, #B4A7FF 0%, #9B8FE8 40%, #7D6FD3 100%)'
                      }}
                    >
                      {animationData ? (
                        <Lottie
                          lottieRef={lottieRef}
                          animationData={animationData}
                          loop={true}
                          autoplay={true}
                          style={{
                            width: '100%',
                            height: '100%'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Bot className="w-10 h-10 text-purple-200 animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Pulsing Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-purple-400/50"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    />
                  </motion.div>
                </motion.div>

                {/* Speech Bubble */}
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.4, type: 'spring' }}
                  className="relative mt-2"
                >
                  <div
                    className="relative px-5 py-4 rounded-2xl rounded-tl-md shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #8B7FF8 0%, #7B6FE8 50%, #6B5FD8 100%)',
                      boxShadow: '0 8px 32px rgba(107, 95, 216, 0.4), 0 4px 16px rgba(139, 127, 248, 0.3)'
                    }}
                  >
                    <p className="text-white font-semibold text-lg">
                      Sure. Here are your classes from today. Which subject would you like to review?
                    </p>

                    {/* Speech bubble tail */}
                    <div
                      className="absolute top-4 -left-2 w-4 h-4 transform rotate-45"
                      style={{ background: '#8B7FF8' }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Content Area with Subject Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="p-6 flex-1 min-h-0"
            >
              {/* Subject Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-6 h-full">
                {/* Geography Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-2xl p-6 cursor-pointer overflow-hidden flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                    boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Geography</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white/90 text-sm font-medium">Topics covered today:</p>
                      <ul className="space-y-1.5">
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Climate Patterns & Weather Systems
                        </li>
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Indian Monsoon Mechanism
                        </li>
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Major River Basins of India
                        </li>
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Soil Types & Distribution
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10" />
                </motion.div>

                {/* Economics Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-2xl p-6 cursor-pointer overflow-hidden flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Economics</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white/90 text-sm font-medium">Topics covered today:</p>
                      <ul className="space-y-1.5">
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          GDP & Economic Growth Models
                        </li>
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Fiscal Policy & Budget Analysis
                        </li>
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Banking System & RBI Functions
                        </li>
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Trade Balance & Foreign Exchange
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10" />
                </motion.div>

                {/* Current Affairs Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, type: 'spring' }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-2xl p-6 cursor-pointer overflow-hidden flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <Newspaper className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Current Affairs</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white/90 text-sm font-medium">Topics covered today:</p>
                      <ul className="space-y-1.5">
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          G20 Summit Highlights
                        </li>
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          International Relations & Diplomacy
                        </li>
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          New Government Schemes
                        </li>
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Recent Parliamentary Bills
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10" />
                </motion.div>

                {/* Biology Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, type: 'spring' }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-2xl p-6 cursor-pointer overflow-hidden flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Biology</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white/90 text-sm font-medium">Topics covered today:</p>
                      <ul className="space-y-1.5">
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Cell Structure & Functions
                        </li>
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Genetics & Heredity
                        </li>
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Ecosystem & Biodiversity
                        </li>
                        <li className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          Human Physiology Basics
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
