// Simplified audio tracker to prevent duplicate playback v6.7
class AudioTracker {
  private static instance: AudioTracker;
  private playedInSession: Set<string> = new Set(); // Tracks page+user combinations
  private currentlyPlaying: string | null = null;
  private lastPlayedTime: Map<string, number> = new Map();
  private activeAudioElements: Set<HTMLAudioElement> = new Set();
  private initTime: number;

  private constructor() {
    this.initTime = Date.now();
    // Only clear old problematic session data once
    this.clearOldFormats();
  }

  private clearOldFormats(): void {
    // Clear only audio-related old format data
    const oldData = sessionStorage.getItem('audioTrackerSession');
    if (oldData) {
      console.log('🧹 AudioTracker v6.7: Clearing old audio session format');
      sessionStorage.removeItem('audioTrackerSession');
    }
  }

  private getCurrentUserType(): string {
    const path = window.location.pathname;
    if (path.includes('academic-achiever')) {
      return 'academic-achiever';
    } else if (path.includes('social-learner')) {
      return 'social-learner';
    }
    return localStorage.getItem('userStudentType') || 'unknown';
  }

  static getInstance(): AudioTracker {
    if (!AudioTracker.instance) {
      AudioTracker.instance = new AudioTracker();
    }
    return AudioTracker.instance;
  }

  hasPlayed(key: string): boolean {
    const userType = this.getCurrentUserType();
    const uniqueKey = `${userType}:${key}`;

    // Check if it was played very recently (within 1 second)
    const lastPlayed = this.lastPlayedTime.get(uniqueKey);
    if (lastPlayed && Date.now() - lastPlayed < 1000) {
      console.log('⏭️ AudioTracker v6.7: Recently played:', key, 'for', userType);
      return true;
    }

    // Check if already played in this session
    const played = this.playedInSession.has(uniqueKey);

    console.log('🔍 AudioTracker v6.7: hasPlayed check', {
      key,
      userType,
      uniqueKey,
      played,
      allPlayedKeys: Array.from(this.playedInSession)
    });

    return played;
  }

  markAsPlayed(key: string): void {
    const userType = this.getCurrentUserType();
    const uniqueKey = `${userType}:${key}`;

    console.log('✅ AudioTracker v6.7: Marking as played:', {
      key,
      userType,
      uniqueKey
    });

    this.playedInSession.add(uniqueKey);
    this.currentlyPlaying = key;
    this.lastPlayedTime.set(uniqueKey, Date.now());
  }

  isCurrentlyPlaying(key: string): boolean {
    return this.currentlyPlaying === key;
  }

  registerAudioElement(audio: HTMLAudioElement): void {
    this.activeAudioElements.add(audio);
  }

  unregisterAudioElement(audio: HTMLAudioElement): void {
    this.activeAudioElements.delete(audio);
  }

  stopAllAudio(): void {
    console.log('🛑 AudioTracker v6.7: Stopping all active audio');
    this.activeAudioElements.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {
        console.error('Failed to stop audio:', e);
      }
    });
    this.activeAudioElements.clear();
    this.currentlyPlaying = null;
  }

  stopPlaying(): void {
    this.currentlyPlaying = null;
  }

  reset(): void {
    console.log('🔄 AudioTracker v6.7: Resetting all tracking');
    this.playedInSession.clear();
    this.currentlyPlaying = null;
    this.lastPlayedTime.clear();
    this.stopAllAudio();
  }

  resetForUser(userType?: string): void {
    const targetUser = userType || this.getCurrentUserType();
    console.log('🔄 AudioTracker v6.7: Resetting for user:', targetUser);

    // Remove all entries for this user
    const keysToRemove = Array.from(this.playedInSession).filter(key =>
      key.startsWith(`${targetUser}:`)
    );
    keysToRemove.forEach(key => this.playedInSession.delete(key));

    // Clear time tracking for this user
    Array.from(this.lastPlayedTime.keys()).forEach(key => {
      if (key.startsWith(`${targetUser}:`)) {
        this.lastPlayedTime.delete(key);
      }
    });
  }

  getPlayedKeys(): string[] {
    const userType = this.getCurrentUserType();
    return Array.from(this.playedInSession)
      .filter(key => key.startsWith(`${userType}:`))
      .map(key => key.split(':')[1]);
  }

  debugInfo(): void {
    const userType = this.getCurrentUserType();
    console.log('🔍 AudioTracker v6.7 Debug:', {
      userType,
      playedInSession: Array.from(this.playedInSession),
      currentlyPlaying: this.currentlyPlaying,
      activeAudioElements: this.activeAudioElements.size
    });
  }
}

export const audioTracker = AudioTracker.getInstance();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).audioTracker = audioTracker;
  (window as any).resetAudio = () => {
    console.log('🧹 Resetting audio for current user');
    audioTracker.resetForUser();
    window.location.reload();
  };
  (window as any).resetAllAudio = () => {
    console.log('🧹 Resetting all audio');
    audioTracker.reset();
    window.location.reload();
  };
  (window as any).audioDebug = () => {
    audioTracker.debugInfo();
  };
  (window as any).forceResetAcademicAchiever = () => {
    console.log('🔧 Force resetting Academic Achiever audio tracking');
    // Remove all academic-achiever entries
    const keysToRemove: string[] = [];
    audioTracker['playedInSession'].forEach((key: string) => {
      if (key.includes('academic-achiever')) {
        keysToRemove.push(key);
      }
    });
    keysToRemove.forEach(key => audioTracker['playedInSession'].delete(key));
    console.log('Removed', keysToRemove.length, 'academic-achiever entries');
    console.log('Remaining keys:', Array.from(audioTracker['playedInSession']));
  };
}