import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  BookOpen,
  Target,
  AlertTriangle,
  CheckCircle,
  Star,
  Trophy,
  Activity,
  BarChart3,
  Eye,
  MessageSquare,
  ThumbsUp,
  GraduationCap
} from 'lucide-react';
import { Bar, Radar, Line } from 'react-chartjs-2';

export function MentorAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [comparisonMode, setComparisonMode] = useState<'all' | 'top' | 'needsimprovement'>('all');

  // Mock mentor data
  const mentors = [
    {
      id: 1,
      name: 'Dr. Guna',
      avatar: '/Guna.png',
      subjects: ['Indian Polity', 'Constitution'],
      students: 45,
      avgRating: 4.8,
      responseTime: 2.3,
      sessionCount: 156,
      studentSatisfaction: 94,
      completionRate: 89,
      trend: 'up',
      performance: 92,
      pascoScore: 88,
      strengths: ['Clear Communication', 'Timely Feedback', 'Student Engagement'],
      painPoints: ['Session Scheduling', 'Response Delays on Weekends'],
      improvement: '+12%'
    },
    {
      id: 2,
      name: 'Prof. Ravikumar',
      avatar: '/Ravikumar.png',
      subjects: ['Economics', 'Current Affairs'],
      students: 38,
      avgRating: 4.6,
      responseTime: 3.1,
      sessionCount: 142,
      studentSatisfaction: 88,
      completionRate: 85,
      trend: 'up',
      performance: 87,
      pascoScore: 82,
      strengths: ['Subject Expertise', 'Structured Teaching'],
      painPoints: ['Student Engagement', 'Feedback Frequency'],
      improvement: '+8%'
    },
    {
      id: 3,
      name: 'Ms. Israel',
      avatar: '/Israel.png',
      subjects: ['Geography', 'Environment'],
      students: 52,
      avgRating: 4.9,
      responseTime: 1.8,
      sessionCount: 178,
      studentSatisfaction: 96,
      completionRate: 92,
      trend: 'up',
      performance: 95,
      pascoScore: 91,
      strengths: ['Exceptional Engagement', 'Quick Response', 'Innovative Methods'],
      painPoints: ['None Significant'],
      improvement: '+15%'
    },
    {
      id: 4,
      name: 'Dr. Sharma',
      avatar: 'DS',
      subjects: ['History', 'Art & Culture'],
      students: 29,
      avgRating: 4.2,
      responseTime: 4.5,
      sessionCount: 98,
      studentSatisfaction: 76,
      completionRate: 72,
      trend: 'down',
      performance: 73,
      pascoScore: 68,
      strengths: ['Subject Knowledge'],
      painPoints: ['Low Engagement', 'Delayed Responses', 'Completion Rate'],
      improvement: '-5%'
    },
    {
      id: 5,
      name: 'Prof. Gupta',
      avatar: 'PG',
      subjects: ['Science & Technology', 'Innovation'],
      students: 41,
      avgRating: 4.7,
      responseTime: 2.6,
      sessionCount: 134,
      studentSatisfaction: 90,
      completionRate: 88,
      trend: 'up',
      performance: 89,
      pascoScore: 85,
      strengths: ['Modern Teaching', 'Tech Integration'],
      painPoints: ['Weekend Availability'],
      improvement: '+10%'
    }
  ];

  const comparisonData = {
    labels: mentors.map(m => m.name),
    datasets: [
      {
        label: 'Student Satisfaction',
        data: mentors.map(m => m.studentSatisfaction),
        backgroundColor: 'rgba(9, 77, 136, 0.8)',
        borderRadius: 8
      },
      {
        label: 'Completion Rate',
        data: mentors.map(m => m.completionRate),
        backgroundColor: 'rgba(16, 172, 139, 0.8)',
        borderRadius: 8
      }
    ]
  };

  const performanceRadarData = {
    labels: ['Student Satisfaction', 'Response Time', 'Session Quality', 'Completion Rate', 'Engagement', 'PASCO Score'],
    datasets: mentors.slice(0, 3).map((mentor, idx) => ({
      label: mentor.name,
      data: [
        mentor.studentSatisfaction,
        100 - (mentor.responseTime * 10),
        mentor.avgRating * 20,
        mentor.completionRate,
        mentor.performance,
        mentor.pascoScore
      ],
      borderColor: ['#094d88', '#10ac8b', '#6366f1'][idx],
      backgroundColor: [`rgba(9, 77, 136, 0.1)`, `rgba(16, 172, 139, 0.1)`, `rgba(99, 102, 241, 0.1)`][idx],
      pointBackgroundColor: ['#094d88', '#10ac8b', '#6366f1'][idx]
    }))
  };

  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Avg. Student Satisfaction',
        data: [82, 85, 87, 88, 90, 91],
        borderColor: '#094d88',
        backgroundColor: 'rgba(9, 77, 136, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Avg. Completion Rate',
        data: [78, 80, 82, 83, 85, 87],
        borderColor: '#10ac8b',
        backgroundColor: 'rgba(16, 172, 139, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const filteredMentors = mentors.filter(mentor => {
    if (comparisonMode === 'top') return mentor.performance >= 85;
    if (comparisonMode === 'needsimprovement') return mentor.performance < 80;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-brand-primary" />
            Mentor Performance Analytics
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive mentor comparison and insights</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={comparisonMode}
            onChange={(e) => setComparisonMode(e.target.value as any)}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
          >
            <option value="all">All Mentors</option>
            <option value="top">Top Performers</option>
            <option value="needsimprovement">Needs Improvement</option>
          </select>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand-primary to-brand-dark text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Mentors</p>
              <p className="text-3xl font-bold mt-2">{mentors.length}</p>
              <p className="text-blue-100 text-sm mt-1">Across {new Set(mentors.flatMap(m => m.subjects)).size} subjects</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-medium">Avg. Satisfaction</p>
              <p className="text-3xl font-bold mt-2">
                {(mentors.reduce((acc, m) => acc + m.studentSatisfaction, 0) / mentors.length).toFixed(1)}%
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                <p className="text-green-100 text-sm">+7% this month</p>
              </div>
            </div>
            <Star className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Sessions</p>
              <p className="text-3xl font-bold mt-2">
                {mentors.reduce((acc, m) => acc + m.sessionCount, 0)}
              </p>
              <p className="text-purple-100 text-sm mt-1">This quarter</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-100 text-sm font-medium">Avg. Rating</p>
              <p className="text-3xl font-bold mt-2">
                {(mentors.reduce((acc, m) => acc + m.avgRating, 0) / mentors.length).toFixed(1)}
              </p>
              <div className="flex items-center gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-200 text-amber-200" />
                ))}
              </div>
            </div>
            <Award className="w-8 h-8 text-amber-200" />
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparison Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Comparison</h3>
          <div className="h-80">
            <Bar
              data={comparisonData}
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

        {/* Radar Comparison */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Multi-Metric Comparison</h3>
          <div className="h-80">
            <Radar
              data={performanceRadarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { stepSize: 20 }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Mentor Performance Trends</h3>
        <div className="h-80">
          <Line
            data={trendData}
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

      {/* Detailed Mentor Cards */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Detailed Mentor Performance</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredMentors.map((mentor, idx) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Mentor Info */}
                <div className="flex items-start gap-4 lg:w-1/3">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {mentor.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{mentor.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{mentor.subjects.join(', ')}</p>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-gray-900">{mentor.avgRating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{mentor.students} students</p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="lg:w-1/3 grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Satisfaction</p>
                    <p className="text-lg font-bold text-blue-600">{mentor.studentSatisfaction}%</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Completion</p>
                    <p className="text-lg font-bold text-green-600">{mentor.completionRate}%</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">PASCO Score</p>
                    <p className="text-lg font-bold text-purple-600">{mentor.pascoScore}%</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Sessions</p>
                    <p className="text-lg font-bold text-amber-600">{mentor.sessionCount}</p>
                  </div>
                </div>

                {/* Strengths & Pain Points */}
                <div className="lg:w-1/3 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Strengths
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.strengths.map((strength, i) => (
                        <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-orange-500" />
                      Pain Points
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.painPoints.map((point, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-600">Performance Trend</span>
                    <div className="flex items-center gap-1">
                      {mentor.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-bold ${
                        mentor.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {mentor.improvement}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6 rounded-2xl shadow-lg text-white">
        <h3 className="text-xl font-bold mb-4">Actionable Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur p-4 rounded-xl">
            <Trophy className="w-6 h-6 mb-2" />
            <h4 className="font-semibold mb-1">Recognize Top Performers</h4>
            <p className="text-sm text-white/90">Ms. Israel shows exceptional metrics across all categories</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-xl">
            <Target className="w-6 h-6 mb-2" />
            <h4 className="font-semibold mb-1">Focus on Improvements</h4>
            <p className="text-sm text-white/90">Dr. Sharma needs support with engagement and response time</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-xl">
            <Activity className="w-6 h-6 mb-2" />
            <h4 className="font-semibold mb-1">Overall Trend</h4>
            <p className="text-sm text-white/90">85% of mentors showing positive improvement trends</p>
          </div>
        </div>
      </div>
    </div>
  );
}
