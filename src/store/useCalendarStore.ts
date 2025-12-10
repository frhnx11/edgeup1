import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface CalendarTask {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  createdAt: string;
}

interface CalendarState {
  tasks: CalendarTask[];

  // Actions
  addTask: (title: string, date: string) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, title: string) => void;
  getTasksByDate: (date: string) => CalendarTask[];
  getTaskCountByDate: (date: string) => number;
}

// Helper to generate unique ID
const generateId = () =>
  `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper to get date string
const getDateString = (date: Date) => date.toISOString().split('T')[0];

// Helper to get date N days from now
const getDateNDaysFromNow = (n: number) => {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return getDateString(date);
};

// Generate mock tasks for demo
const generateMockTasks = (): CalendarTask[] => {
  const tasks: CalendarTask[] = [];
  const today = getDateString(new Date());

  // Today's tasks
  tasks.push({
    id: generateId(),
    title: 'Review Polity Chapter 5 - Fundamental Rights',
    date: today,
    completed: false,
    createdAt: new Date().toISOString()
  });
  tasks.push({
    id: generateId(),
    title: 'Practice 20 MCQs on Indian History',
    date: today,
    completed: true,
    createdAt: new Date().toISOString()
  });
  tasks.push({
    id: generateId(),
    title: 'Read The Hindu Editorial',
    date: today,
    completed: false,
    createdAt: new Date().toISOString()
  });

  // Tomorrow
  tasks.push({
    id: generateId(),
    title: 'Geography - Map practice (Rivers)',
    date: getDateNDaysFromNow(1),
    completed: false,
    createdAt: new Date().toISOString()
  });
  tasks.push({
    id: generateId(),
    title: 'Complete Environment notes',
    date: getDateNDaysFromNow(1),
    completed: false,
    createdAt: new Date().toISOString()
  });

  // Day after tomorrow
  tasks.push({
    id: generateId(),
    title: 'Essay writing practice - Ethics topic',
    date: getDateNDaysFromNow(2),
    completed: false,
    createdAt: new Date().toISOString()
  });

  // 3 days from now
  tasks.push({
    id: generateId(),
    title: 'Revision - Ancient India',
    date: getDateNDaysFromNow(3),
    completed: false,
    createdAt: new Date().toISOString()
  });
  tasks.push({
    id: generateId(),
    title: 'Current Affairs weekly compilation',
    date: getDateNDaysFromNow(3),
    completed: false,
    createdAt: new Date().toISOString()
  });

  // 5 days from now
  tasks.push({
    id: generateId(),
    title: 'Mock Test - GS Paper 1',
    date: getDateNDaysFromNow(5),
    completed: false,
    createdAt: new Date().toISOString()
  });

  // Past tasks (yesterday)
  tasks.push({
    id: generateId(),
    title: 'Complete Economics chapter',
    date: getDateNDaysFromNow(-1),
    completed: true,
    createdAt: new Date().toISOString()
  });
  tasks.push({
    id: generateId(),
    title: 'Watch Polity lecture',
    date: getDateNDaysFromNow(-1),
    completed: true,
    createdAt: new Date().toISOString()
  });

  // 2 days ago
  tasks.push({
    id: generateId(),
    title: 'Science & Tech notes',
    date: getDateNDaysFromNow(-2),
    completed: true,
    createdAt: new Date().toISOString()
  });

  // 4 days ago
  tasks.push({
    id: generateId(),
    title: 'Answer writing - 3 questions',
    date: getDateNDaysFromNow(-4),
    completed: true,
    createdAt: new Date().toISOString()
  });
  tasks.push({
    id: generateId(),
    title: 'Geography physical features',
    date: getDateNDaysFromNow(-4),
    completed: false,
    createdAt: new Date().toISOString()
  });

  return tasks;
};

// Initial mock data
const INITIAL_MOCK_TASKS = generateMockTasks();

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      tasks: INITIAL_MOCK_TASKS,

      addTask: (title, date) => {
        const newTask: CalendarTask = {
          id: generateId(),
          title,
          date,
          completed: false,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
      },

      toggleTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        }));
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId)
        }));
      },

      updateTask: (taskId, title) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, title } : task
          )
        }));
      },

      getTasksByDate: (date) => {
        return get().tasks.filter((task) => task.date === date);
      },

      getTaskCountByDate: (date) => {
        return get().tasks.filter((task) => task.date === date).length;
      }
    }),
    {
      name: 'calendar-storage'
    }
  )
);
