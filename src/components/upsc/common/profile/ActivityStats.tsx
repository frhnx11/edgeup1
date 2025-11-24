import { BookOpen, Users, Eye } from 'lucide-react';

interface ActivityStatsProps {
  coursesTeaching: number;
  coursesEnrolled: number;
  profileViews: number;
}

export function ActivityStats({ coursesTeaching, coursesEnrolled, profileViews }: ActivityStatsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <BookOpen size={20} />
          </div>
          <div className="flex-grow">
            <h3 className="text-sm text-gray-500">Courses teaching</h3>
            <p className="text-xl font-semibold text-gray-900">{coursesTeaching}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <Users size={20} />
          </div>
          <div className="flex-grow">
            <h3 className="text-sm text-gray-500">Courses enrolled</h3>
            <p className="text-xl font-semibold text-gray-900">{coursesEnrolled}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <Eye size={20} />
          </div>
          <div className="flex-grow">
            <h3 className="text-sm text-gray-500">Profile views</h3>
            <p className="text-xl font-semibold text-gray-900">{profileViews}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
