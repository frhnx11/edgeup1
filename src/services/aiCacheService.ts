interface CacheEntry {
  key: string;
  response: string;
  timestamp: number;
  hits: number;
}

class AICacheService {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private ttlMs: number;

  constructor(maxSize: number = 100, ttlMs: number = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  // Generate cache key from messages
  private generateKey(topic: string, question: string, userInput: string): string {
    const normalized = `${topic}:${question}:${userInput}`.toLowerCase().trim();
    return btoa(normalized); // Base64 encode for consistent keys
  }

  // Get cached response if available and not expired
  get(topic: string, question: string, userInput: string): string | null {
    const key = this.generateKey(topic, question, userInput);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count and move to end (LRU)
    entry.hits++;
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.response;
  }

  // Store response in cache
  set(topic: string, question: string, userInput: string, response: string): void {
    const key = this.generateKey(topic, question, userInput);

    // Remove oldest entry if cache is full (LRU eviction)
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      key,
      response,
      timestamp: Date.now(),
      hits: 1
    });
  }

  // Clear expired entries
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttlMs) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): {
    size: number;
    totalHits: number;
    averageHits: number;
    oldestEntry: number | null;
  } {
    let totalHits = 0;
    let oldestTimestamp = Date.now();

    for (const entry of this.cache.values()) {
      totalHits += entry.hits;
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
      }
    }

    return {
      size: this.cache.size,
      totalHits,
      averageHits: this.cache.size > 0 ? totalHits / this.cache.size : 0,
      oldestEntry: this.cache.size > 0 ? oldestTimestamp : null
    };
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }
}

// Singleton instance
let cacheInstance: AICacheService | null = null;

export function getAICacheService(): AICacheService {
  if (!cacheInstance) {
    cacheInstance = new AICacheService();
  }
  return cacheInstance;
}

export default AICacheService;