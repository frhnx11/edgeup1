import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  TrendingUp,
  Users,
  BookOpen,
  Target,
  Clock,
  Calendar,
  Brain,
  ChevronUp,
  BarChart2,
  PieChart,
  LineChart,
  Download
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<string>('performance');

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

  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Average Score',
        data: [75, 78, 82, 85, 88],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
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

  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [1200, 1350, 1250, 1400, 1300, 900, 800],
        backgroundColor: 'rgba(9, 77, 136, 0.8)'
      }
    ]
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Monitor platform performance and trends</p>
          </div>
          <div className="flex gap-4">
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#094d88]/10 text-[#094d88] rounded-lg flex items-center justify-center">
                  <metric.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <ChevronUp className="w-4 h-4" />
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
              <h2 className="text-lg font-semibold">Performance Trend</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <LineChart className="w-4 h-4 text-[#094d88]" />
                <span>Line Chart</span>
              </div>
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
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <PieChart className="w-4 h-4 text-[#094d88]" />
                <span>Pie Chart</span>
              </div>
            </div>
            <div className="h-80">
              <Pie
                data={subjectDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>

          {/* User Engagement */}
          <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">User Engagement</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BarChart2 className="w-4 h-4 text-[#094d88]" />
                <span>Bar Chart</span>
              </div>
            </div>
            <div className="h-80">
              <Bar
                data={engagementData}
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
      </div>
    </AdminLayout>
  );
}