// Only the slice of the Workers runtime that /api/likes uses. The full generated
// worker-configuration.d.ts is not loaded globally because it clashes with DOM types.
declare module 'cloudflare:workers' {
  interface D1Result<T> {
    results: T[];
  }
  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
  }
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  }
  export const env: {
    DB: D1Database;
    /** salt for the anonymous visitor hash (wrangler secret) */
    LIKES_SALT?: string;
  };
}

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID?: string;
  readonly PUBLIC_SANITY_DATASET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
