import { defineArrayMember, defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons/Cog';
import { disciplineOptions } from '../disciplines';

/**
 * Singleton with every editable text of the site that is not a project:
 * Home copy, About lists, contact details and per-discipline texts.
 * Empty fields fall back to the defaults shipped in the site code.
 */
const disciplineGroup = (value: string, title: string) =>
  defineField({
    name: value === '3d' ? 'threeD' : value,
    title,
    type: 'object',
    group: 'disciplines',
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: 'description', type: 'localeText' }),
      defineField({ name: 'tags', type: 'localeString', description: 'Short line on the Home card, e.g. "Branding · Ads · Web"' }),
      defineField({
        name: 'reel',
        type: 'object',
        description: 'Optional showreel at the top of the discipline page.',
        fields: [
          defineField({ name: 'title', type: 'string', initialValue: `${title} Reel` }),
          defineField({
            name: 'videoUrl',
            title: 'Video URL',
            type: 'url',
            description: 'Vimeo or YouTube link, or a direct .mp4 hosted outside Sanity (video files in Sanity get expensive in bandwidth).',
          }),
        ],
      }),
    ],
  });

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'home', title: 'Home', default: true },
    { name: 'about', title: 'About' },
    { name: 'contact', title: 'Contact' },
    { name: 'disciplines', title: 'Disciplines' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Home
    defineField({ name: 'heroGreeting', title: 'Hero greeting', type: 'localeString', group: 'home', description: 'e.g. "hi, I\'m Luiti Escobar —"' }),
    defineField({ name: 'heroTitle1', title: 'Hero title — line 1', type: 'localeString', group: 'home' }),
    defineField({ name: 'heroTitle2', title: 'Hero title — line 2', type: 'localeString', group: 'home' }),
    defineField({ name: 'heroTitle3', title: 'Hero title — line 3', type: 'localeString', group: 'home', description: 'The line containing "disciplin…" is shown in bold.' }),
    defineField({ name: 'introP1', title: 'Bio — paragraph 1', type: 'localeText', group: 'home', description: 'Home teaser and About bio.' }),
    defineField({ name: 'introP2', title: 'Bio — paragraph 2', type: 'localeText', group: 'home', description: 'About bio (and Home on desktop).' }),

    // About
    defineField({ name: 'aboutRole', title: 'Role line', type: 'localeString', group: 'about' }),
    defineField({ name: 'aboutLead', title: 'Lead', type: 'localeText', group: 'about' }),
    defineField({
      name: 'experience',
      type: 'array',
      group: 'about',
      description: 'Newest first. Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'job',
          fields: [
            defineField({ name: 'company', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'role', type: 'localeString' }),
            defineField({ name: 'place', type: 'localeString' }),
            defineField({ name: 'start', type: 'date', options: { dateFormat: 'MMM YYYY' }, validation: (rule) => rule.required() }),
            defineField({ name: 'end', type: 'date', options: { dateFormat: 'MMM YYYY' }, description: 'Leave empty if current.' }),
            defineField({ name: 'summary', type: 'localeText' }),
          ],
          preview: {
            select: { title: 'company', role: 'role.en', start: 'start', end: 'end' },
            prepare: ({ title, role, start, end }) => ({ title, subtitle: `${role ?? ''} · ${start?.slice(0, 4) ?? ''}–${end?.slice(0, 4) ?? 'now'}` }),
          },
        }),
      ],
    }),
    defineField({ name: 'tools', type: 'array', group: 'about', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'selfTaught', title: 'Training intro', type: 'localeText', group: 'about' }),
    defineField({
      name: 'certifications',
      title: 'Training & certifications',
      type: 'array',
      group: 'about',
      of: [defineArrayMember({ type: 'object', name: 'certification', fields: [defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }), defineField({ name: 'detail', type: 'localeString' })] })],
    }),
    defineField({
      name: 'languages',
      type: 'array',
      group: 'about',
      of: [defineArrayMember({ type: 'object', name: 'language', fields: [defineField({ name: 'name', type: 'localeString' }), defineField({ name: 'level', type: 'localeString' })], preview: { select: { title: 'name.en', subtitle: 'level.en' } } })],
    }),

    // Contact
    defineField({ name: 'email', type: 'string', group: 'contact', validation: (rule) => rule.email() }),
    defineField({ name: 'location', type: 'localeString', group: 'contact' }),
    defineField({ name: 'availability', type: 'localeString', group: 'contact' }),
    defineField({ name: 'contactTitle1', title: 'Contact title — line 1', type: 'localeString', group: 'contact' }),
    defineField({ name: 'contactTitle2', title: 'Contact title — line 2', type: 'localeString', group: 'contact' }),
    defineField({ name: 'contactText', title: 'Contact text', type: 'localeText', group: 'contact' }),
    defineField({
      name: 'socials',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({ type: 'object', name: 'social', fields: [defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }), defineField({ name: 'url', type: 'url', validation: (rule) => rule.required() })], preview: { select: { title: 'label', subtitle: 'url' } } })],
    }),

    // Disciplines
    ...disciplineOptions.map((d) => disciplineGroup(d.value, d.title)),

    // SEO
    defineField({ name: 'metaTitle', title: 'Default page title', type: 'localeString', group: 'seo' }),
    defineField({ name: 'metaDescription', title: 'Default description', type: 'localeText', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
