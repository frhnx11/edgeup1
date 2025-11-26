import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Globe, TrendingUp, Newspaper, Leaf, ArrowLeft, ArrowRight, Cloud, Sun, Droplets, Wind, CloudRain, Thermometer, BookOpen, Map, Zap, BarChart3, CheckCircle2, XCircle, Image, Volume2, VolumeX, Loader2, FileText, Play, ExternalLink, Download, FolderOpen } from 'lucide-react';
import Lottie from 'lottie-react';
import { generateSpeech } from '../../../services/elevenlabsAudio';

// Köppen Classification Data
const koppenData = [
  { symbol: 'Af', type: 'Tropical Rainforest', example: 'Andaman & Nicobar' },
  { symbol: 'Am', type: 'Tropical Monsoon', example: 'Western Ghats, Northeast' },
  { symbol: 'Aw', type: 'Tropical Savanna', example: 'Most of Peninsular India' },
  { symbol: 'BSh', type: 'Semi-Arid (Hot)', example: 'Parts of Gujarat, Rajasthan' },
  { symbol: 'BWh', type: 'Arid Desert (Hot)', example: 'Thar Desert' },
  { symbol: 'Cwa', type: 'Humid Subtropical', example: 'North Indian Plains' },
  { symbol: 'H', type: 'Highland', example: 'Himalayas' },
];

// Climate Factors Data
const climateFactors = [
  { factor: 'Latitude', effect: 'Determines insolation angle & duration', icon: '🌍' },
  { factor: 'Altitude', effect: '6.5°C drop per 1000m (Normal Lapse Rate)', icon: '⛰️' },
  { factor: 'Continentality', effect: 'Distance from sea affects temperature range', icon: '🏝️' },
  { factor: 'Ocean Currents', effect: 'Warm currents = moisture; Cold = aridity', icon: '🌊' },
  { factor: 'Relief/Orography', effect: 'Windward vs Leeward effect', icon: '🏔️' },
  { factor: 'Pressure & Winds', effect: 'ITCZ, Trade Winds, Westerlies', icon: '💨' },
];

// Climate Regions Data
const climateRegions = [
  { region: 'Western Ghats (Windward)', type: 'Tropical Rainforest', rainfall: '>250 cm', color: '#22c55e' },
  { region: 'Malabar Coast', type: 'Tropical Monsoon', rainfall: '200-300 cm', color: '#16a34a' },
  { region: 'Coromandel Coast', type: 'Tropical Monsoon', rainfall: '100-150 cm', color: '#15803d' },
  { region: 'Indo-Gangetic Plains', type: 'Humid Subtropical', rainfall: '75-150 cm', color: '#84cc16' },
  { region: 'Thar Desert', type: 'Hot Arid', rainfall: '<25 cm', color: '#eab308' },
  { region: 'Ladakh', type: 'Cold Desert', rainfall: '<10 cm', color: '#06b6d4' },
  { region: 'Northeast India', type: 'Subtropical Highland', rainfall: '400+ cm', color: '#0ea5e9' },
];

// Weather Systems Data
const weatherSystems = [
  {
    name: 'Western Disturbances',
    origin: 'Mediterranean Sea → Iran → Afghanistan → Pakistan',
    season: 'October to March (Peak: Dec-Feb)',
    impact: 'Winter rainfall in Punjab, Haryana, HP, J&K',
    importance: 'Rabi crop irrigation (Wheat)',
    icon: '🌧️'
  },
  {
    name: 'Tropical Cyclones',
    origin: 'Bay of Bengal (5-6/year) & Arabian Sea (1-2/year)',
    season: 'Pre-monsoon (Apr-May) & Post-monsoon (Oct-Nov)',
    impact: 'Coastal flooding, destruction',
    importance: 'Amphan (2020), Tauktae (2021), Biparjoy (2023)',
    icon: '🌀'
  },
  {
    name: 'Jet Streams',
    origin: 'STJ: North of Himalayas | TEJ: Over Peninsula',
    season: 'STJ: Winter | TEJ: Summer',
    impact: 'Controls monsoon onset & withdrawal',
    importance: 'STJ withdrawal triggers SW monsoon',
    icon: '💨'
  },
  {
    name: 'El Niño & La Niña',
    origin: 'Pacific Ocean temperature anomalies',
    season: 'Irregular, 2-7 year cycles',
    impact: 'El Niño: Weak monsoon | La Niña: Strong monsoon',
    importance: 'Drought years: 2009, 2014, 2015',
    icon: '🌡️'
  },
];

// Slide Narrations for Eleven Labs - Short and focused
const slideNarrations: { [key: string]: { [slide: number]: string } } = {
  geography: {
    0: "Welcome! Today we covered Climate Fundamentals, India's Climate Regions, Weather Systems, and Climate Change. Let's review!",
    1: "Climate is the average atmospheric conditions over 30 plus years. The Köppen system classifies climates by temperature and precipitation. India has 7 Köppen types. Six factors control climate: Latitude, Altitude, Continentality, Ocean currents, Relief, and Pressure systems.",
    2: "India has diverse climate regions. Western Ghats receive over 250 centimeters rainfall. Thar Desert gets less than 25. Key facts: Mawsynram is Earth's wettest place. Drass is the second coldest inhabited place. Chennai gets winter rain from Northeast Monsoon.",
    3: "Four major weather systems affect India. Western Disturbances bring winter rainfall for wheat. Tropical Cyclones cause coastal flooding. Jet Streams control monsoon timing. El Niño weakens monsoon, La Niña strengthens it.",
    4: "Here are your study resources for Climate and Weather Systems. Download the PDF notes for detailed revision. Watch the recommended videos for visual learning. Use these materials to strengthen your preparation!",
    5: "Quiz time! Test yourself with UPSC-pattern questions on Köppen classification, Indian Ocean Dipole, and Western Disturbances. Good luck!",
  }
};

// Study Resources Data
const studyResources = {
  pdfs: [
    { title: 'Köppen Climate Classification - Complete Notes', pages: 24, size: '2.4 MB', icon: '📄' },
    { title: 'Indian Monsoon System - UPSC Notes', pages: 18, size: '1.8 MB', icon: '📄' },
    { title: 'Weather Systems & Cyclones - Quick Revision', pages: 12, size: '1.2 MB', icon: '📄' },
    { title: 'Climate Change - Facts & Figures 2024', pages: 15, size: '1.5 MB', icon: '📄' },
  ],
  videos: [
    { title: 'Understanding Köppen Classification', duration: '12:34', thumbnail: '🎬', channel: 'UPSC Geography' },
    { title: 'Indian Monsoon Mechanism Explained', duration: '18:45', thumbnail: '🎬', channel: 'Mrunal Patel' },
    { title: 'El Niño & La Niña - Impact on India', duration: '15:20', thumbnail: '🎬', channel: 'Geography Hub' },
  ],
  links: [
    { title: 'IMD - India Meteorological Department', url: '#', type: 'Official' },
    { title: 'IPCC AR6 Report Summary', url: '#', type: 'Report' },
    { title: 'NASA Climate Change Portal', url: '#', type: 'Reference' },
  ]
};

// Quiz Questions
const quizQuestions = [
  {
    id: 1,
    type: 'Prelims Style - Köppen',
    question: "Consider the following statements about Köppen climate classification:\n1. 'Am' represents Tropical Monsoon climate\n2. 'BWh' represents Cold Desert climate\n3. Most of peninsular India falls under 'Aw' category\n\nWhich of the above is/are correct?",
    options: ['1 only', '1 and 3 only', '2 and 3 only', '1, 2 and 3'],
    correct: 1,
    explanation: "Statement 1 is correct (Am = Tropical Monsoon). Statement 2 is wrong (BWh = Hot Desert, not Cold). Statement 3 is correct (Aw = Tropical Savanna covers most of peninsular India)."
  },
  {
    id: 2,
    type: 'Prelims 2020 - Actual',
    question: "With reference to the Indian Ocean Dipole (IOD):\n1. Positive IOD leads to drought in India\n2. IOD phenomenon is independent of El Niño\n\nSelect the correct answer:",
    options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
    correct: 3,
    explanation: "Both statements are incorrect. Positive IOD actually brings MORE rainfall to India (not drought). IOD and El Niño are connected phenomena, not independent."
  },
  {
    id: 3,
    type: 'Prelims Style - Western Disturbances',
    question: "Western Disturbances are important for:\n1. Rabi crop irrigation in North India\n2. Replenishing Himalayan glaciers\n3. Triggering Southwest monsoon onset\n\nCorrect statements:",
    options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', 'All of the above'],
    correct: 0,
    explanation: "Statements 1 and 2 are correct. WD provides crucial winter rainfall for wheat and replenishes glaciers. Statement 3 is wrong - WD doesn't trigger SW monsoon; it's the withdrawal of Subtropical Westerly Jet that does."
  },
];

