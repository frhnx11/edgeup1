import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Search, 
  Highlighter, 
  Edit3, 
  StickyNote, 
  Volume2, 
  Languages, 
  Users, 
  Clock, 
  Download, 
  Columns, 
  BookOpen, 
  List, 
  Quote, 
  Brain, 
  CreditCard, 
  Moon, 
  Sun, 
  Type, 
  Timer, 
  Eye, 
  Link2, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Save,
  Share2,
  Bookmark,
  FileText,
  MessageSquare,
  Palette,
  Settings,
  X,
  Check,
  Copy,
  Trash2,
  Edit,
  Plus,
  Minus,
  RefreshCw,
  Navigation,
  Hash,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline as UnderlineIcon
} from 'lucide-react';
import { PDFViewer } from '../../../../components/upsc/common/PDFViewer';

interface Annotation {
  id: string;
  type: 'highlight' | 'underline' | 'note' | 'drawing';
  pageNumber: number;
  position: { x: number; y: number; width?: number; height?: number };
  content: string;
  color: string;
  createdAt: Date;
  createdBy: string;
  text?: string;
}

interface Note {
  id: string;
  pageNumber: number;
  content: string;
  createdAt: Date;
  tags: string[];
}

interface ReadingSession {
  startTime: Date;
  endTime?: Date;
  pagesRead: number[];
  totalTime: number;
}

interface DocumentVersion {
  id: string;
  timestamp: Date;
  annotations: Annotation[];
  notes: Note[];
  description: string;
}

