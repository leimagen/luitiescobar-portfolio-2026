import { defineField, defineType } from 'sanity';

/**
 * Field-level localization: every translatable field stores { en, es } side by side,
 * so editors see both languages together. English is the required base language.
 */
export const languages = [
  { id: 'en', title: 'English', isDefault: true },
  { id: 'es', title: 'Español' },
] as const;

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  options: { columns: 2 },
  fields: languages.map((lang) =>
    defineField({ name: lang.id, title: lang.title, type: 'string' }),
  ),
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text',
  type: 'object',
  fields: languages.map((lang) =>
    defineField({ name: lang.id, title: lang.title, type: 'text', rows: 3 }),
  ),
});

export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Localized rich text',
  type: 'object',
  fields: languages.map((lang) =>
    defineField({ name: lang.id, title: lang.title, type: 'blockContent' }),
  ),
});
