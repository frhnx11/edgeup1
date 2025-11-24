import { Calendar, BookOpen, Award } from 'lucide-react';

export function UPSCTimeline() {
  const timelineItems = [
    {
      id: 1,
      time: 'Today',
      title: 'Geography Test',
      description: 'Complete your test on Physical Geography',
      icon: Calendar
    },
    {
      id: 2,
      time: '2 Days Ago',
      title: 'Economic Survey',
      description: 'Started new module on Budget Analysis',
      icon: BookOpen
    },
    {
      id: 3,
      time: '1 Week Ago',
      title: 'Polity Badge',
      description: 'Earned Constitutional Expert badge',
      icon: Award
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Your Timeline</h2>
      
      <div className="space-y-6">
        {timelineItems.map(item => (
          <div key={item.id} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <item.icon size={18} />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">{item.time}</p>
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-700 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