const DocumentLearningPage: React.FC = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const pdfViewerRef = useRef<any>(null);

  // Document state
  const [documentUrl, setDocumentUrl] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  // UI state
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState<string>('Inter');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'annotations' | 'toc' | 'citations'>('notes');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSplitScreen, setIsSplitScreen] = useState<boolean>(false);
  const [isDistractionFree, setIsDistractionFree] = useState<boolean>(false);

  // Feature state
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('cursor');
  const [highlightColor, setHighlightColor] = useState<string>('#FFEB3B');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [readingTime, setReadingTime] = useState<number>(0);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState<number>(0);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [tableOfContents, setTableOfContents] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [practiceQuestions, setPracticeQuestions] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>('');

  // New note state
  const [newNote, setNewNote] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');
  const [showAnnotationMenu, setShowAnnotationMenu] = useState<boolean>(false);
  const [annotationMenuPosition, setAnnotationMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Load document
  useEffect(() => {
    loadDocument();
    loadAnnotations();
    loadNotes();
    loadReadingProgress();
    loadVersionHistory();
    generateTableOfContents();
    estimateReadingTime();
  }, [documentId]);

  const loadDocument = async () => {
    // Simulate loading document
    setDocumentUrl('/sample.pdf');
    setDocumentTitle('Advanced Machine Learning Concepts');
    setTotalPages(250);
  };

  const loadAnnotations = async () => {
    try {
      const { data, error } = await supabase
        .from('document_annotations')
        .select('*')
        .eq('document_id', documentId);

      if (error) throw error;
      setAnnotations(data || []);
    } catch (error) {
      console.error('Error loading annotations:', error);
    }
  };

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('document_notes')
        .select('*')
        .eq('document_id', documentId);

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const loadReadingProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('document_id', documentId)
        .single();

      if (error) throw error;
      if (data) {
        setCurrentPage(data.current_page);
        setReadingProgress(data.progress);
        setReadingTime(data.total_reading_time);
      }
    } catch (error) {
      console.error('Error loading reading progress:', error);
    }
  };

  const loadVersionHistory = async () => {
    // Simulate loading version history
    setVersions([
      {
        id: '1',
        timestamp: new Date('2024-01-15'),
        annotations: [],
        notes: [],
        description: 'Initial reading session'
      },
      {
        id: '2',
        timestamp: new Date('2024-01-20'),
        annotations: [],
        notes: [],
        description: 'Added chapter summaries'
      }
    ]);
  };

  const generateTableOfContents = async () => {
    // Simulate generating TOC
    setTableOfContents([
      { title: 'Chapter 1: Introduction', page: 1 },
      { title: 'Chapter 2: Neural Networks', page: 25 },
      { title: 'Chapter 3: Deep Learning', page: 75 },
      { title: 'Chapter 4: Computer Vision', page: 125 },
      { title: 'Chapter 5: Natural Language Processing', page: 175 }
    ]);
  };

  const estimateReadingTime = async () => {
    // Estimate based on average reading speed (250 words per minute)
    const avgWordsPerPage = 300;
    const totalWords = totalPages * avgWordsPerPage;
    const readingTimeMinutes = totalWords / 250;
    setEstimatedReadingTime(Math.ceil(readingTimeMinutes));
  };

  // Annotation functions
  const addAnnotation = async (type: 'highlight' | 'underline' | 'note', text?: string) => {
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type,
      pageNumber: currentPage,
      position: { x: annotationMenuPosition.x, y: annotationMenuPosition.y },
      content: text || selectedText,
      color: highlightColor,
      createdAt: new Date(),
      createdBy: 'current_user',
      text: selectedText
    };

    setAnnotations([...annotations, newAnnotation]);
    setShowAnnotationMenu(false);
    setSelectedText('');

    // Save to database
    try {
      await supabase.from('document_annotations').insert({
        document_id: documentId,
        ...newAnnotation
      });
    } catch (error) {
      console.error('Error saving annotation:', error);
    }
  };

  const deleteAnnotation = async (id: string) => {
    setAnnotations(annotations.filter(a => a.id !== id));
    
    try {
      await supabase
        .from('document_annotations')
        .delete()
        .eq('id', id);
    } catch (error) {
      console.error('Error deleting annotation:', error);
    }
  };

  // Note functions
  const addNote = async () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      pageNumber: currentPage,
      content: newNote,
      createdAt: new Date(),
      tags: []
    };

    setNotes([...notes, note]);
    setNewNote('');

    try {
      await supabase.from('document_notes').insert({
        document_id: documentId,
        ...note
      });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Text-to-speech
  const toggleTextToSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const text = selectedText || 'Page content here'; // Get actual page text
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Translation
  const translateText = async (text: string, targetLang: string) => {
    // Implement translation API call
    console.log('Translating:', text, 'to', targetLang);
  };

  // Export annotations
  const exportAnnotations = () => {
    const data = {
      document: documentTitle,
      annotations: annotations,
      notes: notes,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle}_annotations.json`;
    a.click();
  };

  // Generate citation
  const generateCitation = (style: 'APA' | 'MLA' | 'Chicago') => {
    const citation = {
      APA: `Author, A. (2024). ${documentTitle}. Publisher.`,
      MLA: `Author, First. "${documentTitle}." Publisher, 2024.`,
      Chicago: `Author, First. ${documentTitle}. City: Publisher, 2024.`
    };

    navigator.clipboard.writeText(citation[style]);
  };

  // AI summarization
  const generateSummary = async () => {
    // Simulate AI summarization
    setSummary('This document explores advanced machine learning concepts including neural networks, deep learning architectures, and practical applications in computer vision and NLP...');
  };

  // Generate flashcards
  const generateFlashcards = async () => {
    const cards = annotations
      .filter(a => a.type === 'highlight')
      .map(a => ({
        id: a.id,
        front: a.text || 'Question',
        back: `Review: ${a.content}`,
        pageRef: a.pageNumber
      }));

    setFlashcards(cards);
  };

  // Generate practice questions
  const generatePracticeQuestions = async () => {
    // Simulate AI-generated questions
    setPracticeQuestions([
      {
        id: '1',
        question: 'What is the primary difference between supervised and unsupervised learning?',
        options: ['A', 'B', 'C', 'D'],
        answer: 'A',
        pageRef: 15
      }
    ]);
  };

  // Navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      updateReadingProgress(page);
    }
  };

  const updateReadingProgress = async (page: number) => {
    const progress = (page / totalPages) * 100;
    setReadingProgress(progress);

    try {
      await supabase
        .from('reading_progress')
        .upsert({
          document_id: documentId,
          current_page: page,
          progress: progress,
          total_reading_time: readingTime
        });
    } catch (error) {
      console.error('Error updating reading progress:', error);
    }
  };

  // Zoom functions
  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 50));
  const handleRotate = () => setRotation((rotation + 90) % 360);

  // Save version
  const saveVersion = async (description: string) => {
    const version: DocumentVersion = {
      id: Date.now().toString(),
      timestamp: new Date(),
      annotations: [...annotations],
      notes: [...notes],
      description
    };

    setVersions([...versions, version]);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 text-gray-900">
      {/* Header */}
      {!isDistractionFree && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h1 className="ml-4 text-lg font-semibold flex-1 truncate">{documentTitle}</h1>

          {/* Toolbar */}
          <div className="flex items-center space-x-2">
            {/* Zoom controls */}
            <div className="flex items-center space-x-1 border-r pr-2">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm w-12 text-center">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Rotate */}
            <button
              onClick={handleRotate}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Annotation tools */}
            <div className="flex items-center space-x-1 border-l pl-2">
              <button
                onClick={() => setSelectedTool('highlight')}
                className={`p-2 rounded ${selectedTool === 'highlight' ? 'bg-yellow-200 bg-yellow-800' : 'hover:bg-gray-100'}`}
              >
                <Highlighter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedTool('underline')}
                className={`p-2 rounded ${selectedTool === 'underline' ? 'bg-blue-200 bg-blue-800' : 'hover:bg-gray-100'}`}
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedTool('note')}
                className={`p-2 rounded ${selectedTool === 'note' ? 'bg-green-200 bg-green-800' : 'hover:bg-gray-100'}`}
              >
                <StickyNote className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedTool('draw')}
                className={`p-2 rounded ${selectedTool === 'draw' ? 'bg-purple-200 bg-purple-800' : 'hover:bg-gray-100'}`}
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* Color picker */}
            <input
              type="color"
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />

            {/* Additional tools */}
            <div className="flex items-center space-x-1 border-l pl-2">
              <button
                onClick={toggleTextToSpeech}
                className={`p-2 rounded ${isSpeaking ? 'bg-blue-200 bg-blue-800' : 'hover:bg-gray-100'}`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsSplitScreen(!isSplitScreen)}
                className={`p-2 rounded ${isSplitScreen ? 'bg-blue-200 bg-blue-800' : 'hover:bg-gray-100'}`}
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsDistractionFree(!isDistractionFree)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-100 rounded"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>


            {/* Settings */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 z-40">
          <div className="max-w-2xl mx-auto flex items-center space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in document..."
              className="flex-1 px-4 py-2 border rounded-lg bg-gray-100 border-gray-600"
              autoFocus
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="max-w-2xl mx-auto mt-2 space-y-1">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => goToPage(result.page)}
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <p className="text-sm">Page {result.page}: {result.snippet}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main content area */}
      <div className={`flex-1 flex ${!isDistractionFree ? 'mt-16' : ''}`}>
        {/* Document viewer */}
        <div className={`flex-1 flex ${isSplitScreen ? 'w-1/2' : ''}`}>
          <div className="flex-1 relative overflow-hidden">
            {/* PDF Viewer would go here */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-white">
              <div 
                className="bg-white bg-gray-100 p-8 rounded-lg shadow-lg"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  fontSize: `${fontSize}px`,
                  fontFamily: fontFamily
                }}
              >
                <p className="text-lg mb-4">Page {currentPage} of {totalPages}</p>
                <p>Document content would be displayed here...</p>
              </div>
            </div>

            {/* Annotation menu */}
            {showAnnotationMenu && (
              <div
                className="absolute bg-white rounded-lg shadow-lg p-2 z-50"
                style={{ left: annotationMenuPosition.x, top: annotationMenuPosition.y }}
              >
                <button
                  onClick={() => addAnnotation('highlight')}
                  className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
                >
                  <Highlighter className="w-4 h-4" />
                  <span className="text-sm">Highlight</span>
                </button>
                <button
                  onClick={() => addAnnotation('underline')}
                  className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
                >
                  <UnderlineIcon className="w-4 h-4" />
                  <span className="text-sm">Underline</span>
                </button>
                <button
                  onClick={() => addAnnotation('note')}
                  className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
                >
                  <StickyNote className="w-4 h-4" />
                  <span className="text-sm">Add Note</span>
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(selectedText)}
                  className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy</span>
                </button>
                <button
                  onClick={() => translateText(selectedText, selectedLanguage)}
                  className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded"
                >
                  <Languages className="w-4 h-4" />
                  <span className="text-sm">Translate</span>
                </button>
              </div>
            )}

            {/* Page navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white rounded-lg shadow-lg p-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-16 text-center px-2 py-1 border rounded bg-gray-100 border-gray-600"
                min="1"
                max={totalPages}
              />
              <span className="text-sm">of {totalPages}</span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Reading progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 bg-gray-100">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Split screen second document */}
        {isSplitScreen && (
          <div className="w-1/2 border-l border-gray-200">
            <div className="h-full flex items-center justify-center bg-gray-100 bg-white">
              <p className="text-gray-500">Second document or comparison view</p>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      {isSidebarOpen && !isDistractionFree && (
        <div className="w-96 border-l border-gray-200 bg-white flex flex-col">
          {/* Sidebar tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'notes' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1" />
              Notes
            </button>
            <button
              onClick={() => setActiveTab('annotations')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'annotations' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Highlighter className="w-4 h-4 inline mr-1" />
              Annotations
            </button>
            <button
              onClick={() => setActiveTab('toc')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'toc' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4 inline mr-1" />
              Contents
            </button>
            <button
              onClick={() => setActiveTab('citations')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'citations' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Quote className="w-4 h-4 inline mr-1" />
              Cite
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Notes tab */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                {/* Add note */}
                <div className="bg-gray-50 bg-gray-100 rounded-lg p-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={`Add a note for page ${currentPage}...`}
                    className="w-full h-24 px-3 py-2 border rounded-lg resize-none bg-gray-100 border-gray-300"
                  />
                  <button
                    onClick={addNote}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Note
                  </button>
                </div>

                {/* Notes list */}
                <div className="space-y-3">
                  {notes
                    .filter(note => note.pageNumber === currentPage)
                    .map(note => (
                      <div key={note.id} className="bg-gray-50 bg-gray-100 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <p className="text-sm">{note.content}</p>
                          <button
                            onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Page {note.pageNumber} • {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Annotations tab */}
            {activeTab === 'annotations' && (
              <div className="space-y-3">
                {annotations.map(annotation => (
                  <div
                    key={annotation.id}
                    className="bg-gray-50 bg-gray-100 rounded-lg p-3 cursor-pointer hover:bg-gray-100"
                    onClick={() => goToPage(annotation.pageNumber)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {annotation.type === 'highlight' && <Highlighter className="w-4 h-4" style={{ color: annotation.color }} />}
                          {annotation.type === 'underline' && <UnderlineIcon className="w-4 h-4" />}
                          {annotation.type === 'note' && <StickyNote className="w-4 h-4" />}
                          <span className="text-xs text-gray-500">Page {annotation.pageNumber}</span>
                        </div>
                        <p className="text-sm">{annotation.text || annotation.content}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnnotation(annotation.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table of Contents tab */}
            {activeTab === 'toc' && (
              <div className="space-y-2">
                {tableOfContents.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(item.page)}
                    className="w-full text-left p-3 hover:bg-gray-100 rounded-lg"
                  >
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">Page {item.page}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Citations tab */}
            {activeTab === 'citations' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <button
                    onClick={() => generateCitation('APA')}
                    className="w-full p-3 bg-gray-50 bg-gray-100 hover:bg-gray-100 rounded-lg text-left"
                  >
                    <p className="font-medium">APA Style</p>
                    <p className="text-xs text-gray-500 mt-1">Click to copy</p>
                  </button>
                  <button
                    onClick={() => generateCitation('MLA')}
                    className="w-full p-3 bg-gray-50 bg-gray-100 hover:bg-gray-100 rounded-lg text-left"
                  >
                    <p className="font-medium">MLA Style</p>
                    <p className="text-xs text-gray-500 mt-1">Click to copy</p>
                  </button>
                  <button
                    onClick={() => generateCitation('Chicago')}
                    className="w-full p-3 bg-gray-50 bg-gray-100 hover:bg-gray-100 rounded-lg text-left"
                  >
                    <p className="font-medium">Chicago Style</p>
                    <p className="text-xs text-gray-500 mt-1">Click to copy</p>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar footer */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            {/* Reading stats */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Reading time</span>
              <span>{Math.floor(readingTime / 60)}h {readingTime % 60}m</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Est. time remaining</span>
              <span>{Math.ceil((estimatedReadingTime * (100 - readingProgress) / 100))} min</span>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={exportAnnotations}
                className="px-3 py-2 bg-gray-100 bg-gray-100 hover:bg-gray-200 hover:bg-gray-100 rounded-lg text-sm"
              >
                <Download className="w-4 h-4 inline mr-1" />
                Export
              </button>
              <button
                onClick={() => saveVersion('Manual save')}
                className="px-3 py-2 bg-gray-100 bg-gray-100 hover:bg-gray-200 hover:bg-gray-100 rounded-lg text-sm"
              >
                <Save className="w-4 h-4 inline mr-1" />
                Save
              </button>
              <button
                onClick={generateSummary}
                className="px-3 py-2 bg-gray-100 bg-gray-100 hover:bg-gray-200 hover:bg-gray-100 rounded-lg text-sm"
              >
                <Brain className="w-4 h-4 inline mr-1" />
                Summarize
              </button>
              <button
                onClick={generateFlashcards}
                className="px-3 py-2 bg-gray-100 bg-gray-100 hover:bg-gray-200 hover:bg-gray-100 rounded-lg text-sm"
              >
                <CreditCard className="w-4 h-4 inline mr-1" />
                Flashcards
              </button>
            </div>

            {/* Collaborators */}
            {collaborators.length > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Active collaborators</p>
                <div className="flex -space-x-2">
                  {collaborators.map((user, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white border-gray-800"
                    >
                      {user[0]}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Font settings modal */}
      {/* Add modal for font size, type controls */}

      {/* Practice questions modal */}
      {/* Add modal for AI-generated practice questions */}

      {/* Summary modal */}
      {summary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">AI Summary</h3>
            <p className="text-gray-600 text-gray-600">{summary}</p>
            <button
              onClick={() => setSummary('')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentLearningPage;