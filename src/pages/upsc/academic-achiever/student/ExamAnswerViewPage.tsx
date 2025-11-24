import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Download,
  Printer,
  Star,
  Lightbulb,
  Target,
  Brain,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function ExamAnswerViewPage() {
  const { examId, studentId } = useParams();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(['keywords']);

  // Sample data
  const examData = {
    title: 'The Blue Revolution is not just about increased fish production but also about sustainable practices! Discuss the progress and challenges in achieving a sustainable Blue Economy in India (15M).',
    studentName: 'Archiq',
    studentId: '5459751',
    timeSpent: '85',
    score: '8/10',
    keywords: [
      { text: 'Blue Revolution', present: true },
      { text: 'Sustainable Blue Economy', present: true },
      { text: 'Fish Production', present: true },
      { text: 'Aquaculture', present: true },
      { text: 'Marine Resources', present: true },
      { text: 'Marine Conservation', present: false },
      { text: 'Sustainable Fisheries', present: true },
      { text: 'Environmental Impact', present: true },
      { text: 'Ecosystem Health', present: false },
      { text: 'Climate Change', present: false },
      { text: 'Biodiversity', present: false }
    ],
    suggestions: [
      'Quantify progress with data on fish production increase, aquaculture growth, or ICZM implementation.',
      'Elaborate on specific pollution types (plastic, chemical) and their impact on marine life.',
      'Discuss the role of climate change in affecting marine ecosystems and fisheries.',
      'Analyze the effectiveness of existing policies and suggest improvements for sustainable practices.',
      'Explore the potential of blue carbon initiatives and their contribution to carbon sequestration.'
    ],
    relevancy: 'Highly relevant to the provided text, covering progress and challenges in India\'s blue economy.',
    approach: '1. Progress:\nHighlight advancements in aquaculture, technology, ICZM, and policies like PMMSY.\n\n2. Challenges:\nAddress overfishing, pollution, climate change impacts, and the need for sustainable practices and community involvement.'
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isSectionExpanded = (section: string) => expandedSections.includes(section);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{examData.title}</h1>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {examData.studentName} • ID: {examData.studentId}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="text-sm text-indigo-600">Time Spent:</div>
                <div className="text-sm font-medium">{examData.timeSpent} minutes</div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-sm text-green-600">Score:</div>
                <div className="text-sm font-medium">{examData.score}</div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Printer className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Keywords Section */}
          <div className="bg-white rounded-xl shadow-sm">
            <button
              onClick={() => toggleSection('keywords')}
              className="w-full px-6 py-4 flex items-center gap-3 text-left"
            >
              <div className="flex items-center gap-3 flex-1">
                <Star className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="font-medium">Key-words</div>
                  <div className="text-sm text-gray-600">Core concepts</div>
                </div>
              </div>
              {isSectionExpanded('keywords') ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isSectionExpanded('keywords') && (
              <div className="px-6 pb-6">
                <div className="flex justify-end gap-4 mb-4">
                  <div className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded">Present</div>
                  <div className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded">Not present</div>
                </div>
                
                <div className="space-y-3">
                  {examData.keywords.map((keyword, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg ${
                        keyword.present ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{keyword.text}</span>
                        </div>
                        <div className={keyword.present ? 'text-green-600' : 'text-red-600'}>
                          {keyword.present ? 'Present' : 'Missing'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions Section */}
          <div className="bg-white rounded-xl shadow-sm">
            <button
              onClick={() => toggleSection('suggestions')}
              className="w-full px-6 py-4 flex items-center gap-3 text-left"
            >
              <div className="flex items-center gap-3 flex-1">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">Suggestions to improve</div>
                  <div className="text-sm text-gray-600">Enhancement Areas</div>
                </div>
              </div>
              {isSectionExpanded('suggestions') ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isSectionExpanded('suggestions') && (
              <div className="px-6 pb-6">
                <div className="space-y-4">
                  {examData.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Relevancy Section */}
          <div className="bg-white rounded-xl shadow-sm">
            <button
              onClick={() => toggleSection('relevancy')}
              className="w-full px-6 py-4 flex items-center gap-3 text-left"
            >
              <div className="flex items-center gap-3 flex-1">
                <Target className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium">Relevancy</div>
                  <div className="text-sm text-gray-600">Context Alignment</div>
                </div>
              </div>
              {isSectionExpanded('relevancy') ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isSectionExpanded('relevancy') && (
              <div className="px-6 pb-6">
                <p className="text-gray-700">{examData.relevancy}</p>
              </div>
            )}
          </div>

          {/* Approach Section */}
          <div className="bg-white rounded-xl shadow-sm">
            <button
              onClick={() => toggleSection('approach')}
              className="w-full px-6 py-4 flex items-center gap-3 text-left"
            >
              <div className="flex items-center gap-3 flex-1">
                <Brain className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">Approach</div>
                  <div className="text-sm text-gray-600">Problem-Solving Strategy</div>
                </div>
              </div>
              {isSectionExpanded('approach') ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {isSectionExpanded('approach') && (
              <div className="px-6 pb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{examData.approach}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}