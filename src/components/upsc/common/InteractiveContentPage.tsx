import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight,
  Folder,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  MoreHorizontal,
  Info,
  Search,
  Play,
  FileText,
  CheckSquare,
  Grid3x3,
  MapPin,
  Clipboard,
  Upload as UploadIcon,
  Plus,
  ArrowLeft,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon
} from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface InteractiveContentPageProps {
  onCancel?: () => void;
}

export const InteractiveContentPage: React.FC<InteractiveContentPageProps> = ({ onCancel }) => {
  const navigate = useNavigate();
  const [selectedContentType, setSelectedContentType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'create' | 'upload'>('create');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'alphabetical'>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [displayDescription, setDisplayDescription] = useState<boolean>(true);
  const [expandedSections, setExpandedSections] = useState({
    displayOptions: true,
    grade: false,
    commonModule: false,
    restrictAccess: false,
    activityCompletion: false,
    tags: false,
    competencies: false
  });

  const contentTypes = [
    {
      id: 'interactive-video',
      title: 'Interactive Video',
      description: 'Create videos enriched with interactions',
      icon: <Play className="w-8 h-8" />,
      color: '#3498db',
      updateAvailable: false
    },
    {
      id: 'course-presentation',
      title: 'Course Presentation',
      description: 'Create a presentation with interactive slides',
      icon: <FileText className="w-8 h-8" />,
      color: '#e74c3c',
      updateAvailable: false
    },
    {
      id: 'multiple-choice',
      title: 'Multiple Choice',
      description: 'Create flexible multiple choice questions',
      icon: <CheckSquare className="w-8 h-8" />,
      color: '#2ecc71',
      updateAvailable: false
    },
    {
      id: 'fill-blanks',
      title: 'Fill in the Blanks',
      description: 'Create a task with missing words in a text',
      icon: <FileText className="w-8 h-8" />,
      color: '#f39c12',
      updateAvailable: true
    },
    {
      id: 'drag-words',
      title: 'Drag the Words',
      description: 'Create text-based drag and drop tasks',
      icon: <Grid3x3 className="w-8 h-8" />,
      color: '#1abc9c',
      updateAvailable: true
    },
    {
      id: 'drag-drop',
      title: 'Drag and Drop',
      description: 'Create drag and drop tasks with images',
      icon: <Grid3x3 className="w-8 h-8" />,
      color: '#9b59b6',
      updateAvailable: true
    },
    {
      id: 'image-hotspots',
      title: 'Image Hotspots',
      description: 'Create an image with multiple info hotspots',
      icon: <MapPin className="w-8 h-8" />,
      color: '#34495e',
      updateAvailable: false
    }
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  const handleSave = () => {
    console.log('Saving interactive content:', {
      description,
      displayDescription,
      selectedContentType,
      expandedSections
    });
    alert('Interactive content saved successfully!');
    handleCancel();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Folder className="w-5 h-5 text-gray-500" />
          <h1 className="text-2xl font-semibold text-gray-800">Adding a new Interactive Content</h1>
        </div>
      </div>

      <div className="flex gap-6 p-8">
        {/* Main Form Area */}
        <div className="flex-1 space-y-6">
          {/* Description Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Description
            </label>
            
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Enter description here..."
            />
            
            {/* Checkbox */}
            <div className="flex items-center gap-2 mt-3">
              <input 
                type="checkbox" 
                id="display-desc" 
                className="rounded border-gray-300"
                checked={displayDescription}
                onChange={(e) => setDisplayDescription(e.target.checked)}
              />
              <label htmlFor="display-desc" className="text-sm text-gray-600">
                Display description on course page
              </label>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Editor Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Editor
            </label>
            
            {/* Dropdown */}
            <div className="relative mb-4">
              <select className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white pr-10">
                <option>H5P... Select content type</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Tabs */}
            <div className="bg-gray-800 rounded-t-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTab('create')}
                  className={`flex items-center gap-2 px-3 py-1 rounded ${
                    activeTab === 'create' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Create Content
                </button>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-2 px-3 py-1 rounded ${
                    activeTab === 'upload' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <UploadIcon className="w-4 h-4" />
                  Upload
                </button>
              </div>
              <button className="text-gray-400 hover:text-white">
                <Clipboard className="w-5 h-5" />
              </button>
            </div>

            {/* Content Types Panel */}
            <div className="border border-t-0 border-gray-200 rounded-b-lg p-6">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for Content Types"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  All Content Types <span className="text-gray-400">({contentTypes.length} results)</span>
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">Show:</span>
                  <button 
                    onClick={() => setSortBy('popular')}
                    className={`${sortBy === 'popular' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    Popular First
                  </button>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={() => setSortBy('newest')}
                    className={`${sortBy === 'newest' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    Newest First
                  </button>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={() => setSortBy('alphabetical')}
                    className={`${sortBy === 'alphabetical' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    A to Z
                  </button>
                </div>
              </div>

              {/* Content Type Grid */}
              <div className="space-y-4">
                {contentTypes
                  .filter(type => 
                    type.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    type.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((type) => (
                    <div 
                      key={type.id} 
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors cursor-pointer ${
                        selectedContentType === type.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedContentType(type.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-16 h-16 rounded-lg flex items-center justify-center" 
                          style={{ backgroundColor: `${type.color}20` }}
                        >
                          <div style={{ color: type.color }}>
                            {type.icon}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{type.title}</h4>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {type.updateAvailable && (
                          <span className="text-xs text-gray-500">Update available</span>
                        )}
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle details click
                          }}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Get Button */}
              <div className="flex justify-end mt-6">
                <button 
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedContentType}
                >
                  <Plus className="w-4 h-4" />
                  Get
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Options */}
        <div className="w-80 space-y-4">
          {/* Display Options */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('displayOptions')}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
            >
              <span className="text-sm font-medium text-gray-700">Display Options</span>
              {expandedSections.displayOptions ? 
                <ChevronDownIcon className="w-4 h-4 text-gray-500" /> : 
                <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              }
            </button>
            {expandedSections.displayOptions && (
              <div className="px-4 pb-4 space-y-3">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    defaultChecked 
                  />
                  <span className="text-sm text-gray-600">Display action bar and frame</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    defaultChecked 
                  />
                  <span className="text-sm text-gray-600">Copyright button</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-600">Enable download button</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-600">Enable embed button</span>
                </label>
              </div>
            )}
          </div>

          {/* Other Sections */}
          {[
            { key: 'grade', label: 'Grade' },
            { key: 'commonModule', label: 'Common module settings' },
            { key: 'restrictAccess', label: 'Restrict access' },
            { key: 'activityCompletion', label: 'Activity completion' },
            { key: 'tags', label: 'Tags' },
            { key: 'competencies', label: 'Competencies' }
          ].map((section) => (
            <div key={section.key} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-700">{section.label}</span>
                {expandedSections[section.key as keyof typeof expandedSections] ? 
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" /> : 
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                }
              </button>
              {expandedSections[section.key as keyof typeof expandedSections] && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-500">Settings for {section.label} will be configured here.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 border-t border-gray-200 px-8 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save and return to course
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save and display
          </button>
          <button 
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveContentPage;