import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  BookOpen,
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
  FileText
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  subject: string;
  instructor: {
    name: string;
    image: string;
  };
  students: number;
  progress: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  materials: number;
  avgScore: number;
}

export function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const courses: Course[] = [
    {
      id: '1',
      title: 'Indian Polity Comprehensive Course',
      subject: 'Indian Polity',
      instructor: {
        name: 'Dr. Rajesh Kumar',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      students: 245,
      progress: 75,
      startDate: '2025-01-15',
      endDate: '2025-06-15',
      status: 'active',
      materials: 48,
      avgScore: 82
    },
    {
      id: '2',
      title: 'Economics Foundation Course',
      subject: 'Economics',
      instructor: {
        name: 'Prof. Sarah Williams',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      students: 180,
      progress: 45,
      startDate: '2025-02-01',
      endDate: '2025-07-01',
      status: 'active',
      materials: 36,
      avgScore: 78
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600">Manage and monitor course progress</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Course
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
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#094d88]/10 text-[#094d88] rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{course.title}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">{course.subject}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          course.status === 'active' 
                            ? 'bg-[#10ac8b]/10 text-[#10ac8b]'
                            : 'bg-[#094d88]/10 text-[#094d88]'
                        }`}>
                          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={course.instructor.image}
                      alt={course.instructor.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-sm text-gray-600">Instructor</div>
                      <div className="font-medium">{course.instructor.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Students</div>
                      <div className="font-medium">{course.students}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Course Progress</span>
                    <span className={`font-medium ${
                      course.progress >= 80 ? 'text-[#10ac8b]' :
                      course.progress >= 50 ? 'text-[#094d88]' :
                      'text-[#094d88]'
                    }`}>{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-[#094d88] to-[#10ac8b] rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-[#094d88]" />
                      Duration
                    </div>
                    <div className="mt-1 font-medium">
                      {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4 text-[#094d88]" />
                      Materials
                    </div>
                    <div className="mt-1 font-medium">{course.materials}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BarChart2 className="w-4 h-4 text-[#094d88]" />
                      Avg. Score
                    </div>
                    <div className="mt-1 font-medium">{course.avgScore}%</div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <h3 className="text-xl font-semibold mb-6">Add New Course</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="">Select Subject</option>
                    <option value="polity">Indian Polity</option>
                    <option value="economics">Economics</option>
                    <option value="geography">Geography</option>
                    <option value="history">History</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}