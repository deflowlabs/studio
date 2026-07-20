/**
 * Partner schema — ecosystem partners, investors, and integrations.
 * Displayed in trust strips and partner pages.
 */
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  icon: () => '🤝',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'url',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Ecosystem', value: 'ecosystem' },
          { title: 'Investor', value: 'investor' },
          { title: 'Integration', value: 'integration' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'logo',
    },
  },
})
