import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Clock,
  Book,
  Settings,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  LayoutList // Changed from Columns to LayoutList
} from 'lucide-react';

interface QuestionPaper {
  id: string;
  code: string;
  exam: string;
  examTitle: string;
  course: string;
  creator: {
    name: string;
    avatar: string;
  };
  setCreated: number;
  status: 'Pending' | 'Published';
}

export function QuestionPaperPage() {
  const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const papers: QuestionPaper[] = [
    {
      id: '9CAEA0CD58',
      code: 'TEST',
      exam: 'TTest exam for demo',
      examTitle: 'Test exam for demo',
      course: 'Science8 - Science-8th',
      creator: {
        name: 'Narayana New Town',
        avatar: '/school-logo.png'
      },
      setCreated: 1,
      status: 'Pending'
    },
    {
      id: 'AFBDB47E2B',
      code: 'MATHEMATICS',
      exam: 'MATHEMATICS',
      examTitle: 'PERIODIC RETEST III - MATHEMATICS - VIII',
      course: 'MATHEMATICS8 - MATHEMATICS-8th',
      creator: {
        name: 'Narayana New Town',
        avatar: '/school-logo.png'
      },
      setCreated: 1,
      status: 'Published'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Question Papers</h1>
            <p className="text-gray-600">Create and manage exam question papers</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Show Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <LayoutList className="w-4 h-4" /> {/* Changed from Columns to LayoutList */}
            Columns
          </button>
        </div>

        {/* Question Papers Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <div className="bg-gray-50">
              <div className="grid grid-cols-[auto_1fr_2fr_1fr_auto_auto_auto] gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>Code</div>
                <div>Exam</div>
                <div>Exam Title</div>
                <div>Course</div>
                <div>Creator</div>
                <div>Set Created</div>
                <div>Status</div>
                <div>View Questions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="bg-white divide-y divide-gray-200">
              {papers.map((paper) => (
                <div key={paper.id} className="grid grid-cols-[auto_1fr_2fr_1fr_auto_auto_auto] gap-4 px-6 py-4 hover:bg-gray-50">
                  <div className="text-sm font-medium text-indigo-600">{paper.code}</div>
                  <div className="text-sm text-gray-900">{paper.exam}</div>
                  <div className="text-sm text-gray-900">{paper.examTitle}</div>
                  <div className="text-sm text-gray-900">{paper.course}</div>
                  <div className="flex items-center gap-2">
                    <img src={paper.creator.avatar} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-gray-900">{paper.creator.name}</span>
                  </div>
                  <div className="text-sm text-gray-900">{paper.setCreated}</div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      paper.status === 'Published' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {paper.status}
                    </span>
                  </div>
                  <div>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Question Paper Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <h3 className="text-xl font-semibold mb-6">Create Question Paper</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option>Select Course</option>
                    <option>Science-8th</option>
                    <option>Mathematics-8th</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}