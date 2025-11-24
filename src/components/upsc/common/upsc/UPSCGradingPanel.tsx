import React from 'react';
import { ChevronRight } from 'lucide-react';

interface GradingItemProps {
  label: string;
  hasPending: boolean;
  onClick: () => void;
}

const GradingItem: React.FC<GradingItemProps> = ({ label, hasPending, onClick }) => {
  return (
    <div 
      className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {hasPending && (
          <div className="w-2 h-2 rounded-full bg-red-500" />
        )}
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </div>
  );
};

export function UPSCGradingPanel() {
  const gradingItems = [
    {
      id: 1,
      label: 'Mock Test: GS Paper I',
      hasPending: true,
      onClick: () => console.log('Mock Test: GS Paper I clicked')
    },
    {
      id: 2,
      label: 'Essay Submissions',
      hasPending: true,
      onClick: () => console.log('Essay Submissions clicked')
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Teacher - Needs Grading</h3>
        <button className="text-xs text-blue-500 font-medium">View all</button>
      </div>
      
      <div className="border-t border-gray-100 pt-2">
        {gradingItems.map(item => (
          <GradingItem
            key={item.id}
            label={item.label}
            hasPending={item.hasPending}
            onClick={item.onClick}
          />
        ))}
      </div>
    </div>
  );
}
