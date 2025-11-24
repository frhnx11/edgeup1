import { useState } from 'react';
import { ArrowLeft, Search, Plus, RotateCcw, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  name: string;
  shortName: string;
  category: string;
  courseCount: number;
}

interface ManageCoursesPageProps {
  onCancel?: () => void;
}

export function ManageCoursesPage({ onCancel }: ManageCoursesPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All courses');

  // Sample course data
  const courses: Course[] = [
    { id: '1', name: 'Android Training 2023', shortName: 'AT23', category: 'All courses', courseCount: 0 },
    { id: '2', name: 'Android Training 2024', shortName: 'AT24', category: 'All courses', courseCount: 0 },
    { id: '3', name: 'Android for Beginners', shortName: 'AFB', category: 'All courses', courseCount: 0 },
    { id: '4', name: 'Kotlin Training 2023', shortName: 'KT23', category: 'All courses', courseCount: 0 },
    { id: '5', name: 'React Native 2023', shortName: 'RN23', category: 'All courses', courseCount: 0 },
    { id: '6', name: 'React Native 2024', shortName: 'RN24', category: 'All courses', courseCount: 0 },
    { id: '7', name: 'Swift iOS Training 2023', shortName: 'ST23', category: 'All courses', courseCount: 0 },
    { id: '8', name: 'Swift iOS Training 2024', shortName: 'ST24', category: 'All courses', courseCount: 0 },
    { id: '9', name: 'JavaScript Fundamentals', shortName: 'JSF', category: 'All courses', courseCount: 0 },
    { id: '10', name: 'TypeScript Advanced', shortName: 'TSA', category: 'All courses', courseCount: 0 },
    { id: '11', name: 'Python for Data Science', shortName: 'PDS', category: 'All courses', courseCount: 0 },
    { id: '12', name: 'Machine Learning Basics', shortName: 'MLB', category: 'All courses', courseCount: 0 },
    { id: '13', name: 'Web Development Bootcamp', shortName: 'WDB', category: 'All courses', courseCount: 0 },
    { id: '14', name: 'Database Design', shortName: 'DBD', category: 'All courses', courseCount: 0 },
    { id: '15', name: 'Cloud Computing AWS', shortName: 'CCA', category: 'All courses', courseCount: 0 },
    { id: '16', name: 'DevOps Fundamentals', shortName: 'DOF', category: 'All courses', courseCount: 0 },
    { id: '17', name: 'Cybersecurity Basics', shortName: 'CSB', category: 'All courses', courseCount: 0 },
    { id: '18', name: 'UI/UX Design Principles', shortName: 'UXP', category: 'All courses', courseCount: 0 },
    { id: '19', name: 'Flutter Development', shortName: 'FLD', category: 'All courses', courseCount: 0 },
    { id: '20', name: 'Node.js Backend', shortName: 'NJB', category: 'All courses', courseCount: 0 },
  ];

  // Add more courses to reach 75 total
  const additionalCourses: Course[] = [];
  for (let i = 21; i <= 75; i++) {
    additionalCourses.push({
      id: i.toString(),
      name: `Course ${i}`,
      shortName: `C${i}`,
      category: 'All courses',
      courseCount: 0
    });
  }

  const allCourses = [...courses, ...additionalCourses];

  // Filter courses based on search query
  const filteredCourses = allCourses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center">
        <button 
          onClick={handleCancel} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Manage Courses</h1>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Top Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Course count and dropdown */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium text-gray-900">{allCourses.length} courses</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All courses">All courses</option>
                <option value="Programming">Programming</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            {/* Search field */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
              onClick={() => console.log('Navigate to course:', course.id)}
            >
              <h3 className="font-medium text-gray-900 mb-1">
                {course.name} ({course.shortName})
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Course category: {course.category}
              </p>
              <p className="text-sm font-medium text-gray-700">
                {course.courseCount} courses
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => console.log('Manage courses')}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage courses
            </button>
            <button
              onClick={() => console.log('Add new course')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add a new course
            </button>
            <button
              onClick={() => console.log('Restore course')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}