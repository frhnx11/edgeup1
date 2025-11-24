import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  FileText,
  Users,
  BookOpen,
  Search,
  ChevronRight,
  BarChart2,
  Clock,
  Target,
  Brain,
  LineChart,
  PieChart,
  TrendingUp,
  Activity,
  Download
} from 'lucide-react';

interface ReportSection {
  id: string;
  title: string;
  items: {
    id: string;
    name: string;
    path: string;
  }[];
}

export function ReportsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const reports: ReportSection[] = [
    {
      id: 'exam',
      title: 'Exam Report',
      items: [
        { id: 'completion', name: 'Exam Completion Rate', path: '/admin/reports/exam/completion' },
        { id: 'performance', name: 'Exam Performance Overview', path: '/admin/reports/exam/performance' },
        { id: 'difficulty', name: 'Difficulty Level Distribution', path: '/admin/reports/exam/difficulty' },
        { id: 'response-time', name: 'Question Response Time Analysis', path: '/admin/reports/exam/response-time' }
      ]
    },
    {
      id: 'student',
      title: 'Student Report',
      items: [
        { id: 'overall', name: 'Overall Reports', path: '/admin/reports/student/overall' },
        { id: 'blooms', name: 'Progress Across Blooms Taxonomy', path: '/admin/reports/student/blooms' },
        { id: 'learning', name: 'Learning Objective', path: '/admin/reports/student/learning' }
      ]
    },
    {
      id: 'teacher',
      title: 'Teacher Report',
      items: [
        { id: 'difficulty', name: 'Difficulty Level Distribution', path: '/admin/reports/teacher/difficulty' },
        { id: 'question', name: 'Question Difficulty Analysis', path: '/admin/reports/teacher/question' },
        { id: 'topic', name: 'Topic-wise Performance Breakdown', path: '/admin/reports/teacher/topic' },
        { id: 'time', name: 'Time Management Analysis', path: '/admin/reports/teacher/time' }
      ]
    },
    {
      id: 'course',
      title: 'Course Report',
      items: [
        { id: 'performance', name: 'Performance Trend Analysis', path: '/admin/reports/course/performance' },
        { id: 'response-time', name: 'Question Response Time Analysis', path: '/admin/reports/course/response-time' },
        { id: 'completion', name: 'Exam Completion Rate', path: '/admin/reports/course/completion' },
        { id: 'difficulty', name: 'Difficulty Level Distribution', path: '/admin/reports/course/difficulty' }
      ]
    }
  ];

  const getReportIcon = (reportId: string) => {
    const IconComponent = {
      exam: FileText,
      student: Users,
      teacher: Brain,
      course: BookOpen
    }[reportId] || FileText;

    return <IconComponent className="w-5 h-5" />;
  };

  const getReportColor = (reportId: string) => {
    switch (reportId) {
      case 'exam':
        return 'green';
      case 'student':
        return 'blue';
      case 'teacher':
        return 'orange';
      case 'course':
        return 'purple';
      default:
        return 'indigo';
    }
  };

  const filteredReports = reports.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  const handleReportClick = (path: string) => {
    navigate(path);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Overall Reports</h1>
            <p className="text-[#094d88]">View and analyze comprehensive reports</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors">
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
          />
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map(section => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#094d88]/10 text-[#094d88] rounded-lg flex items-center justify-center">
                    {getReportIcon(section.id)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{section.title}</h2>
                    <div className="mt-2 text-sm text-[#094d88]">
                      Dashboard View
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleReportClick(item.path)}
                    className="w-full flex items-center justify-between p-4 hover:bg-[#094d88]/5 transition-colors"
                  >
                    <span className="text-[#094d88]">{item.name}</span>
                    <ChevronRight className="w-5 h-5 text-[#094d88]" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}