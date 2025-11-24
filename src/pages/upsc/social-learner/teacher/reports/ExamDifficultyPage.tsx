import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  Search,
  Filter,
  Download,
  ArrowLeft,
  Clock,
  Calendar,
  FileText,
  Users,
  ChevronDown
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExamData {
  exam: string;
  examType: string;
  examMode: string;
  course: string;
  duration: string;
  scheduledDate: string;
  totalMarks: number;
  examTime: string;
}

interface StudentData {
  registerNo: string;
  studentName: string;
  gender: string;
  totalQuestions: number;
  easyQuestions: number;
  mediumQuestions: number;
  hardQuestions: number;
  highestDifficulty: number;
  highestDifficultyCount: number;
  status: string;
}

export function ExamDifficultyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const examData: ExamData = {
    exam: 'PERIODIC RETEST III - MATHEMATICS - VIII',
    examType: 'Internal',
    examMode: 'Offline',
    course: 'MATHEMATICS8 - MATHEMATICS-8th',
    duration: '90 minutes',
    scheduledDate: '09 Jan 2025',
    totalMarks: 40,
    examTime: '11:15 AM - 12:45 PM'
  };

  const students: StudentData[] = [
    {
      registerNo: '5868799',
      studentName: 'Reddherma gupta',
      gender: 'Female',
      totalQuestions: 20,
      easyQuestions: 0,
      mediumQuestions: 0,
      hardQuestions: 0,
      highestDifficulty: 0,
      highestDifficultyCount: 0,
      status: 'Not Attempted'
    },
    {
      registerNo: '5818272',
      studentName: 'Ayush yadav',
      gender: 'Male',
      totalQuestions: 20,
      easyQuestions: 0,
      mediumQuestions: 0,
      hardQuestions: 0,
      highestDifficulty: 0,
      highestDifficultyCount: 0,
      status: 'Not Attempted'
    },
    {
      registerNo: '5637464',
      studentName: 'Isha bachchan',
      gender: 'Female',
      totalQuestions: 20,
      easyQuestions: 0,
      mediumQuestions: 0,
      hardQuestions: 0,
      highestDifficulty: 0,
      highestDifficultyCount: 0,
      status: 'Not Attempted'
    },
    {
      registerNo: '5634496',
      studentName: 'Mustafa raza',
      gender: 'Male',
      totalQuestions: 20,
      easyQuestions: 0,
      mediumQuestions: 0,
      hardQuestions: 0,
      highestDifficulty: 0,
      highestDifficultyCount: 0,
      status: 'Attempted'
    }
  ];

  const difficultyData = {
    labels: ['MATHEMATICS-8th'],
    datasets: [
      {
        label: 'Easy',
        data: [30],
        backgroundColor: 'rgba(79, 70, 229, 1)'
      },
      {
        label: 'Medium',
        data: [45],
        backgroundColor: 'rgba(245, 158, 11, 1)'
      },
      {
        label: 'Hard',
        data: [25],
        backgroundColor: 'rgba(16, 185, 129, 1)'
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
              <h1 className="text-2xl font-bold text-gray-900">Difficulty Level Distribution</h1>
              <p className="text-gray-600">Analyze question difficulty patterns</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Exam Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-600">Exam</div>
              <div className="font-medium mt-1">{examData.exam}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Exam Type</div>
              <div className="font-medium mt-1">{examData.examType}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Exam Mode</div>
              <div className="font-medium mt-1">{examData.examMode}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Course</div>
              <div className="font-medium mt-1">{examData.course}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Duration</div>
              <div className="font-medium mt-1">{examData.duration}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Scheduled Date</div>
              <div className="font-medium mt-1">{examData.scheduledDate}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Marks</div>
              <div className="font-medium mt-1">{examData.totalMarks}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Exam Time</div>
              <div className="font-medium mt-1">{examData.examTime}</div>
            </div>
          </div>
        </div>

        {/* Difficulty Distribution Graph */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Difficulty Level Distribution</h2>
          <div className="h-80">
            <Bar
              data={difficultyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Percentage'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top' as const
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
              <h2 className="text-lg font-semibold">Student Details</h2>
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
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Register No
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Questions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Easy Questions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medium Questions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hard Questions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Highest Difficulty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Highest Difficulty Count
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.registerNo} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.registerNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.totalQuestions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.easyQuestions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.mediumQuestions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.hardQuestions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.highestDifficulty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.highestDifficultyCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === 'Attempted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
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