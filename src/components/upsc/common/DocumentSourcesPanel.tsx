import React, { useState, useCallback } from 'react';
import {
  Upload,
  FileText,
  Image,
  FileVideo,
  FileAudio,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FilePlus,
  Search,
  Filter,
  Download,
  Eye,
  Link,
  BookOpen,
  Layers,
  Database,
  Brain,
  X
} from 'lucide-react';
import { ProcessedDocument, searchDocuments, getDocumentsByTopic, getAllEntities } from '../../../utils/documentProcessor';

interface DocumentSourcesPanelProps {
  uploadedDocuments: ProcessedDocument[];
  onUpload: (files: FileList) => void;
  onRemove: (docId: string) => void;
  isProcessing: boolean;
}

export function DocumentSourcesPanel({
  uploadedDocuments,
  onUpload,
  onRemove,
  isProcessing
}: DocumentSourcesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<ProcessedDocument | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'error'>('all');

  // Get all unique topics from documents
  const allTopics = Array.from(new Set(
    uploadedDocuments.flatMap(doc => doc.topics || [])
  ));

  // Get all entities
  const allEntities = getAllEntities();

  // Filter documents
  const filteredDocuments = uploadedDocuments.filter(doc => {
    if (filterStatus !== 'all' && doc.status !== filterStatus) return false;
    if (selectedTopic && doc.topics && !doc.topics.includes(selectedTopic)) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return doc.name.toLowerCase().includes(query) ||
             (doc.summary && doc.summary.toLowerCase().includes(query)) ||
             (doc.topics && doc.topics.some(t => t.toLowerCase().includes(query)));
    }
    return true;
  });

  // Calculate statistics
  const stats = {
    total: uploadedDocuments.length,
    ready: uploadedDocuments.filter(d => d.status === 'ready').length,
    processing: uploadedDocuments.filter(d => d.status === 'processing' || d.status === 'uploading').length,
    error: uploadedDocuments.filter(d => d.status === 'error').length,
    totalSize: uploadedDocuments.reduce((sum, doc) => sum + doc.size, 0),
    totalEntities: allEntities.length,
    totalTopics: allTopics.length
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  }, [onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Documents</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Database className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Ready to Use</p>
              <p className="text-2xl font-bold text-green-900">{stats.ready}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Topics</p>
              <p className="text-2xl font-bold text-purple-900">{stats.totalTopics}</p>
            </div>
            <Layers className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Knowledge Entities</p>
              <p className="text-2xl font-bold text-orange-900">{stats.totalEntities}</p>
            </div>
            <Brain className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents, topics, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Topic Filter */}
          <select
            value={selectedTopic || ''}
            onChange={(e) => setSelectedTopic(e.target.value || null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Topics</option>
            {allTopics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="ready">Ready</option>
            <option value="error">Error</option>
          </select>
          
          {/* View Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-gray-50"
      >
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mp3,.wav"
          onChange={(e) => e.target.files && onUpload(e.target.files)}
          className="hidden"
          id="document-upload"
          disabled={isProcessing}
        />
        <label htmlFor="document-upload" className="cursor-pointer">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isProcessing ? 'Processing Documents...' : 'Upload Study Materials'}
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your files here or click to browse
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-white rounded border border-gray-200">PDF</span>
            <span className="px-2 py-1 bg-white rounded border border-gray-200">DOCX</span>
            <span className="px-2 py-1 bg-white rounded border border-gray-200">TXT</span>
            <span className="px-2 py-1 bg-white rounded border border-gray-200">Images</span>
            <span className="px-2 py-1 bg-white rounded border border-gray-200">Videos</span>
            <span className="px-2 py-1 bg-white rounded border border-gray-200">Audio</span>
          </div>
          <p className="text-xs text-gray-500 mt-4">Maximum file size: 50MB</p>
        </label>
      </div>

      {/* Documents Display */}
      {filteredDocuments.length > 0 ? (
        <div className={viewMode === 'grid' ? 
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 
          'space-y-4'
        }>
          {filteredDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onRemove={onRemove}
              viewMode={viewMode}
              onSelect={() => setSelectedDocument(doc)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FilePlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {uploadedDocuments.length === 0 ? 'No documents uploaded yet' : 'No documents match your filters'}
          </h3>
          <p className="text-gray-600">
            {uploadedDocuments.length === 0 ? 
              'Upload your study materials to unlock AI-powered learning tools' :
              'Try adjusting your search or filters'
            }
          </p>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDocument && (
        <DocumentDetailModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}

// Document Card Component
function DocumentCard({
  document,
  onRemove,
  viewMode,
  onSelect
}: {
  document: ProcessedDocument;
  onRemove: (id: string) => void;
  viewMode: 'grid' | 'list';
  onSelect: () => void;
}) {
  const getStatusColor = (status: ProcessedDocument['status']) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'uploading': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getFileIcon = (type: ProcessedDocument['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6" />;
      case 'docx': return <FileText className="w-6 h-6" />;
      case 'image': return <Image className="w-6 h-6" />;
      case 'video': return <FileVideo className="w-6 h-6" />;
      case 'audio': return <FileAudio className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            document.type === 'pdf' ? 'bg-red-100 text-red-600' :
            document.type === 'docx' ? 'bg-blue-100 text-blue-600' :
            document.type === 'image' ? 'bg-green-100 text-green-600' :
            document.type === 'video' ? 'bg-purple-100 text-purple-600' :
            document.type === 'audio' ? 'bg-orange-100 text-orange-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {getFileIcon(document.type)}
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{document.name}</h4>
            <p className="text-sm text-gray-500">
              {formatFileSize(document.size || 0)} • {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'Unknown date'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
              {document.status}
            </span>
            
            {document.status === 'ready' && (
              <>
                <button
                  onClick={onSelect}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </>
            )}
            
            <button
              onClick={() => onRemove(document.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {document.status === 'ready' && document.summary && (
          <div className="mt-3 pl-16">
            <p className="text-sm text-gray-600 line-clamp-2">{document.summary}</p>
            {document.topics && document.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {document.topics.slice(0, 3).map((topic, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {topic}
                  </span>
                ))}
                {document.topics.length > 3 && (
                  <span className="text-xs text-gray-500">+{document.topics.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            document.type === 'pdf' ? 'bg-red-100 text-red-600' :
            document.type === 'docx' ? 'bg-blue-100 text-blue-600' :
            document.type === 'image' ? 'bg-green-100 text-green-600' :
            document.type === 'video' ? 'bg-purple-100 text-purple-600' :
            document.type === 'audio' ? 'bg-orange-100 text-orange-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {getFileIcon(document.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{document.name}</h4>
            <p className="text-sm text-gray-500 mt-1">
              {formatFileSize(document.size || 0)} • {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'Unknown date'}
            </p>
            
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border mt-2 ${getStatusColor(document.status)}`}>
              {document.status}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onRemove(document.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      {document.status === 'ready' && document.summary && (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{document.summary}</p>
          
          {document.topics && document.topics.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {document.topics.slice(0, 3).map((topic, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {topic}
                </span>
              ))}
              {document.topics.length > 3 && (
                <span className="text-xs text-gray-500">+{document.topics.length - 3}</span>
              )}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={onSelect}
              className="flex-1 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View Details
            </button>
            <button className="flex-1 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              Download
            </button>
          </div>
        </div>
      )}
      
      {document.status === 'error' && document.errorMessage && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">{document.errorMessage}</p>
        </div>
      )}
    </div>
  );
}

// Document Detail Modal
function DocumentDetailModal({
  document,
  onClose
}: {
  document: ProcessedDocument;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{document.name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            {/* Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
              <p className="text-gray-700 leading-relaxed">{document.summary}</p>
            </div>
            
            {/* Key Points */}
            {document.keyPoints && document.keyPoints.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Points</h3>
                <div className="space-y-2">
                  {document.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Topics */}
            {document.topics && document.topics.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {document.topics.map((topic, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Entities */}
            {document.entities && document.entities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Entities</h3>
                <div className="flex flex-wrap gap-2">
                  {document.entities.map((entity, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {entity}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Content Preview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {document.content.substring(0, 2000)}
                  {document.content.length > 2000 && '...'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}