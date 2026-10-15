import { defineArrayMember, defineField, defineType } from 'sanity';
import { ImagesIcon } from '@sanity/icons/Images';
import { ImageIcon } from '@sanity/icons/Image';

/** Image with required alt text, reused across the schema. */
export const altImage = defineType({
  name: 'altImage',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Short description for screen readers and SEO.',
      validation: (rule) => rule.required(),
    }),
  ],
});

/** Rich text for case studies: email-like editing with headings, bold, lists, quotes and images. */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading', value: 'h2' },
        { title: 'Subheading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullets', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [defineField({ name: 'href', title: 'URL', type: 'url', validation: (rule) => rule.uri({ scheme: ['http', 'https', 'mailto'] }) })],
          }),
        ],
      },
    }),
    defineArrayMember({ type: 'altImage' }),
    defineArrayMember({
      name: 'imageRow',
      title: 'Image row',
      type: 'object',
      icon: ImagesIcon,
      fields: [
        defineField({
          name: 'images',
          type: 'array',
          of: [defineArrayMember({ type: 'altImage' })],
          validation: (rule) => rule.min(2).max(3),
        }),
      ],
      preview: {
        select: { images: 'images', media: 'images.0' },
        prepare: ({ images, media }) => ({ title: `Image row (${images?.length ?? 0})`, media }),
      },
    }),
  ],
});
