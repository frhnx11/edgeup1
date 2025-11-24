import React from 'react';
import { Clock } from 'lucide-react';

export function UPSCTimelineWidget() {
  // Timeline state - empty in this case, as per requirements
  const hasActivities = false;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Timeline</h3>
      
      {hasActivities ? (
        <div className="space-y-3">
          {/* Timeline items would go here */}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500">No upcoming activities due</p>
        </div>
      )}
    </div>
  );
}
