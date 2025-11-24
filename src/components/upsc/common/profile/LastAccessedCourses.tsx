import { Book, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import { formatDate } from '../../utils/formatters';

interface Course {
  id: string;
  title: string;
  lastAccessed: string;
  image?: string;
  progress: number;
}

interface LastAccessedCoursesProps {
  courses: Course[];
}

export function LastAccessedCourses({ courses }: LastAccessedCoursesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };
  
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 300; // Adjust based on card width + gap
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };
  
  if (courses.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Last Accessed Courses</h2>
        
        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-1 rounded-full ${
              canScrollLeft ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-1 rounded-full ${
              canScrollRight ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {courses.map(course => (
          <div 
            key={course.id}
            className="flex-shrink-0 w-64 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Course Image */}
            <div className="h-32 bg-gray-200 relative">
              {course.image ? (
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <Book size={32} />
                </div>
              )}
            </div>
            
            {/* Course Content */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-[#094d88] h-2 rounded-full" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-3 text-sm">
                <span className="text-gray-600">Last accessed</span>
                <span className="text-gray-900 font-medium">{formatDate(course.lastAccessed, 'short')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
