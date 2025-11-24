import { useState, useEffect } from 'react';
import { Book, Clock, Award } from 'lucide-react';

interface CourseDetailsProps {
  userId: string;
}

interface CourseDetail {
  id: string;
  title: string;
  type: string;
  status: string;
  completionPercentage: number;
}

export function CourseDetails({ userId }: CourseDetailsProps) {
  const [courseDetails, setCourseDetails] = useState<CourseDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from API
    const fetchCourseDetails = async () => {
      setIsLoading(true);
      try {
        // Simulated API response
        const mockCourseDetails: CourseDetail[] = [
          { 
            id: '1', 
            title: 'Indian Polity & Constitution', 
            type: 'Core', 
            status: 'In Progress',
            completionPercentage: 65 
          },
          { 
            id: '2', 
            title: 'Economy & Budget Analysis', 
            type: 'Elective', 
            status: 'Completed',
            completionPercentage: 100 
          },
          { 
            id: '3', 
            title: 'Indian History', 
            type: 'Core', 
            status: 'In Progress',
            completionPercentage: 78 
          },
        ];
        
        setCourseDetails(mockCourseDetails);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [userId]);

  if (isLoading) {
    return <div className="bg-white rounded-lg shadow-sm p-6">Loading course details...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Course Details</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {courseDetails.length > 0 ? (
          courseDetails.map(course => (
            <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#094d88]/10 text-[#094d88] flex items-center justify-center">
                    <Book className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{course.type}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        course.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Circle or Check Icon */}
                <div className="flex items-center">
                  {course.status === 'Completed' ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 relative">
                      {/* Progress Circle */}
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        {/* Background Circle */}
                        <circle 
                          cx="18" cy="18" r="16"
                          fill="none" 
                          stroke="#e5e7eb" 
                          strokeWidth="4" 
                        />
                        {/* Progress Circle */}
                        <circle 
                          cx="18" cy="18" r="16"
                          fill="none" 
                          stroke="#094d88" 
                          strokeWidth="4" 
                          strokeDasharray={`${course.completionPercentage} ${100 - course.completionPercentage}`}
                          strokeDashoffset="25"
                          transform="rotate(-90 18 18)"
                        />
                        <text 
                          x="50%" y="50%" 
                          textAnchor="middle" 
                          dy=".3em" 
                          fontSize="10"
                          fontWeight="bold"
                          fill="#333"
                        >
                          {course.completionPercentage}%
                        </text>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No course details available.
          </div>
        )}
      </div>
    </div>
  );
}
