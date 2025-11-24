import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Download,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  Target,
  Clock,
  ChevronRight,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  location: string;
  subjects: string[];
  progress: number;
  status: 'active' | 'inactive';
  lastActive: string;
  testsTaken: number;
  avgScore: number;
  studyHours: number;
}

export function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample student data
  const students: Student[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      joinDate: '2025-01-15',
      location: 'Mumbai, India',
      subjects: ['Indian Polity', 'Economics', 'Geography'],
      progress: 75,
      status: 'active',
      lastActive: '2 hours ago',
      testsTaken: 24,
      avgScore: 82,
      studyHours: 128
    },
    // Add more students...
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600">Manage student accounts and progress</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">All Students</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {students.map(student => (
              <div key={student.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-medium">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{student.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {student.phone}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {new Date(student.joinDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {student.location}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {student.subjects.map(subject => (
                          <span
                            key={subject}
                            className="px-2 py-1 bg-[#094d88]/10 text-[#094d88] rounded-full text-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === 'active' 
                            ? 'bg-[#10ac8b]/10 text-[#10ac8b]'
                            : 'bg-[#094d88]/10 text-[#094d88]'
                        }`}>
                          {student.status === 'active' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-600">
                          Last active {student.lastActive}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-sm text-gray-600">Tests</div>
                          <div className="font-medium">{student.testsTaken}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Avg. Score</div>
                          <div className="font-medium">{student.avgScore}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Hours</div>
                          <div className="font-medium">{student.studyHours}</div>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {selectedStudent?.id === student.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                          <button
                            onClick={() => {/* Handle edit */}}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Student
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Student
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className={`font-medium ${
                      student.progress >= 80 ? 'text-[#10ac8b]' :
                      student.progress >= 50 ? 'text-[#094d88]' :
                      'text-[#094d88]'
                    }`}>{student.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-[#094d88] to-[#10ac8b] rounded-full transition-all duration-500"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Delete Student</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-[#094d88]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  /* Handle delete */
                  setShowDeleteModal(false);
                }}
                className="flex-1 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <h3 className="text-xl font-semibold mb-6">Add New Student</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subjects
                </label>
                <select
                  multiple
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="polity">Indian Polity</option>
                  <option value="economics">Economics</option>
                  <option value="geography">Geography</option>
                  <option value="history">History</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-[#094d88]/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}