// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://luitiescobar.com',
  // Pages are prerendered (content comes from Sanity at build time); only /api/* runs on the Worker.
  output: 'static',
  // no sessions needed (avoids provisioning a KV namespace on deploy)
  session: false,
  adapter: cloudflare({
    // optimize local images at build time with sharp; Sanity images use Sanity's CDN
    imageService: 'compile',
    prerenderEnvironment: 'node',
  }),
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
});
