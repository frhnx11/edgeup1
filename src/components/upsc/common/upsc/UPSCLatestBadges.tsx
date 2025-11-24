import React from 'react';
import { Award, ChevronRight } from 'lucide-react';

interface BadgeProps {
  title: string;
  onClick: () => void;
}

const BadgeItem: React.FC<BadgeProps> = ({ title, onClick }) => {
  return (
    <div 
      className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <Award className="w-4 h-4 text-yellow-600" />
        </div>
        <p className="text-sm text-gray-700">{title}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </div>
  );
};

export function UPSCLatestBadges() {
  // Sample badges for UPSC preparation context
  const badges = [
    {
      id: 1,
      title: 'Top Performer in CSAT',
      onClick: () => console.log('Top Performer in CSAT badge clicked')
    },
    {
      id: 2,
      title: 'Completed Indian Polity Module',
      onClick: () => console.log('Completed Indian Polity Module badge clicked')
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Latest badges</h3>
        <button className="text-xs text-blue-500 font-medium">View all</button>
      </div>
      
      {badges.length > 0 ? (
        <div className="border-t border-gray-100 pt-2">
          {badges.map(badge => (
            <BadgeItem
              key={badge.id}
              title={badge.title}
              onClick={badge.onClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">No badges yet</p>
          <p className="text-sm text-blue-500 mt-1 cursor-pointer">How to earn badges</p>
        </div>
      )}
    </div>
  );
}
