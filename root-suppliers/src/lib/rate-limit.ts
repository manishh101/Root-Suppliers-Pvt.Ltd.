/**
 * Simple Fixed Window Rate Limiter
 */
export class RateLimiter {
  private tokens: Map<string, { count: number; expiresAt: number }>;
  private interval: number;
  public readonly limit: number;

  constructor(limit: number = 20, intervalMs: number = 60000) {
    this.tokens = new Map();
    this.limit = limit;
    this.interval = intervalMs;
  }

  /**
   * Check if a token (e.g., IP) has exceeded the limit
   * @returns boolean true if allowed, false if limited
   */
  public check(token: string): boolean {
    const now = Date.now();
    const bucket = this.tokens.get(token);

    if (bucket && now < bucket.expiresAt) {
      if (bucket.count >= this.limit) {
        return false;
      }
      bucket.count++;
      return true;
    }

    // Reset or new bucket
    this.tokens.set(token, {
      count: 1,
      expiresAt: now + this.interval,
    });

    // Proactive cleanup if map grows too large
    if (this.tokens.size > 2000) {
      this.cleanup();
    }

    return true;
  }

  /**
   * Remove expired buckets to prevent memory leaks
   */
  private cleanup() {
    const now = Date.now();
    this.tokens.forEach((bucket, token) => {
      if (now > bucket.expiresAt) {
        this.tokens.delete(token);
      }
    });
  }

  /**
   * Get remaining attempts for a token
   */
  public getRemaining(token: string): number {
    const bucket = this.tokens.get(token);
    if (!bucket || Date.now() > bucket.expiresAt) return this.limit;
    return Math.max(0, this.limit - bucket.count);
  }
}

// Pre-defined limiters for common use cases
export const loginLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 mins
export const inquiryLimiter = new RateLimiter(3, 15 * 60 * 1000); // 3 inquiries per 15 mins
export const publicApiLimiter = new RateLimiter(60, 60 * 1000); // 60 requests per minute
