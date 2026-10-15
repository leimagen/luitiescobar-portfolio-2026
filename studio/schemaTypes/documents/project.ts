import { defineField, defineType } from 'sanity';
import { CaseIcon } from '@sanity/icons/Case';
import { disciplineOptions, subcategoryOptions } from '../disciplines';

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: CaseIcon,
  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'details', title: 'Details' },
    { name: 'story', title: 'Case study' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
      group: 'main',
      validation: (rule) => rule.custom((v: { en?: string } | undefined) => (v?.en ? true : 'English title is required')),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'main',
      description: 'URL of the project page: /work/<slug>',
      options: { source: 'title.en', maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'altImage',
      group: 'main',
      description: 'Shown in the galleries. Any proportion works — the grid adapts to it.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'discipline',
      type: 'string',
      group: 'main',
      options: { list: disciplineOptions, layout: 'radio', direction: 'horizontal' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subcategory',
      type: 'string',
      group: 'main',
      description: 'Used by the filters on the discipline page.',
      options: { list: Object.entries(subcategoryOptions).flatMap(([d, subs]) => subs.map((s) => ({ title: `${disciplineOptions.find((o) => o.value === d)?.title} — ${s.title}`, value: s.value }))) },
      validation: (rule) =>
        rule.required().custom((value, ctx) => {
          const discipline = (ctx.document as { discipline?: string } | undefined)?.discipline;
          if (!discipline || !value) return true;
          return subcategoryOptions[discipline]?.some((s) => s.value === value) ? true : 'Pick a subcategory of the selected discipline';
        }),
    }),
    defineField({
      name: 'date',
      type: 'date',
      group: 'main',
      description: 'Used for "Recent" sorting.',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'selected', title: 'Show in Home "Selected work"', type: 'boolean', group: 'main', initialValue: false }),
    defineField({ name: 'featured', title: 'Featured on the discipline card (Home)', type: 'boolean', group: 'main', initialValue: false }),

    defineField({ name: 'client', type: 'string', group: 'details' }),
    defineField({ name: 'year', type: 'string', group: 'details' }),
    defineField({ name: 'role', type: 'localeString', group: 'details' }),
    defineField({ name: 'tools', type: 'string', group: 'details', description: 'e.g. After Effects, Cinema 4D' }),

    defineField({ name: 'lead', title: 'Intro', type: 'localeText', group: 'story', description: 'One or two sentences under the title.' }),
    defineField({ name: 'body', title: 'Case study', type: 'localeBlockContent', group: 'story', description: 'Optional. Leave empty for image-only projects.' }),
    defineField({ name: 'gallery', title: 'Extra images', type: 'array', group: 'story', of: [{ type: 'altImage' }], description: 'Shown full width after the text.' }),
  ],
  orderings: [{ title: 'Date, newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'title.en', discipline: 'discipline', date: 'date', media: 'coverImage' },
    prepare: ({ title, discipline, date, media }) => ({
      title,
      subtitle: [disciplineOptions.find((o) => o.value === discipline)?.title, date?.slice(0, 4)].filter(Boolean).join(' · '),
      media,
    }),
  },
});
