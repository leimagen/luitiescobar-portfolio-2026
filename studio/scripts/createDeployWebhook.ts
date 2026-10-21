/**
 * Creates the Sanity webhook that rebuilds luitiescobar.com when content is published.
 * It calls the Cloudflare Workers Builds Deploy Hook of the "luitiescobar" Worker.
 * The hook URL is read from the DEPLOY_HOOK_URL env var so it never ends up in the repo:
 *
 *   PowerShell:  $env:DEPLOY_HOOK_URL = Get-Clipboard; npx sanity exec scripts/createDeployWebhook.ts --with-user-token
 *
 * Re-running replaces the existing "Rebuild luitiescobar.com" webhook.
 */
import { getCliClient } from 'sanity/cli';

const NAME = 'Rebuild luitiescobar.com';
const hook = process.env.DEPLOY_HOOK_URL?.trim().match(/https:\/\/api\.cloudflare\.com\/client\/v4\/workers\/builds\/deploy_hooks\/[\w-]+/)?.[0];
if (!hook) {
  console.error('DEPLOY_HOOK_URL is missing or is not a Workers Builds deploy hook URL.');
  process.exit(1);
}

const cli = getCliClient({ apiVersion: '2021-10-04' });
const { projectId } = cli.config();
const api = cli.withConfig({ useProjectHostname: false, apiHost: 'https://api.sanity.io' });

const existing = await api.request<{ id: string; name: string }[]>({ uri: `/hooks/projects/${projectId}` });
for (const h of existing.filter((h) => h.name === NAME)) {
  await api.request({ uri: `/hooks/projects/${projectId}/${h.id}`, method: 'DELETE' });
}

await api.request({
  uri: `/hooks/projects/${projectId}`,
  method: 'POST',
  body: {
    type: 'document',
    name: NAME,
    description: 'Triggers a Cloudflare Workers Builds deploy when projects or site settings are published.',
    url: hook,
    httpMethod: 'POST',
    apiVersion: 'v2021-03-25',
    dataset: 'production',
    // published documents only (drafts never trigger it)
    rule: { on: ['create', 'update', 'delete'], filter: '_type in ["project", "siteSettings"]', projection: '{_id, _type}' },
    includeDrafts: false,
    isDisabled: false,
  },
});
console.log(`Webhook "${NAME}" created for project ${projectId}.`);
