import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseCardProps {
  title: string;
  image: string;
  status: 'Published' | 'Draft' | 'Upcoming';
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, image, status, onClick }) => {
  return (
    <motion.div 
      className="min-w-[300px] bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div 
        className="h-40 bg-gray-200 bg-cover bg-center" 
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{title}</h3>
        <div className="flex justify-between items-center">
          <span 
            className={`px-3 py-1 text-xs rounded-full font-medium ${
              status === 'Published' ? 'bg-green-100 text-green-700' : 
              status === 'Draft' ? 'bg-gray-100 text-gray-600' : 
              'bg-blue-100 text-blue-700'
            }`}
          >
            {status}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export function UPSCRecentCourses() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 320; // Approximate card width + margin
    const currentScroll = scrollContainerRef.current.scrollLeft;
    
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };
  
  // Sample recently accessed courses
  const recentCourses = [
    {
      id: 1,
      title: "General Studies – Environment",
      image: "/public/placeholder-course-1.jpg",
      status: "Published" as const
    },
    {
      id: 2,
      title: "Indian Polity & Constitution",
      image: "/public/placeholder-course-2.jpg",
      status: "Published" as const
    },
    {
      id: 3,
      title: "Current Affairs May 2025",
      image: "/public/placeholder-course-3.jpg", 
      status: "Published" as const
    },
    {
      id: 4,
      title: "Economy & Budget Analysis",
      image: "/public/placeholder-course-4.jpg",
      status: "Published" as const
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Recently Accessed Courses</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => handleScroll('left')}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleScroll('right')}
            className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recentCourses.map(course => (
          <CourseCard 
            key={course.id}
            title={course.title}
            image={course.image}
            status={course.status}
            onClick={() => console.log(`Clicked on ${course.title}`)}
          />
        ))}
      </div>
    </div>
  );
}
