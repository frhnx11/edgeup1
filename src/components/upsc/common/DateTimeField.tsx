import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface DateTimeFieldProps {
  label: string;
  date: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export const DateTimeField: React.FC<DateTimeFieldProps> = ({ 
  label, 
  date, 
  onDateChange,
  className = '' 
}) => {
  const [dateValue, setDateValue] = useState<string>('');
  const [timeValue, setTimeValue] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    // Format the date to YYYY-MM-DD for the date input
    const formattedDate = date.toISOString().split('T')[0];
    // Format the time to HH:MM for the time input
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    
    setDateValue(formattedDate);
    setTimeValue(formattedTime);
  }, [date]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    // Preserve the existing time
    newDate.setHours(date.getHours());
    newDate.setMinutes(date.getMinutes());
    onDateChange(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onDateChange(newDate);
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDisplayTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <div 
            className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <span>{formatDisplayDate(date)}</span>
            <Calendar className="h-4 w-4 text-gray-500" />
          </div>
          {showDatePicker && (
            <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <input
                type="date"
                value={dateValue}
                onChange={handleDateChange}
                className="w-full p-2 border-0 focus:ring-2 focus:ring-blue-500 rounded-md"
                onBlur={() => setTimeout(() => setShowDatePicker(false), 200)}
                autoFocus
              />
            </div>
          )}
        </div>
        
        <div className="relative">
          <div 
            className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500"
            onClick={() => setShowTimePicker(!showTimePicker)}
          >
            <span>{formatDisplayTime(date)}</span>
            <Clock className="h-4 w-4 text-gray-500" />
          </div>
          {showTimePicker && (
            <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <input
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                className="w-full p-2 border-0 focus:ring-2 focus:ring-blue-500 rounded-md"
                onBlur={() => setTimeout(() => setShowTimePicker(false), 200)}
                step="300" // 5 minute steps
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeField;