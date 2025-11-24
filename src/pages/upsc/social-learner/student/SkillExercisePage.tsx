import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';
import { 
  Brain, 
  Target, 
  Activity, 
  Gauge, 
  RefreshCw,
  HelpCircle,
  Bot,
  Send,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ClipboardCheck,
  Mic,
  Volume2,
  VolumeX,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Star,
  Rocket,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Trophy
} from 'lucide-react';
import { useGameStore } from '../../../../store/useGameStore';
import { RewardPopup } from '../../../../components/upsc/common/GameElements';
import RecordRTC from 'recordrtc';

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: number;
  explanation: string;
  type: 'multiple-choice' | 'text' | 'interactive';
}

interface ExerciseData {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'quiz' | 'simulation' | 'challenge' | 'memory' | 'meditation' | 'logical';
  questions?: Question[];
  timeLimit?: number;
  xpReward: number;
  content?: string | string[];
  duration?: number;
  tips?: string[];
  instructions?: string[];
  benefits?: string[];
}

export function SkillExercisePage() {
  const navigate = useNavigate();
  const { exerciseId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showReward, setShowReward] = useState<{ xp: number; coins: number; message: string } | null>(null);
  const { addXP, addCoins } = useGameStore();

  // Memory exercise states
  const [showContent, setShowContent] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecalling, setIsRecalling] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Meditation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [meditationTime, setMeditationTime] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Exercise data
  const exercises: Record<string, ExerciseData> = {
    // Logical Reasoning Exercises
    'syl-1': {
      id: 'syl-1',
      title: 'Syllogistic Reasoning',
      description: 'Practice deductive reasoning through syllogisms and logical arguments',
      type: 'logical',
      xpReward: 100,
      questions: [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'If all A are B, and all B are C, what can we conclude?',
          options: [
            'All A are C',
            'Some A are C',
            'No A are C',
            'Cannot determine'
          ],
          correctAnswer: 0,
          explanation: 'This is a valid syllogism. If all A are B, and all B are C, then all A must be C.'
        },
        {
          id: '2',
          type: 'multiple-choice',
          question: 'If no X are Y, and all Z are Y, what can we conclude?',
          options: [
            'All X are Z',
            'No X are Z',
            'Some X are Z',
            'Cannot determine'
          ],
          correctAnswer: 1,
          explanation: 'Since no X are Y and all Z are Y, it follows that no X can be Z.'
        }
      ]
    },
    'pat-1': {
      id: 'pat-1',
      title: 'Pattern Recognition',
      description: 'Identify and complete complex patterns in sequences',
      type: 'logical',
      xpReward: 75,
      questions: [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'What number comes next in the sequence: 2, 6, 12, 20, 30, ?',
          options: ['42', '40', '36', '44'],
          correctAnswer: 0,
          explanation: 'The pattern adds consecutive even numbers: +4, +6, +8, +10, +12. Therefore, 30 + 12 = 42'
        },
        {
          id: '2',
          type: 'multiple-choice',
          question: 'Complete the pattern: AABABC, ABBACD, ABCADE, ?',
          options: ['ABCDAF', 'ABBCDE', 'ABCDEF', 'ACDABE'],
          correctAnswer: 0,
          explanation: 'Each sequence follows a pattern where letters are rearranged and a new letter is added.'
        }
      ]
    },

    // Memory Exercises
    'num-seq-1': {
      id: 'num-seq-1',
      title: 'Number Sequence Memorization',
      description: 'Practice memorizing and recalling sequences of numbers',
      type: 'memory',
      xpReward: 100,
      content: '739481265',
      duration: 30,
      tips: [
        'Break the number into chunks of 3',
        'Look for patterns or relationships',
        'Create a story with the numbers',
        'Visualize the numbers in your mind'
      ]
    },
    'word-seq-1': {
      id: 'word-seq-1',
      title: 'Word Sequence Memory',
      description: 'Memorize sequences of related words',
      type: 'memory',
      xpReward: 150,
      content: ['Democracy', 'Parliament', 'Constitution', 'Judiciary', 'Federation'],
      duration: 45,
      tips: [
        'Create a story linking the words',
        'Visualize each concept',
        'Make acronyms',
        'Find logical connections'
      ]
    },

    // Meditation Exercises
    'focus-1': {
      id: 'focus-1',
      title: 'Pre-Study Focus Meditation',
      description: 'Guided meditation for improved study focus',
      type: 'meditation',
      xpReward: 75,
      duration: 300,
      instructions: [
        'Find a quiet, comfortable place to sit',
        'Close your eyes and take deep breaths',
        'Focus your attention on your breath',
        'When your mind wanders, gently bring it back',
        'Gradually expand awareness to your study intentions'
      ],
      benefits: [
        'Improved concentration',
        'Reduced study anxiety',
        'Enhanced mental clarity',
        'Better information retention'
      ]
    },
    'mindful-1': {
      id: 'mindful-1',
      title: 'Mindful Learning Practice',
      description: 'Mindfulness practice for enhanced learning',
      type: 'meditation',
      xpReward: 100,
      duration: 600,
      instructions: [
        'Sit comfortably with your study materials',
        'Take three deep breaths',
        'Notice physical sensations and thoughts',
        'Observe your learning environment',
        'Set clear intentions for your study session'
      ],
      benefits: [
        'Increased learning awareness',
        'Better focus on study materials',
        'Reduced mental fatigue',
        'Improved learning efficiency'
      ]
    }
  };

  const exercise = exerciseId ? exercises[exerciseId] : null;

  useEffect(() => {
    if (exercise?.type === 'logical' && exercise.questions) {
      setAnswers(new Array(exercise.questions.length).fill(null));
    }
  }, [exercise?.type, exercise?.questions?.length]);

  useEffect(() => {
    if (timer !== null && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev === null || prev <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    } else if (timer === 0) {
      setShowContent(false);
      setIsRecalling(true);
    }
  }, [timer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setMeditationTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleMemoryExercise = (exerciseId: string) => {
    const exercise = exercises[exerciseId];
    if (!exercise || exercise.type !== 'memory') return;

    setTimer(exercise.duration || 30);
    setShowContent(true);
    setIsRecalling(false);
    setUserAnswer('');
  };

  const handleMeditationExercise = (exerciseId: string) => {
    const exercise = exercises[exerciseId];
    if (!exercise || exercise.type !== 'meditation') return;

    if (isPlaying) {
      setIsPlaying(false);
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
    } else {
      setIsPlaying(true);
      
      // Create new audio context and oscillator
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      oscillatorRef.current = audioContext.createOscillator();
      gainNodeRef.current = audioContext.createGain();
      
      const oscillator = oscillatorRef.current;
      const gainNode = gainNodeRef.current;
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(432, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answerIndex: number) => {
    if (!exercise?.questions) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!exercise?.questions) return;
    
    const score = exercise.questions.reduce((acc, question, index) => {
      return acc + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    const percentage = (score / exercise.questions.length) * 100;
    const xpEarned = Math.round((percentage / 100) * exercise.xpReward);
    
    addXP(xpEarned);
    addCoins(Math.round(xpEarned / 2));
    setShowResults(true);
    setShowReward({
      xp: xpEarned,
      coins: Math.round(xpEarned / 2),
      message: `You completed the exercise with ${Math.round(percentage)}% accuracy!`
    });
  };

  if (!exercise) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Exercise Not Found</h2>
            <p className="text-gray-600 mb-4">The exercise you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/skills')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Skills
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/skills')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exercise.title}</h1>
              <p className="text-gray-600">{exercise.description}</p>
            </div>
          </div>
        </div>

        {/* Exercise Content */}
        {exercise.type === 'logical' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span>Question {currentQuestion + 1} of {exercise.questions?.length}</span>
                <div className="flex items-center gap-2 text-yellow-600">
                  <Star className="w-4 h-4" />
                  <span>{exercise.xpReward} XP available</span>
                </div>
              </div>
            </div>

            {!showResults ? (
              <div className="p-6">
                <p className="text-lg mb-6">{exercise.questions?.[currentQuestion].question}</p>

                <div className="space-y-3">
                  {exercise.questions?.[currentQuestion].options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                        ${answers[currentQuestion] === index 
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-gray-200 hover:border-indigo-200'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2
                        ${answers[currentQuestion] === index 
                          ? 'border-indigo-600 text-indigo-600' 
                          : 'border-gray-300'}`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1 text-left">{option}</span>
                      {answers[currentQuestion] === index && (
                        <CheckCircle className="text-indigo-600" size={20} />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-between gap-4">
                  <button
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className="px-6 py-2 rounded-lg border-2 border-gray-200 hover:border-indigo-200 disabled:opacity-50 disabled:hover:border-gray-200"
                  >
                    Previous
                  </button>
                  {currentQuestion === (exercise.questions?.length || 0) - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={answers.some(a => a === null)}
                      className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestion(prev => prev + 1)}
                      disabled={answers[currentQuestion] === null}
                      className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Exercise Complete!</h2>
                  <p className="text-gray-600">
                    You answered {answers.filter((a, i) => a === exercise.questions?.[i].correctAnswer).length} out of {exercise.questions?.length} questions correctly
                  </p>
                </div>

                <div className="space-y-6">
                  {exercise.questions?.map((question, index) => (
                    <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {answers[index] === question.correctAnswer ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className="font-medium">Question {index + 1}</span>
                          </div>
                          <p className="text-gray-900">{question.question}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {question.options?.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg ${
                              optIndex === question.correctAnswer
                                ? 'bg-green-50 border-2 border-green-600'
                                : optIndex === answers[index]
                                ? 'bg-red-50 border-2 border-red-600'
                                : 'bg-white border-2 border-gray-200'
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>

                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Brain className="w-4 h-4 mt-1 text-indigo-600" />
                          <div>
                            <p className="font-medium text-indigo-900">Explanation:</p>
                            <p className="text-indigo-800 mt-1">{question.explanation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => navigate('/skills')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Star className="w-5 h-5" />
                    Return to Skills
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {exercise.type === 'memory' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-6">
              {showContent ? (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">Memorize</div>
                    <div className="text-sm text-gray-600 mb-4">
                      Time Remaining: {formatTime(timer || 0)}
                    </div>
                    <div className="text-4xl font-mono bg-indigo-50 p-8 rounded-xl">
                      {typeof exercise.content === 'string' 
                        ? exercise.content
                        : exercise.content?.join(' • ')}
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Tips:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {exercise.tips?.map((tip, index) => (
                        <li key={index} className="text-sm text-yellow-700">{tip}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Recall Phase</h3>
                    <p className="text-gray-600">Enter what you remember:</p>
                  </div>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Type your answer here..."
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => handleMemoryExercise(exercise.id)}
                      className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        const isCorrect = typeof exercise.content === 'string'
                          ? userAnswer.trim() === exercise.content
                          : exercise.content?.every(word => 
                              userAnswer.toLowerCase().includes(word.toLowerCase())
                            );

                        const xpEarned = isCorrect ? exercise.xpReward : Math.round(exercise.xpReward * 0.5);
                        addXP(xpEarned);
                        addCoins(Math.round(xpEarned / 2));
                        setShowReward({
                          xp: xpEarned,
                          coins: Math.round(xpEarned / 2),
                          message: isCorrect 
                            ? 'Perfect recall! Excellent memory!'
                            : 'Good attempt! Keep practicing to improve.'
                        });
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {exercise.type === 'meditation' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{exercise.title}</h3>
                <p className="text-gray-600">{formatTime(meditationTime)} / {formatTime(exercise.duration || 0)}</p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleMeditationExercise(exercise.id)}
                  className={`p-4 rounded-full transition-colors ${
                    isPlaying 
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
              </div>

              <div className="bg-indigo-50 p-6 rounded-xl">
                <h4 className="font-medium text-indigo-900 mb-4">Instructions:</h4>
                <ul className="space-y-3">
                  {exercise.instructions?.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3 text-indigo-800">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {exercise.benefits?.map((benefit, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reward Popup */}
      {showReward && (
        <RewardPopup
          reward={showReward}
          onClose={() => {
            setShowReward(null);
            navigate('/skills');
          }}
        />
      )}
    </DashboardLayout>
  );
}