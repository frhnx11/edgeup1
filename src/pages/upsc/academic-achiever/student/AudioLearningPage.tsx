import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, Download, 
  Bookmark, MessageSquare, FileText, Mic, Timer, Settings,
  ChevronLeft, ChevronRight, Moon, Sun, Headphones, 
  BookOpen, Brain, Clock, Share2, Plus, Check, X,
  Rewind, FastForward, List, Edit3, Trash2, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WaveSurfer from 'wavesurfer.js';
import { toast } from 'react-hot-toast';

// Types
interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
}

interface Bookmark {
  id: string;
  time: number;
  title: string;
  note?: string;
  createdAt: Date;
}

interface Note {
  id: string;
  timestamp: number;
  content: string;
  createdAt: Date;
}

interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
}

interface Quiz {
  id: string;
  timestamp: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface AudioTrack {
  id: string;
  title: string;
  author: string;
  duration: number;
  url: string;
  thumbnail?: string;
  chapters?: Chapter[];
  transcript?: TranscriptSegment[];
  quizzes?: Quiz[];
}

const AudioLearningPage: React.FC = () => {
  const navigate = useNavigate();
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(0.7);
  const [activeTab, setActiveTab] = useState<'transcript' | 'notes' | 'chapters' | 'quiz' | 'discussion'>('transcript');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [equalizer, setEqualizer] = useState({
    bass: 0,
    mid: 0,
    treble: 0
  });

  // Mock data
  const currentTrack: AudioTrack = {
    id: '1',
    title: 'Introduction to Quantum Physics',
    author: 'Dr. Sarah Johnson',
    duration: 3600,
    url: '/audio/quantum-physics.mp3',
    chapters: [
      { id: '1', title: 'What is Quantum Physics?', startTime: 0, endTime: 900 },
      { id: '2', title: 'Wave-Particle Duality', startTime: 900, endTime: 1800 },
      { id: '3', title: 'Quantum Entanglement', startTime: 1800, endTime: 2700 },
      { id: '4', title: 'Applications and Future', startTime: 2700, endTime: 3600 }
    ],
    transcript: [
      { id: '1', startTime: 0, endTime: 5, text: 'Welcome to our comprehensive introduction to quantum physics.', speaker: 'Dr. Johnson' },
      { id: '2', startTime: 5, endTime: 10, text: 'Today, we\'ll explore the fascinating world of quantum mechanics.', speaker: 'Dr. Johnson' },
      // Add more transcript segments
    ],
    quizzes: [
      {
        id: '1',
        timestamp: 300,
        question: 'What is the fundamental principle of quantum mechanics?',
        options: ['Determinism', 'Uncertainty', 'Causality', 'Locality'],
        correctAnswer: 1
      }
    ]
  };

  // Initialize WaveSurfer
  useEffect(() => {
    if (waveformRef.current && !wavesurfer.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4F46E5',
        progressColor: '#818CF8',
        cursorColor: '#fff',
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 80,
        normalize: true,
        backend: 'WebAudio'
      });

      wavesurfer.current.on('ready', () => {
        setDuration(wavesurfer.current?.getDuration() || 0);
      });

      wavesurfer.current.on('audioprocess', () => {
        setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
      });

      wavesurfer.current.on('play', () => setIsPlaying(true));
      wavesurfer.current.on('pause', () => setIsPlaying(false));

      // Load mock audio URL
      // wavesurfer.current.load(currentTrack.url);
    }

    return () => {
      wavesurfer.current?.destroy();
    };
  }, []);

  // Sleep timer effect
  useEffect(() => {
    if (sleepTimer && sleepTimer > 0) {
      const timer = setTimeout(() => {
        setSleepTimer(prev => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            handlePause();
            toast.success('Sleep timer finished');
            return null;
          }
        });
      }, 60000); // 1 minute

      return () => clearTimeout(timer);
    }
  }, [sleepTimer]);

  // Study mode auto-pause
  useEffect(() => {
    if (studyMode && isPlaying) {
      const interval = setInterval(() => {
        handlePause();
        toast('Study mode: Time to take notes!', {
          icon: '📝',
          duration: 3000
        });
      }, 300000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [studyMode, isPlaying]);

  // Playback controls
  const handlePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handlePlay = () => {
    wavesurfer.current?.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    wavesurfer.current?.pause();
    setIsPlaying(false);
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(0, currentTime - 10);
    wavesurfer.current?.seekTo(newTime / duration);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    wavesurfer.current?.seekTo(newTime / duration);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    wavesurfer.current?.setPlaybackRate(speed);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    wavesurfer.current?.setVolume(newVolume);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const progress = x / bounds.width;
    wavesurfer.current?.seekTo(progress);
  };

  // Bookmark functions
  const addBookmark = () => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      time: currentTime,
      title: bookmarkTitle || `Bookmark at ${formatTime(currentTime)}`,
      note: bookmarkNote,
      createdAt: new Date()
    };
    setBookmarks([...bookmarks, newBookmark]);
    setShowBookmarkDialog(false);
    setBookmarkTitle('');
    setBookmarkNote('');
    toast.success('Bookmark added');
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
    toast.success('Bookmark removed');
  };

  const jumpToBookmark = (time: number) => {
    wavesurfer.current?.seekTo(time / duration);
  };

  // Note functions
  const addNote = () => {
    if (currentNote.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        timestamp: currentTime,
        content: currentNote,
        createdAt: new Date()
      };
      setNotes([...notes, newNote]);
      setCurrentNote('');
      toast.success('Note added');
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    toast.success('Note deleted');
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // Handle the recorded audio blob
        toast.success('Voice note saved');
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  // AI Summary generation
  const generateSummary = async () => {
    setShowSummary(true);
    // Simulate AI summary generation
    setTimeout(() => {
      setAiSummary(`
        **Key Points from "${currentTrack.title}":**
        
        1. Quantum physics describes the behavior of matter and energy at the smallest scales
        2. Wave-particle duality shows that particles can exhibit both wave and particle properties
        3. Quantum entanglement demonstrates non-local connections between particles
        4. Applications include quantum computing, cryptography, and sensing
        
        **Important Concepts:**
        - Superposition
        - Uncertainty principle
        - Quantum tunneling
        - Decoherence
        
        **Next Steps:**
        - Review the mathematical foundations
        - Explore practical applications
        - Complete the embedded quizzes
      `);
    }, 2000);
  };

  // Chapter navigation
  const jumpToChapter = (chapter: Chapter) => {
    wavesurfer.current?.seekTo(chapter.startTime / duration);
    setSelectedChapter(chapter.id);
  };

  // Quiz handling
  const checkQuizTrigger = useCallback(() => {
    if (currentTrack.quizzes) {
      const triggeredQuiz = currentTrack.quizzes.find(
        q => Math.abs(q.timestamp - currentTime) < 1 && !showQuiz
      );
      if (triggeredQuiz) {
        setCurrentQuiz(triggeredQuiz);
        setShowQuiz(true);
        handlePause();
      }
    }
  }, [currentTime, currentTrack.quizzes, showQuiz]);

  useEffect(() => {
    checkQuizTrigger();
  }, [currentTime, checkQuizTrigger]);

  const submitQuizAnswer = () => {
    if (currentQuiz && selectedAnswer !== null) {
      if (selectedAnswer === currentQuiz.correctAnswer) {
        toast.success('Correct answer!');
      } else {
        toast.error('Incorrect. Try reviewing that section.');
      }
      setShowQuiz(false);
      setCurrentQuiz(null);
      setSelectedAnswer(null);
      handlePlay();
    }
  };

  // Utility functions
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadAudio = () => {
    // Implement download functionality
    toast.success('Download started');
  };

  const shareAudio = () => {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={shareAudio}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={downloadAudio}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Track Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Headphones className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{currentTrack.title}</h1>
                  <p className="text-gray-600 mt-1">{currentTrack.author}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="text-sm text-gray-500">
                      Duration: {formatTime(duration)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Progress: {Math.round((currentTime / duration) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Waveform */}
              <div className="mt-6">
                <div ref={waveformRef} className="w-full cursor-pointer" onClick={handleSeek} />
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 flex items-center justify-center space-x-4">
                <button
                  onClick={() => handleSkipBackward()}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => handleSkipForward()}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>

              {/* Additional Controls */}
              <div className="mt-6 flex items-center justify-between">
                {/* Speed Control */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Speed:</span>
                  <select
                    value={playbackRate}
                    onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                    className="text-sm border rounded-lg px-2 py-1"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="1.75">1.75x</option>
                    <option value="2">2x</option>
                    <option value="2.5">2.5x</option>
                    <option value="3">3x</option>
                  </select>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-5 h-5 text-gray-600" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-24"
                  />
                </div>

                {/* Feature Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowBookmarkDialog(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Add Bookmark"
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSleepTimer(sleepTimer ? null : 30)}
                    className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                      sleepTimer ? 'text-indigo-600' : ''
                    }`}
                    title="Sleep Timer"
                  >
                    <Timer className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowEqualizer(!showEqualizer)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Equalizer"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Playlist"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sleep Timer Display */}
              {sleepTimer && (
                <div className="mt-4 bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Sleep timer: {sleepTimer} minutes remaining
                  </span>
                  <button
                    onClick={() => setSleepTimer(null)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Equalizer */}
              <AnimatePresence>
                {showEqualizer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 bg-gray-50 rounded-lg p-4"
                  >
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Equalizer</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 w-16">Bass</span>
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          value={equalizer.bass}
                          onChange={(e) => setEqualizer({ ...equalizer, bass: parseInt(e.target.value) })}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600 w-8">{equalizer.bass}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 w-16">Mid</span>
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          value={equalizer.mid}
                          onChange={(e) => setEqualizer({ ...equalizer, mid: parseInt(e.target.value) })}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600 w-8">{equalizer.mid}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 w-16">Treble</span>
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          value={equalizer.treble}
                          onChange={(e) => setEqualizer({ ...equalizer, treble: parseInt(e.target.value) })}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600 w-8">{equalizer.treble}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Content Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm"
            >
              {/* Tab Navigation */}
              <div className="border-b px-6">
                <div className="flex space-x-8">
                  {[
                    { id: 'transcript', label: 'Transcript', icon: FileText },
                    { id: 'notes', label: 'Notes', icon: Edit3 },
                    { id: 'chapters', label: 'Chapters', icon: BookOpen },
                    { id: 'quiz', label: 'Quiz', icon: Brain },
                    { id: 'discussion', label: 'Discussion', icon: MessageSquare }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 transition-colors flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Transcript Tab */}
                {activeTab === 'transcript' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Interactive Transcript</h3>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={autoScroll}
                          onChange={(e) => setAutoScroll(e.target.checked)}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-sm text-gray-600">Auto-scroll</span>
                      </label>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {currentTrack.transcript?.map((segment) => (
                        <motion.div
                          key={segment.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            currentTime >= segment.startTime && currentTime <= segment.endTime
                              ? 'bg-indigo-50 border border-indigo-200'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => jumpToBookmark(segment.startTime)}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-xs text-gray-500 mt-0.5">
                              {formatTime(segment.startTime)}
                            </span>
                            <div className="flex-1">
                              {segment.speaker && (
                                <span className="text-sm font-medium text-gray-700">
                                  {segment.speaker}:
                                </span>
                              )}
                              <p className="text-gray-800">{segment.text}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <textarea
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                        placeholder="Add a note at the current timestamp..."
                        className="flex-1 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500"
                        rows={3}
                      />
                      <button
                        onClick={addNote}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Add Note
                      </button>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {notes.map((note) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <button
                                  onClick={() => jumpToBookmark(note.timestamp)}
                                  className="text-sm text-indigo-600 hover:text-indigo-700"
                                >
                                  {formatTime(note.timestamp)}
                                </button>
                                <span className="text-sm text-gray-500">
                                  {new Date(note.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-800">{note.content}</p>
                            </div>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="ml-3 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chapters Tab */}
                {activeTab === 'chapters' && (
                  <div className="space-y-3">
                    {currentTrack.chapters?.map((chapter) => (
                      <motion.div
                        key={chapter.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedChapter === chapter.id
                            ? 'bg-indigo-50 border border-indigo-200'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => jumpToChapter(chapter)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Quiz Tab */}
                {activeTab === 'quiz' && (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Quizzes will appear automatically at specific timestamps during playback.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Upcoming Quizzes</h4>
                      {currentTrack.quizzes?.map((quiz) => (
                        <div key={quiz.id} className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">{quiz.question}</span>
                          <span className="text-sm text-gray-500">
                            at {formatTime(quiz.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discussion Tab */}
                {activeTab === 'discussion' && (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        Join the discussion with other learners about this audio lesson.
                      </p>
                    </div>
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No discussions yet. Be the first to start one!</p>
                      <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Start Discussion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Mode */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Study Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Study Mode</span>
                  <button
                    onClick={() => setStudyMode(!studyMode)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      studyMode ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        studyMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </label>
                {studyMode && (
                  <p className="text-sm text-gray-600">
                    Auto-pauses every 5 minutes for note-taking
                  </p>
                )}
              </div>
            </motion.div>

            {/* Voice Notes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Voice Notes</h3>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  isRecording
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Mic className="w-5 h-5" />
                <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
              </button>
            </motion.div>

            {/* AI Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">AI Assistant</h3>
              <button
                onClick={generateSummary}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Brain className="w-5 h-5" />
                <span>Generate Summary</span>
              </button>
            </motion.div>

            {/* Bookmarks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Bookmarks</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {bookmarks.length === 0 ? (
                  <p className="text-sm text-gray-600">No bookmarks yet</p>
                ) : (
                  bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <button
                        onClick={() => jumpToBookmark(bookmark.time)}
                        className="flex-1 text-left"
                      >
                        <p className="text-sm font-medium text-gray-900">{bookmark.title}</p>
                        <p className="text-xs text-gray-500">{formatTime(bookmark.time)}</p>
                      </button>
                      <button
                        onClick={() => deleteBookmark(bookmark.id)}
                        className="ml-2 text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Related Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Related Resources</h3>
              <div className="space-y-3">
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <p className="text-sm font-medium text-gray-900">Quantum Physics Textbook</p>
                  <p className="text-xs text-gray-600 mt-1">PDF • 245 pages</p>
                </a>
                <a href="#" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <p className="text-sm font-medium text-gray-900">Lab Experiments Guide</p>
                  <p className="text-xs text-gray-600 mt-1">Interactive • 12 experiments</p>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Bookmark Dialog */}
      <AnimatePresence>
        {showBookmarkDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBookmarkDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Bookmark</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={bookmarkTitle}
                    onChange={(e) => setBookmarkTitle(e.target.value)}
                    placeholder="Enter bookmark title..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (optional)
                  </label>
                  <textarea
                    value={bookmarkNote}
                    onChange={(e) => setBookmarkNote(e.target.value)}
                    placeholder="Add a note..."
                    className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-gray-600">
                    Timestamp: {formatTime(currentTime)}
                  </span>
                  <div className="space-x-3">
                    <button
                      onClick={() => setShowBookmarkDialog(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addBookmark}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Add Bookmark
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && currentQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Quiz</h3>
              <p className="text-gray-700 mb-6">{currentQuiz.question}</p>
              <div className="space-y-3">
                {currentQuiz.options.map((option, index) => (
                  <label
                    key={index}
                    className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAnswer === index
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz-answer"
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => setSelectedAnswer(index)}
                      className="sr-only"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowQuiz(false);
                    setCurrentQuiz(null);
                    setSelectedAnswer(null);
                    handlePlay();
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={submitQuizAnswer}
                  disabled={selectedAnswer === null}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSummary(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">AI-Generated Summary</h3>
                <button
                  onClick={() => setShowSummary(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {aiSummary ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">{aiSummary}</div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              )}
              {aiSummary && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiSummary);
                      toast.success('Summary copied to clipboard');
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([aiSummary], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${currentTrack.title}-summary.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Download
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist Modal */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPlaylist(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Playlist</h3>
                <button
                  onClick={() => setShowPlaylist(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {playlist.length === 0 ? (
                  <div className="text-center py-8">
                    <List className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No tracks in playlist</p>
                  </div>
                ) : (
                  playlist.map((track, index) => (
                    <div
                      key={track.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        index === currentTrackIndex
                          ? 'bg-indigo-50 border border-indigo-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentTrackIndex(index)}
                    >
                      <p className="font-medium text-gray-900">{track.title}</p>
                      <p className="text-sm text-gray-600">{track.author}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioLearningPage;