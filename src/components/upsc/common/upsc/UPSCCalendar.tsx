import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function UPSCCalendar() {
  const [currentMonth, setCurrentMonth] = useState(5); // June (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-8"></div>);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === 14 && currentMonth === 5 && currentYear === 2025; // Assuming today is June 14, 2025
    const hasEvent = day === 24 && currentMonth === 5 && currentYear === 2025; // Mock Interview on June 24
    
    calendarDays.push(
      <div 
        key={day} 
        className={`h-8 w-8 flex items-center justify-center rounded-full text-sm
          ${isToday ? 'bg-blue-500 text-white' : ''} 
          ${hasEvent ? 'font-bold text-blue-600' : ''}
          ${!isToday && !hasEvent ? 'hover:bg-gray-100 cursor-pointer' : ''}
        `}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-3">Calendar</h3>
      
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePrevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h4 className="font-medium">
          {monthNames[currentMonth]} {currentYear}
        </h4>
        <button 
          onClick={handleNextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs text-gray-500 font-medium">
            {day.charAt(0)}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>
    </div>
  );
}
