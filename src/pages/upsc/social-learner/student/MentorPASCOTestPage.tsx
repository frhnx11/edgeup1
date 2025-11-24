import React, { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Users,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Award,
  TrendingUp,
  FileText,
  AlertCircle,
  Play,
  BarChart3
} from 'lucide-react';

export function MentorPASCOTestPage() {
  const [selectedMentor, setSelectedMentor] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const mentors = [
    { id: '1', name: 'Dr. Guna', subject: 'Indian Polity' },
    { id: '2', name: 'Prof. Ravikumar', subject: 'Economics' },
    { id: '3', name: 'Ms. Israel', subject: 'Geography' },
    { id: '4', name: 'Dr. Sharma', subject: 'History' },
    { id: '5', name: 'Prof. Gupta', subject: 'Science & Technology' }
  ];

  const pascoQuestions = [
    {
      id: 1,
      category: 'Professionalism',
      question: 'How would you handle a situation where a student consistently submits assignments late?',
      options: [
        'Deduct marks immediately without discussion',
        'Have a one-on-one conversation to understand the root cause',
        'Ignore it if the quality is good',
        'Report to administration immediately'
      ],
      correct: 1
    },
    {
      id: 2,
      category: 'Adaptability',
      question: 'A new teaching technology is introduced mid-semester. How do you respond?',
      options: [
        'Resist the change and continue with traditional methods',
        'Embrace it immediately and integrate it into lessons',
        'Wait for others to test it first',
        'Request extensive training before using it'
      ],
      correct: 1
    },
    {
      id: 3,
      category: 'Communication',
      question: 'How do you ensure your feedback is constructive and helps student growth?',
      options: [
        'Focus only on mistakes to help them improve',
        'Balance positive reinforcement with specific areas for improvement',
        'Provide only praise to maintain confidence',
        'Use standardized comments for efficiency'
      ],
      correct: 1
    },
    {
      id: 4,
      category: 'Student-Centric',
      question: 'You notice a student struggling but not asking for help. What do you do?',
      options: [
        'Wait for them to approach you',
        'Proactively reach out and offer support',
        'Lower expectations for them',
        'Inform their parents'
      ],
      correct: 1
    },
    {
      id: 5,
      category: 'Organization',
      question: 'How do you manage your session planning and student assessments?',
      options: [
        'Plan as you go each week',
        'Create detailed long-term plans with regular reviews',
        'Follow only the textbook sequence',
        'Repeat last year\'s plan without changes'
      ],
      correct: 1
    },
    {
      id: 6,
      category: 'Collaboration',
      question: 'How do you work with fellow mentors to improve teaching quality?',
      options: [
        'Work independently to maintain autonomy',
        'Actively share resources and seek feedback',
        'Only collaborate when required',
        'Focus solely on your own students'
      ],
      correct: 1
    },
    {
      id: 7,
      category: 'Outcomes',
      question: 'How do you measure the effectiveness of your teaching?',
      options: [
        'Only through final exam scores',
        'Multiple metrics including engagement, progress, and assessments',
        'Student feedback alone',
        'Completion of syllabus'
      ],
      correct: 1
    },
    {
      id: 8,
      category: 'Accountability',
      question: 'A student performs poorly despite your efforts. How do you respond?',
      options: [
        'Blame the student for not trying hard enough',
        'Reflect on teaching methods and try different approaches',
        'Lower the difficulty level significantly',
        'Give them passing marks anyway'
      ],
      correct: 1
    }
  ];

  const handleStartTest = () => {
    if (!selectedMentor) {
      alert('Please select a mentor to begin the assessment');
      return;
    }
    setTestStarted(true);
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex.toString() });
  };

  const handleNext = () => {
    if (currentQuestion < pascoQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < pascoQuestions.length) {
      alert('Please answer all questions before submitting');
      return;
    }
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    pascoQuestions.forEach((q, idx) => {
      if (parseInt(answers[idx]) === q.correct) {
        correct++;
      }
    });
    return {
      score: Math.round((correct / pascoQuestions.length) * 100),
      correct,
      total: pascoQuestions.length
    };
  };

  const getCategoryScores = () => {
    const categories = new Map<string, { correct: number; total: number }>();

    pascoQuestions.forEach((q, idx) => {
      if (!categories.has(q.category)) {
        categories.set(q.category, { correct: 0, total: 0 });
      }
      const cat = categories.get(q.category)!;
      cat.total++;
      if (parseInt(answers[idx]) === q.correct) {
        cat.correct++;
      }
    });

    return Array.from(categories.entries()).map(([category, data]) => ({
      category,
      score: Math.round((data.correct / data.total) * 100)
    }));
  };

  if (showResults) {
    const results = calculateScore();
    const categoryScores = getCategoryScores();
    const selectedMentorData = mentors.find(m => m.id === selectedMentor);

    return (
      <AdminLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Results Header */}
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-8 rounded-2xl text-white text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">PASCO Assessment Complete!</h1>
            <p className="text-blue-100">Assessment for {selectedMentorData?.name}</p>
          </div>

          {/* Overall Score */}
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(9, 77, 136, 0.1)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={results.score >= 80 ? '#10ac8b' : results.score >= 60 ? '#fbbf24' : '#ef4444'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - results.score / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className="text-4xl font-bold text-gray-900">{results.score}%</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              {results.correct} out of {results.total} questions answered correctly
            </p>
            <div className={`inline-block px-6 py-2 rounded-full text-white font-semibold ${
              results.score >= 80 ? 'bg-green-500' :
              results.score >= 60 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}>
              {results.score >= 80 ? 'Excellent Performance' :
               results.score >= 60 ? 'Good Performance' :
               'Needs Improvement'}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Category Breakdown</h2>
            <div className="space-y-4">
              {categoryScores.map((cat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{cat.category}</span>
                    <span className={`font-bold ${
                      cat.score >= 80 ? 'text-green-600' :
                      cat.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {cat.score}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        cat.score >= 80 ? 'bg-green-500' :
                        cat.score >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.score}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowResults(false);
                setTestStarted(false);
                setCurrentQuestion(0);
                setAnswers({});
                setSelectedMentor('');
              }}
              className="flex-1 px-6 py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all font-semibold"
            >
              New Assessment
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Download Report
            </button>
          </div>
        </motion.div>
      </AdminLayout>
    );
  }

  if (!testStarted) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-8 rounded-2xl text-white">
              <Brain className="w-16 h-16 mb-4" />
              <h1 className="text-3xl font-bold mb-2">PASCO Assessment for Mentors</h1>
              <p className="text-blue-100">
                Comprehensive evaluation of teaching effectiveness across 8 key dimensions
              </p>
            </div>

            {/* Assessment Info */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Assessment Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <FileText className="w-6 h-6 text-brand-primary" />
                  <div>
                    <p className="font-semibold text-gray-900">8 Questions</p>
                    <p className="text-sm text-gray-600">Covering 8 categories</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <Clock className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">~10 Minutes</p>
                    <p className="text-sm text-gray-600">Estimated duration</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Assessment Categories:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Professionalism', 'Adaptability', 'Communication', 'Student-Centric', 'Organization', 'Collaboration', 'Outcomes', 'Accountability'].map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {cat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Mentor to Assess:
                </label>
                <select
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                >
                  <option value="">Choose a mentor...</option>
                  {mentors.map(mentor => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name} - {mentor.subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartTest}
              disabled={!selectedMentor}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Play className="w-6 h-6" />
              Start Assessment
            </button>
          </motion.div>
        </div>
      </AdminLayout>
    );
  }

  const currentQ = pascoQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / pascoQuestions.length) * 100;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {pascoQuestions.length}
              </span>
              <span className="text-sm font-medium text-brand-primary">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <div className="mb-6">
                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium">
                  {currentQ.category}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentQ.question}</h2>

              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      answers[currentQuestion] === idx.toString()
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-gray-200 hover:border-brand-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion] === idx.toString()
                          ? 'border-brand-primary bg-brand-primary'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestion] === idx.toString() && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-brand-primary hover:text-brand-primary transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex-1" />
            {currentQuestion === pascoQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className="px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
