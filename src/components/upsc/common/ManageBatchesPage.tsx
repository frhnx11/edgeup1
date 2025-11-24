import { useState } from 'react';
import { ArrowLeft, Search, Plus, Edit2, Trash2, Users, Calendar, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Batch {
  id: string;
  name: string;
  code: string;
  course: string;
  startDate: string;
  endDate: string;
  students: number;
  instructor: string;
  status: 'Active' | 'Completed' | 'Upcoming' | 'Cancelled';
}

interface ManageBatchesPageProps {
  onCancel?: () => void;
}

export function ManageBatchesPage({ onCancel }: ManageBatchesPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sample batch data
  const batches: Batch[] = [
    {
      id: '1',
      name: 'UPSC Prelims Foundation Batch 1',
      code: 'UPF1-2024',
      course: 'UPSC Prelims Foundation',
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      students: 45,
      instructor: 'Dr. Rajesh Kumar',
      status: 'Active'
    },
    {
      id: '2',
      name: 'UPSC Mains General Studies',
      code: 'UMG-2024',
      course: 'UPSC Mains Preparation',
      startDate: '2024-02-01',
      endDate: '2024-08-01',
      students: 38,
      instructor: 'Prof. Priya Sharma',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Current Affairs Weekly Batch',
      code: 'CAW-2024',
      course: 'Current Affairs & News Analysis',
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      students: 52,
      instructor: 'Mr. Anil Verma',
      status: 'Active'
    },
    {
      id: '4',
      name: 'UPSC History & Culture',
      code: 'UHC-2024',
      course: 'History and Indian Culture',
      startDate: '2023-11-01',
      endDate: '2024-03-01',
      students: 35,
      instructor: 'Dr. Meera Joshi',
      status: 'Completed'
    },
    {
      id: '5',
      name: 'Geography & Environment',
      code: 'GEO-2024',
      course: 'Geography and Environment',
      startDate: '2024-01-20',
      endDate: '2024-05-20',
      students: 42,
      instructor: 'Prof. Suresh Patel',
      status: 'Active'
    },
    {
      id: '6',
      name: 'Polity & Governance',
      code: 'POL-2024',
      course: 'Indian Polity & Governance',
      startDate: '2024-04-01',
      endDate: '2024-08-01',
      students: 40,
      instructor: 'Adv. Kavita Singh',
      status: 'Upcoming'
    },
    {
      id: '7',
      name: 'Economics & Social Issues',
      code: 'ECO-2024',
      course: 'Economics & Social Development',
      startDate: '2023-10-15',
      endDate: '2024-02-15',
      students: 36,
      instructor: 'Dr. Ramesh Gupta',
      status: 'Completed'
    },
    {
      id: '8',
      name: 'Science & Technology',
      code: 'SCI-2024',
      course: 'Science & Technology for UPSC',
      startDate: '2024-02-15',
      endDate: '2024-06-15',
      students: 33,
      instructor: 'Dr. Neha Agarwal',
      status: 'Active'
    },
    {
      id: '9',
      name: 'Essay Writing & Ethics',
      code: 'EWE-2024',
      course: 'Essay Writing & Ethics',
      startDate: '2024-05-01',
      endDate: '2024-09-01',
      students: 28,
      instructor: 'Prof. Vikash Dubey',
      status: 'Upcoming'
    },
    {
      id: '10',
      name: 'Mock Test Series',
      code: 'MTS-2024',
      course: 'UPSC Mock Test & Analysis',
      startDate: '2023-12-01',
      endDate: '2024-04-01',
      students: 55,
      instructor: 'Team EdgeUp',
      status: 'Completed'
    }
  ];

  // Filter batches based on search query and status
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || batch.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center">
        <button 
          onClick={handleCancel} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Manage Batches</h1>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Top Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Batch count and status filter */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium text-gray-900">{filteredBatches.length} batches</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Search field */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search batches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Batch Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border"
              onClick={() => console.log('Navigate to batch details:', batch.id)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{batch.name}</h3>
                  <p className="text-sm text-gray-500">{batch.code}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(batch.status)}`}>
                  {batch.status}
                </span>
              </div>

              {/* Course Info */}
              <div className="flex items-center mb-3">
                <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{batch.course}</span>
              </div>

              {/* Date Range */}
              <div className="flex items-center mb-3">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                </span>
              </div>

              {/* Students and Instructor */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{batch.students} students</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{batch.instructor}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Edit batch:', batch.id);
                  }}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Delete batch:', batch.id);
                  }}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBatches.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or create a new batch.</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => console.log('Create new batch')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create new batch
            </button>
            <button
              onClick={() => console.log('Import batches')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Users className="h-4 w-4 mr-2" />
              Import batches
            </button>
            <button
              onClick={() => console.log('Export batch data')}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Export batch data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}