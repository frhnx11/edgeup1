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

interface StudentData {
  totalQuestions: number;
  questionsAttempted: number;
  marksObtained: number;
}

export function LearningObjectivePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState('PERIODIC RETEST III - MATHEMATICS - VIII');
  const [selectedStudent, setSelectedStudent] = useState('Reddhema');

  const studentData: StudentData[] = [
    {
      totalQuestions: 20,
      questionsAttempted: 0,
      marksObtained: 0
    },
    {
      totalQuestions: 20,
      questionsAttempted: 0,
      marksObtained: 0
    },
    {
      totalQuestions: 20,
      questionsAttempted: 0,
      marksObtained: 0
    },
    {
      totalQuestions: 20,
      questionsAttempted: 19,
      marksObtained: 0
    }
  ];

  const learningObjectiveData = {
    labels: ['MATHEMATICS-8th', 'MATHEMATICS-9th', 'MATHEMATICS-8th', 'MATHEMATICS-8th', 'MATHEMATICS-7th'],
    datasets: [
      {
        label: 'Class Average',
        data: [20, 55, 25, 25, 45],
        backgroundColor: 'rgba(79, 70, 229, 1)'
      },
      {
        label: 'Your Score',
        data: [65, 55, 95, 95, 45],
        backgroundColor: 'rgba(249, 115, 22, 1)'
      },
      {
        label: 'Top 25%',
        data: [55, 45, 75, 75, 50],
        backgroundColor: 'rgba(34, 197, 94, 1)'
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
              <h1 className="text-2xl font-bold text-gray-900">Learning Objective</h1>
              <p className="text-gray-600">Exam Name: {selectedExam}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option>{selectedExam}</option>
            </select>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option>{selectedStudent}</option>
            </select>
          </div>
        </div>

        {/* Learning Objective Graph */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Learning Objective</h2>
          <div className="h-96">
            <Bar
              data={learningObjectiveData}
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
                }
              }}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">4 results found</div>
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
                    Total Questions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions Attempted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks Obtained
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.totalQuestions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.questionsAttempted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.marksObtained}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>Showing 1 of 1 page</div>
              <div className="flex items-center gap-2">
                <span>Data per page:</span>
                <select className="px-2 py-1 border border-gray-200 rounded">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}