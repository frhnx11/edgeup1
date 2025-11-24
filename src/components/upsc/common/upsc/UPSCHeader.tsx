import React from 'react';
import { Bell, MessageSquare, Search, Settings } from 'lucide-react';

interface UPSCHeaderProps {
  userName: string;
}

export function UPSCHeader({ userName }: UPSCHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="font-bold text-2xl text-gray-800">Dashboard</h1>

      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-60 pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-primary focus:ring focus:ring-brand-primary/20 focus:ring-opacity-50"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <MessageSquare className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {userName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">{userName}</span>
            <span className="text-xs text-gray-500">UPSC Aspirant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
