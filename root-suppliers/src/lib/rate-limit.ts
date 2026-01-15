type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new Map();
  const { uniqueTokenPerInterval = 500, interval = 60000 } = options || {};

  return {
    check: (res: any, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        // Simple cleanup
        if (tokenCache.size > uniqueTokenPerInterval) {
          tokenCache.clear();
          // In a real prod env, we'd use LRU, but this is a safe fallback to prevent OOM
        }

        // Reset count after interval
        // This is a naive implementation where the "window" is effectively reset
        // strictly by time if we used timestamps, but here we just rely on checks.
        // Actually, for a proper window, we should store timestamps. 
        // Let's improve this to a standard fixed window counter.
      }),
  };
}

// Improved implementation for robustness
export class RateLimiter {
  private tokens: Map<string, { count: number; expiresAt: number }>;
  private interval: number;
  private limit: number;

  constructor(limit: number = 10, interval: number = 60000) {
    this.tokens = new Map();
    this.limit = limit;
    this.interval = interval;
  }

  public check(token: string): boolean {
    const now = Date.now();
    const cleanToken = this.tokens.get(token);

    if (cleanToken && now < cleanToken.expiresAt) {
      if (cleanToken.count >= this.limit) {
        return false;
      }
      cleanToken.count++;
      return true;
    }

    // Reset or new
    this.tokens.set(token, {
      count: 1,
      expiresAt: now + this.interval,
    });

    // Cleanup old tokens occasionally
    if (this.tokens.size > 1000) {
      this.cleanup(now);
    }

    return true;
  }

  private cleanup(now: number) {
    this.tokens.forEach((value, key) => {
      if (now > value.expiresAt) {
        this.tokens.delete(key);
      }
    });
  }
}
