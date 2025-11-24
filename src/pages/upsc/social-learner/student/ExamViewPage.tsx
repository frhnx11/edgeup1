import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  Search,
  Filter,
  Download,
  ArrowLeft,
  ChevronDown,
  MoreVertical,
  Eye,
  FileText,
  Clock,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Brain,
  Settings,
  Columns,
  View,
  Upload
} from 'lucide-react';

interface Student {
  registerNo: string;
  studentName: string;
  gender: string;
  totalQuestions: number;
  requiredQuestions: number;
  questionsAttempted: number;
  evaluationPending: number;
  marksObtained: number;
  status: 'Not Attempted' | 'Completed' | 'In Progress';
  answerFile?: string;
  result?: string;
}

export function ExamViewPage() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null);

  // This would come from your data store in a real app
  const examData = {
    title: 'PERIODIC RETEST III - MATHEMATICS - VIII',
    type: 'Internal',
    mode: 'Offline',
    course: 'MATHEMATICS8 - MATHEMATICS-8th',
    duration: '90 minutes',
    scheduledDate: '2025-01-09',
    totalMarks: 40,
    examTime: '11:15 AM - 12:45 PM'
  };

  const students: Student[] = [
    {
      registerNo: '5868799',
      studentName: 'Reddherma Gupta',
      gender: 'Female',
      totalQuestions: 20,
      requiredQuestions: 20,
      questionsAttempted: 0,
      evaluationPending: 0,
      marksObtained: 0,
      status: 'Not Attempted'
    },
    {
      registerNo: '5818272',
      studentName: 'Ayush Yadav',
      gender: 'Male',
      totalQuestions: 20,
      requiredQuestions: 20,
      questionsAttempted: 0,
      evaluationPending: 0,
      marksObtained: 0,
      status: 'Not Attempted'
    },
    {
      registerNo: '5637464',
      studentName: 'Isha Bachchan',
      gender: 'Female',
      totalQuestions: 20,
      requiredQuestions: 20,
      questionsAttempted: 0,
      evaluationPending: 0,
      marksObtained: 0,
      status: 'Not Attempted'
    },
    {
      registerNo: '5634496',
      studentName: 'Mustafa Raza',
      gender: 'Male',
      totalQuestions: 20,
      requiredQuestions: 20,
      questionsAttempted: 19,
      evaluationPending: 19,
      marksObtained: 0,
      status: 'Completed',
      answerFile: 'uploaded'
    }
  ];

  const handleViewAnswers = (studentId: string) => {
    navigate(`/exam/${examId}/student/${studentId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-50';
      case 'In Progress':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-red-600 bg-red-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'In Progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{examData.title}</h1>
              <p className="text-gray-600">View exam details and student responses</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Exam Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-600">Exam</div>
              <div className="font-medium mt-1">{examData.title}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Exam Type</div>
              <div className="font-medium mt-1">{examData.type}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Exam Mode</div>
              <div className="font-medium mt-1">{examData.mode}</div>
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

        {/* Students Table */}
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
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
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
                    Required Questions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions Attempted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evaluation Pending
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks Obtained
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Answer File
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Options
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
                      {student.requiredQuestions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.questionsAttempted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.evaluationPending}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.marksObtained}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.answerFile ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Uploaded
                        </span>
                      ) : (
                        <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                          <Upload className="w-4 h-4" />
                          Upload
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.result || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {getStatusIcon(student.status)}
                        <span className="ml-1">{student.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowOptionsMenu(showOptionsMenu === student.registerNo ? null : student.registerNo);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {showOptionsMenu === student.registerNo && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              onClick={() => handleViewAnswers(student.registerNo)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                            >
                              <View className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => {/* Handle AI evaluation */}}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Brain className="w-4 h-4" />
                              AI Evaluate
                            </button>
                            <button
                              onClick={() => {/* Handle comparison */}}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4" />
                              Comparison
                            </button>
                          </div>
                        )}
                      </div>
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