import { CheckCircle2, Book } from 'lucide-react';

export function UPSCYourCourses() {
  const courses = [
    {
      id: 1,
      title: 'Indian Polity & Constitution',
      image: '/images/courses/indian-polity.jpg',
      progress: 65,
      status: 'Published'
    },
    {
      id: 2,
      title: 'Economy & Budget Analysis',
      image: '/images/courses/economy.jpg',
      progress: 42,
      status: 'Published'
    },
    {
      id: 3,
      title: 'Indian History',
      image: '/images/courses/history.jpg',
      progress: 78,
      status: 'Published'
    },
    {
      id: 4,
      title: 'Geography & Environment',
      image: '/images/courses/geography.jpg',
      progress: 30,
      status: 'Published'
    },
    {
      id: 5,
      title: 'Current Affairs',
      image: '/images/courses/current-affairs.jpg',
      progress: 85,
      status: 'Published'
    },
    {
      id: 6,
      title: 'Ethics & Integrity',
      image: '/images/courses/ethics.jpg',
      progress: 20,
      status: 'Draft'
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Your UPSC Courses</h2>
        <button className="text-brand-primary hover:text-brand-primary/80 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map(course => (
          <div 
            key={course.id}
            className="relative bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Course Image */}
            <div className="h-32 bg-gray-200 relative">
              {/* Placeholder for image */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <Book size={32} />
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded 
              ${course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {course.status === 'Published' && <CheckCircle2 className="inline-block mr-1 w-3 h-3" />}
              {course.status}
            </div>
            
            {/* Course Content */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2">{course.title}</h3>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-brand-primary h-2 rounded-full" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              
              <div className="text-sm text-gray-600">{course.progress}% complete</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
