/**
 * Dumps what the site would read from Sanity — including DRAFTS — to a local JSON file,
 * so the site can be previewed before publishing:
 *
 *   cd studio && npx sanity exec scripts/snapshot.ts --with-user-token
 *   cd .. && CMS_SNAPSHOT=.cms-snapshot.json npm run build && npm run preview
 */
import { getCliClient } from 'sanity/cli';
import { writeFileSync } from 'node:fs';
import { CMS_QUERY } from '../../src/lib/cmsQuery';

const client = getCliClient({ apiVersion: '2026-10-01' });
const data = await client.fetch(CMS_QUERY, {}, { perspective: 'drafts' });
writeFileSync('../.cms-snapshot.json', JSON.stringify(data));
console.log(`Snapshot written: ${data.projects.length} projects (drafts included) → .cms-snapshot.json`);
