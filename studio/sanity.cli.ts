import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // the Studio is a static app; it is deployed to cms.luitiescobar.com on Cloudflare (see wrangler.jsonc)
  autoUpdates: false,
});
