import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  ArrowLeft,
  Circle
} from 'lucide-react';
import { DashboardLayout } from '../../../../layouts/DashboardLayout';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  gradient: string;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sent: boolean;
  read: boolean;
}

// Sample contacts data
const contactsData: Contact[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: 'P',
    lastMessage: 'Did you complete the polity notes?',
    timestamp: '2:30 PM',
    unread: 2,
    online: true,
    gradient: 'from-rose-500 to-pink-500'
  },
  {
    id: '2',
    name: 'Rahul Verma',
    avatar: 'R',
    lastMessage: 'See you at the study session!',
    timestamp: '1:15 PM',
    unread: 0,
    online: true,
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    id: '3',
    name: 'Anita Singh',
    avatar: 'A',
    lastMessage: 'Thanks for sharing the PDF',
    timestamp: '12:45 PM',
    unread: 0,
    online: false,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: '4',
    name: 'Mentor Gupta',
    avatar: 'M',
    lastMessage: 'Your essay needs improvement in...',
    timestamp: '11:30 AM',
    unread: 1,
    online: true,
    gradient: 'from-purple-500 to-violet-500'
  },
  {
    id: '5',
    name: 'Vikram Patel',
    avatar: 'V',
    lastMessage: 'Check out this current affairs link',
    timestamp: 'Yesterday',
    unread: 0,
    online: false,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: '6',
    name: 'History Study Group',
    avatar: 'H',
    lastMessage: 'Neha: Meeting at 5 PM tomorrow',
    timestamp: 'Yesterday',
    unread: 5,
    online: true,
    gradient: 'from-cyan-500 to-teal-500'
  }
];

// Initial messages for each contact
const initialMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Hey! How\'s your preparation going?', timestamp: '2:00 PM', sent: false, read: true },
    { id: '2', text: 'Going well! Just finished the economy section', timestamp: '2:15 PM', sent: true, read: true },
    { id: '3', text: 'That\'s great! I\'m still on polity', timestamp: '2:20 PM', sent: false, read: true },
    { id: '4', text: 'Did you complete the polity notes?', timestamp: '2:30 PM', sent: false, read: true }
  ],
  '2': [
    { id: '1', text: 'Are we meeting for the group study?', timestamp: '12:30 PM', sent: true, read: true },
    { id: '2', text: 'Yes! 4 PM at the library', timestamp: '12:45 PM', sent: false, read: true },
    { id: '3', text: 'Perfect, I\'ll bring my geography notes', timestamp: '1:00 PM', sent: true, read: true },
    { id: '4', text: 'See you at the study session!', timestamp: '1:15 PM', sent: false, read: true }
  ],
  '3': [
    { id: '1', text: 'I found great notes on Modern History', timestamp: '12:00 PM', sent: true, read: true },
    { id: '2', text: 'Can you share them please?', timestamp: '12:15 PM', sent: false, read: true },
    { id: '3', text: 'Sure, sending the PDF now!', timestamp: '12:30 PM', sent: true, read: true },
    { id: '4', text: 'Thanks for sharing the PDF', timestamp: '12:45 PM', sent: false, read: true }
  ],
  '4': [
    { id: '1', text: 'Sir, I submitted my essay on ethics', timestamp: '10:00 AM', sent: true, read: true },
    { id: '2', text: 'I\'ve reviewed it. Good effort!', timestamp: '11:00 AM', sent: false, read: true },
    { id: '3', text: 'Your essay needs improvement in structure and examples', timestamp: '11:30 AM', sent: false, read: true }
  ],
  '5': [
    { id: '1', text: 'Found this great resource for current affairs', timestamp: 'Yesterday', sent: false, read: true },
    { id: '2', text: 'Check out this current affairs link', timestamp: 'Yesterday', sent: false, read: true }
  ],
  '6': [
    { id: '1', text: 'Priya: Let\'s discuss the French Revolution', timestamp: 'Yesterday', sent: false, read: true },
    { id: '2', text: 'Good idea! I have notes on it', timestamp: 'Yesterday', sent: true, read: true },
    { id: '3', text: 'Neha: Meeting at 5 PM tomorrow', timestamp: 'Yesterday', sent: false, read: true }
  ]
};

export function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      read: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));

    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contactsData.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-2rem)] flex rounded-2xl overflow-hidden border-2 border-gray-200 bg-white shadow-lg">
        {/* Left Panel - Contact List */}
        <div className={`w-96 border-r border-gray-200 flex flex-col bg-white ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Messages
            </h2>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <motion.button
                key={contact.id}
                whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                onClick={() => setSelectedContact(contact)}
                className={`w-full flex items-center gap-3 p-4 border-b border-gray-100 transition-all text-left ${
                  selectedContact?.id === contact.id ? 'bg-purple-50' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${contact.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{contact.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Panel - Chat Area */}
        <div className={`flex-1 flex flex-col ${selectedContact ? 'flex' : 'hidden md:flex'}`}>
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>

                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedContact.gradient} flex items-center justify-center text-white font-bold`}>
                      {selectedContact.avatar}
                    </div>
                    {selectedContact.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedContact.online ? (
                        <span className="text-green-600">Online</span>
                      ) : (
                        'Last seen recently'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="space-y-3">
                  <AnimatePresence>
                    {(messages[selectedContact.id] || []).map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm ${
                            message.sent
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md'
                              : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${
                            message.sent ? 'text-white/70' : 'text-gray-400'
                          }`}>
                            <span className="text-xs">{message.timestamp}</span>
                            {message.sent && (
                              message.read ? (
                                <CheckCheck className="w-3.5 h-3.5" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Smile className="w-6 h-6 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="w-6 h-6 text-gray-500" />
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all pr-12"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className={`p-3 rounded-xl transition-all ${
                      inputMessage.trim()
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6"
              >
                <Circle className="w-12 h-12 text-purple-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your Messages</h3>
              <p className="text-gray-600 max-w-sm">
                Select a conversation from the left to start messaging with your study buddies
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
