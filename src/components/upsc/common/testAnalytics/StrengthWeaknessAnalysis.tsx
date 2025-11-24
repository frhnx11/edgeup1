import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BookOpen,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';

interface StrengthWeaknessAnalysisProps {
  studentId: string | null;
}

interface SubjectPerformance {
  subject: string;
  score: number;
  level: 'strong' | 'moderate' | 'weak';
  topics: string[];
}

interface Prescription {
  id: string;
  subject: string;
  topic: string;
  weakness: string;
  recommendation: string;
  resources: string[];
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
}

export function StrengthWeaknessAnalysis({ studentId }: StrengthWeaknessAnalysisProps) {
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  useEffect(() => {
    // Sample data
    setSubjectPerformance([
      { 
        subject: 'Mathematics', 
        score: 88, 
        level: 'strong',
        topics: ['Algebra', 'Calculus', 'Geometry', 'Statistics']
      },
      { 
        subject: 'Science', 
        score: 75, 
        level: 'moderate',
        topics: ['Physics', 'Chemistry', 'Biology']
      },
      { 
        subject: 'English', 
        score: 65, 
        level: 'weak',
        topics: ['Grammar', 'Vocabulary', 'Comprehension', 'Writing']
      },
      { 
        subject: 'History', 
        score: 82, 
        level: 'strong',
        topics: ['Ancient History', 'Medieval History', 'Modern History']
      },
      { 
        subject: 'Geography', 
        score: 70, 
        level: 'moderate',
        topics: ['Physical Geography', 'Human Geography', 'Environmental Geography']
      },
      { 
        subject: 'Economics', 
        score: 58, 
        level: 'weak',
        topics: ['Microeconomics', 'Macroeconomics', 'International Trade']
      }
    ]);

    setPrescriptions([
      {
        id: '1',
        subject: 'English',
        topic: 'Grammar',
        weakness: 'Difficulty with complex sentence structures',
        recommendation: 'Focus on sentence diagramming and clause identification',
        resources: ['Advanced Grammar Workbook', 'Online Grammar Exercises', 'Video Tutorials'],
        estimatedTime: 120,
        priority: 'high'
      },
      {
        id: '2',
        subject: 'Economics',
        topic: 'Macroeconomics',
        weakness: 'Weak understanding of fiscal policies',
        recommendation: 'Study government budget and monetary policies',
        resources: ['Economics Textbook Ch. 5-7', 'Khan Academy Videos', 'Practice Problems Set'],
        estimatedTime: 90,
        priority: 'high'
      },
      {
        id: '3',
        subject: 'Science',
        topic: 'Chemistry',
        weakness: 'Organic chemistry reactions',
        recommendation: 'Practice naming compounds and reaction mechanisms',
        resources: ['Chemistry Lab Manual', 'Organic Chemistry Guide', 'Interactive Simulations'],
        estimatedTime: 60,
        priority: 'medium'
      },
      {
        id: '4',
        subject: 'Geography',
        topic: 'Human Geography',
        weakness: 'Population distribution concepts',
        recommendation: 'Review demographic transition models',
        resources: ['Geography Atlas', 'Population Studies Guide', 'Case Studies'],
        estimatedTime: 45,
        priority: 'low'
      }
    ]);
  }, [studentId]);

  const getColorForLevel = (level: string) => {
    switch (level) {
      case 'strong': return 'from-green-400 to-green-600';
      case 'moderate': return 'from-yellow-400 to-yellow-600';
      case 'weak': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPrescriptions = prescriptions.filter(p => 
    filterPriority === 'all' || p.priority === filterPriority
  );

  // Sort subjects by performance for pyramid
  const sortedSubjects = [...subjectPerformance].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      {/* Visual Pyramid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Pyramid</h2>
        
        <div className="relative">
          {/* Pyramid visualization */}
          <div className="max-w-2xl mx-auto">
            {sortedSubjects.map((subject, index) => {
              const width = 100 - (index * 15); // Decrease width for pyramid effect
              const marginLeft = (100 - width) / 2;
              
              return (
                <div
                  key={subject.subject}
                  className={`relative h-20 mb-2 rounded-lg bg-gradient-to-r ${getColorForLevel(subject.level)} 
                    cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  style={{ 
                    width: `${width}%`, 
                    marginLeft: `${marginLeft}%`,
                    opacity: 1 - (index * 0.1)
                  }}
                  onClick={() => setSelectedSubject(subject.subject)}
                >
                  <div className="absolute inset-0 flex items-center justify-between px-6">
                    <div className="text-white">
                      <p className="font-semibold text-lg">{subject.subject}</p>
                      <p className="text-sm opacity-90">Score: {subject.score}%</p>
                    </div>
                    <div className="text-white text-right">
                      <p className="text-sm font-medium capitalize">{subject.level}</p>
                      <p className="text-xs opacity-90">{subject.topics.length} topics</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded"></div>
              <span className="text-sm text-gray-600">Strong (80%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded"></div>
              <span className="text-sm text-gray-600">Moderate (60-79%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded"></div>
              <span className="text-sm text-gray-600">Weak (&lt;60%)</span>
            </div>
          </div>
        </div>

        {/* Selected Subject Details */}
        {selectedSubject && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{selectedSubject} - Detailed Topics</h3>
            <div className="flex flex-wrap gap-2">
              {subjectPerformance.find(s => s.subject === selectedSubject)?.topics.map((topic, index) => (
                <span key={index} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prescriptions Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Improvement Prescriptions</h2>
              <p className="text-gray-600 mt-1">Personalized recommendations based on weak areas</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {prescription.subject} - {prescription.topic}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(prescription.priority)}`}>
                      {prescription.priority} priority
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Weakness:</strong> {prescription.weakness}</span>
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                      <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Recommendation:</strong> {prescription.recommendation}</span>
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Recommended Resources:</p>
                    <div className="flex flex-wrap gap-2">
                      {prescription.resources.map((resource, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                          <BookOpen className="w-3 h-3" />
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Estimated time: {prescription.estimatedTime} minutes
                    </span>
                  </div>
                </div>

                <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No prescriptions found for the selected priority level</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">Strong Subjects</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {subjectPerformance.filter(s => s.level === 'strong').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Keep up the good work!</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">Areas to Improve</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {subjectPerformance.filter(s => s.level === 'moderate').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Need moderate attention</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">Weak Areas</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {subjectPerformance.filter(s => s.level === 'weak').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Require immediate attention</p>
        </div>
      </div>
    </div>
  );
}