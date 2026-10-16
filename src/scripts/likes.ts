/** Browser helpers for /api/likes. Every call resolves to null when the API isn't reachable. */
export interface LikesState {
  counts: Record<string, number>;
  liked: string[];
}

export async function fetchLikes(slugs: string[]): Promise<LikesState | null> {
  const unique = [...new Set(slugs)].filter(Boolean);
  if (!unique.length) return null;
  try {
    const res = await fetch(`/api/likes?slugs=${unique.map(encodeURIComponent).join(',')}`, { headers: { accept: 'application/json' } });
    if (!res.ok) return null;
    return (await res.json()) as LikesState;
  } catch {
    return null;
  }
}

/** host of the external page that sent the visitor here (e.g. "linkedin.com"), only for the like notification */
function externalReferrer(): string | undefined {
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    return ref && ref.host !== location.host ? ref.hostname.replace(/^www\./, '') : undefined;
  } catch {
    return undefined;
  }
}

export async function sendLike(slug: string, liked: boolean): Promise<{ count: number; liked: boolean } | null> {
  try {
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug, liked, ref: liked ? externalReferrer() : undefined }),
    });
    if (!res.ok) return null;
    return (await res.json()) as { count: number; liked: boolean };
  } catch {
    return null;
  }
}

/** Fill every `[data-like-count="<slug>"]` on the page with the real count. */
export async function hydrateLikeCounts(root: ParentNode = document) {
  const nodes = [...root.querySelectorAll<HTMLElement>('[data-like-count]')];
  const state = await fetchLikes(nodes.map((n) => n.dataset.likeCount!));
  if (!state) return;
  nodes.forEach((n) => (n.textContent = String(state.counts[n.dataset.likeCount!] ?? 0)));
}
