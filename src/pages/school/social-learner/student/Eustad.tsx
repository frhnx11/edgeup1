import { useState, useRef, useEffect } from 'react';
import { callOpenAIWithHistory } from '../../../../services/openai';
import type { OpenAIMessage } from '../../../../services/openai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const Eustad = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Eustad, your AI learning assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Photosynthesis Discussion',
      lastMessage: 'Can you explain photosynthesis?',
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      title: 'Math Help - Quadratic',
      lastMessage: 'Help with quadratic equations',
      timestamp: new Date(Date.now() - 172800000)
    },
    {
      id: '3',
      title: 'Physics - Newton Laws',
      lastMessage: 'Newton\'s laws of motion',
      timestamp: new Date(Date.now() - 259200000)
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    const currentInput = inputText;
    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Convert messages to OpenAI format
      const conversationHistory: OpenAIMessage[] = [
        {
          role: 'system',
          content: 'You are Eustad, a helpful AI learning assistant for students. You help students understand their subjects better, answer questions, explain concepts, and provide study guidance. Be encouraging, clear, and educational in your responses.'
        },
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text
        })),
        {
          role: 'user',
          content: currentInput
        }
      ];

      // Call OpenAI API
      const aiResponse = await callOpenAIWithHistory(conversationHistory, {
        temperature: 0.7,
        max_tokens: 1000
      });

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);

      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error connecting to the AI service. Please check your internet connection and try again.',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      setMessages([
        {
          id: '1',
          text: "Hello! I'm Eustad, your AI learning assistant. How can I help you today?",
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      // Start recording
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            setIsRecording(true);
            // Here you would implement actual voice recording logic
            // For now, we'll just simulate it
            alert('Voice recording started! (Feature in development)');
          })
          .catch(err => {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please check your permissions.');
          });
      } else {
        alert('Voice recording is not supported in this browser.');
      }
    } else {
      // Stop recording
      setIsRecording(false);
      alert('Voice recording stopped! (Feature in development)');
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      gap: '1.5rem'
    }}>
      {/* Sidebar - Chat History */}
      <div style={{
        width: '300px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        padding: '1.5rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #f7fafc'
        }}>
          <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.125rem', fontWeight: 700 }}>
            <i className="fas fa-history" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            Recent Chats
          </h3>
        </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                style={{
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10ac8b';
                  e.currentTarget.style.background = '#f0fdf8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f7fafc';
                }}
              >
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '0.9rem', fontWeight: 700 }}>
                  {conv.title}
                </h4>
                <p style={{ margin: '0 0 0.5rem 0', color: '#718096', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  {conv.lastMessage}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>
                  {conv.timestamp.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* Main Chat Interface */}
      <div style={{
        flex: 1,
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Chat Header */}
        <div style={{
          background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(60px)'
          }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.75rem',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
            }}>
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>Eustad AI</h3>
              <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#10ffcf',
                  borderRadius: '50%',
                  animation: 'pulse-dot 2s infinite'
                }}></div>
                Always Online & Ready to Help
              </p>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <button
              onClick={handleClearChat}
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              }}
            >
              <i className="fas fa-trash-alt"></i>
              Clear
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          background: 'linear-gradient(180deg, #f7fafc 0%, #ffffff 100%)'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '1.5rem',
                animation: 'fadeIn 0.3s ease-in'
              }}
            >
              {message.sender === 'ai' && (
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.125rem',
                  marginRight: '1rem',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(9, 77, 136, 0.3)'
                }}>
                  <i className="fas fa-robot"></i>
                </div>
              )}
              <div style={{
                maxWidth: '70%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: message.sender === 'user'
                      ? '20px 20px 4px 20px'
                      : '20px 20px 20px 4px',
                    background: message.sender === 'user'
                      ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)'
                      : 'white',
                    color: message.sender === 'user' ? 'white' : '#2d3748',
                    boxShadow: message.sender === 'user'
                      ? '0 4px 16px rgba(9, 77, 136, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.1)',
                    border: message.sender === 'ai' ? '2px solid #f7fafc' : 'none',
                    position: 'relative'
                  }}
                >
                  <p style={{ margin: 0, lineHeight: 1.7, fontSize: '1rem' }}>{message.text}</p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '0.5rem',
                  paddingLeft: message.sender === 'ai' ? '0' : '0',
                  paddingRight: message.sender === 'user' ? '0' : '0'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#a0aec0',
                    fontWeight: 500
                  }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <button
                    onClick={() => handleCopyMessage(message.text)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#a0aec0',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#10ac8b';
                      e.currentTarget.style.background = '#f7fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#a0aec0';
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              {message.sender === 'user' && (
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#667eea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.125rem',
                  marginLeft: '1rem',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}>
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '1.5rem',
              animation: 'fadeIn 0.3s ease-in'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.125rem',
                marginRight: '1rem',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(9, 77, 136, 0.3)'
              }}>
                <i className="fas fa-robot"></i>
              </div>
              <div style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '20px 20px 20px 4px',
                background: 'white',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '2px solid #f7fafc'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10ac8b',
                    animation: 'bounce 1.4s infinite ease-in-out both'
                  }}></div>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10ac8b',
                    animation: 'bounce 1.4s infinite ease-in-out both 0.2s'
                  }}></div>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10ac8b',
                    animation: 'bounce 1.4s infinite ease-in-out both 0.4s'
                  }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>


        {/* Input Area */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: '2px solid #f7fafc',
          background: 'white'
        }}>
          {/* File Upload Preview */}
          {uploadedFiles.length > 0 && (
            <div style={{
              marginBottom: '1rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: '#f7fafc',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    color: '#2d3748'
                  }}
                >
                  <i className={`fas ${file.type.startsWith('image/') ? 'fa-image' : 'fa-file'}`} style={{ color: '#10ac8b' }}></i>
                  <span>{file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: '0.25rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Left Side Buttons - File Upload & Mic */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {/* File Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '44px',
                  height: '44px',
                  background: '#f7fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  color: '#667eea',
                  fontSize: '1.125rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#667eea';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f7fafc';
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                title="Upload file or image"
              >
                <i className="fas fa-paperclip"></i>
              </button>

              {/* Microphone Button */}
              <button
                onClick={handleVoiceRecord}
                style={{
                  width: '44px',
                  height: '44px',
                  background: isRecording ? '#ef4444' : '#f7fafc',
                  border: `2px solid ${isRecording ? '#ef4444' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  color: isRecording ? 'white' : '#ef4444',
                  fontSize: '1.125rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  animation: isRecording ? 'pulse 1.5s ease-in-out infinite' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isRecording) {
                    e.currentTarget.style.background = '#ef4444';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isRecording) {
                    e.currentTarget.style.background = '#f7fafc';
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
                title={isRecording ? 'Stop recording' : 'Start voice recording'}
              >
                <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
              </button>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Eustad anything about your studies..."
                rows={1}
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s',
                  resize: 'none',
                  fontFamily: 'inherit',
                  lineHeight: '1.5'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#10ac8b';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(16, 172, 139, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              style={{
                padding: '1rem 2rem',
                background: inputText.trim() && !isTyping
                  ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                  : '#e2e8f0',
                border: 'none',
                borderRadius: '16px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: inputText.trim() && !isTyping ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s',
                boxShadow: inputText.trim() && !isTyping ? '0 4px 16px rgba(9, 77, 136, 0.3)' : 'none',
                minWidth: '120px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (inputText.trim() && !isTyping) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(9, 77, 136, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = inputText.trim() && !isTyping ? '0 4px 16px rgba(9, 77, 136, 0.3)' : 'none';
              }}
            >
              {isTyping ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  Sending
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default Eustad;
