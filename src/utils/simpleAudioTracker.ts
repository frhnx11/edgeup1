// Ultra-simple audio tracker v6.12 - Enhanced Social Learner dashboard support
class SimpleAudioTracker {
  private static instance: SimpleAudioTracker;
  private playedThisPageLoad: Set<string> = new Set();
  private currentlyPlaying: string | null = null;

  private constructor() {
    console.log('🎯 SimpleAudioTracker v6.12: Initialized');
  }

  static getInstance(): SimpleAudioTracker {
    if (!SimpleAudioTracker.instance) {
      SimpleAudioTracker.instance = new SimpleAudioTracker();
    }
    return SimpleAudioTracker.instance;
  }

  private getUserType(): string {
    const path = window.location.pathname;
    if (path.includes('academic-achiever')) return 'academic-achiever';
    if (path.includes('social-learner')) return 'social-learner';
    return 'unknown';
  }

  shouldPlay(messageKey: string): boolean {
    const userType = this.getUserType();
    const trackingKey = `${userType}:${messageKey}`;

    // v6.12: Enhanced dashboard handling for both user types
    if (messageKey === 'dashboard') {
      // Only block if currently playing the same dashboard audio
      if (this.currentlyPlaying === messageKey) {
        console.log('⏸️ SimpleAudioTracker v6.12: Dashboard currently playing');
        return false;
      }

      // For Social Learner dashboard - be extra permissive due to lazy loading
      if (userType === 'social-learner' && !this.playedThisPageLoad.has(trackingKey)) {
        console.log('🟢 SimpleAudioTracker v6.12: Social Learner Dashboard - WILL PLAY (priority)');
        return true;
      }

      // For any dashboard, allow first play
      if (!this.playedThisPageLoad.has(trackingKey)) {
        console.log('🏠 SimpleAudioTracker v6.12: Dashboard - WILL PLAY for:', userType);
        return true;
      }
    }

    // Special handling for academic-achiever - be more permissive
    if (userType === 'academic-achiever') {
      // Only block if currently playing
      if (this.currentlyPlaying === messageKey) {
        console.log('🔊 SimpleAudioTracker: Academic Achiever - currently playing:', messageKey);
        return false;
      }

      // Check if played in last 2 seconds (prevent rapid replay)
      const playedRecently = this.playedThisPageLoad.has(`${trackingKey}:${Date.now()}`);

      if (!this.playedThisPageLoad.has(trackingKey)) {
        console.log('✅ SimpleAudioTracker: Academic Achiever - WILL PLAY:', messageKey);
        return true;
      }
    }

    // Normal tracking for other users
    if (this.currentlyPlaying === messageKey) {
      console.log('⏸️ SimpleAudioTracker: Currently playing:', messageKey);
      return false;
    }

    if (this.playedThisPageLoad.has(trackingKey)) {
      console.log('⏭️ SimpleAudioTracker: Already played this page load:', trackingKey);
      return false;
    }

    console.log('✅ SimpleAudioTracker: Will play:', trackingKey);
    return true;
  }

  markAsPlaying(messageKey: string): void {
    const userType = this.getUserType();
    const trackingKey = `${userType}:${messageKey}`;

    console.log('🎵 SimpleAudioTracker: Now playing:', trackingKey);

    // If switching to a different message, clear the previous one from tracking
    // This allows tab switches to play new audio
    if (this.currentlyPlaying && this.currentlyPlaying !== messageKey) {
      const prevTrackingKey = `${userType}:${this.currentlyPlaying}`;
      this.playedThisPageLoad.delete(prevTrackingKey);
      console.log('🔄 SimpleAudioTracker: Cleared previous tracking for:', prevTrackingKey);
    }

    this.playedThisPageLoad.add(trackingKey);
    this.currentlyPlaying = messageKey;
  }

  markAsStopped(): void {
    console.log('⏹️ SimpleAudioTracker: Stopped playing:', this.currentlyPlaying);
    this.currentlyPlaying = null;
  }

  reset(): void {
    console.log('🔄 SimpleAudioTracker: Resetting');
    this.playedThisPageLoad.clear();
    this.currentlyPlaying = null;
  }

  debug(): void {
    console.log('🔍 SimpleAudioTracker Debug:', {
      userType: this.getUserType(),
      currentlyPlaying: this.currentlyPlaying,
      playedKeys: Array.from(this.playedThisPageLoad)
    });
  }
}

export const simpleAudioTracker = SimpleAudioTracker.getInstance();

// Expose for debugging
if (typeof window !== 'undefined') {
  (window as any).simpleAudioTracker = simpleAudioTracker;
  (window as any).audioReset = () => {
    simpleAudioTracker.reset();
    console.log('Audio tracker reset');
  };
  (window as any).audioInfo = () => {
    simpleAudioTracker.debug();
  };
}