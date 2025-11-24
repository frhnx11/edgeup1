import React from 'react';
import { Sidebar } from './Sidebar';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed on the left */}
      <Sidebar />

      {/* Main Content - Offset by sidebar width (w-72 = 288px) */}
      <main className="flex-1 ml-72">
        {children}
      </main>
    </div>
  );
}
