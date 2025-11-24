import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Target,
  BookOpen,
  Clock,
  Brain,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';

interface StudentBatchAnalyticsProps {
  batchId?: string;
}

export function StudentBatchAnalytics({ batchId }: StudentBatchAnalyticsProps) {
  const [selectedBatch, setSelectedBatch] = useState(batchId || 'batch-1');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  // Mock batch data
  const batches = [
    { id: 'batch-1', name: 'Batch A - 2024', students: 45, avgScore: 82 },
    { id: 'batch-2', name: 'Batch B - 2024', students: 38, avgScore: 78 },
    { id: 'batch-3', name: 'Batch C - 2023', students: 52, avgScore: 85 }
  ];

  const batchMetrics = {
    totalStudents: 45,
    activeStudents: 42,
    avgAttendance: 87,
    avgScore: 82,
    completionRate: 78,
    studyHours: 1245,
    atRiskStudents: 5,
    topPerformers: 12
  };

  const progressData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Average Score',
        data: [75, 78, 80, 82],
        borderColor: '#094d88',
        backgroundColor: 'rgba(9, 77, 136, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Completion Rate',
        data: [70, 73, 76, 78],
        borderColor: '#10ac8b',
        backgroundColor: 'rgba(16, 172, 139, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const subjectPerformanceData = {
    labels: ['Polity', 'Economics', 'Geography', 'History', 'Science'],
    datasets: [
      {
        label: 'Average Score',
        data: [85, 78, 82, 80, 76],
        backgroundColor: [
          'rgba(9, 77, 136, 0.8)',
          'rgba(16, 172, 139, 0.8)',
          'rgba(10, 125, 100, 0.8)',
          'rgba(6, 52, 86, 0.8)',
          'rgba(99, 102, 241, 0.8)'
        ],
        borderRadius: 8
      }
    ]
  };

  const students = [
    { id: 1, name: 'Arjun Mehta', score: 92, attendance: 95, trend: 'up', risk: 'low', courses: 5 },
    { id: 2, name: 'Priya Sharma', score: 88, attendance: 90, trend: 'up', risk: 'low', courses: 4 },
    { id: 3, name: 'Raj Kumar', score: 75, attendance: 82, trend: 'same', risk: 'medium', courses: 4 },
    { id: 4, name: 'Sneha Reddy', score: 94, attendance: 98, trend: 'up', risk: 'low', courses: 6 },
    { id: 5, name: 'Deepak Singh', score: 58, attendance: 65, trend: 'down', risk: 'high', courses: 3 },
    { id: 6, name: 'Anita Verma', score: 85, attendance: 88, trend: 'up', risk: 'low', courses: 5 },
    { id: 7, name: 'Vikram Joshi', score: 68, attendance: 72, trend: 'down', risk: 'high', courses: 3 },
    { id: 8, name: 'Pooja Nair', score: 90, attendance: 92, trend: 'up', risk: 'low', courses: 5 }
  ];

  const painPoints = [
    { category: 'Low Attendance', count: 8, severity: 'medium', students: ['Raj Kumar', 'Deepak Singh', 'Vikram Joshi'] },
    { category: 'Poor Test Scores', count: 5, severity: 'high', students: ['Deepak Singh', 'Vikram Joshi'] },
    { category: 'Late Submissions', count: 12, severity: 'low', students: ['Multiple students'] },
    { category: 'Engagement Issues', count: 6, severity: 'medium', students: ['Deepak Singh', 'Raj Kumar'] }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Batch Selector */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-brand-primary" />
            Student Batch Analytics
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive insights into student performance and progress</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
          >
            {batches.map(batch => (
              <option key={batch.id} value={batch.id}>{batch.name}</option>
            ))}
          </select>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold mt-2">{batchMetrics.totalStudents}</p>
              <p className="text-blue-100 text-sm mt-1">{batchMetrics.activeStudents} active</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-medium">Avg. Score</p>
              <p className="text-3xl font-bold mt-2">{batchMetrics.avgScore}%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                <p className="text-green-100 text-sm">+5% from last month</p>
              </div>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-medium">Study Hours</p>
              <p className="text-3xl font-bold mt-2">{batchMetrics.studyHours}</p>
              <p className="text-purple-100 text-sm mt-1">27.7 hrs/student</p>
            </div>
            <Clock className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-red-100 text-sm font-medium">At-Risk Students</p>
              <p className="text-3xl font-bold mt-2">{batchMetrics.atRiskStudents}</p>
              <p className="text-red-100 text-sm mt-1">Needs attention</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Progress Trend</h3>
          <div className="h-64">
            <Line
              data={progressData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, padding: 15 }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Subject Performance</h3>
          <div className="h-64">
            <Bar
              data={subjectPerformanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Pain Points Analysis */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Identified Pain Points & Improvement Areas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {painPoints.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-xl border-2 ${
                point.severity === 'high' ? 'border-red-200 bg-red-50' :
                point.severity === 'medium' ? 'border-orange-200 bg-orange-50' :
                'border-yellow-200 bg-yellow-50'
              }`}
            >
              <h4 className="font-semibold text-gray-900 mb-1">{point.category}</h4>
              <p className="text-2xl font-bold text-gray-900 mb-2">{point.count}</p>
              <p className="text-sm text-gray-600">{point.students.join(', ')}</p>
              <div className={`mt-3 px-2 py-1 rounded-lg text-xs font-medium inline-block ${
                point.severity === 'high' ? 'bg-red-200 text-red-800' :
                point.severity === 'medium' ? 'bg-orange-200 text-orange-800' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                {point.severity.toUpperCase()} Priority
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Student Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Courses</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-semibold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${
                      student.score >= 85 ? 'text-green-600' :
                      student.score >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {student.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{student.attendance}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{student.courses}</span>
                  </td>
                  <td className="px-6 py-4">
                    {student.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                    {student.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
                    {student.trend === 'same' && <Activity className="w-5 h-5 text-gray-400" />}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.risk === 'low' ? 'bg-green-100 text-green-800' :
                      student.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.risk.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
