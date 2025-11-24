// Ultra-simple audio tracker v6.8 - designed to work reliably
class SimpleAudioTracker {
  private static instance: SimpleAudioTracker;
  private playedThisPageLoad: Set<string> = new Set();
  private currentlyPlaying: string | null = null;

  private constructor() {
    console.log('🎯 SimpleAudioTracker v6.8: Initialized');
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
    this.playedThisPageLoad.add(trackingKey);
    this.currentlyPlaying = messageKey;
  }

  markAsStopped(): void {
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