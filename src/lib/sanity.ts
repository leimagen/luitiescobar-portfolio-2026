import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

/**
 * Sanity connection. The project id is public (it is in every image URL), so it has a default and CI builds
 * need no env vars. While the CMS has no published projects the site shows the placeholders in src/data.
 */
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'cp45bc1k';
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

/** 1200×630 JPEG crop for Open Graph / LinkedIn previews (respects the image hotspot). */
export function ogImageUrl(img: CmsImage | undefined): string | undefined {
  if (!builder || !img?.asset) return undefined;
  return builder.image(img).width(1200).height(630).fit('crop').format('jpg').quality(85).url();
}
