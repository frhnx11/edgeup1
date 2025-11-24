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

interface StudentData {
  studentId: string;
  studentName: string;
  gender: string;
  course: string;
  numberOfQuestion: number;
  difficultyLevel: string;
}

export function CourseDifficultyPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const students: StudentData[] = [
    {
      studentId: 'S001',
      studentName: 'Alice Johnson',
      gender: 'Female',
      course: 'Computer Science',
      numberOfQuestion: 20,
      difficultyLevel: 'Medium'
    },
    {
      studentId: 'S002',
      studentName: 'Bob Smith',
      gender: 'Male',
      course: 'Electrical Engineering',
      numberOfQuestion: 15,
      difficultyLevel: 'High'
    },
    {
      studentId: 'S003',
      studentName: 'Charlie Brown',
      gender: 'Non-Binary',
      course: 'Mechanical Engineering',
      numberOfQuestion: 25,
      difficultyLevel: 'Low'
    }
  ];

  const difficultyDistribution = {
    easy: 40,
    medium: 10,
    hard: 55
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
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Question Type Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Question Type Analysis</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">EASY</span>
                <span className="text-sm text-gray-600">{difficultyDistribution.easy}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${difficultyDistribution.easy}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">MEDIUM</span>
                <span className="text-sm text-gray-600">{difficultyDistribution.medium}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${difficultyDistribution.medium}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">HARD</span>
                <span className="text-sm text-gray-600">{difficultyDistribution.hard}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${difficultyDistribution.hard}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">2 results found</div>
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
                    Student ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number of Question
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
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
                      {student.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.numberOfQuestion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.difficultyLevel === 'High'
                          ? 'bg-red-100 text-red-800'
                          : student.difficultyLevel === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {student.difficultyLevel}
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