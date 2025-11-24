import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

interface EventProps {
  title: string;
  date: string;
  onClick: () => void;
}

const EventItem: React.FC<EventProps> = ({ title, date, onClick }) => {
  return (
    <div 
      className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
          <Calendar className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">{title}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </div>
  );
};

export function UPSCUpcomingEvents() {
  const events = [
    {
      id: 1,
      title: 'Mock Interview on 24 June',
      date: '24 Jun, 10:00 AM',
      onClick: () => console.log('Mock Interview clicked')
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Upcoming events</h3>
        <button className="text-xs text-blue-500 font-medium">View all</button>
      </div>
      
      {events.length > 0 ? (
        <div className="border-t border-gray-100 pt-2">
          {events.map(event => (
            <EventItem
              key={event.id}
              title={event.title}
              date={event.date}
              onClick={event.onClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">No upcoming events</p>
        </div>
      )}
    </div>
  );
}
