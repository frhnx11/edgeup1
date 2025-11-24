import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  Search,
  Filter,
  Download,
  ArrowLeft,
  ChevronDown,
  Columns
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface StudentData {
  sNo: number;
  studentId: string;
  studentName: string;
  gender: string;
  courseName: string;
  totalQuestions: number;
  totalMarksForCourse: number;
  totalMarksObtained: number;
}

export function TeacherTopicPerformancePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const students: StudentData[] = [
    {
      sNo: 1,
      studentId: 'S001',
      studentName: 'John Doe',
      gender: 'Male',
      courseName: 'Mathematics',
      totalQuestions: 50,
      totalMarksForCourse: 100,
      totalMarksObtained: 85
    },
    {
      sNo: 2,
      studentId: 'S002',
      studentName: 'Jane Smith',
      gender: 'Female',
      courseName: 'Science',
      totalQuestions: 40,
      totalMarksForCourse: 80,
      totalMarksObtained: 70
    },
    {
      sNo: 3,
      studentId: 'S003',
      studentName: 'Emily Johnson',
      gender: 'Female',
      courseName: 'English',
      totalQuestions: 45,
      totalMarksForCourse: 90,
      totalMarksObtained: 78
    },
    {
      sNo: 4,
      studentId: 'S004',
      studentName: 'Michael Brown',
      gender: 'Male',
      courseName: 'Mathematics',
      totalQuestions: 50,
      totalMarksForCourse: 100,
      totalMarksObtained: 65
    },
    {
      sNo: 5,
      studentId: 'S005',
      studentName: 'Sarah Davis',
      gender: 'Female',
      courseName: 'History',
      totalQuestions: 30,
      totalMarksForCourse: 60,
      totalMarksObtained: 50
    }
  ];

  const topicData = {
    labels: ['Algebra', 'Geometry', 'Calculus', 'Differential equation', 'Statistics', 'Trigonometry'],
    datasets: [
      {
        label: 'Topic Performance',
        data: [72, 85, 90, 85, 88, 95],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Topic-wise Performance Breakdown</h1>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Topic Performance Graph */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Topic-wise Performance Breakdown</h2>
          <div className="h-96">
            <Radar
              data={topicData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      stepSize: 25
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">5 results found</div>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Columns className="w-4 h-4" />
                  Columns
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.NO
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Questions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Marks for Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Marks Obtained
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.sNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.totalQuestions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.totalMarksForCourse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`${
                        student.totalMarksObtained >= 80 ? 'text-green-600' :
                        student.totalMarksObtained >= 60 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {student.totalMarksObtained}
                      </span>
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