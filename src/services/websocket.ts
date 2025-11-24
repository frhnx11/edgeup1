import { io, Socket } from 'socket.io-client';
import { logger } from '../utils/logger';

interface WebSocketEvents {
  // Connection events
  connect: () => void;
  disconnect: (reason: string) => void;
  
  // User events
  'user-joined': (userId: string) => void;
  'user-left': (userId: string) => void;
  
  // Chat events
  'new-message': (data: {
    message: string;
    userId: string;
    timestamp: string;
  }) => void;
  
  // Collaboration events
  'whiteboard-update': (data: any) => void;
  'user-sharing-screen': (data: { userId: string }) => void;
  
  // AI events
  'ai-stream-chunk': (chunk: string) => void;
  
  // Study room events
  'room-created': (roomData: any) => void;
  'room-joined': (roomData: any) => void;
  'room-updated': (roomData: any) => void;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private currentUserId: string | null = null;
  private currentRoom: string | null = null;
  private eventHandlers = new Map<string, Set<Function>>();

  constructor() {
    this.connect();
  }

  // Connect to WebSocket server
  connect() {
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000';
    const token = localStorage.getItem('accessToken');

    this.socket = io(wsUrl, {
      auth: {
        token
      },
      transports: ['websocket'],
      upgrade: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.setupEventListeners();
  }

  // Setup socket event listeners
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('WebSocket connected');
      this.emit('connect');
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('WebSocket disconnected:', reason);
      this.emit('disconnect', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnection();
    });

    // Study room events
    this.socket.on('user-joined', (userId: string) => {
      this.emit('user-joined', userId);
    });

    this.socket.on('user-left', (userId: string) => {
      this.emit('user-left', userId);
    });

    // Chat events
    this.socket.on('new-message', (data) => {
      this.emit('new-message', data);
    });

    // Collaboration events
    this.socket.on('whiteboard-update', (data) => {
      this.emit('whiteboard-update', data);
    });

    this.socket.on('user-sharing-screen', (data) => {
      this.emit('user-sharing-screen', data);
    });

    // AI events
    this.socket.on('ai-stream-chunk', (chunk) => {
      this.emit('ai-stream-chunk', chunk);
    });
  }

  // Handle reconnection logic
  private handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this.connect();
    }, delay);
  }

  // Generic event emitter
  private emit(event: string, ...args: any[]) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  // Add event listener
  on<K extends keyof WebSocketEvents>(
    event: K, 
    handler: WebSocketEvents[K]
  ): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  // Remove event listener
  off<K extends keyof WebSocketEvents>(
    event: K, 
    handler: WebSocketEvents[K]
  ): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  // Join user to their personal room
  joinUserRoom(userId: string) {
    if (!this.isConnected || !this.socket) return;
    
    this.currentUserId = userId;
    this.socket.emit('join-user-room', userId);
  }

  // Join study room for collaboration
  joinStudyRoom(roomId: string) {
    if (!this.isConnected || !this.socket) return;

    if (this.currentRoom) {
      this.leaveStudyRoom(this.currentRoom);
    }

    this.currentRoom = roomId;
    this.socket.emit('join-study-room', roomId);
  }

  // Leave study room
  leaveStudyRoom(roomId: string) {
    if (!this.isConnected || !this.socket) return;

    this.socket.emit('leave-study-room', roomId);
    if (this.currentRoom === roomId) {
      this.currentRoom = null;
    }
  }

  // Send chat message in study room
  sendChatMessage(roomId: string, message: string) {
    if (!this.isConnected || !this.socket || !this.currentUserId) return;

    this.socket.emit('chat-message', {
      roomId,
      message,
      userId: this.currentUserId
    });
  }

  // Send whiteboard drawing data
  sendWhiteboardUpdate(roomId: string, drawData: any) {
    if (!this.isConnected || !this.socket) return;

    this.socket.emit('whiteboard-draw', {
      roomId,
      drawData
    });
  }

  // Start screen sharing
  startScreenShare(roomId: string) {
    if (!this.isConnected || !this.socket || !this.currentUserId) return;

    this.socket.emit('start-screen-share', {
      roomId,
      userId: this.currentUserId
    });
  }

  // Stop screen sharing
  stopScreenShare(roomId: string) {
    if (!this.isConnected || !this.socket || !this.currentUserId) return;

    this.socket.emit('stop-screen-share', {
      roomId,
      userId: this.currentUserId
    });
  }

  // Send AI response stream update
  sendAIStreamUpdate(chunk: string) {
    if (!this.isConnected || !this.socket || !this.currentUserId) return;

    this.socket.emit('ai-response-stream', {
      userId: this.currentUserId,
      chunk
    });
  }

  // Create study room
  createStudyRoom(roomData: {
    name: string;
    subject: string;
    maxParticipants?: number;
    isPublic?: boolean;
  }) {
    if (!this.isConnected || !this.socket) return;

    this.socket.emit('create-study-room', roomData);
  }

  // Get connection status
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Get current room
  getCurrentRoom(): string | null {
    return this.currentRoom;
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentRoom = null;
      this.currentUserId = null;
    }
  }

  // Send ping to check connection
  ping() {
    if (!this.isConnected || !this.socket) return;
    
    this.socket.emit('ping', Date.now());
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
export type { WebSocketEvents };