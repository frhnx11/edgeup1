import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWorker } from 'tesseract.js';
import { analyzeExamPaper } from '../../../../utils/openai';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Download,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Brain,
  Target,
  Clock,
  ChevronRight,
  Sparkles,
  Image,
  FileType,
  Scan,
  Eye,
  PenTool,
  BarChart2,
  Lightbulb,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Book,
  Users,
  Star,
  Trophy,
  Medal,
  Crown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

interface ExamPaper {
  id: string;
  studentName: string;
  subject: string;
  uploadDate: string;
  status: 'pending' | 'correcting' | 'completed' | 'error';
  score?: number;
  totalMarks: number;
  feedback?: string;
  aiAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    confidenceScore: number;
    keywordAnalysis?: {
      keyword: string;
      present: boolean;
    }[];
    detailedScoring?: {
      accuracy: number;
      completeness: number;
      relevance: number;
      presentation: number;
    };
  };
  questionWiseAnalysis?: Array<{
    questionNumber: number;
    score: number;
    feedback: string;
    improvement: string;
  }>;
}

interface AIProcessingStatus {
  stage: 'uploading' | 'processing' | 'analyzing' | 'complete' | 'error';
  progress: number;
  message: string;
}

// FuturisticCard Component
const FuturisticCard = ({ children, className = "", delay = 0, neonGlow = false }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
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

export function ExamCorrectionPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<AIProcessingStatus | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    score: number;
    feedback: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    keywordAnalysis?: {
      keyword: string;
      present: boolean;
    }[];
  } | null>(null);

  const handleFilePreview = (file: File) => {
    if (file.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const processDocument = async (file: File) => {
    setProcessingStatus({
      stage: 'uploading',
      progress: 0,
      message: 'Uploading document...'
    });

    try {
      let imageData: string;
      if (file.type.includes('image')) {
        imageData = URL.createObjectURL(file);
      } else {
        throw new Error('Currently only image files are supported');
      }

      const worker = await createWorker();

      setProcessingStatus({
        stage: 'processing',
        progress: 30,
        message: 'Processing document content...'
      });

      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(imageData);
      await worker.terminate();
      URL.revokeObjectURL(imageData);

      setProcessingStatus({
        stage: 'analyzing',
        progress: 60,
        message: 'Analyzing answers...'
      });

      const form = document.querySelector('form');
      const subject = form?.querySelector<HTMLSelectElement>('select[name="subject"]')?.value || '';
      const totalMarks = parseInt(form?.querySelector<HTMLInputElement>('input[name="totalMarks"]')?.value || '0');

      const analysis = await analyzeExamPaper(text, subject, totalMarks);
      setAnalysisResults(analysis);

      setProcessingStatus({
        stage: 'complete',
        progress: 100,
        message: 'Analysis complete!'
      });

      setTimeout(() => {
        setShowUploadModal(false);
        setProcessingStatus(null);
      }, 1000);

    } catch (error) {
      console.error('Error processing document:', error);
      setProcessingStatus({
        stage: 'error',
        progress: 0,
        message: 'Error processing document'
      });
      throw error;
    }
  };

  const examPapers: ExamPaper[] = [
    {
      id: '1',
      studentName: 'John Doe',
      subject: 'Indian Polity',
      uploadDate: '2025-02-15',
      status: 'completed',
      score: 85,
      totalMarks: 100,
      feedback: 'Good understanding of constitutional concepts. Need improvement in current affairs.',
      aiAnalysis: {
        strengths: ['Strong conceptual understanding', 'Good examples used'],
        weaknesses: ['Some key terms missing', 'Could improve structure'],
        suggestions: ['Include more current examples', 'Better keyword coverage needed'],
        confidenceScore: 85,
        keywordAnalysis: [
          { keyword: 'Blue Revolution', present: true },
          { keyword: 'Sustainable Economy', present: true },
          { keyword: 'Marine Conservation', present: false }
        ]
      }
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      subject: 'Economics',
      uploadDate: '2025-02-15',
      status: 'correcting',
      totalMarks: 100
    }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.includes('image')) {
        alert('Currently only image files are supported. Please upload a JPG, PNG or similar image file.');
        return;
      }
      setSelectedFile(file);
      handleFilePreview(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await processDocument(selectedFile);
      setIsUploading(false);
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-[#10ac8b] bg-[#10ac8b]/10';
      case 'correcting':
        return 'text-[#094d88] bg-[#094d88]/10';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'correcting':
        return <RefreshCw className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Chart data for keyword analysis
  const keywordData = {
    labels: ['Required Keywords', 'Present Keywords', 'Missing Keywords'],
    datasets: [
      {
        label: 'Keyword Analysis',
        data: [20, 15, 5],
        backgroundColor: [
          'rgba(9, 77, 136, 0.8)',
          'rgba(16, 172, 139, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }
    ]
  };

  // Chart data for scoring metrics
  const scoringMetrics = {
    labels: ['Accuracy', 'Completeness', 'Relevance', 'Presentation'],
    datasets: [
      {
        label: 'Score Distribution',
        data: [85, 75, 90, 80],
        backgroundColor: 'rgba(9, 77, 136, 0.2)',
        borderColor: 'rgb(9, 77, 136)',
        borderWidth: 2,
        fill: true
      }
    ]
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

      <div className="space-y-6 relative">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent mb-2">
              Exam Paper Correction
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#10ac8b]" />
              AI-powered exam paper evaluation and feedback
            </p>
          </div>
          <motion.button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white rounded-xl hover:shadow-lg transition-all shadow-md"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(9, 77, 136, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload className="w-4 h-4" />
            Upload Paper
          </motion.button>
        </motion.div>

        {/* Processing Status */}
        <AnimatePresence>
          {processingStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FuturisticCard className="rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      processingStatus.stage === 'error'
                        ? 'bg-gradient-to-br from-red-500 to-red-600'
                        : 'bg-gradient-to-br from-[#094d88] to-[#10ac8b]'
                    }`}
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: processingStatus.stage === 'error' ? 0 : [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {processingStatus.stage === 'uploading' && <Upload className="w-7 h-7 text-white" />}
                    {processingStatus.stage === 'processing' && <Scan className="w-7 h-7 text-white" />}
                    {processingStatus.stage === 'analyzing' && <Brain className="w-7 h-7 text-white" />}
                    {processingStatus.stage === 'complete' && <CheckCircle className="w-7 h-7 text-white" />}
                    {processingStatus.stage === 'error' && <AlertCircle className="w-7 h-7 text-white" />}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-lg bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                        {processingStatus.message}
                      </span>
                      <span className="text-lg font-bold text-[#094d88]">{processingStatus.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#094d88] to-[#10ac8b] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${processingStatus.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </FuturisticCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: FileText, label: 'Total Papers', value: '24', color: 'from-blue-500 to-indigo-600' },
            { icon: CheckCircle, label: 'Corrected', value: '18', color: 'from-green-500 to-emerald-600' },
            { icon: Clock, label: 'Pending', value: '6', color: 'from-yellow-500 to-orange-600' },
            { icon: Target, label: 'Avg. Score', value: '82%', color: 'from-purple-500 to-pink-600' }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <FuturisticCard key={stat.label} className="rounded-2xl p-6" delay={0.1 + index * 0.05} neonGlow>
                <div className="flex items-center gap-4">
                  <motion.div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color} shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <motion.p
                      className="text-3xl font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.05, type: "spring", stiffness: 200 }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                </div>
              </FuturisticCard>
            );
          })}
        </div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <FuturisticCard className="rounded-2xl p-6" delay={0.3}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#094d88] to-[#10ac8b] flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                      Analysis Results
                    </h2>
                  </div>
                  <motion.div
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#094d88]/10 to-[#10ac8b]/10 rounded-2xl"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-4xl font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                      {analysisResults.score}%
                    </span>
                    <span className="text-sm text-gray-600">Overall Score</span>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Keyword Analysis */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#094d88]" />
                      Keyword Analysis
                    </h3>
                    <div className="space-y-3">
                      {analysisResults.keywordAnalysis?.map((keyword, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                            keyword.present
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                              : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300'
                          }`}
                        >
                          <span className="font-medium">{keyword.keyword}</span>
                          {keyword.present ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Strengths and Weaknesses */}
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-green-600" />
                        Strengths
                      </h3>
                      <div className="space-y-2">
                        {analysisResults.strengths.map((strength, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            className="flex items-center gap-2 text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200"
                          >
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{strength}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        Areas for Improvement
                      </h3>
                      <div className="space-y-2">
                        {analysisResults.weaknesses.map((weakness, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.55 + index * 0.05 }}
                            className="flex items-center gap-2 text-yellow-700 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200"
                          >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{weakness}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Charts */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-200"
                  >
                    <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-[#094d88]" />
                      Keyword Distribution
                    </h3>
                    <div className="h-64">
                      <Bar
                        data={keywordData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-200"
                  >
                    <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#094d88]" />
                      Scoring Metrics
                    </h3>
                    <div className="h-64">
                      <Radar
                        data={scoringMetrics}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            r: {
                              beginAtZero: true,
                              max: 100
                            }
                          }
                        }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Suggestions */}
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[#094d88]" />
                    Improvement Suggestions
                  </h3>
                  <div className="bg-gradient-to-br from-[#094d88]/5 to-[#10ac8b]/5 p-6 rounded-2xl border border-[#094d88]/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="w-5 h-5 text-[#094d88]" />
                      <span className="font-semibold text-[#094d88]">AI Recommendations</span>
                    </div>
                    <div className="space-y-3">
                      {analysisResults.suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.75 + index * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#094d88] to-[#10ac8b] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                            <span className="text-white text-sm font-semibold">{index + 1}</span>
                          </div>
                          <span className="text-[#094d88] flex-1">{suggestion}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </FuturisticCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Papers List */}
        <FuturisticCard className="rounded-2xl overflow-hidden" delay={0.4}>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#094d88] to-[#10ac8b] flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                Recent Papers
              </h2>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {examPapers.map((paper, index) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all cursor-pointer"
                whileHover={{ x: 5 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FileText className="w-6 h-6" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{paper.studentName}</h3>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-sm text-gray-600">{paper.subject}</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(paper.status)}`}>
                          {getStatusIcon(paper.status)}
                          <span>
                            {paper.status.charAt(0).toUpperCase() + paper.status.slice(1)}
                          </span>
                        </span>
                      </div>
                      {paper.aiAnalysis && (
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                              <div className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Strengths
                              </div>
                              <ul className="text-sm text-green-700 space-y-2">
                                {paper.aiAnalysis.strengths.map((strength, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                              <div className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                Areas for Improvement
                              </div>
                              <ul className="text-sm text-yellow-700 space-y-2">
                                {paper.aiAnalysis.weaknesses.map((weakness, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {paper.aiAnalysis.detailedScoring && (
                            <div className="grid grid-cols-4 gap-3">
                              {Object.entries(paper.aiAnalysis.detailedScoring).map(([key, value]) => (
                                <div key={key} className="p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                                  <div className="text-xs text-gray-600 capitalize mb-1">{key}</div>
                                  <div className="text-lg font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                                    {value}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {paper.feedback && (
                        <p className="text-sm text-gray-600 mt-3 italic">{paper.feedback}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {paper.score !== undefined && (
                      <motion.div
                        className="text-right"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}
                      >
                        <div className="text-3xl font-bold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                          {paper.score}/{paper.totalMarks}
                        </div>
                        <div className="text-sm text-gray-600">Score</div>
                      </motion.div>
                    )}
                    <motion.button
                      onClick={() => navigate(`/exam/${paper.id}/student/1`)}
                      className="p-3 hover:bg-gradient-to-r hover:from-[#094d88]/10 hover:to-[#10ac8b]/10 rounded-xl transition-all"
                      whileHover={{ scale: 1.1, x: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-5 h-5 text-[#094d88]" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FuturisticCard>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20"
            >
              <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                Upload Exam Paper
              </h3>

              <form className="space-y-6">
                <motion.div
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#094d88] transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-[#094d88] to-[#10ac8b] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Upload className="w-8 h-8" />
                    </motion.div>
                    <p className="text-sm text-gray-700 mb-2 font-medium">
                      {selectedFile ? selectedFile.name : 'Drag and drop or click to upload'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, and other image files
                    </p>
                  </label>
                </motion.div>

                {/* File Preview */}
                <AnimatePresence>
                  {selectedFile && previewUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border-2 border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-[#094d88]">Document Preview</h4>
                        <div className="flex items-center gap-2">
                          <motion.button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl(null);
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <XCircle className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      <div className="aspect-[4/3] bg-white rounded-xl overflow-hidden border border-gray-200">
                        {selectedFile.type.includes('image') ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileType className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-[#094d88] focus:ring-4 focus:ring-[#094d88]/20 transition-all"
                  >
                    <option value="">Select Subject</option>
                    <option value="polity">Indian Polity</option>
                    <option value="economics">Economics</option>
                    <option value="geography">Geography</option>
                    <option value="history">History</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    name="totalMarks"
                    min="0"
                    max="1000"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-[#094d88] focus:ring-4 focus:ring-[#094d88]/20 transition-all"
                    placeholder="Enter total marks"
                  />
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#094d88] to-[#10ac8b] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-medium"
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(9, 77, 136, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-white/20"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-[#094d88] to-[#10ac8b] bg-clip-text text-transparent">
                  Document Preview
                </h3>
                <motion.button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XCircle className="w-6 h-6" />
                </motion.button>
              </div>
              <div className="flex-1 overflow-auto bg-gray-100 rounded-xl p-4">
                {selectedFile?.type.includes('image') ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto mx-auto"
                  />
                ) : (
                  <iframe
                    src={previewUrl}
                    className="w-full h-full min-h-[600px]"
                    title="Document Preview"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
