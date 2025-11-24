import React, { useState } from 'react';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Hash,
  Users,
  Calendar,
  BookOpen,
  Lightbulb,
  Target,
  BarChart3,
  Brain,
  Download,
  Share2,
  X
} from 'lucide-react';
import { ProcessedDocument } from '../../../utils/documentProcessor';

interface DocumentSummaryProps {
  document: ProcessedDocument;
  onClose?: () => void;
  variant?: 'inline' | 'modal' | 'card';
}

export function DocumentSummary({ document, onClose, variant = 'card' }: DocumentSummaryProps) {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    keyPoints: true,
    topics: true,
    entities: false,
    preview: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const getDocumentInsights = () => {
    const insights = [];
    
    if (document.entities.filter(e => e.match(/\d{4}/)).length > 3) {
      insights.push({ icon: Calendar, text: 'Rich in historical dates' });
    }
    if (document.entities.filter(e => e.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/)).length > 5) {
      insights.push({ icon: Users, text: 'Multiple key figures mentioned' });
    }
    if (document.keyPoints.length > 7) {
      insights.push({ icon: Target, text: 'Comprehensive coverage' });
    }
    if (document.topics.length > 5) {
      insights.push({ icon: Brain, text: 'Multi-disciplinary content' });
    }
    
    return insights;
  };

  const insights = getDocumentInsights();

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{document.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {getReadingTime(document.content)} • {new Date(document.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            )}
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            <DocumentSummaryContent
              document={document}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              insights={insights}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl ${variant === 'card' ? 'border border-gray-200 shadow-sm' : ''}`}>
      {variant === 'card' && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Document Summary
            </h3>
            <span className="text-sm text-gray-500">{getReadingTime(document.content)}</span>
          </div>
        </div>
      )}
      
      <div className={variant === 'card' ? 'p-4' : ''}>
        <DocumentSummaryContent
          document={document}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          insights={insights}
        />
      </div>
    </div>
  );
}

function DocumentSummaryContent({
  document,
  expandedSections,
  toggleSection,
  insights
}: {
  document: ProcessedDocument;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: any) => void;
  insights: Array<{ icon: any; text: string }>;
}) {
  return (
    <div className="space-y-6">
      {/* Quick Insights */}
      {insights.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-blue-50 rounded-lg p-3 flex items-center gap-2">
              <insight.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs text-blue-700">{insight.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Summary Section */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Summary
          </h4>
          {expandedSections.summary ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        
        {expandedSections.summary && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{document.summary}</p>
          </div>
        )}
      </div>

      {/* Key Points Section */}
      {document.keyPoints.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('keyPoints')}
            className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Key Points ({document.keyPoints.length})
            </h4>
            {expandedSections.keyPoints ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
          {expandedSections.keyPoints && (
            <div className="space-y-2">
              {document.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-yellow-800">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Topics Section */}
      {document.topics.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('topics')}
            className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Hash className="w-5 h-5 text-green-600" />
              Topics Covered ({document.topics.length})
            </h4>
            {expandedSections.topics ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
          {expandedSections.topics && (
            <div className="flex flex-wrap gap-2">
              {document.topics.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Entities Section */}
      {document.entities.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('entities')}
            className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Key Entities ({document.entities.length})
            </h4>
            {expandedSections.entities ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
          {expandedSections.entities && (
            <div className="flex flex-wrap gap-2">
              {document.entities.map((entity, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {entity}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Document Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          Document Statistics
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Total Characters</p>
            <p className="font-semibold text-gray-900">{document.content.length.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Word Count</p>
            <p className="font-semibold text-gray-900">~{Math.round(document.content.split(/\s+/).length).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">File Type</p>
            <p className="font-semibold text-gray-900">{document.type.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-gray-500">Processing Status</p>
            <p className="font-semibold text-green-600">Ready</p>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('preview')}
          className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            Content Preview
          </h4>
          {expandedSections.preview ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        
        {expandedSections.preview && (
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {document.content.substring(0, 1000)}
              {document.content.length > 1000 && '...'}
            </pre>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Brain className="w-4 h-4" />
          Generate Study Materials
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}