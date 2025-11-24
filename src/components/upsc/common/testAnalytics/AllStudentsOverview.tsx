import { useState, useEffect } from 'react';
import { 
  Download, 
  ArrowUpDown, 
  Filter,
  Calendar,
  ChevronDown,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Student {
  id: string;
  name: string;
  testNumber: string;
  subject: string;
  level: 'Elementary' | 'Intermediate' | 'Advanced';
  totalScore: number;
  accuracy: number;
  gsScore: number;
  csatScore: number;
  date: string;
}

interface AllStudentsOverviewProps {
  searchQuery: string;
  onStudentSelect: (studentId: string) => void;
}

export function AllStudentsOverview({ searchQuery, onStudentSelect }: AllStudentsOverviewProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'asc' | 'desc' } | null>(null);
  
  // Filter states
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedTest, setSelectedTest] = useState<string>('all');

  // Sample data
  useEffect(() => {
    const sampleStudents: Student[] = [
      {
        id: '1',
        name: 'Rahul Sharma',
        testNumber: 'TEST001',
        subject: 'Mathematics',
        level: 'Advanced',
        totalScore: 92,
        accuracy: 88.5,
        gsScore: 45,
        csatScore: 47,
        date: '2024-01-15'
      },
      {
        id: '2',
        name: 'Priya Patel',
        testNumber: 'TEST001',
        subject: 'Science',
        level: 'Intermediate',
        totalScore: 85,
        accuracy: 82.3,
        gsScore: 42,
        csatScore: 43,
        date: '2024-01-15'
      },
      {
        id: '3',
        name: 'Amit Singh',
        testNumber: 'TEST002',
        subject: 'English',
        level: 'Elementary',
        totalScore: 78,
        accuracy: 75.6,
        gsScore: 38,
        csatScore: 40,
        date: '2024-01-16'
      },
      {
        id: '4',
        name: 'Sneha Verma',
        testNumber: 'TEST002',
        subject: 'Mathematics',
        level: 'Advanced',
        totalScore: 95,
        accuracy: 92.8,
        gsScore: 48,
        csatScore: 47,
        date: '2024-01-16'
      },
      {
        id: '5',
        name: 'Karan Mehta',
        testNumber: 'TEST003',
        subject: 'Science',
        level: 'Intermediate',
        totalScore: 82,
        accuracy: 79.4,
        gsScore: 40,
        csatScore: 42,
        date: '2024-01-17'
      }
    ];
    setStudents(sampleStudents);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...students];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(student => student.subject === selectedSubject);
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(student => student.level === selectedLevel);
    }

    // Apply test filter
    if (selectedTest !== 'all') {
      filtered = filtered.filter(student => student.testNumber === selectedTest);
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(student => {
        const studentDate = new Date(student.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return studentDate >= startDate && studentDate <= endDate;
      });
    }

    setFilteredStudents(filtered);
  }, [students, searchQuery, selectedSubject, selectedLevel, selectedTest, dateRange]);

  // Sorting logic
  const handleSort = (key: keyof Student) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredStudents].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredStudents(sorted);
  };

  // Export to Excel
  const handleExport = () => {
    // In a real app, you would use a library like xlsx
    const csvContent = [
      ['Student Name', 'Test Number', 'Subject', 'Level', 'Total Score', 'Accuracy %', 'GS Score', 'CSAT Score'],
      ...filteredStudents.map(s => [
        s.name, s.testNumber, s.subject, s.level, 
        s.totalScore, s.accuracy, s.gsScore, s.csatScore
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test_analytics.csv';
    a.click();
  };

  // Chart data
  const scoreDistributionData = {
    labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
    datasets: [{
      label: 'Students',
      data: [
        filteredStudents.filter(s => s.totalScore <= 20).length,
        filteredStudents.filter(s => s.totalScore > 20 && s.totalScore <= 40).length,
        filteredStudents.filter(s => s.totalScore > 40 && s.totalScore <= 60).length,
        filteredStudents.filter(s => s.totalScore > 60 && s.totalScore <= 80).length,
        filteredStudents.filter(s => s.totalScore > 80).length,
      ],
      backgroundColor: '#3B82F6',
      borderRadius: 8
    }]
  };

  const subjectPerformanceData = {
    labels: [...new Set(students.map(s => s.subject))],
    datasets: [{
      label: 'Average Score',
      data: [...new Set(students.map(s => s.subject))].map(subject => {
        const subjectStudents = filteredStudents.filter(s => s.subject === subject);
        return subjectStudents.length > 0
          ? subjectStudents.reduce((sum, s) => sum + s.totalScore, 0) / subjectStudents.length
          : 0;
      }),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      borderRadius: 8
    }]
  };

  const levelAnalysisData = {
    labels: ['Elementary', 'Intermediate', 'Advanced'],
    datasets: [{
      data: [
        filteredStudents.filter(s => s.level === 'Elementary').length,
        filteredStudents.filter(s => s.level === 'Intermediate').length,
        filteredStudents.filter(s => s.level === 'Advanced').length,
      ],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="Elementary">Elementary</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Test Number Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Number</label>
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">All Tests</option>
              <option value="TEST001">TEST001</option>
              <option value="TEST002">TEST002</option>
              <option value="TEST003">TEST003</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Student Performance Data</h2>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export to Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Student Name/ID
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('testNumber')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Test Number
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('subject')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Subject
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('level')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Level
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleSort('totalScore')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Total Score
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleSort('accuracy')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Accuracy %
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleSort('gsScore')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    GS Score
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleSort('csatScore')}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    CSAT Score
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onStudentSelect(student.id)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-500">ID: {student.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.testNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      student.level === 'Elementary' ? 'bg-green-100 text-green-800' :
                      student.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                    {student.totalScore}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span className={`font-medium ${
                      student.accuracy >= 90 ? 'text-green-600' :
                      student.accuracy >= 75 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {student.accuracy}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900">{student.gsScore}</td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900">{student.csatScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Score Distribution</h3>
          </div>
          <div className="h-64">
            <Bar
              data={scoreDistributionData}
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
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Subject-wise Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Subject Performance</h3>
          </div>
          <div className="h-64">
            <Bar
              data={subjectPerformanceData}
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

        {/* Level-wise Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Level Analysis</h3>
          </div>
          <div className="h-64">
            <Pie
              data={levelAnalysisData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}