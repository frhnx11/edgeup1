import { useState, useEffect } from 'react';
import { FileText, ChevronRight, PieChart } from 'lucide-react';

interface AdminReportsProps {
  userId: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'performance' | 'activity' | 'grades';
}

export function AdminReports({ userId }: AdminReportsProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from API
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        // Simulated API response
        const mockReports: Report[] = [
          { 
            id: '1', 
            title: 'Performance Analysis', 
            description: 'Detailed performance report across all courses',
            date: '2023-06-10',
            type: 'performance'
          },
          { 
            id: '2', 
            title: 'Activity Report', 
            description: 'User activity and engagement metrics',
            date: '2023-06-05',
            type: 'activity'
          },
          { 
            id: '3', 
            title: 'Grade Report', 
            description: 'Comprehensive grade summary for all courses',
            date: '2023-05-28',
            type: 'grades'
          },
        ];
        
        setReports(mockReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [userId]);

  if (isLoading) {
    return <div className="bg-white rounded-lg shadow-sm p-6">Loading reports...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Reports</h2>
        <button className="text-sm text-[#094d88] hover:text-[#10ac8b] transition-colors">
          View All
        </button>
      </div>
      
      <div className="divide-y divide-gray-200">
        {reports.length > 0 ? (
          reports.map(report => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    report.type === 'performance' 
                      ? 'bg-blue-50 text-blue-600' 
                      : report.type === 'activity'
                        ? 'bg-purple-50 text-purple-600'
                        : 'bg-green-50 text-green-600'
                  }`}>
                    {report.type === 'performance' ? (
                      <PieChart size={20} />
                    ) : (
                      <FileText size={20} />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{new Date(report.date).toLocaleDateString()}</span>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No reports available.
          </div>
        )}
      </div>
    </div>
  );
}
