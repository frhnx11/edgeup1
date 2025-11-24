import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Send,
  Download,
  Eye,
  Filter,
  Search,
  AlertCircle,
  TrendingUp,
  Calendar,
  RefreshCw
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  testStatus: 'completed' | 'in-progress' | 'not-started';
  testNumber: string;
  completionDate?: string;
  startedDate?: string;
  timeSpent?: number;
  score?: number;
}

export function TestCompletionTracker() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<string>('TEST001');

  // Sample data
  useEffect(() => {
    setStudents([
      {
        id: '1',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        testStatus: 'completed',
        testNumber: 'TEST001',
        completionDate: '2024-01-15',
        timeSpent: 45,
        score: 92
      },
      {
        id: '2',
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        testStatus: 'completed',
        testNumber: 'TEST001',
        completionDate: '2024-01-15',
        timeSpent: 50,
        score: 85
      },
      {
        id: '3',
        name: 'Amit Singh',
        email: 'amit.singh@example.com',
        testStatus: 'in-progress',
        testNumber: 'TEST001',
        startedDate: '2024-01-16',
        timeSpent: 25
      },
      {
        id: '4',
        name: 'Sneha Verma',
        email: 'sneha.verma@example.com',
        testStatus: 'not-started',
        testNumber: 'TEST001'
      },
      {
        id: '5',
        name: 'Karan Mehta',
        email: 'karan.mehta@example.com',
        testStatus: 'completed',
        testNumber: 'TEST001',
        completionDate: '2024-01-14',
        timeSpent: 52,
        score: 78
      },
      {
        id: '6',
        name: 'Anita Desai',
        email: 'anita.desai@example.com',
        testStatus: 'not-started',
        testNumber: 'TEST001'
      },
      {
        id: '7',
        name: 'Vikram Rao',
        email: 'vikram.rao@example.com',
        testStatus: 'in-progress',
        testNumber: 'TEST001',
        startedDate: '2024-01-16',
        timeSpent: 15
      }
    ]);
  }, []);

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesStatus = filterStatus === 'all' || student.testStatus === filterStatus;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTest = student.testNumber === selectedTest;
    return matchesStatus && matchesSearch && matchesTest;
  });

  // Calculate statistics
  const totalStudents = students.length;
  const completedCount = students.filter(s => s.testStatus === 'completed').length;
  const inProgressCount = students.filter(s => s.testStatus === 'in-progress').length;
  const notStartedCount = students.filter(s => s.testStatus === 'not-started').length;
  const completionRate = (completedCount / totalStudents) * 100;

  // Handle bulk actions
  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSendReminders = () => {
    const studentsToRemind = students.filter(s => 
      selectedStudents.includes(s.id) && s.testStatus !== 'completed'
    );
    alert(`Sending reminders to ${studentsToRemind.length} students...`);
    setSelectedStudents([]);
  };

  const handleExportReport = () => {
    const csvContent = [
      ['Student Name', 'Email', 'Test Number', 'Status', 'Completion Date', 'Time Spent', 'Score'],
      ...filteredStudents.map(s => [
        s.name,
        s.email,
        s.testNumber,
        s.testStatus,
        s.completionDate || '-',
        s.timeSpent ? `${s.timeSpent} min` : '-',
        s.score || '-'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test_completion_report.csv';
    a.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'not-started':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-started':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalStudents}</p>
          <p className="text-xs text-gray-500 mt-1">Enrolled in {selectedTest}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              {completionRate.toFixed(0)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Completed</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{completedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Tests finished</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{inProgressCount}</p>
          <p className="text-xs text-gray-500 mt-1">Currently taking test</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">Not Started</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{notStartedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Yet to begin</p>
        </div>
      </div>

      {/* Completion Rate Gauge */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Completion Rate</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
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
                stroke={completionRate >= 80 ? '#10B981' : completionRate >= 60 ? '#F59E0B' : '#EF4444'}
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - completionRate / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-900">{completionRate.toFixed(0)}%</span>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Student Status</h2>
              <p className="text-gray-600 text-sm mt-1">Track individual test completion status</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Test Selector */}
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="TEST001">TEST001</option>
                <option value="TEST002">TEST002</option>
                <option value="TEST003">TEST003</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="not-started">Not Started</option>
              </select>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-3">
              <button
                onClick={handleSendReminders}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Send className="w-4 h-4" />
                Send Reminders
              </button>
              <button
                onClick={handleExportReport}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export Selected
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === filteredStudents.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Spent
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(student.testStatus)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(student.testStatus)}`}>
                        {student.testStatus.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.testNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.completionDate ? new Date(student.completionDate).toLocaleDateString() :
                     student.startedDate ? `Started ${new Date(student.startedDate).toLocaleDateString()}` :
                     '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900">
                    {student.timeSpent ? `${student.timeSpent} min` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    {student.score ? (
                      <span className={`font-medium ${
                        student.score >= 80 ? 'text-green-600' :
                        student.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {student.score}%
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Full Report
          </button>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Eye className="w-4 h-4" />
              View Detailed Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}