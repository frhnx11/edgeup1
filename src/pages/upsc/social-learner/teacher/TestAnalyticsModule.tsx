import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import { 
  Users, 
  User, 
  TrendingUp, 
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import { AllStudentsOverview } from '../../../../components/upsc/common/testAnalytics/AllStudentsOverview';
import { IndividualStudentAnalysis } from '../../../../components/upsc/common/testAnalytics/IndividualStudentAnalysis';
import { StrengthWeaknessAnalysis } from '../../../../components/upsc/common/testAnalytics/StrengthWeaknessAnalysis';
import { TestCompletionTracker } from '../../../../components/upsc/common/testAnalytics/TestCompletionTracker';

type TabType = 'overview' | 'individual' | 'analysis' | 'tracker';

interface Tab {
  id: TabType;
  label: string;
  icon: any;
  description: string;
  adminOnly?: boolean;
}

export function TestAnalyticsModule() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  
  // Check if user is admin (you can get this from your auth context)
  const isAdmin = true; // Replace with actual admin check

  const tabs: Tab[] = [
    {
      id: 'overview',
      label: 'All Students Overview',
      icon: Users,
      description: 'View performance data for all students'
    },
    {
      id: 'individual',
      label: 'Individual Analysis',
      icon: User,
      description: 'Deep dive into individual student performance'
    },
    {
      id: 'analysis',
      label: 'Strength & Weakness',
      icon: TrendingUp,
      description: 'Analyze strengths and get improvement recommendations'
    },
    {
      id: 'tracker',
      label: 'Completion Tracker',
      icon: CheckCircle,
      description: 'Track test completion status',
      adminOnly: true
    }
  ];

  const filteredTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    setActiveTab('individual');
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Test Analytics</h1>
                <p className="text-gray-600 mt-1">
                  Comprehensive analysis of student performance and test results
                </p>
              </div>
              
              {/* Global Search */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
              {filteredTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Description */}
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm text-blue-700">
              {filteredTabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'overview' && (
            <AllStudentsOverview 
              searchQuery={searchQuery}
              onStudentSelect={handleStudentSelect}
            />
          )}
          
          {activeTab === 'individual' && (
            <IndividualStudentAnalysis 
              studentId={selectedStudent}
              searchQuery={searchQuery}
            />
          )}
          
          {activeTab === 'analysis' && (
            <StrengthWeaknessAnalysis 
              studentId={selectedStudent}
            />
          )}
          
          {activeTab === 'tracker' && isAdmin && (
            <TestCompletionTracker />
          )}
        </div>
      </div>

      {/* CSS for scrollbar hide */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </AdminLayout>
  );
}