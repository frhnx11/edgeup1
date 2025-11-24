import React from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseCardProps {
  id: number;
  title: string;
  image: string;
  status: 'Published' | 'Draft' | 'Upcoming';
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, image, status, onClick }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div 
        className="h-32 bg-gray-200 bg-cover bg-center" 
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-gray-800 mb-auto line-clamp-2">{title}</h3>
        <div className="flex justify-between items-center mt-3">
          <span 
            className={`px-3 py-1 text-xs rounded-full font-medium ${
              status === 'Published' ? 'bg-green-100 text-green-700' : 
              status === 'Draft' ? 'bg-gray-100 text-gray-600' : 
              'bg-blue-100 text-blue-700'
            }`}
          >
            {status}
          </span>
          <button className="text-gray-400 hover:text-brand-primary">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export function UPSCCoursesGrid() {
  // Sample courses data with UPSC-relevant modules
  const courses = [
    {
      id: 1,
      title: "Indian Polity & Constitution",
      image: "/public/placeholder-course-1.jpg",
      status: "Published" as const
    },
    {
      id: 2,
      title: "Economy & Budget Analysis",
      image: "/public/placeholder-course-2.jpg",
      status: "Published" as const
    },
    {
      id: 3,
      title: "Science & Technology",
      image: "/public/placeholder-course-3.jpg",
      status: "Published" as const
    },
    {
      id: 4,
      title: "CSAT Logical Reasoning",
      image: "/public/placeholder-course-4.jpg",
      status: "Published" as const
    },
    {
      id: 5,
      title: "Current Affairs – Monthly Dossier",
      image: "/public/placeholder-course-5.jpg",
      status: "Published" as const
    },
    {
      id: 6,
      title: "Essay Writing Masterclass",
      image: "/public/placeholder-course-6.jpg",
      status: "Published" as const
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Courses</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-brand-primary hover:underline flex items-center">
            All courses <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard 
            key={course.id}
            id={course.id}
            title={course.title}
            image={course.image}
            status={course.status}
            onClick={() => console.log(`Clicked on course: ${course.title}`)}
          />
        ))}
      </div>
    </div>
  );
}
