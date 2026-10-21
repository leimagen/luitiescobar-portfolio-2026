// Only the slice of the Workers runtime that /api/likes (and src/lib/notify.ts) uses. The full generated
// worker-configuration.d.ts is not loaded globally because it clashes with DOM types.
declare module 'cloudflare:workers' {
  interface D1Result<T> {
    results: T[];
    meta: { changes: number };
  }
  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
  }
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  }
  interface SendEmail {
    send(message: {
      to: string;
      from: string | { email: string; name?: string };
      subject: string;
      text?: string;
      html?: string;
      replyTo?: string | { email: string; name?: string };
    }): Promise<{ messageId: string }>;
  }
  export const env: {
    DB: D1Database;
    /** Email Service binding: sends to verified Email Routing destinations only */
    EMAIL?: SendEmail;
    /** where contact form messages go (wrangler secret; must be a verified destination) */
    CONTACT_TO?: string;
    /** salt for the anonymous visitor hash (wrangler secret) */
    LIKES_SALT?: string;
    /** Telegram like notifications (wrangler secrets, optional) */
    TELEGRAM_BOT_TOKEN?: string;
    TELEGRAM_CHAT_ID?: string;
  };
}

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID?: string;
  readonly PUBLIC_SANITY_DATASET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
