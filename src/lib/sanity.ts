import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

/**
 * Sanity connection. When PUBLIC_SANITY_PROJECT_ID is not set the site keeps working
 * with the placeholder content in src/data (useful before the CMS has content).
 */
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export const sanityEnabled = Boolean(projectId);

export const sanity: SanityClient | null = sanityEnabled
  ? createClient({ projectId, dataset, apiVersion: '2026-10-01', useCdn: false, perspective: 'published' })
  : null;

const builder = sanityEnabled ? createImageUrlBuilder({ projectId: projectId!, dataset }) : null;

/** Image as fetched by our GROQ queries (asset ref + crop/hotspot + metadata). */
export interface CmsImage {
  _type?: string;
  alt?: string;
  asset?: { _ref: string };
  crop?: unknown;
  hotspot?: unknown;
  dims?: { width: number; height: number; aspectRatio: number };
  lqip?: string;
}

export interface ImageAttrs {
  src: string;
  srcset: string;
  width: number;
  height: number;
  aspect: number;
  alt: string;
  lqip?: string;
}

const WIDTHS = [320, 480, 640, 800, 1080, 1440, 1920, 2400];

/** Responsive <img> attributes served (and resized) by Sanity's image CDN. */
export function imageAttrs(img: CmsImage | undefined, maxWidth = 2400): ImageAttrs | undefined {
  if (!builder || !img?.asset) return undefined;
  const width = img.dims?.width ?? 1600;
  const height = img.dims?.height ?? 1000;
  const base = builder.image(img).auto('format').fit('max').quality(82);
  const widths = WIDTHS.filter((w) => w <= Math.min(maxWidth, width));
  if (!widths.length) widths.push(width);
  return {
    src: base.width(widths[Math.min(3, widths.length - 1)]).url(),
    srcset: widths.map((w) => `${base.width(w).url()} ${w}w`).join(', '),
    width,
    height,
    aspect: width / height,
    alt: img.alt ?? '',
    lqip: img.lqip,
  };
}
