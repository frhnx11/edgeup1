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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StudentData {
  sNo: number;
  studentId: string;
  studentName: string;
  gender: string;
  questionNumber: number;
  questionType: string;
  timeSpentOnQuestion: string;
  totalTimeSpentOnExam: string;
  timeEfficiencyForExam: 'High' | 'Medium' | 'Low';
}

export function TeacherTimeManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const students: StudentData[] = [
    {
      sNo: 1,
      studentId: 'S001',
      studentName: 'John Doe',
      gender: 'Male',
      questionNumber: 1,
      questionType: 'MCQ',
      timeSpentOnQuestion: '2 minutes',
      totalTimeSpentOnExam: '30 minutes',
      timeEfficiencyForExam: 'High'
    },
    {
      sNo: 2,
      studentId: 'S002',
      studentName: 'Jane Smith',
      gender: 'Female',
      questionNumber: 2,
      questionType: 'Short Answer',
      timeSpentOnQuestion: '5 minutes',
      totalTimeSpentOnExam: '40 minutes',
      timeEfficiencyForExam: 'Medium'
    },
    {
      sNo: 3,
      studentId: 'S003',
      studentName: 'Emily Johnson',
      gender: 'Female',
      questionNumber: 3,
      questionType: 'Essay',
      timeSpentOnQuestion: '15 minutes',
      totalTimeSpentOnExam: '60 minutes',
      timeEfficiencyForExam: 'Low'
    },
    {
      sNo: 4,
      studentId: 'S004',
      studentName: 'Michael Brown',
      gender: 'Male',
      questionNumber: 4,
      questionType: 'MCQ',
      timeSpentOnQuestion: '3 minutes',
      totalTimeSpentOnExam: '35 minutes',
      timeEfficiencyForExam: 'High'
    },
    {
      sNo: 5,
      studentId: 'S005',
      studentName: 'Sarah Davis',
      gender: 'Female',
      questionNumber: 5,
      questionType: 'Short Answer',
      timeSpentOnQuestion: '4 minutes',
      totalTimeSpentOnExam: '45 minutes',
      timeEfficiencyForExam: 'Medium'
    }
  ];

  const timeData = {
    labels: ['0-15 min', '16-30 min', '31-45 min', '46-60 min', '61-75 min', '76-90 min'],
    datasets: [
      {
        label: 'Question Completed',
        data: [2, 20, 12, 40, 60, 30],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Question Attempted',
        data: [20, 60, 42, 50, 40, 80],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4
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
              <h1 className="text-2xl font-bold text-gray-900">Time Management Analysis</h1>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Time Management Graph */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Time Management Analysis</h2>
          <div className="h-96">
            <Line
              data={timeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Number of Questions'
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
                    Question Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Spent on Question
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Time Spent on Exam
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Efficiency for Exam
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
                      {student.questionNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.questionType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.timeSpentOnQuestion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.totalTimeSpentOnExam}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.timeEfficiencyForExam === 'High'
                          ? 'bg-green-100 text-green-800'
                          : student.timeEfficiencyForExam === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.timeEfficiencyForExam}
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