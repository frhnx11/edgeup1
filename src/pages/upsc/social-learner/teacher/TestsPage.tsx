import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Clock,
  Users,
  BarChart2,
  Calendar,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Columns
} from 'lucide-react';

interface Exam {
  id: string;
  subject: string;
  title: string;
  course: string;
  description: string;
  totalMarks: number;
  status: 'Pending' | 'Evaluated' | 'QP not assigned';
  type: 'Internal' | 'External';
  mode: 'Online' | 'Offline';
  scheduledAt?: string;
  scheduledTime?: string;
  view?: 'Question';
}

export function TestsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const exams: Exam[] = [
    {
      id: '1',
      subject: 'TTest exan for demo',
      title: 'TTest exan for demo',
      course: 'Science8 - Science-8th',
      description: 'Test',
      totalMarks: 40,
      status: 'Pending',
      type: 'Internal',
      mode: 'Offline'
    },
    {
      id: '2',
      subject: 'English',
      title: 'PERIODIC RETEST III - English - VIII',
      course: 'ENGLISH8 - ENGLISH-8th',
      description: 'Retest',
      totalMarks: 40,
      status: 'Pending',
      type: 'Internal',
      mode: 'Offline'
    },
    {
      id: '3',
      subject: 'English',
      title: 'PERIODIC RETEST III - English - VII',
      course: 'ENGLISH7 - ENGLISH-7th',
      description: 'Retest',
      totalMarks: 40,
      status: 'Pending',
      type: 'Internal',
      mode: 'Offline'
    },
    {
      id: '4',
      subject: 'English',
      title: 'PERIODIC RETEST III - English - VI',
      course: 'ENGLISH6 - ENGLISH-6th',
      description: 'Retest',
      totalMarks: 40,
      status: 'Pending',
      type: 'Internal',
      mode: 'Offline'
    },
    {
      id: '5',
      subject: 'MATHEMATICS',
      title: 'PERIODIC RETEST III - MATHEMATICS - VIII',
      course: 'MATHEMATICS8 - MATHEMATICS-8th',
      description: 'Retest',
      totalMarks: 40,
      status: 'Evaluated',
      type: 'Internal',
      mode: 'Offline',
      scheduledAt: '2025-01-09',
      scheduledTime: '11:15 AM - 12:45 PM',
      view: 'Question'
    },
    {
      id: '6',
      subject: 'MATHEMATICS',
      title: 'PERIODIC RETEST III - MATHEMATICS - VII',
      course: 'MATHEMATICS7 - MATHEMATICS-7th',
      description: 'Retest',
      totalMarks: 40,
      status: 'Evaluated',
      type: 'Internal',
      mode: 'Offline',
      scheduledAt: '2025-01-09',
      scheduledTime: '01:00 PM - 02:30 PM',
      view: 'Question'
    },
    {
      id: '7',
      subject: 'SOCIAL STUDIES',
      title: 'PERIODIC RETEST - SOCIAL STUDIES - VII',
      course: 'SocialScience7 - SOCAL SCIENCE -7th',
      description: 'Retest',
      totalMarks: 40,
      status: 'Evaluated',
      type: 'Internal',
      mode: 'Offline',
      scheduledAt: '2025-01-09',
      scheduledTime: '12:31 PM - 02:01 PM',
      view: 'Question'
    },
    {
      id: '8',
      subject: 'Science',
      title: 'PERIODIC RETEST III - Science - VI',
      course: 'Science6 - Science-6th',
      description: 'Retest',
      totalMarks: 40,
      status: 'Evaluated',
      type: 'Internal',
      mode: 'Offline',
      scheduledAt: '2025-01-09',
      scheduledTime: '02:01 PM - 03:31 PM',
      view: 'Question'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Evaluated':
        return 'bg-[#10ac8b]/10 text-[#10ac8b]';
      case 'Pending':
        return 'bg-[#094d88]/10 text-[#094d88]';
      default:
        return 'bg-[#094d88]/10 text-[#094d88]';
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || exam.status === selectedStatus;
    const matchesType = selectedType === 'all' || exam.type === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exam</h1>
            <p className="text-[#094d88]">{filteredExams.length} results found</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Exam
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Show Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Columns className="w-4 h-4" />
              Columns
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedStatus === 'all'
                ? 'bg-[#094d88] text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            All (31)
          </button>
          <button
            onClick={() => setSelectedStatus('Published')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedStatus === 'Published'
                ? 'bg-[#094d88] text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Published (27)
          </button>
          <button
            onClick={() => setSelectedStatus('Unpublished')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedStatus === 'Unpublished'
                ? 'bg-[#094d88] text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Unpublished (4)
          </button>
        </div>

        {/* Exams Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Mark
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evaluation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExams.map((exam) => (
                  <tr 
                    key={exam.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/exam/${exam.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#094d88]">{exam.subject}</span>
                        <div className="flex gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {exam.type}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {exam.mode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.totalMarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.view && (
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded bg-white hover:bg-[#094d88]/5 transition-colors">
                          <span className="text-[#094d88]">{exam.view}</span>
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.scheduledAt && (
                        <div className="text-[#094d88]">
                          <div>{exam.scheduledAt}</div>
                          <div className="text-gray-500">{exam.scheduledTime}</div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}