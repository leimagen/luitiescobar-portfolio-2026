/** The single GROQ query the site runs at build time. Pure module: also used by studio/scripts/snapshot.ts. */
const IMG = `{ ..., "dims": asset->metadata.dimensions, "lqip": asset->metadata.lqip }`;
const BODY = `[]{ ..., _type == "altImage" => ${IMG}, _type == "imageRow" => { ..., images[]${IMG} } }`;

export const CMS_QUERY = `{
  "settings": *[_id == "siteSettings"][0],
  "projects": *[_type == "project" && defined(slug.current) && defined(coverImage.asset)] | order(date desc) {
    "slug": slug.current, title, discipline, subcategory, date, featured, selected,
    client, year, role, tools, lead,
    "cover": coverImage${IMG}, video,
    "body": { "en": body.en${BODY}, "es": body.es${BODY} },
    "gallery": gallery[]${IMG}
  }
}`;
