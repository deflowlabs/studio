/**
 * Announcement schema — CMS-managed top banner for time-sensitive news.
 * Only one announcement should be active at a time. Dismissible per-session.
 */
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'announcement',
  title: 'Announcement Banner',
  type: 'document',
  icon: () => '📢',
  fields: [
    defineField({
      name: 'text',
      title: 'Banner Text',
      type: 'string',
      description: 'Short announcement text (max 100 chars recommended)',
      validation: (Rule) => Rule.required().max(150),
    }),
    defineField({
      name: 'link',
      title: 'Link URL',
      type: 'url',
      description: 'Where the banner links to (optional)',
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      initialValue: 'Learn more →',
      description: 'CTA text shown next to the announcement',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: false,
      description: 'Only one announcement should be active at a time',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      initialValue: '#1E1E2E',
      description: 'Hex color for the banner background (default: dark indigo)',
    }),
  ],
  preview: {
    select: {
      title: 'text',
      isActive: 'isActive',
    },
    prepare({ title, isActive }) {
      return {
        title: title || 'Untitled',
        subtitle: isActive ? '🟢 Active' : '⚪ Inactive',
      }
    },
  },
})
