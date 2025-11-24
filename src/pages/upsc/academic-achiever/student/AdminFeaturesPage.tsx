import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  Users,
  BookOpen,
  Target,
  Activity,
  Settings,
  Search,
  Filter,
  ChevronRight,
  BarChart2,
  TrendingUp,
  Clock,
  Brain,
  Download
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function AdminFeaturesPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Average Score',
        data: [75, 78, 82, 85, 88],
        borderColor: 'rgb(9, 77, 136)',
        backgroundColor: 'rgba(9, 77, 136, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const subjectDistributionData = {
    labels: ['Indian Polity', 'Economics', 'Geography', 'History'],
    datasets: [
      {
        label: 'Student Distribution',
        data: [45, 35, 30, 40],
        backgroundColor: [
          'rgba(9, 77, 136, 0.8)',
          'rgba(16, 172, 139, 0.8)',
          'rgba(10, 125, 100, 0.8)',
          'rgba(6, 52, 86, 0.8)'
        ]
      }
    ]
  };

  const metrics = [
    {
      title: 'Total Students',
      value: '2,458',
      trend: '+12% this month',
      icon: Users,
      color: 'indigo'
    },
    {
      title: 'Active Courses',
      value: '24',
      trend: '4 new added',
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Avg. Test Score',
      value: '82%',
      trend: '+5% improvement',
      icon: Target,
      color: 'yellow'
    },
    {
      title: 'Study Hours',
      value: '12,845',
      trend: 'Last 30 days',
      icon: Clock,
      color: 'red'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      user: 'John Doe',
      action: 'Completed test',
      subject: 'Indian Polity',
      score: '85%',
      time: '2 hours ago',
      type: 'test'
    },
    {
      id: '2',
      user: 'Jane Smith',
      action: 'Started course',
      subject: 'Economics',
      time: '3 hours ago',
      type: 'course'
    },
    {
      id: '3',
      user: 'Mike Johnson',
      action: 'Submitted assignment',
      subject: 'Geography',
      time: '5 hours ago',
      type: 'assignment'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage platform performance</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-${metric.color}-50 text-${metric.color}-600 rounded-lg flex items-center justify-center`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {metric.trend}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Student Performance</h2>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="h-80">
              <Line
                data={performanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
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

          {/* Subject Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Subject Distribution</h2>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
              >
                <option value="all">All Subjects</option>
                <option value="polity">Indian Polity</option>
                <option value="economics">Economics</option>
                <option value="geography">Geography</option>
                <option value="history">History</option>
              </select>
            </div>
            <div className="h-80">
              <Bar
                data={subjectDistributionData}
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
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <button className="text-sm text-[#094d88] hover:text-[#10ac8b]">View All</button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {recentActivities.map(activity => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'test' 
                        ? 'bg-[#094d88]/10 text-[#094d88]'
                        : 'bg-[#10ac8b]/10 text-[#10ac8b]'
                    }`}>
                      {activity.type === 'test' ? <Target className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-medium">{activity.user}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">{activity.action}</span>
                        <span className="text-sm text-indigo-600">{activity.subject}</span>
                        {activity.score && (
                          <span className="text-sm text-green-600">{activity.score}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{activity.time}</span>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5 text-[#094d88]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}