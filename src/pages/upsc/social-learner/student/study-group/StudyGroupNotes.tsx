import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Search,
  Filter,
  BookOpen,
  Clock,
  User,
  Star
} from 'lucide-react';

interface StudyGroup {
  id: number;
  name: string;
  gradient: string;
  bgGradient: string;
}

interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
  rating: number;
  gradient: string;
}

interface StudyGroupNotesProps {
  group: StudyGroup;
}

export function StudyGroupNotes({ group }: StudyGroupNotesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Sample notes data
  const notes: Note[] = [
    {
      id: '1',
      title: 'Constitution of India - Complete Notes',
      description: 'Comprehensive notes covering all articles, amendments, and important case laws for UPSC preparation.',
      subject: 'Polity',
      fileSize: '2.4 MB',
      uploadedBy: 'Priya Sharma',
      uploadedAt: '2 days ago',
      downloads: 156,
      rating: 4.8,
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      id: '2',
      title: 'Modern Indian History Timeline',
      description: 'Detailed timeline from 1857 to 1947 with key events, leaders, and movements.',
      subject: 'History',
      fileSize: '1.8 MB',
      uploadedBy: 'Rahul Verma',
      uploadedAt: '5 days ago',
      downloads: 203,
      rating: 4.9,
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: '3',
      title: 'Physical Geography - Climate Patterns',
      description: 'Notes on Indian monsoons, climate zones, and weather patterns with diagrams.',
      subject: 'Geography',
      fileSize: '3.1 MB',
      uploadedBy: 'Anita Singh',
      uploadedAt: '1 week ago',
      downloads: 178,
      rating: 4.7,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: '4',
      title: 'Indian Economy - Budget Analysis 2024',
      description: 'Detailed breakdown of Union Budget 2024 with key schemes and allocations.',
      subject: 'Economy',
      fileSize: '1.5 MB',
      uploadedBy: 'Vikram Patel',
      uploadedAt: '3 days ago',
      downloads: 234,
      rating: 4.6,
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      id: '5',
      title: 'Environment & Ecology Handbook',
      description: 'Complete guide to biodiversity, conservation, and environmental policies.',
      subject: 'Environment',
      fileSize: '2.8 MB',
      uploadedBy: 'Neha Gupta',
      uploadedAt: '4 days ago',
      downloads: 145,
      rating: 4.5,
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      id: '6',
      title: 'Ethics Case Studies Collection',
      description: 'Compilation of 50+ case studies with model answers for GS Paper IV.',
      subject: 'Ethics',
      fileSize: '1.9 MB',
      uploadedBy: 'Arjun Reddy',
      uploadedAt: '1 week ago',
      downloads: 189,
      rating: 4.8,
      gradient: 'from-rose-500 to-pink-500'
    }
  ];

  const subjects = ['all', 'Polity', 'History', 'Geography', 'Economy', 'Environment', 'Ethics'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div>
      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 appearance-none bg-white cursor-pointer"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject === 'all' ? 'All Subjects' : subject}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 mb-6 text-sm text-gray-600"
      >
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          <span>{filteredNotes.length} notes</span>
        </div>
        <div className="flex items-center gap-1">
          <Download className="w-4 h-4" />
          <span>{notes.reduce((acc, n) => acc + n.downloads, 0)} total downloads</span>
        </div>
      </motion.div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* File Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${note.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <FileText className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-gray-900 line-clamp-1">{note.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${note.gradient} text-white flex-shrink-0`}>
                    {note.subject}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.description}</p>

                {/* Meta Info */}
                <div className="flex items-center flex-wrap gap-3 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{note.fileSize}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{note.uploadedBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{note.uploadedAt}</span>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-amber-600">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{note.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Download className="w-3 h-3" />
                      <span>{note.downloads}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 bg-gradient-to-r ${note.gradient} text-white rounded-lg shadow-md hover:shadow-lg transition-all`}
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}
    </div>
  );
}
