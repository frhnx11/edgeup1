// Events Data for Activity Hub
import type { Event } from '../types/activityHub';

export const events: Event[] = [
  {
    id: 'evt-1',
    title: 'Inter-School Debate Championship',
    type: 'competition',
    date: '2025-02-15',
    time: '10:00 AM',
    venue: 'Main Auditorium',
    organizer: 'Debate Club',
    description: 'Annual inter-school debate competition with teams from 12 schools across the city.',
    registrationDeadline: '2025-02-05',
    registrationStatus: 'open',
    maxParticipants: 30,
    currentParticipants: 18,
    category: 'academic',
    benefits: ['Cash prizes', 'Certificates', 'Trophy for winners']
  },
  {
    id: 'evt-2',
    title: 'Robotics Workshop by IIT Delhi',
    type: 'workshop',
    date: '2025-01-28',
    time: '2:00 PM',
    venue: 'STEM Lab',
    organizer: 'Robotics Club',
    description: 'Hands-on workshop on Arduino programming and robot building led by IIT Delhi students.',
    registrationDeadline: '2025-01-25',
    registrationStatus: 'registered',
    maxParticipants: 20,
    currentParticipants: 20,
    category: 'tech'
  },
  {
    id: 'evt-3',
    title: 'Annual Day Celebration',
    type: 'cultural',
    date: '2025-03-20',
    time: '6:00 PM',
    venue: 'School Grounds',
    organizer: 'School Administration',
    description: 'Grand annual day celebration with cultural performances, prize distribution, and showcases.',
    registrationDeadline: '2025-03-10',
    registrationStatus: 'open',
    category: 'cultural',
    maxParticipants: 200
  },
  {
    id: 'evt-4',
    title: 'Basketball Tournament',
    type: 'sports',
    date: '2025-02-10',
    time: '9:00 AM',
    venue: 'Sports Complex',
    organizer: 'Basketball Team',
    description: 'Inter-class basketball tournament with knockout rounds.',
    registrationDeadline: '2025-02-01',
    registrationStatus: 'open',
    maxParticipants: 60,
    currentParticipants: 42,
    category: 'sports'
  },
  {
    id: 'evt-5',
    title: 'Photography Exhibition',
    type: 'performance',
    date: '2025-02-28',
    time: '11:00 AM',
    venue: 'Art Gallery',
    organizer: 'Photography Club',
    description: 'Display best photographs clicked by students with theme "Nature & Sustainability".',
    registrationDeadline: '2025-02-20',
    registrationStatus: 'open',
    category: 'arts',
    maxParticipants: 50
  }
];
