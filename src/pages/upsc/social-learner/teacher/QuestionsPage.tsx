import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  ClipboardList,
  Database,
  Tag,
  ChevronRight,
  Search,
  Filter,
  Plus
} from 'lucide-react';

export function QuestionsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'papers',
      title: 'Question Papers',
      description: 'Create and manage exam question papers',
      icon: ClipboardList,
      path: '/admin/question-papers',
      stats: {
        total: 28,
        recent: '5 papers created this week'
      }
    },
    {
      id: 'bank',
      title: 'Question Bank',
      description: 'Organize and store questions by subject',
      icon: Database,
      path: '/admin/question-bank',
      stats: {
        total: 1250,
        recent: '45 questions added today'
      }
    },
    {
      id: 'types',
      title: 'Question Types',
      description: 'Manage different types of questions',
      icon: Tag,
      path: '/admin/question-types',
      stats: {
        total: 6,
        recent: 'Last updated 2 days ago'
      }
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
            <p className="text-[#094d88]">Manage all aspects of your question system</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#094d88] focus:ring focus:ring-[#094d88]/20 focus:ring-opacity-50"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(section.path)}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#094d88]/10 text-[#094d88] rounded-lg flex items-center justify-center group-hover:bg-[#094d88] group-hover:text-white transition-colors">
                    <section.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{section.title}</h3>
                    <p className="text-sm text-[#094d88]">{section.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-[#094d88]">Total</div>
                    <div className="font-medium">{section.stats.total}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-[#094d88]">Recent Activity</div>
                    <div className="font-medium text-sm">{section.stats.recent}</div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button className="w-full flex items-center justify-center gap-2 text-[#094d88] hover:text-[#10ac8b] transition-colors">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Quick Actions Menu */}
              <div className="absolute top-0 right-0 mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`${section.path}/create`);
                  }}
                  className="p-2 bg-[#094d88] text-white rounded-lg hover:bg-[#10ac8b] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}