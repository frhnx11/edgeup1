// Track user interaction to enable audio autoplay
class UserInteractionTracker {
  private static instance: UserInteractionTracker;
  private hasInteracted: boolean = false;
  private pendingCallbacks: (() => void)[] = [];

  private constructor() {
    this.setupListeners();
    // Check if user has already interacted in this session
    const sessionInteracted = sessionStorage.getItem('userHasInteracted');
    if (sessionInteracted === 'true') {
      this.hasInteracted = true;
      console.log('👆 User interaction already detected in session');
    }
  }

  private setupListeners(): void {
    // Listen for any user interaction
    const interactionEvents = ['click', 'touchstart', 'keydown', 'mousedown'];

    const handleInteraction = () => {
      if (!this.hasInteracted) {
        console.log('👆 User interaction detected! Audio autoplay now enabled');
        this.hasInteracted = true;
        sessionStorage.setItem('userHasInteracted', 'true');

        // Execute all pending callbacks
        this.pendingCallbacks.forEach(callback => callback());
        this.pendingCallbacks = [];

        // Remove listeners after first interaction
        interactionEvents.forEach(event => {
          document.removeEventListener(event, handleInteraction);
        });
      }
    };

    interactionEvents.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true });
    });
  }

  static getInstance(): UserInteractionTracker {
    if (!UserInteractionTracker.instance) {
      UserInteractionTracker.instance = new UserInteractionTracker();
    }
    return UserInteractionTracker.instance;
  }

  hasUserInteracted(): boolean {
    return this.hasInteracted;
  }

  waitForInteraction(callback: () => void): void {
    if (this.hasInteracted) {
      // User has already interacted, execute immediately
      callback();
    } else {
      // Queue the callback for when interaction happens
      this.pendingCallbacks.push(callback);
      console.log('⏳ Waiting for user interaction to enable audio autoplay');
    }
  }

  reset(): void {
    this.hasInteracted = false;
    this.pendingCallbacks = [];
    sessionStorage.removeItem('userHasInteracted');
    this.setupListeners();
  }
}

export const userInteractionTracker = UserInteractionTracker.getInstance();