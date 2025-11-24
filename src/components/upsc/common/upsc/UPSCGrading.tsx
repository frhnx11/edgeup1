export function UPSCGrading() {
  const grades = [
    { subject: 'Indian Polity', grade: 'A', percentage: 85 },
    { subject: 'Economics', grade: 'B+', percentage: 78 },
    { subject: 'Geography', grade: 'A-', percentage: 82 },
    { subject: 'History', grade: 'B', percentage: 75 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Grading Overview</h2>
      
      <div className="space-y-4">
        {grades.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-2 h-10 rounded-sm mr-3 ${
                item.grade.startsWith('A') ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <div>
                <p className="text-gray-700">{item.subject}</p>
                <p className="text-xs text-gray-500">{item.percentage}%</p>
              </div>
            </div>
            <div className="text-xl font-semibold text-gray-900">{item.grade}</div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-5 py-2 px-4 bg-gray-50 text-brand-primary hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">
        View Detailed Report
      </button>
    </div>
  );
}
