/**
 * Publishes every project draft (drafts.<id> → <id>) in one transaction and removes the drafts.
 * Equivalent to pressing "Publish" on each one in the Studio.
 *
 *   cd studio && npx sanity exec scripts/publishDrafts.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2026-10-01' });
const drafts = await client.fetch(`*[_id in path("drafts.**") && _type == "project"]`, {}, { perspective: 'raw' });

if (!drafts.length) {
  console.log('No drafts to publish.');
  process.exit(0);
}

const tx = client.transaction();
for (const { _id, _rev, _createdAt, _updatedAt, ...doc } of drafts) {
  tx.createOrReplace({ ...doc, _id: _id.replace(/^drafts\./, '') });
  tx.delete(_id);
}
await tx.commit({ visibility: 'sync' });
console.log(`Published ${drafts.length} projects.`);
