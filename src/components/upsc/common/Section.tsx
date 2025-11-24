import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SectionProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ 
  title, 
  icon, 
  isOpen, 
  onToggle, 
  children,
  className = ''
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gray-50 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center">
          {icon && <span className="text-blue-600 mr-3">{icon}</span>}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};