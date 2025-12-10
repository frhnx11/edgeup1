import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Check,
  Trash2,
  Calendar as CalendarIcon,
  ListTodo,
  CheckCircle2,
  Clock,
  Sparkles,
  Target
} from 'lucide-react';
import { useCalendarStore } from '../../../store/useCalendarStore';

// Weekday names
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Month names
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper to get date string in YYYY-MM-DD format
const formatDateString = (year: number, month: number, day: number) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// Helper to format date for display
const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};

// Get today's date string
const getTodayString = () => {
  const today = new Date();
  return formatDateString(today.getFullYear(), today.getMonth(), today.getDate());
};

// Helper to format short date
const formatShortDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateString === getTodayString()) {
    return 'Today';
  } else if (dateString === formatDateString(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function SmartCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  
  // Store
  const { tasks, addTask, toggleTask, deleteTask, getTasksByDate } = useCalendarStore();

  // Get calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Number of days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Create array of day objects
    const days: { day: number; isCurrentMonth: boolean; dateString: string }[] = [];

    // Previous month days (to fill the first row)
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      days.push({
        day,
        isCurrentMonth: false,
        dateString: formatDateString(prevYear, prevMonth, day)
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        dateString: formatDateString(year, month, day)
      });
    }

    // Next month days (to complete the grid - 6 rows total)
    const remainingDays = 42 - days.length; // 6 rows × 7 days = 42
    for (let day = 1; day <= remainingDays; day++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      days.push({
        day,
        isCurrentMonth: false,
        dateString: formatDateString(nextYear, nextMonth, day)
      });
    }

    return { year, month, days };
  }, [currentDate]);

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Task handlers
  const handleAddTask = () => {
    if (newTaskTitle.trim() && selectedDate) {
      addTask(newTaskTitle.trim(), selectedDate);
      setNewTaskTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  // Get tasks for selected date
  const selectedDateTasks = selectedDate ? getTasksByDate(selectedDate) : [];

  // Get task count for a date
  const getTaskCount = (dateString: string) => {
    return tasks.filter((t) => t.date === dateString).length;
  };

  // Get completed task count for a date
  const getCompletedCount = (dateString: string) => {
    return tasks.filter((t) => t.date === dateString && t.completed).length;
  };

  // Check if date is today
  const todayString = getTodayString();

  // Stats calculations
  const todayTasks = tasks.filter(t => t.date === todayString);
  const todayCompleted = todayTasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const totalCompleted = tasks.filter(t => t.completed).length;

  // Get upcoming tasks (next 7 days, not completed)
  const upcomingTasks = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return tasks
      .filter(t => {
        const taskDate = new Date(t.date);
        return taskDate >= today && taskDate <= nextWeek && !t.completed;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [tasks]);

  return (
    <>
      <div className="min-h-[calc(100vh-280px)] bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 rounded-2xl p-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Calendar</h1>
            <p className="text-sm text-gray-500">Plan your study schedule efficiently</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{todayTasks.length}</p>
              <p className="text-xs text-gray-500">Today's Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{todayCompleted}/{todayTasks.length}</p>
              <p className="text-xs text-gray-500">Completed Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              <p className="text-xs text-gray-500">Total Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0}%</p>
              <p className="text-xs text-gray-500">Completion Rate</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-white rounded-lg transition-all shadow-sm border border-gray-200 bg-white"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </motion.button>
                <h2 className="text-lg font-semibold text-gray-900 min-w-[180px] text-center">
                  {MONTHS[calendarData.month]} {calendarData.year}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-white rounded-lg transition-all shadow-sm border border-gray-200 bg-white"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToToday}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
              >
                Today
              </motion.button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-gray-50/50">
            {WEEKDAYS.map((day, index) => (
              <div
                key={day}
                className={`py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                  index === 0 || index === 6 ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarData.days.map((dayData, index) => {
              const taskCount = getTaskCount(dayData.dateString);
              const completedCount = getCompletedCount(dayData.dateString);
              const isToday = dayData.dateString === todayString;
              const isWeekend = index % 7 === 0 || index % 7 === 6;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(dayData.dateString)}
                  className={`
                    relative h-24 p-2 border-b border-r border-gray-100 text-left cursor-pointer
                    ${!dayData.isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'}
                    ${isToday ? 'bg-gradient-to-br from-indigo-50 to-purple-50' : ''}
                    ${isWeekend && dayData.isCurrentMonth && !isToday ? 'bg-slate-50/50' : ''}
                  `}
                >
                  {/* Day Number */}
                  <div className="flex items-start justify-between">
                    <span
                      className={`
                        inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full
                        ${!dayData.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                        ${isToday ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30' : ''}
                      `}
                    >
                      {dayData.day}
                    </span>

                    {/* Task indicator dots */}
                    {taskCount > 0 && (
                      <div className="flex gap-0.5">
                        {Array.from({ length: Math.min(taskCount, 3) }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < completedCount
                                ? 'bg-green-400'
                                : dayData.isCurrentMonth
                                ? 'bg-indigo-400'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                        {taskCount > 3 && (
                          <span className="text-[10px] text-gray-400 ml-0.5">+{taskCount - 3}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Task Preview */}
                  {taskCount > 0 && dayData.isCurrentMonth && (
                    <div className="mt-1 space-y-0.5">
                      {getTasksByDate(dayData.dateString).slice(0, 2).map((task, i) => (
                        <div
                          key={task.id}
                          className={`text-[10px] truncate px-1.5 py-0.5 rounded ${
                            task.completed
                              ? 'bg-green-50 text-green-600'
                              : 'bg-indigo-50 text-indigo-600'
                          }`}
                        >
                          {task.title}
                        </div>
                      ))}
                      {taskCount > 2 && (
                        <div className="text-[10px] text-gray-400 px-1.5">
                          +{taskCount - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Tasks Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit"
        >
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-white/80" />
              <h3 className="font-semibold text-white">Upcoming Tasks</h3>
            </div>
            <p className="text-xs text-white/70 mt-1">Next 7 days</p>
          </div>

          <div className="p-4">
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">All caught up!</p>
                <p className="text-xs text-gray-400 mt-1">No pending tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedDate(task.date)}
                    className="group p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 group-hover:text-indigo-700 font-medium truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatShortDate(task.date)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
        </div>
      </div>

      {/* Day Modal - Rendered via Portal to center on entire window */}
      {createPortal(
        <AnimatePresence>
          {selectedDate && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedDate(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[9999]"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mx-4">
                  {/* Modal Header */}
                  <div className="px-6 py-5 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          {formatDisplayDate(selectedDate)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-white/80">
                            {selectedDateTasks.filter(t => t.completed).length}/{selectedDateTasks.length} completed
                          </span>
                          {selectedDateTasks.length > 0 && (
                            <div className="h-1.5 w-20 bg-white/20 rounded-full overflow-hidden">
                              <div
                                style={{
                                  width: `${(selectedDateTasks.filter(t => t.completed).length / selectedDateTasks.length) * 100}%`
                                }}
                                className="h-full bg-white rounded-full"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="px-5 py-4 max-h-80 overflow-y-auto">
                    {selectedDateTasks.length === 0 ? (
                      <div className="text-center py-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-4">
                          <CalendarIcon className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">No tasks scheduled</p>
                        <p className="text-gray-400 text-sm mt-1">Add a task below to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedDateTasks.map((task) => (
                          <div
                            key={task.id}
                            onMouseEnter={() => setHoveredTaskId(task.id)}
                            onMouseLeave={() => setHoveredTaskId(null)}
                            className={`
                              flex items-center gap-3 p-4 rounded-xl border-2
                              ${task.completed
                                ? 'bg-green-50/50 border-green-100'
                                : 'bg-white border-gray-100'
                              }
                            `}
                          >
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleTask(task.id)}
                              className="flex-shrink-0"
                            >
                              {task.completed ? (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-sm">
                                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                              )}
                            </button>

                            {/* Task Title */}
                            <span
                              className={`
                                flex-1 text-sm font-medium
                                ${task.completed ? 'text-green-600' : 'text-gray-700'}
                              `}
                            >
                              {task.title}
                            </span>

                            {/* Delete Button */}
                            {hoveredTaskId === task.id && (
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="flex-shrink-0 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Task Input */}
                  <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add a new task..."
                        className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-400"
                      />
                      <button
                        onClick={handleAddTask}
                        disabled={!newTaskTitle.trim()}
                        className={`
                          p-3 rounded-xl transition-colors
                          ${newTaskTitle.trim()
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }
                        `}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
