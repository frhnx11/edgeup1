import React, { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import AddCourseForm from '../../../../components/upsc/common/AddCourseForm';

const CoursesPage: React.FC = () => {
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);

  if (showAddCourseForm) {
    return <AddCourseForm onCancel={() => setShowAddCourseForm(false)} />;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
          <button
            onClick={() => setShowAddCourseForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Course
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course Cards - Example data */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Introduction to Computer Science</h3>
            <p className="text-gray-600 text-sm mb-4">CS101 • Technology</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">120 Students</span>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View Details →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Advanced Mathematics</h3>
            <p className="text-gray-600 text-sm mb-4">MATH201 • Mathematics</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">85 Students</span>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View Details →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Data Science Fundamentals</h3>
            <p className="text-gray-600 text-sm mb-4">DS100 • Technology</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">95 Students</span>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View Details →
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="mt-12 text-center text-gray-500">
          <p className="mb-4">No courses found. Start by adding a new course.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CoursesPage;