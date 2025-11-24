import { useState, useEffect } from 'react';
import { 
  User, 
  TrendingUp, 
  Target, 
  Award,
  Clock,
  BookOpen,
  BarChart3,
  Activity,
  Calendar,
  ChevronDown
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Radar, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface IndividualStudentAnalysisProps {
  studentId: string | null;
  searchQuery: string;
}

interface TestHistory {
  date: string;
  testNumber: string;
  subject: string;
  score: number;
  accuracy: number;
  timeTaken: number;
}

interface SubjectBreakdown {
  subject: string;
  totalTests: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  trend: 'up' | 'down' | 'stable';
}

export function IndividualStudentAnalysis({ studentId, searchQuery }: IndividualStudentAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'subjects' | 'questions'>('history');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [testHistory, setTestHistory] = useState<TestHistory[]>([]);
  const [subjectBreakdown, setSubjectBreakdown] = useState<SubjectBreakdown[]>([]);

  // Sample student data
  useEffect(() => {
    if (studentId) {
      // In a real app, fetch student data based on studentId
      setSelectedStudent({
        id: studentId,
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        grade: '12th',
        section: 'A',
        enrollmentDate: '2023-06-15',
        profileImage: null
      });

      // Sample test history
      setTestHistory([
        { date: '2024-01-15', testNumber: 'TEST001', subject: 'Mathematics', score: 92, accuracy: 88.5, timeTaken: 45 },
        { date: '2024-01-10', testNumber: 'TEST002', subject: 'Science', score: 85, accuracy: 82.3, timeTaken: 50 },
        { date: '2024-01-05', testNumber: 'TEST003', subject: 'English', score: 78, accuracy: 75.6, timeTaken: 40 },
        { date: '2023-12-28', testNumber: 'TEST004', subject: 'Mathematics', score: 88, accuracy: 85.2, timeTaken: 48 },
        { date: '2023-12-20', testNumber: 'TEST005', subject: 'Science', score: 82, accuracy: 79.8, timeTaken: 52 }
      ]);

      // Sample subject breakdown
      setSubjectBreakdown([
        { subject: 'Mathematics', totalTests: 8, averageScore: 88, highestScore: 95, lowestScore: 75, trend: 'up' },
        { subject: 'Science', totalTests: 7, averageScore: 82, highestScore: 90, lowestScore: 72, trend: 'stable' },
        { subject: 'English', totalTests: 6, averageScore: 78, highestScore: 85, lowestScore: 70, trend: 'down' },
        { subject: 'History', totalTests: 5, averageScore: 85, highestScore: 92, lowestScore: 78, trend: 'up' }
      ]);
    }
  }, [studentId]);

  if (!studentId) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Student Selected</h3>
        <p className="text-gray-600">
          Please select a student from the overview table to view their detailed analysis
        </p>
      </div>
    );
  }

  if (!selectedStudent) {
    return <div>Loading...</div>;
  }

  // Calculate metrics
  const overallAccuracy = testHistory.reduce((sum, test) => sum + test.accuracy, 0) / testHistory.length;
  const testsAttempted = testHistory.length;
  const averageScore = testHistory.reduce((sum, test) => sum + test.score, 0) / testHistory.length;
  const improvementRate = ((testHistory[0]?.score - testHistory[testHistory.length - 1]?.score) / testHistory[testHistory.length - 1]?.score * 100) || 0;

  // Chart data
  const performanceTrendData = {
    labels: testHistory.map(test => new Date(test.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Score',
        data: testHistory.map(test => test.score),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Accuracy %',
        data: testHistory.map(test => test.accuracy),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const subjectStrengthData = {
    labels: subjectBreakdown.map(s => s.subject),
    datasets: [{
      label: 'Average Score',
      data: subjectBreakdown.map(s => s.averageScore),
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: '#3B82F6',
      borderWidth: 2,
      pointBackgroundColor: '#3B82F6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  };

  const levelPerformanceData = {
    labels: ['Elementary', 'Intermediate', 'Advanced'],
    datasets: [{
      label: 'Average Score',
      data: [75, 82, 88],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderRadius: 8
    }]
  };

  const currentAffairsGauge = 78; // Percentage

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {selectedStudent.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
            <p className="text-gray-600">ID: {selectedStudent.id} | Grade: {selectedStudent.grade} | Section: {selectedStudent.section}</p>
            <p className="text-sm text-gray-500 mt-1">Enrolled since {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-blue-600" />
            <span className={`text-sm font-medium ${improvementRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {improvementRate > 0 ? '+' : ''}{improvementRate.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Overall Accuracy</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{overallAccuracy.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">Tests Attempted</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{testsAttempted}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">Average Score</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{averageScore.toFixed(1)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-amber-600" />
            <span className="text-sm font-medium text-green-600">+{improvementRate.toFixed(1)}%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Improvement Rate</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">Good</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Performance Trend Over Time
          </h3>
          <div className="h-80">
            <Line
              data={performanceTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Subject-wise Strengths */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            Subject-wise Strengths
          </h3>
          <div className="h-80">
            <Radar
              data={subjectStrengthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      stepSize: 20
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Level-wise Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Level-wise Performance
          </h3>
          <div className="h-80">
            <Bar
              data={levelPerformanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Current Affairs Performance Gauge */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-600" />
            Current Affairs Performance
          </h3>
          <div className="flex items-center justify-center h-72">
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#E5E7EB"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#F59E0B"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - currentAffairsGauge / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{currentAffairsGauge}%</span>
                <span className="text-sm text-gray-600">Performance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Test History
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subjects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Subject Breakdown
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'questions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Question-level Analysis
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'history' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Test Number</th>
                    <th className="pb-3">Subject</th>
                    <th className="pb-3 text-center">Score</th>
                    <th className="pb-3 text-center">Accuracy</th>
                    <th className="pb-3 text-center">Time Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {testHistory.map((test, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 text-sm text-gray-900">
                        {new Date(test.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-sm text-gray-900">{test.testNumber}</td>
                      <td className="py-3 text-sm text-gray-900">{test.subject}</td>
                      <td className="py-3 text-sm text-center font-medium text-gray-900">
                        {test.score}
                      </td>
                      <td className="py-3 text-sm text-center">
                        <span className={`font-medium ${
                          test.accuracy >= 85 ? 'text-green-600' :
                          test.accuracy >= 70 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {test.accuracy}%
                        </span>
                      </td>
                      <td className="py-3 text-sm text-center text-gray-900">
                        {test.timeTaken} min
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="space-y-4">
              {subjectBreakdown.map((subject, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                    <span className={`flex items-center gap-1 text-sm font-medium ${
                      subject.trend === 'up' ? 'text-green-600' :
                      subject.trend === 'down' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {subject.trend === 'up' ? '↑' : subject.trend === 'down' ? '↓' : '→'}
                      {subject.trend === 'up' ? 'Improving' : subject.trend === 'down' ? 'Declining' : 'Stable'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Tests</p>
                      <p className="font-semibold text-gray-900">{subject.totalTests}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Average Score</p>
                      <p className="font-semibold text-gray-900">{subject.averageScore}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Highest Score</p>
                      <p className="font-semibold text-green-600">{subject.highestScore}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Lowest Score</p>
                      <p className="font-semibold text-red-600">{subject.lowestScore}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="text-center py-8 text-gray-500">
              <p>Question-level analysis coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}