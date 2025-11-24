import React from 'react';
import { ArrowUp, ArrowDown, Clock, BarChart2 } from 'lucide-react';

export function UPSCStatsPanel() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">User Stats</h3>
      
      {/* Time Spent */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Time spent</span>
          <span className="text-xs text-gray-500">since Monday, 1 April 2025</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="text-xl font-bold">34h 15m</span>
        </div>
      </div>
      
      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="flex items-center gap-1 text-xs text-green-600">
            <ArrowUp className="w-3 h-3" />
            8%
          </span>
        </div>
        <div className="relative w-full h-2 bg-gray-100 rounded-full mt-2">
          <div 
            className="absolute left-0 top-0 h-full bg-green-500 rounded-full" 
            style={{ width: '68%' }}
          />
        </div>
      </div>
      
      {/* Usage Trend */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">By time range</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded">Day</button>
            <button className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">Week</button>
            <button className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">Month</button>
          </div>
        </div>
        
        {/* Simple chart representation */}
        <div className="h-20 flex items-end gap-1">
          {[15, 25, 18, 32, 40, 28, 35].map((height, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-500 mt-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
