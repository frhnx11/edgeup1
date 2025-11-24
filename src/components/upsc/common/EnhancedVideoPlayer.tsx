import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, SkipForward, SkipBack, Subtitles, Download,
  BookOpen, MessageSquare, Share2, Bookmark, ChevronUp,
  ChevronDown, Clock, Zap, Award, FileText, Languages,
  Monitor, Smartphone, PictureInPicture2, Sun, Moon
} from 'lucide-react';

interface VideoChapter {
  id: string;
  title: string;
  timestamp: number;
  duration: number;
}

interface VideoNote {
  id: string;
  timestamp: number;
  content: string;
  createdAt: Date;
}

interface EnhancedVideoPlayerProps {
  url: string;
  title: string;
  onClose: () => void;
  onProgress?: (progress: number) => void;
  chapters?: VideoChapter[];
  savedNotes?: VideoNote[];
  onSaveNote?: (note: VideoNote) => void;
  transcript?: string;
  subtitles?: { language: string; url: string }[];
}

export function EnhancedVideoPlayer({ 
  url, 
  title, 
  onClose, 
  onProgress,
  chapters = [],
  savedNotes = [],
  onSaveNote,
  transcript,
  subtitles = []
}: EnhancedVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('720p');
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [selectedSubtitle, setSelectedSubtitle] = useState(subtitles[0]?.language || 'en');
  const [isPiPActive, setIsPiPActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Quality options
  const qualityOptions = ['1080p', '720p', '480p', '360p', 'Auto'];
  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      if (onProgress) {
        onProgress((video.currentTime / video.duration) * 100);
      }
    };

    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
        case 'arrowleft':
          skip(-10);
          break;
        case 'arrowright':
          skip(10);
          break;
        case 'arrowup':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case 'c':
          setShowSubtitles(!showSubtitles);
          break;
        case 'p':
          togglePiP();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [showSubtitles]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const adjustVolume = (delta: number) => {
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
    setIsMuted(vol === 0);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      } else {
        await videoRef.current.requestPictureInPicture();
        setIsPiPActive(true);
      }
    } catch (error) {
      console.error('PiP not supported');
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const saveNote = () => {
    if (!noteContent.trim() || !onSaveNote) return;
    
    const newNote: VideoNote = {
      id: Date.now().toString(),
      timestamp: currentTime,
      content: noteContent,
      createdAt: new Date()
    };
    
    onSaveNote(newNote);
    setNoteContent('');
  };

  const jumpToChapter = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
    }
  };

  const jumpToNote = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(url);
  const isYouTube = !!videoId;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex"
      onMouseMove={handleMouseMove}
    >
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Header */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-4 z-10"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium text-lg">{title}</h3>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FileText className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowNotes(!showNotes)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <BookOpen className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePiP}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <PictureInPicture2 className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video */}
        {isYouTube ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={url}
              className="w-full h-full"
              onClick={togglePlay}
            />

            {/* Custom Controls */}
            <AnimatePresence>
              {showControls && !isYouTube && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4"
                >
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer video-progress"
                      style={{
                        background: `linear-gradient(to right, #10ac8b 0%, #10ac8b ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`
                      }}
                    />
                    
                    {/* Chapter Markers */}
                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full -mt-3 cursor-pointer hover:scale-150 transition-transform"
                        style={{ left: `${(chapter.timestamp / duration) * 100}%` }}
                        onClick={() => jumpToChapter(chapter.timestamp)}
                        title={chapter.title}
                      />
                    ))}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Play/Pause */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlay}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white" />
                        )}
                      </motion.button>

                      {/* Skip buttons */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => skip(-10)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <SkipBack className="w-5 h-5 text-white" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => skip(10)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <SkipForward className="w-5 h-5 text-white" />
                      </motion.button>

                      {/* Volume */}
                      <div className="flex items-center gap-2">
                        <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          {isMuted ? (
                            <VolumeX className="w-5 h-5 text-white" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, white 0%, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) 100%)`
                          }}
                        />
                      </div>

                      {/* Time */}
                      <div className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Subtitles */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowSubtitles(!showSubtitles)}
                        className={`p-2 rounded-lg transition-colors ${
                          showSubtitles ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/70'
                        }`}
                      >
                        <Subtitles className="w-5 h-5" />
                      </motion.button>

                      {/* Settings */}
                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowSettings(!showSettings)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Settings className="w-5 h-5 text-white" />
                        </motion.button>

                        {/* Settings Menu */}
                        <AnimatePresence>
                          {showSettings && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg p-2 min-w-[200px]"
                            >
                              {/* Playback Speed */}
                              <div className="p-2">
                                <p className="text-white/70 text-xs mb-2">Playback Speed</p>
                                <div className="grid grid-cols-4 gap-1">
                                  {playbackRates.map((rate) => (
                                    <button
                                      key={rate}
                                      onClick={() => {
                                        setPlaybackRate(rate);
                                        if (videoRef.current) {
                                          videoRef.current.playbackRate = rate;
                                        }
                                      }}
                                      className={`px-2 py-1 text-xs rounded ${
                                        playbackRate === rate
                                          ? 'bg-[#10ac8b] text-white'
                                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                                      }`}
                                    >
                                      {rate}x
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Quality */}
                              <div className="p-2 border-t border-white/10">
                                <p className="text-white/70 text-xs mb-2">Quality</p>
                                <div className="space-y-1">
                                  {qualityOptions.map((q) => (
                                    <button
                                      key={q}
                                      onClick={() => setQuality(q)}
                                      className={`w-full text-left px-2 py-1 text-sm rounded ${
                                        quality === q
                                          ? 'bg-[#10ac8b] text-white'
                                          : 'text-white/70 hover:bg-white/10'
                                      }`}
                                    >
                                      {q}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Fullscreen */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {isFullscreen ? (
                          <Minimize className="w-5 h-5 text-white" />
                        ) : (
                          <Maximize className="w-5 h-5 text-white" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {(showTranscript || showNotes) && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-gray-900 border-l border-gray-800 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-gray-800">
                <button
                  onClick={() => {
                    setShowTranscript(true);
                    setShowNotes(false);
                  }}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    showTranscript
                      ? 'text-white bg-gray-800'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Transcript
                </button>
                <button
                  onClick={() => {
                    setShowNotes(true);
                    setShowTranscript(false);
                  }}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    showNotes
                      ? 'text-white bg-gray-800'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Notes ({savedNotes.length})
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {showTranscript && (
                  <div className="p-4">
                    {transcript ? (
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {transcript}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm">No transcript available</p>
                    )}
                  </div>
                )}

                {showNotes && (
                  <div className="p-4">
                    {/* Note Input */}
                    <div className="mb-4">
                      <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Add a note at this timestamp..."
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#10ac8b]"
                        rows={3}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">
                          {formatTime(currentTime)}
                        </span>
                        <button
                          onClick={saveNote}
                          disabled={!noteContent.trim()}
                          className="px-3 py-1 bg-[#10ac8b] text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0a7d64] transition-colors"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>

                    {/* Saved Notes */}
                    <div className="space-y-3">
                      {savedNotes.map((note) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => jumpToNote(note.timestamp)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[#10ac8b] text-xs font-medium">
                              {formatTime(note.timestamp)}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{note.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}