// Subject data structure
const subjectsData = {
  geography: {
    name: 'Geography',
    icon: Globe,
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    shadowColor: 'rgba(59, 130, 246, 0.3)',
    totalSlides: 6, // 0: Intro, 1-4: Content, 5: Quiz
    topics: [
      { emoji: '🌡️', text: 'Climate Fundamentals & Köppen Classification' },
      { emoji: '🗺️', text: "India's Climate Regions" },
      { emoji: '🌀', text: 'Weather Systems Affecting India' },
      { emoji: '📊', text: 'Climate Change & Current Affairs' }
    ]
  },
  economics: {
    name: 'Economics',
    icon: TrendingUp,
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    shadowColor: 'rgba(16, 185, 129, 0.3)',
    topics: [
      { emoji: '📈', text: 'GDP & Economic Growth Models' },
      { emoji: '💰', text: 'Fiscal Policy & Budget Analysis' },
      { emoji: '🏦', text: 'Banking System & RBI Functions' },
      { emoji: '🌍', text: 'Trade Balance & Foreign Exchange' }
    ]
  },
  currentAffairs: {
    name: 'Current Affairs',
    icon: Newspaper,
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    shadowColor: 'rgba(245, 158, 11, 0.3)',
    topics: [
      { emoji: '🌐', text: 'G20 Summit Highlights' },
      { emoji: '🤝', text: 'International Relations & Diplomacy' },
      { emoji: '📋', text: 'New Government Schemes' },
      { emoji: '🏛️', text: 'Recent Parliamentary Bills' }
    ]
  },
  biology: {
    name: 'Biology',
    icon: Leaf,
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    shadowColor: 'rgba(139, 92, 246, 0.3)',
    topics: [
      { emoji: '🔬', text: 'Cell Structure & Functions' },
      { emoji: '🧬', text: 'Genetics & Heredity' },
      { emoji: '🌿', text: 'Ecosystem & Biodiversity' },
      { emoji: '❤️', text: 'Human Physiology Basics' }
    ]
  }
};

interface ReviewClassesPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

type SubjectKey = keyof typeof subjectsData;

export function ReviewClassesPopup({ isVisible, onClose }: ReviewClassesPopupProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const lottieRef = useRef<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number | null }>({});
  const [showExplanation, setShowExplanation] = useState<{ [key: number]: boolean }>({});
  const [mapModalOpen, setMapModalOpen] = useState(false);

  // Audio state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(() => {
    return localStorage.getItem('review-audio-muted') === 'true';
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get total slides for current subject
  const getTotalSlides = () => {
    if (!selectedSubject) return 0;
    return subjectsData[selectedSubject].totalSlides || 6;
  };

  // Stop audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsAudioPlaying(false);
    setIsAudioLoading(false);
  }, []);

  // Play narration for current slide
  const playNarration = useCallback(async () => {
    if (!selectedSubject || isAudioMuted || isAudioLoading) return;

    const narration = slideNarrations[selectedSubject]?.[currentSlide];
    if (!narration) return;

    // Stop any existing audio first
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsAudioPlaying(false);

    try {
      setIsAudioLoading(true);
      const audioUrl = await generateSpeech(narration);

      // Check if we should still play (user might have navigated away)
      if (!selectedSubject) {
        setIsAudioLoading(false);
        return;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsAudioPlaying(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        console.error('Audio playback error');
        setIsAudioPlaying(false);
        setIsAudioLoading(false);
        audioRef.current = null;
      };

      setIsAudioLoading(false);
      setIsAudioPlaying(true);
      await audio.play();
    } catch (error) {
      console.error('Error playing narration:', error);
      setIsAudioPlaying(false);
      setIsAudioLoading(false);
      audioRef.current = null;
    }
  }, [selectedSubject, currentSlide, isAudioMuted, isAudioLoading]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const newMutedState = !isAudioMuted;
    setIsAudioMuted(newMutedState);
    localStorage.setItem('review-audio-muted', String(newMutedState));

    if (newMutedState) {
      stopAudio();
    }
  }, [isAudioMuted, stopAudio]);

  // Reset presentation when popup closes
  useEffect(() => {
    if (!isVisible) {
      setSelectedSubject(null);
      setCurrentSlide(0);
      setQuizAnswers({});
      setShowExplanation({});
      setMapModalOpen(false);
      stopAudio();
    }
  }, [isVisible, stopAudio]);

  // Auto-play narration when slide changes
  const prevSlideRef = useRef<number | null>(null);
  const prevSubjectRef = useRef<string | null>(null);

  useEffect(() => {
    // Only play if slide or subject actually changed
    const slideChanged = prevSlideRef.current !== currentSlide;
    const subjectChanged = prevSubjectRef.current !== selectedSubject;

    if ((slideChanged || subjectChanged) && selectedSubject && !isAudioMuted) {
      // Stop any existing audio first
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      setIsAudioPlaying(false);
      setIsAudioLoading(false);

      prevSlideRef.current = currentSlide;
      prevSubjectRef.current = selectedSubject;

      // Small delay to let the slide animate in
      const timer = setTimeout(() => {
        playNarration();
      }, 800);

      return () => {
        clearTimeout(timer);
      };
    }

    prevSlideRef.current = currentSlide;
    prevSubjectRef.current = selectedSubject;
  }, [selectedSubject, currentSlide, isAudioMuted, playNarration]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Navigation handlers
  const goToNextSlide = () => {
    if (currentSlide < getTotalSlides() - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // Quiz handlers
  const handleQuizAnswer = (questionId: number, answerIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    setShowExplanation(prev => ({ ...prev, [questionId]: true }));
  };

  const handleSubjectClick = (subject: SubjectKey) => {
    setSelectedSubject(subject);
    setCurrentSlide(0);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setCurrentSlide(0);
  };

  // Generate speech text based on selected subject and current slide
  const getSpeechText = () => {
    if (!selectedSubject) {
      return "Sure. Here are your classes from today. Which subject would you like to review?";
    }

    const subject = subjectsData[selectedSubject];

    // Different speech for each slide
    if (selectedSubject === 'geography') {
      switch (currentSlide) {
        case 0:
          return `Today, in ${subject.name} you learnt about Climate Fundamentals, Climate Regions, Weather Systems, and Climate Change. Let's review!`;
        case 1:
          return "Let's master the fundamentals of climate - a favorite topic in UPSC Prelims and Mains!";
        case 2:
          return "India's diverse geography creates unique climate regions. Let's analyze each with UPSC precision!";
        case 3:
          return "Understanding weather systems is crucial - they directly impact agriculture and policy questions in UPSC!";
        case 4:
          return "Here are your study resources - PDFs, videos, and reference links to strengthen your preparation!";
        case 5:
          return "Time to test yourself with actual UPSC-pattern questions!";
        default:
          return `Today, in ${subject.name} you learnt about ${subject.topics.map(t => t.text.split(' & ')[0]).join(', ')}.`;
      }
    }

    const topicsList = subject.topics.map(t => t.text.split(' & ')[0]).join(', ');
    return `Today, in ${subject.name} you learnt about ${topicsList}.`;
  };

  // Get slide title
  const getSlideTitle = () => {
    if (!selectedSubject || selectedSubject !== 'geography') return 'Introduction';

    switch (currentSlide) {
      case 0: return 'Introduction';
      case 1: return 'Climate Fundamentals & Köppen Classification';
      case 2: return "India's Climate Regions";
      case 3: return 'Weather Systems Affecting India';
      case 4: return 'Notes & Study Resources';
      case 5: return 'UPSC Quiz';
      default: return 'Introduction';
    }
  };

  // Load Lottie animation
  useEffect(() => {
    fetch('/robot-bot-animation.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Failed to load animation:', error));
  }, []);

  // ESC key to close map modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mapModalOpen) {
        setMapModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mapModalOpen]);

  return (
    <>
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
                      {getSpeechText()}
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

            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="p-6 flex-1 min-h-0"
            >
              <AnimatePresence mode="wait">
                {!selectedSubject ? (
                  /* Subject Cards Grid */
                  <motion.div
                    key="subject-cards"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-6 h-full"
                  >
                {/* Geography Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubjectClick('geography')}
                  className="relative rounded-2xl p-6 cursor-pointer overflow-hidden flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                    boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Geography</h3>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <p className="text-white/90 text-lg font-semibold mb-4">Topics covered today:</p>
                      <ul className="space-y-3 flex-1">
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          Climate Fundamentals & Köppen Classification
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          India's Climate Regions
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          Weather Systems Affecting India
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          Climate Change & Current Affairs
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
                  onClick={() => handleSubjectClick('economics')}
                  className="relative rounded-2xl p-6 cursor-pointer overflow-hidden flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Economics</h3>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <p className="text-white/90 text-lg font-semibold mb-4">Topics covered today:</p>
                      <ul className="space-y-3 flex-1">
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          GDP & Economic Growth Models
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          Fiscal Policy & Budget Analysis
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          Banking System & RBI Functions
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
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
                  onClick={() => handleSubjectClick('currentAffairs')}
                  className="relative rounded-2xl p-6 cursor-pointer overflow-hidden flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                        <Newspaper className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Current Affairs</h3>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <p className="text-white/90 text-lg font-semibold mb-4">Topics covered today:</p>
                      <ul className="space-y-3 flex-1">
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          G20 Summit Highlights
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          International Relations & Diplomacy
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          New Government Schemes
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
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
                  onClick={() => handleSubjectClick('biology')}
                  className="relative rounded-2xl p-6 cursor-pointer overflow-hidden flex flex-col"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Biology</h3>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <p className="text-white/90 text-lg font-semibold mb-4">Topics covered today:</p>
                      <ul className="space-y-3 flex-1">
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          Cell Structure & Functions
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          Genetics & Heredity
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          Ecosystem & Biodiversity
                        </li>
                        <li className="flex items-center gap-3 text-white/90 text-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                          Human Physiology Basics
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10" />
                </motion.div>
                  </motion.div>
                ) : (
                  /* Presentation View */
                  <motion.div
                    key="presentation"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                    className="h-full flex flex-col"
                  >
                    {/* Top Bar: Back Button + Audio Controls */}
                    <div className="flex items-center justify-between mb-4">
                      {/* Back Button */}
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={handleBackToSubjects}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                      >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Subjects</span>
                      </motion.button>

                      {/* Audio Controls */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3"
                      >
                        {/* Audio Status */}
                        {isAudioLoading && (
                          <span className="flex items-center gap-2 text-sm text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading audio...
                          </span>
                        )}
                        {isAudioPlaying && !isAudioLoading && (
                          <span className="flex items-center gap-2 text-sm text-purple-600">
                            <motion.div
                              className="flex items-center gap-0.5"
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <span className="w-1 h-3 bg-purple-500 rounded-full" />
                              <span className="w-1 h-4 bg-purple-500 rounded-full" />
                              <span className="w-1 h-2 bg-purple-500 rounded-full" />
                            </motion.div>
                            Playing...
                          </span>
                        )}

                        {/* Replay Button */}
                        {!isAudioPlaying && !isAudioLoading && !isAudioMuted && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={playNarration}
                            className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Volume2 className="w-4 h-4" />
                            Replay
                          </motion.button>
                        )}

                        {/* Mute/Unmute Toggle */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={toggleMute}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isAudioMuted
                              ? 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                          }`}
                          title={isAudioMuted ? 'Unmute narration' : 'Mute narration'}
                        >
                          {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </motion.button>
                      </motion.div>
                    </div>

                    {/* Slide Content Area */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                      <AnimatePresence mode="wait">
                        {/* SLIDE 0: Introduction */}
                        {currentSlide === 0 && (
                          <motion.div
                            key="slide-0"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="h-full rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-8 overflow-y-auto"
                          >
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-8">
                              <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ background: subjectsData[selectedSubject].gradient }}
                              >
                                {(() => {
                                  const IconComponent = subjectsData[selectedSubject].icon;
                                  return <IconComponent className="w-7 h-7 text-white" />;
                                })()}
                              </div>
                              <div>
                                <p className="text-blue-600 text-sm font-medium uppercase tracking-wider">Introduction</p>
                                <h2 className="text-2xl font-bold text-gray-800">{subjectsData[selectedSubject].name} - Today's Learning</h2>
                              </div>
                            </div>

                            {/* Topics Grid */}
                            <p className="text-gray-600 text-lg font-medium mb-6">What you learned today:</p>
                            <div className="grid grid-cols-2 gap-4">
                              {subjectsData[selectedSubject].topics.map((topic, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 + index * 0.1 }}
                                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                                >
                                  <div className="flex items-center gap-4">
                                    <span className="text-4xl">{topic.emoji}</span>
                                    <div className="flex-1">
                                      <span className="text-gray-800 text-lg font-semibold group-hover:text-blue-600 transition-colors">{topic.text}</span>
                                      <p className="text-gray-400 text-sm mt-1">Click to start →</p>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Progress indicator */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                              className="mt-8 flex items-center justify-center gap-3 text-gray-400"
                            >
                              <span className="text-sm">Use arrow keys or buttons to navigate</span>
                              <ArrowRight className="w-4 h-4 animate-pulse" />
                            </motion.div>
                          </motion.div>
                        )}

                        {/* SLIDE 1: Climate Fundamentals & Köppen Classification */}
                        {currentSlide === 1 && selectedSubject === 'geography' && (
                          <motion.div
                            key="slide-1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="h-full rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-6 overflow-hidden flex flex-col"
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                                  <Thermometer className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-blue-500 text-xs font-semibold uppercase tracking-wider">Slide 1 of 5</p>
                                  <h2 className="text-lg font-bold text-gray-800">Climate Fundamentals & Köppen Classification</h2>
                                </div>
                              </div>
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">UPSC Important</span>
                            </div>

                            {/* Main Content: Map Left + Content Right */}
                            <div className="flex-1 min-h-0 flex gap-5">
                              {/* Left: Köppen Map - Scrollable & Clickable */}
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="w-1/2 bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col"
                              >
                                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                                  <div className="flex items-center gap-2">
                                    <Map className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-gray-800 font-semibold text-sm">Köppen Climate Classification of India</h3>
                                  </div>
                                  <span className="text-xs text-gray-400">Click to expand</span>
                                </div>
                                <div
                                  className="flex-1 min-h-0 overflow-y-auto rounded-lg bg-gray-50 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                                  onClick={() => setMapModalOpen(true)}
                                >
                                  <img
                                    src="/images/koppen-map.jpg"
                                    alt="Köppen Climate Classification Map of India"
                                    className="w-full h-auto"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  <div className="hidden h-full flex flex-col items-center justify-center text-gray-400 py-20">
                                    <Image className="w-16 h-16 mb-3 opacity-50" />
                                    <p className="text-sm">Save image to: public/images/koppen-map.jpg</p>
                                  </div>
                                </div>
                              </motion.div>

                              {/* Right: Definition + Factors */}
                              <div className="w-1/2 flex flex-col gap-4 overflow-y-auto">
                                {/* Definition Card */}
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 }}
                                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-shrink-0"
                                >
                                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Definition (WMO)</p>
                                  <p className="text-gray-700 leading-relaxed">"Climate is the average atmospheric conditions of an area over a long period <span className="font-semibold text-blue-600">(30+ years)</span>"</p>
                                  <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500">
                                      <span className="font-semibold text-gray-700">Köppen System:</span> Based on temperature & precipitation thresholds
                                    </p>
                                  </div>
                                </motion.div>

                                {/* Factors Grid */}
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.4 }}
                                  className="flex-1"
                                >
                                  <h3 className="text-gray-800 font-semibold text-sm mb-3">Factors Controlling Climate</h3>
                                  <div className="grid grid-cols-2 gap-3">
                                    {climateFactors.map((item, i) => (
                                      <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + i * 0.05 }}
                                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
                                      >
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-xl">{item.icon}</span>
                                          <p className="font-semibold text-gray-800 text-sm">{item.factor}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">{item.effect}</p>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* SLIDE 2: India's Climate Regions */}
                        {currentSlide === 2 && selectedSubject === 'geography' && (
                          <motion.div
                            key="slide-2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="h-full rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50 p-8 overflow-y-auto"
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
                                  <Map className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider">Slide 2 of 5</p>
                                  <h2 className="text-xl font-bold text-gray-800">India's Climate Regions</h2>
                                </div>
                              </div>
                            </div>

                            {/* Regions Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              {climateRegions.map((region, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 + i * 0.05 }}
                                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-4"
                                >
                                  <div
                                    className="w-3 h-12 rounded-full flex-shrink-0"
                                    style={{ background: region.color }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm truncate">{region.region}</p>
                                    <p className="text-xs text-gray-500">{region.type}</p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-bold text-emerald-600">{region.rainfall}</p>
                                    <p className="text-xs text-gray-400">rainfall</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Key Facts Box */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                              className="bg-amber-50 rounded-xl p-5 border border-amber-200"
                            >
                              <p className="text-amber-700 font-semibold text-sm mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs">★</span>
                                UPSC Key Facts
                              </p>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-xs text-gray-500">Wettest Place</p>
                                  <p className="font-semibold text-gray-800">Mawsynram</p>
                                  <p className="text-emerald-600 font-bold">11,871 mm</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-xs text-gray-500">2nd Coldest Inhabited</p>
                                  <p className="font-semibold text-gray-800">Drass, Ladakh</p>
                                  <p className="text-blue-600 font-bold">-60°C</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-xs text-gray-500">Winter Rain City</p>
                                  <p className="font-semibold text-gray-800">Chennai</p>
                                  <p className="text-amber-600 font-bold">NE Monsoon</p>
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}

                        {/* SLIDE 3: Weather Systems */}
                        {currentSlide === 3 && selectedSubject === 'geography' && (
                          <motion.div
                            key="slide-3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="h-full rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50 p-8 overflow-y-auto"
                          >
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
                                <Zap className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="text-amber-500 text-xs font-semibold uppercase tracking-wider">Slide 3 of 5</p>
                                <h2 className="text-xl font-bold text-gray-800">Weather Systems Affecting India</h2>
                              </div>
                            </div>

                            {/* Weather Systems Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              {weatherSystems.map((system, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 + i * 0.1 }}
                                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                                >
                                  <div className="flex items-center gap-3 mb-3">
                                    <span className="text-3xl">{system.icon}</span>
                                    <h3 className="font-bold text-gray-800">{system.name}</h3>
                                  </div>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex">
                                      <span className="text-gray-400 w-16 flex-shrink-0">Origin</span>
                                      <span className="text-gray-600">{system.origin}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-gray-400 w-16 flex-shrink-0">Season</span>
                                      <span className="text-gray-600">{system.season}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="text-gray-400 w-16 flex-shrink-0">Impact</span>
                                      <span className="text-gray-600">{system.impact}</span>
                                    </div>
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-amber-600 font-medium">★ {system.importance}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* ITCZ Note */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                              className="bg-blue-50 rounded-xl p-5 border border-blue-100"
                            >
                              <h4 className="font-semibold text-gray-800 mb-2">ITCZ (Inter-Tropical Convergence Zone)</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs">JUL</span>
                                  <span className="text-gray-600">Over Gangetic Plains (~25°N) → Monsoon trough</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">JAN</span>
                                  <span className="text-gray-600">Over southern Indian Ocean</span>
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}

                        {/* SLIDE 4: Notes & Study Resources */}
                        {currentSlide === 4 && selectedSubject === 'geography' && (
                          <motion.div
                            key="slide-4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="h-full rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50 p-6 overflow-y-auto"
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
                                  <FolderOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <p className="text-indigo-500 text-xs font-semibold uppercase tracking-wider">Slide 4 of 5</p>
                                  <h2 className="text-xl font-bold text-gray-800">Notes & Study Resources</h2>
                                </div>
                              </div>
                            </div>

                            {/* Brief Description */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-5"
                            >
                              <p className="text-gray-600 leading-relaxed">
                                Access comprehensive study materials for <span className="font-semibold text-indigo-600">Climate & Weather Systems</span>.
                                Download PDF notes for offline revision, watch curated videos for visual learning, and explore reference links for deeper understanding.
                              </p>
                            </motion.div>

                            {/* Resources Grid */}
                            <div className="grid grid-cols-2 gap-5">
                              {/* PDF Notes Section */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                              >
                                <div className="flex items-center gap-2 mb-4">
                                  <FileText className="w-5 h-5 text-red-500" />
                                  <h3 className="font-semibold text-gray-800">PDF Notes</h3>
                                  <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{studyResources.pdfs.length} files</span>
                                </div>
                                <div className="space-y-3">
                                  {studyResources.pdfs.map((pdf, i) => (
                                    <motion.div
                                      key={i}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.3 + i * 0.05 }}
                                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-red-50 cursor-pointer transition-colors group"
                                    >
                                      <span className="text-2xl">{pdf.icon}</span>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-red-600">{pdf.title}</p>
                                        <p className="text-xs text-gray-400">{pdf.pages} pages • {pdf.size}</p>
                                      </div>
                                      <Download className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>

                              {/* Video Lectures Section */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                              >
                                <div className="flex items-center gap-2 mb-4">
                                  <Play className="w-5 h-5 text-purple-500" />
                                  <h3 className="font-semibold text-gray-800">Video Lectures</h3>
                                  <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{studyResources.videos.length} videos</span>
                                </div>
                                <div className="space-y-3">
                                  {studyResources.videos.map((video, i) => (
                                    <motion.div
                                      key={i}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.4 + i * 0.05 }}
                                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors group"
                                    >
                                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
                                        {video.thumbnail}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-purple-600">{video.title}</p>
                                        <p className="text-xs text-gray-400">{video.channel} • {video.duration}</p>
                                      </div>
                                      <Play className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            </div>

                            {/* Reference Links */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              className="mt-5 bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <ExternalLink className="w-5 h-5 text-blue-500" />
                                <h3 className="font-semibold text-gray-800">Reference Links</h3>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {studyResources.links.map((link, i) => (
                                  <motion.a
                                    key={i}
                                    href={link.url}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + i * 0.05 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700 font-medium transition-colors"
                                  >
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                      link.type === 'Official' ? 'bg-green-100 text-green-600' :
                                      link.type === 'Report' ? 'bg-amber-100 text-amber-600' :
                                      'bg-gray-100 text-gray-600'
                                    }`}>{link.type}</span>
                                    {link.title}
                                    <ExternalLink className="w-3 h-3" />
                                  </motion.a>
                                ))}
                              </div>
                            </motion.div>

                            {/* Quick Tip */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 }}
                              className="mt-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100"
                            >
                              <p className="text-indigo-700 text-sm">
                                <span className="font-semibold">Pro Tip:</span> Download the PDFs for offline access during your commute. Watch videos at 1.5x speed for efficient revision!
                              </p>
                            </motion.div>
                          </motion.div>
                        )}

                        {/* SLIDE 5: UPSC Quiz */}
                        {currentSlide === 5 && selectedSubject === 'geography' && (
                          <motion.div
                            key="slide-5"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="h-full rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50 p-8 overflow-y-auto"
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center shadow-lg">
                                  <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <p className="text-rose-500 text-xs font-semibold uppercase tracking-wider">Quiz Time</p>
                                  <h2 className="text-xl font-bold text-gray-800">UPSC-Style Questions</h2>
                                </div>
                              </div>
                              {Object.keys(quizAnswers).length === quizQuestions.length && (
                                <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                                  <span className="text-gray-600">Score: </span>
                                  <span className="font-bold text-rose-600">
                                    {quizQuestions.filter(q => quizAnswers[q.id] === q.correct).length}/{quizQuestions.length}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Questions */}
                            <div className="space-y-6">
                              {quizQuestions.map((q, qIndex) => (
                                <motion.div
                                  key={q.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 + qIndex * 0.1 }}
                                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                                >
                                  <div className="flex items-start gap-4 mb-4">
                                    <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                      {qIndex + 1}
                                    </span>
                                    <div className="flex-1">
                                      <p className="text-xs text-rose-500 font-medium mb-2">{q.type}</p>
                                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{q.question}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3 ml-12">
                                    {q.options.map((opt, optIndex) => {
                                      const isSelected = quizAnswers[q.id] === optIndex;
                                      const isCorrect = q.correct === optIndex;
                                      const showResult = showExplanation[q.id];

                                      return (
                                        <motion.button
                                          key={optIndex}
                                          whileHover={{ scale: showResult ? 1 : 1.01 }}
                                          whileTap={{ scale: showResult ? 1 : 0.99 }}
                                          onClick={() => !showResult && handleQuizAnswer(q.id, optIndex)}
                                          disabled={showResult}
                                          className={`p-4 rounded-xl text-left text-sm transition-all flex items-center gap-3 border-2 ${
                                            showResult
                                              ? isCorrect
                                                ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                                                : isSelected
                                                  ? 'bg-red-50 border-red-400 text-red-700'
                                                  : 'bg-gray-50 border-gray-200 text-gray-500'
                                              : 'bg-gray-50 border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-gray-700'
                                          }`}
                                        >
                                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                            showResult && isCorrect ? 'bg-emerald-200 text-emerald-700' :
                                            showResult && isSelected ? 'bg-red-200 text-red-700' :
                                            'bg-gray-200 text-gray-600'
                                          }`}>
                                            {String.fromCharCode(65 + optIndex)}
                                          </span>
                                          <span className="flex-1">{opt}</span>
                                          {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                          {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                                        </motion.button>
                                      );
                                    })}
                                  </div>

                                  {showExplanation[q.id] && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      className="mt-4 ml-12 p-4 bg-blue-50 rounded-xl border border-blue-100"
                                    >
                                      <p className="font-semibold text-blue-700 text-sm mb-1">Explanation</p>
                                      <p className="text-gray-600 text-sm leading-relaxed">{q.explanation}</p>
                                    </motion.div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Navigation Controls */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100"
                    >
                      {/* Previous Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={goToPrevSlide}
                        disabled={currentSlide === 0}
                        className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                      </motion.button>

                      {/* Slide Dots */}
                      <div className="flex items-center gap-2">
                        {Array.from({ length: getTotalSlides() }).map((_, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            whileHover={{ scale: 1.2 }}
                            className={`h-3 rounded-full transition-all duration-300 ${
                              currentSlide === index ? 'w-8' : 'w-3 bg-gray-300 hover:bg-gray-400'
                            }`}
                            style={{
                              background: currentSlide === index ? subjectsData[selectedSubject].gradient : undefined
                            }}
                          />
                        ))}
                      </div>

                      {/* Next Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={goToNextSlide}
                        disabled={currentSlide === getTotalSlides() - 1}
                        className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <ArrowRight className="w-5 h-5 text-gray-600" />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Map Fullscreen Modal */}
      <AnimatePresence>
        {mapModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center p-8"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(8px)'
            }}
            onClick={() => setMapModalOpen(false)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMapModalOpen(false)}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Map Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-6 left-6 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Köppen Climate Classification</h3>
                <p className="text-white/60 text-sm">Click anywhere or press ESC to close</p>
              </div>
            </motion.div>

            {/* Full Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="max-h-[90vh] max-w-[90vw] overflow-auto rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/images/koppen-map.jpg"
                alt="Köppen Climate Classification Map of India - Full View"
                className="max-h-[85vh] w-auto object-contain rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
