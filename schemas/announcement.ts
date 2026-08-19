import { defineField, defineType } from 'sanity'
import { BellIcon } from '@sanity/icons'
import { requireCtaPair, uniqueEnabledDocument } from '../validators.ts'

export default defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  icon: BellIcon,
  validation: Rule => Rule.custom(document => requireCtaPair(document as Record<string, any>)),
  fields: [
    defineField({ name: 'text', title: 'Message', type: 'string', description: 'One concise sentence displayed at the top of the website.', validation: Rule => Rule.required().min(8).max(150) }),
    defineField({ name: 'cta', title: 'Optional call to action', type: 'cta' }),
    defineField({ name: 'tone', title: 'Tone', type: 'string', description: 'Uses an accessible, design-system colour pair.', options: { list: [{ title: 'Information', value: 'info' }, { title: 'Positive update', value: 'success' }, { title: 'Important notice', value: 'warning' }], layout: 'radio' }, initialValue: 'info', validation: Rule => Rule.required() }),
    defineField({ name: 'isActive', title: 'Show this announcement', type: 'boolean', initialValue: false, description: 'Only one announcement can be active.', validation: Rule => Rule.custom(uniqueEnabledDocument('announcement', 'isActive')) }),
    defineField({ name: 'link', title: 'Legacy link URL', type: 'url', readOnly: true, hidden: ({ value }) => !value }),
    defineField({ name: 'linkText', title: 'Legacy link text', type: 'string', readOnly: true, hidden: ({ value }) => !value }),
    defineField({ name: 'backgroundColor', title: 'Legacy background colour', type: 'string', readOnly: true, hidden: ({ value }) => !value }),
  ],
  orderings: [{ title: 'Last edited', name: 'updatedAtDesc', by: [{ field: '_updatedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'text', active: 'isActive', tone: 'tone' },
    prepare({ title, active, tone }) { return { title: title || 'Untitled announcement', subtitle: `${active ? 'Active' : 'Inactive'} · ${tone || 'No tone'}` } },
  },
})
