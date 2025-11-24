import { useState, useRef } from 'react';
import { generateQuestions, generateThoughtChain } from '../../../../utils/openai';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeTooltip } from '../../../../components/upsc/common/WelcomeTooltip';
import {
  Brain,
  Target,
  RefreshCw,
  HelpCircle,
  Sparkles,
  ClipboardCheck,
  Lightbulb,
  BookOpen,
  Download,
  CheckCircle
} from 'lucide-react';

interface StreamingThought {
  id: string;
  content: string;
  isComplete: boolean;
}

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
  type: string;
  difficulty: string;
  reasoning?: string;
}

// FuturisticCard Component
interface FuturisticCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  neonGlow?: boolean;
}

const FuturisticCard: React.FC<FuturisticCardProps> = ({ children, className = "", delay = 0, neonGlow = false }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5 }}
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(16, 172, 139, 0.15) 0%,
            transparent 60%
          ),
          linear-gradient(135deg,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(255, 255, 255, 0.95) 100%
          )
        `,
        backdropFilter: 'blur(10px)',
        boxShadow: neonGlow
          ? '0 0 30px rgba(16, 172, 139, 0.3), 0 8px 32px 0 rgba(9, 77, 136, 0.1)'
          : '0 8px 32px 0 rgba(9, 77, 136, 0.1)'
      }}
    >
      {/* Holographic borders */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#094d88]/5 via-transparent to-[#10ac8b]/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#094d88]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#10ac8b]/20 to-transparent" />
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#094d88]/20 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#10ac8b]/20 to-transparent" />
      {children}
    </motion.div>
  );
};

export function QuestionGenerationPage() {
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<StreamingThought[]>([]);

  // Question Types
  const questionTypes = [
    {
      id: 'mcq',
      name: 'Multiple Choice Questions',
      description: 'Questions with multiple options and one correct answer',
      icon: ClipboardCheck,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'descriptive',
      name: 'Descriptive Questions',
      description: 'Long-form questions requiring detailed answers',
      icon: BookOpen,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'case-study',
      name: 'Case Study Based',
      description: 'Questions based on real-world scenarios',
      icon: Lightbulb,
      gradient: 'from-green-500 to-teal-600'
    }
  ];

  // Subjects
  const subjects = [
    { id: 'polity', name: 'Indian Polity' },
    { id: 'economics', name: 'Economics' },
    { id: 'geography', name: 'Geography' },
    { id: 'history', name: 'History' }
  ];

  // Topics by subject
  const topics: Record<string, { id: string; name: string }[]> = {
    polity: [
      { id: 'constitution', name: 'Constitutional Framework' },
      { id: 'parliament', name: 'Parliament and Legislature' },
      { id: 'executive', name: 'Executive' }
    ],
    economics: [
      { id: 'macro', name: 'Macroeconomics' },
      { id: 'monetary', name: 'Monetary Policy' },
      { id: 'fiscal', name: 'Fiscal Policy' }
    ],
    geography: [
      { id: 'physical', name: 'Physical Geography' },
      { id: 'climate', name: 'Climate Systems' },
      { id: 'resources', name: 'Natural Resources' }
    ],
    history: [
      { id: 'ancient', name: 'Ancient India' },
      { id: 'medieval', name: 'Medieval India' },
      { id: 'modern', name: 'Modern India' }
    ]
  };

  const handleQuestionCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 50) {
      setQuestionCount(value);
    }
  };

  const handleGenerate = async () => {
    try {
      setError(null);
      setIsGenerating(true);

      const selectedSubjectName = subjects.find(s => s.id === selectedSubject)?.name || '';
      const selectedTopicName = topics[selectedSubject]?.find(t => t.id === selectedTopic)?.name || '';

      // Start generating chain of thoughts with streaming updates
      await generateThoughtChain(
        selectedSubjectName,
        selectedTopicName,
        selectedQuestionType,
        difficulty,
        (updatedThoughts) => {
          setThoughts(updatedThoughts);
        }
      );

      // Generate questions in batches for better UX
      const batchSize = 3;
      const totalBatches = Math.ceil(questionCount / batchSize);
      let allQuestions: Question[] = [];

      for (let i = 0; i < totalBatches; i++) {
        const currentBatchSize = Math.min(batchSize, questionCount - (i * batchSize));
        const batchQuestions = await generateQuestions(
          selectedSubjectName,
          selectedTopicName,
          selectedQuestionType,
          difficulty,
          currentBatchSize
        );

        allQuestions = [...allQuestions, ...batchQuestions];
        setGeneratedQuestions(allQuestions);
      }

    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQuestions = () => {
    const content = generatedQuestions.map((q, index) => {
      let questionText = `${index + 1}. ${q.question} (${q.marks} marks)\n`;

      if (q.type === 'mcq' && q.options) {
        questionText += '\nOptions:\n' + q.options.map((opt, i) =>
          `${String.fromCharCode(65 + i)}. ${opt}`
        ).join('\n');
      }

      questionText += `\n\nCorrect Answer: ${q.correctAnswer}`;
      questionText += `\n\nExplanation: ${q.explanation}\n\n`;
      return questionText;
    }).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSubject}_${selectedTopic}_questions.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
      <>
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16, 172, 139, 0.15) 0%, transparent 70%)',
            top: '10%',
            left: '5%',
            filter: 'blur(60px)'
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(9, 77, 136, 0.15) 0%, transparent 70%)',
            top: '50%',
            right: '10%',
            filter: 'blur(60px)'
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
            bottom: '10%',
            left: '50%',
            filter: 'blur(60px)'
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.15, 1],
            rotate: [0, 360, 0]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-white/20"
            >
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Brain className="w-12 h-12 text-[#094d88]" />
                    </motion.div>
                  </div>
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <div className="w-full h-full rounded-full border-2 border-transparent border-t-[#094d88] border-r-[#10ac8b]" />
                  </motion.div>
                </div>
                <motion.h3
                  className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Generating Questions
                </motion.h3>
                <p className="text-gray-600">Analyzing topic and crafting questions...</p>
              </div>

              {/* Chain of Thoughts */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-[#094d88]" />
                  <span className="font-medium bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">Chain of Thoughts</span>
                </div>
                <div className="space-y-3 text-sm max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {thoughts.map((thought, index) => (
                      <motion.div
                        key={thought.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#094d88] to-[#10ac8b] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                          <span className="text-white font-medium text-xs">
                            {parseInt(thought.id.split('-')[1])}
                          </span>
                        </div>
                        <div className="flex-1 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm min-h-[48px] border border-gray-200">
                          <span className="inline">
                            {thought.content}
                            {!thought.isComplete && (
                              <motion.span
                                className="inline-block w-2 h-4 bg-[#094d88] ml-1"
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                              />
                            )}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-4 h-4 text-[#094d88]" />
                  </motion.div>
                  <span>Generating {questionCount} questions...</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#10ac8b]" />
                  <span>Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6 relative">
        <WelcomeTooltip message="Generate practice questions using AI to test your knowledge." />

        {/* Header */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent mb-2">
              Question Generation
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#10ac8b]" />
              Generate custom questions for your study needs
            </p>
          </div>
          <div className="flex gap-4">
            <motion.button
              onClick={() => setGeneratedQuestions([])}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:border-[#094d88] transition-all shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </motion.button>
            <motion.button
              onClick={handleGenerate}
              disabled={!selectedQuestionType || !selectedSubject || !selectedTopic || isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(9, 77, 136, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Questions
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Configuration Panel */}
        <FuturisticCard className="rounded-2xl p-6" delay={0.1}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#094d88] to-[#10ac8b] flex items-center justify-center shadow-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
              Configuration Settings
            </h2>
          </div>
          <div className="space-y-6">
            {/* Question Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Question Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questionTypes.map((type, index) => {
                  const IconComponent = type.icon;
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedQuestionType(type.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedQuestionType === type.id
                          ? 'border-[#094d88] bg-gradient-to-br from-[#094d88]/5 to-[#10ac8b]/5'
                          : 'border-gray-200 hover:border-[#10ac8b] bg-white'
                      }`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${type.gradient} shadow-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-medium text-gray-900">{type.name}</div>
                          <div className="text-sm text-gray-600">{type.description}</div>
                        </div>
                        {selectedQuestionType === type.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <CheckCircle className="w-5 h-5 text-[#094d88]" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Subject and Topic Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedTopic('');
                  }}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-[#094d88] focus:ring-4 focus:ring-[#094d88]/20 transition-all shadow-sm"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  disabled={!selectedSubject}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-[#094d88] focus:ring-4 focus:ring-[#094d88]/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <option value="">Select Topic</option>
                  {selectedSubject && topics[selectedSubject].map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={questionCount.toString()}
                onChange={handleQuestionCountChange}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-[#094d88] focus:ring-4 focus:ring-[#094d88]/20 transition-all shadow-sm"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { level: 'easy', label: 'Easy', gradient: 'from-green-500 to-emerald-600', emoji: '😊' },
                  { level: 'medium', label: 'Medium', gradient: 'from-yellow-500 to-orange-600', emoji: '🤔' },
                  { level: 'hard', label: 'Hard', gradient: 'from-red-500 to-rose-600', emoji: '💪' }
                ].map((item) => (
                  <motion.button
                    key={item.level}
                    onClick={() => setDifficulty(item.level as 'easy' | 'medium' | 'hard')}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      difficulty === item.level
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-lg mr-2">{item.emoji}</span>
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </FuturisticCard>

        {/* Generated Questions */}
        <FuturisticCard className="rounded-2xl overflow-hidden" delay={0.2}>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#094d88] to-[#10ac8b] flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                  Generated Questions
                </h2>
              </div>
              {generatedQuestions.length > 0 && (
                <motion.button
                  onClick={downloadQuestions}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white rounded-xl hover:shadow-lg transition-all shadow-md"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(9, 77, 136, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </motion.button>
              )}
            </div>
          </div>

          <div className="p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2"
              >
                <HelpCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}

            {generatedQuestions.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#094d88]/10 to-[#10ac8b]/10 rounded-2xl flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Brain className="w-10 h-10 text-[#094d88]" />
                </motion.div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Questions Generated Yet</h3>
                <p className="text-gray-600">
                  Configure your preferences and click Generate to create questions
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {generatedQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-[#094d88]/30 transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#094d88] to-[#10ac8b] flex items-center justify-center text-white font-semibold shadow-md">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                              Question {index + 1}
                            </span>
                            <span className="px-3 py-1 bg-gradient-to-r from-[#094d88]/10 to-[#10ac8b]/10 text-[#094d88] rounded-full text-xs font-semibold">
                              {question.marks} marks
                            </span>
                          </div>
                          <p className="text-gray-900 text-lg leading-relaxed">{question.question}</p>
                        </div>
                      </div>

                      {/* Show MCQ options */}
                      {question.type === 'mcq' && question.options && (
                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optIndex) => (
                            <motion.div
                              key={optIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + optIndex * 0.05 }}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                option === question.correctAnswer
                                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                                  option === question.correctAnswer
                                    ? 'border-green-600 text-green-600 bg-green-100'
                                    : 'border-gray-300 text-gray-500'
                                }`}>
                                  {String.fromCharCode(65 + optIndex)}
                                </div>
                                <span className="flex-1">{option}</span>
                                {option === question.correctAnswer && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                  >
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Show answer for descriptive and case study questions */}
                      {(question.type === 'descriptive' || question.type === 'case-study') && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium text-green-900 mb-2">Model Answer:</p>
                              <p className="text-green-800 whitespace-pre-wrap">{question.correctAnswer}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Show explanation */}
                      <div className="mt-4 p-4 bg-gradient-to-br from-[#094d88]/5 to-[#10ac8b]/5 rounded-xl border border-[#094d88]/20">
                        <div className="flex items-start gap-2">
                          <Brain className="w-5 h-5 mt-1 text-[#094d88] flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-[#094d88] mb-2">Explanation:</p>
                            <p className="text-[#094d88]/90">{question.explanation}</p>
                          </div>
                        </div>
                      </div>

                      {/* Show reasoning if available */}
                      {question.reasoning && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-5 h-5 mt-1 text-purple-600 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium text-purple-900 mb-2">Question Design Reasoning:</p>
                              <p className="text-purple-800">{question.reasoning}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </FuturisticCard>
      </div>
      </>
  );
}
