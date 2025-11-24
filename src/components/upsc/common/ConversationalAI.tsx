import { useEffect, useState, useRef, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  WifiOff,
  Wifi,
  Activity,
  MessageSquare,
  User,
  Bot,
  Settings,
  X,
  RefreshCw
} from 'lucide-react';

interface ConversationalAIProps {
  agentId: string;
  onMessageReceived?: (message: string, isUser: boolean) => void;
  onStatusChange?: (status: string) => void;
  className?: string;
  showTranscript?: boolean;
  embedded?: boolean;
  autoStart?: boolean;
  onConnectionChange?: (isConnected: boolean) => void;
  onConversationReady?: (conversation: any) => void;
}

interface ConversationMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ConversationalAI({ 
  agentId, 
  onMessageReceived,
  onStatusChange,
  className = '',
  showTranscript = true,
  embedded = false,
  autoStart = false,
  onConnectionChange,
  onConversationReady
}: ConversationalAIProps) {
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setConnectionStatus('connected');
      onStatusChange?.('connected');
      onConnectionChange?.(true);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setConnectionStatus('disconnected');
      onStatusChange?.('disconnected');
      setIsCallActive(false);
      onConnectionChange?.(false);
    },
    onMessage: (message) => {
      console.log('ElevenLabs onMessage:', message);
      
      // The message object structure may vary, so let's handle all possibilities
      if (message) {
        // Extract text from various possible fields
        let text = '';
        let isUserMessage = false;
        let isFinalMessage = true;
        
        // Handle different message structures
        if (typeof message === 'string') {
          text = message;
        } else if (typeof message === 'object') {
          // Try different field names that might contain the text
          text = message.text || message.message || message.transcript || message.content || '';
          
          // Determine if it's a user message
          isUserMessage = message.role === 'user' || 
                         message.type === 'user' || 
                         message.sender === 'user' ||
                         message.is_user === true ||
                         message.isUser === true;
          
          // Check if it's a final transcript
          isFinalMessage = message.isFinal !== false && message.final !== false;
          
          // For debug messages, log but don't display
          if (message.type === 'debug' || message.debug) {
            console.log('Debug message:', message);
            return;
          }
        }
        
        // Pass the message to parent if we have text
        if (text && embedded && onMessageReceived) {
          onMessageReceived(text, isUserMessage);
        }
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      setError(error.message || 'An error occurred');
      onStatusChange?.('error');
    }
  });

  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
  const [isVolumeEnabled, setIsVolumeEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [micPermission, setMicPermission] = useState<PermissionState | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check microphone permissions
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setMicPermission(result.state);
        result.addEventListener('change', () => {
          setMicPermission(result.state);
        });
      } catch (error) {
        console.error('Error checking microphone permission:', error);
      }
    };
    checkMicPermission();
  }, []);

  // Monitor agent speaking status
  useEffect(() => {
    setIsAgentSpeaking(conversation.isSpeaking || false);
  }, [conversation.isSpeaking]);

  // Auto-start conversation if enabled
  useEffect(() => {
    if (autoStart && agentId && !isCallActive && connectionStatus === 'idle') {
      // Add a small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        console.log('Auto-starting conversation with agent:', agentId);
        startConversation();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [autoStart, agentId]);


  const startConversation = async () => {
    try {
      setError(null);
      setConnectionStatus('connecting');
      
      // Check if agent ID is valid
      if (!agentId) {
        throw new Error('No agent ID configured');
      }
      
      // Request microphone access first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micError) {
        throw new Error('Microphone access denied. Please allow microphone access to use voice chat.');
      }
      
      // Start the conversation session
      console.log('Starting conversation with agent:', agentId);
      
      // Try WebRTC first, fall back to websocket if it fails
      let sessionId;
      try {
        sessionId = await conversation.startSession({
          agentId: agentId,
          connectionType: 'webrtc' // Use WebRTC for better quality
        });
      } catch (webrtcError) {
        console.warn('WebRTC connection failed, trying websocket:', webrtcError);
        sessionId = await conversation.startSession({
          agentId: agentId,
          connectionType: 'websocket' // Fallback to websocket
        });
      }
      
      console.log('Conversation started with session ID:', sessionId);
      setIsCallActive(true);
      setConnectionStatus('connected');
      
      // Pass conversation object to parent
      if (onConversationReady) {
        onConversationReady(conversation);
      }
      
      // Add welcome message only if not in embedded mode
      if (!embedded) {
        const welcomeMessage: ConversationMessage = {
          id: 'welcome-' + Date.now(),
          text: "Hello! I'm ready to help you. Feel free to ask me anything!",
          isUser: false,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
      
    } catch (error: any) {
      console.error('Failed to start conversation:', error);
      const errorMessage = error.message || 'Failed to start conversation';
      setError(errorMessage);
      setConnectionStatus('error');
      setIsCallActive(false);
      
      // Log more details for debugging
      console.error('Error details:', {
        agentId,
        error: error.toString(),
        stack: error.stack
      });
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      setIsCallActive(false);
      setConnectionStatus('disconnected');
      
      // Add goodbye message
      const goodbyeMessage: ConversationMessage = {
        id: 'goodbye-' + Date.now(),
        text: "Goodbye! Feel free to start a new conversation anytime.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, goodbyeMessage]);
      
    } catch (error: any) {
      console.error('Failed to end conversation:', error);
      setError(error.message || 'Failed to end conversation');
    }
  };

  const toggleMicrophone = () => {
    setIsMicrophoneEnabled(!isMicrophoneEnabled);
    // TODO: Implement actual microphone muting
    // This would require access to the MediaStream
  };

  const toggleVolume = () => {
    if (isVolumeEnabled) {
      conversation.setVolume({ volume: 0 });
      setIsVolumeEnabled(false);
    } else {
      conversation.setVolume({ volume: volume });
      setIsVolumeEnabled(true);
    }
  };

  const adjustVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (isVolumeEnabled) {
      conversation.setVolume({ volume: newVolume });
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connecting':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Ready to Connect';
    }
  };

  // For embedded mode, return only the controls
  if (embedded && !showTranscript) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {getStatusIcon()}
          <span className="hidden sm:inline">{getStatusText()}</span>
          {isAgentSpeaking && (
            <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
          )}
        </div>

        {/* Error message in embedded mode */}
        {error && connectionStatus === 'error' && (
          <div className="text-xs text-red-600 max-w-xs">
            {error}
          </div>
        )}

        {/* Microphone Toggle */}
        <button
          onClick={toggleMicrophone}
          disabled={!isCallActive}
          className={`p-2 rounded-lg transition-all ${
            isCallActive
              ? isMicrophoneEnabled
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-red-100 hover:bg-red-200 text-red-700'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
          title={isMicrophoneEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {isMicrophoneEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Main Call Button */}
        {(!autoStart || connectionStatus === 'error') && (
          <button
            onClick={isCallActive ? endConversation : startConversation}
            disabled={connectionStatus === 'connecting'}
            className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
              isCallActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : connectionStatus === 'connecting'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : connectionStatus === 'error'
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-gradient-to-r from-[#094d88] to-[#10ac8b] hover:shadow-lg text-white'
            }`}
            title={connectionStatus === 'error' ? 'Retry connection' : ''}
          >
            {connectionStatus === 'connecting' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isCallActive ? (
              <PhoneOff className="w-4 h-4" />
            ) : connectionStatus === 'error' ? (
              <RefreshCw className="w-4 h-4" />
            ) : (
              <Phone className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Volume Toggle */}
        <button
          onClick={toggleVolume}
          disabled={!isCallActive}
          className={`p-2 rounded-lg transition-all ${
            isCallActive
              ? isVolumeEnabled
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-red-100 hover:bg-red-200 text-red-700'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
          title={isVolumeEnabled ? 'Mute speaker' : 'Unmute speaker'}
        >
          {isVolumeEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#094d88] to-[#10ac8b] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Voice Assistant</h3>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="text-white/80 text-sm">{getStatusText()}</span>
                {isAgentSpeaking && (
                  <Activity className="w-3 h-3 text-white animate-pulse" />
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 p-3">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Microphone Permission Warning */}
      {micPermission === 'denied' && (
        <div className="bg-amber-50 border-b border-amber-200 p-3">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Microphone access denied. Please enable it in your browser settings.</span>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10 w-64">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Settings</h4>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Transcript/Messages Area */}
      {showTranscript && (
        <div className="flex-1 overflow-y-auto p-4 max-h-96 bg-gray-50">
          {messages.length === 0 && !isCallActive ? (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Start a conversation to see the transcript</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isUser ? 'bg-[#094d88]' : 'bg-[#10ac8b]'
                    }`}>
                      {message.isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`px-4 py-2 rounded-2xl ${
                      message.isUser 
                        ? 'bg-[#094d88] text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <span className={`text-xs mt-1 block ${
                        message.isUser ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {currentTranscript && (
                <div className="flex justify-end animate-pulse">
                  <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-2xl max-w-[80%]">
                    <p className="text-sm italic">{currentTranscript}...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      )}

      {/* Control Panel */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-center justify-center gap-4">
          {/* Microphone Toggle */}
          <button
            onClick={toggleMicrophone}
            disabled={!isCallActive}
            className={`p-3 rounded-full transition-all ${
              isCallActive
                ? isMicrophoneEnabled
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-red-100 hover:bg-red-200 text-red-700'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            title={isMicrophoneEnabled ? 'Mute microphone' : 'Unmute microphone'}
          >
            {isMicrophoneEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Main Call Button */}
          <button
            onClick={isCallActive ? endConversation : startConversation}
            disabled={connectionStatus === 'connecting'}
            className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
              isCallActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : connectionStatus === 'connecting'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#094d88] to-[#10ac8b] hover:shadow-lg text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {connectionStatus === 'connecting' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : isCallActive ? (
                <>
                  <PhoneOff className="w-5 h-5" />
                  <span>End Call</span>
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5" />
                  <span>Start Call</span>
                </>
              )}
            </div>
          </button>

          {/* Volume Toggle */}
          <button
            onClick={toggleVolume}
            disabled={!isCallActive}
            className={`p-3 rounded-full transition-all ${
              isCallActive
                ? isVolumeEnabled
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-red-100 hover:bg-red-200 text-red-700'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            title={isVolumeEnabled ? 'Mute speaker' : 'Unmute speaker'}
          >
            {isVolumeEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Status Indicators */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              isCallActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
            }`} />
            <span>Call {isCallActive ? 'Active' : 'Inactive'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              isAgentSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
            }`} />
            <span>AI {isAgentSpeaking ? 'Speaking' : 'Listening'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}