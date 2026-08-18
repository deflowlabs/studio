import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'name', title: 'Organisation name', type: 'string', validation: Rule => Rule.required().min(2).max(100) }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: Rule => Rule.required().min(3).max(180) })] }),
    defineField({ name: 'url', title: 'Website URL', type: 'url', validation: Rule => Rule.uri({ scheme: ['https'] }) }),
    defineField({ name: 'category', title: 'Relationship', type: 'string', options: { list: [{ title: 'Research', value: 'research' }, { title: 'Ecosystem', value: 'ecosystem' }, { title: 'Investor', value: 'investor' }, { title: 'Integration', value: 'integration' }] }, validation: Rule => Rule.required() }),
    defineField({ name: 'isPublic', title: 'Approved for public display', type: 'boolean', description: 'Enable only when permission to display the relationship and logo is recorded.', initialValue: false }),
    defineField({ name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 100, validation: Rule => Rule.integer().min(0).max(10000) }),
    defineField({ name: 'internalNote', title: 'Internal permission note', type: 'text', rows: 3, description: 'Record the approval source. This field is never queried by the website.' }),
  ],
  orderings: [{ title: 'Display order', name: 'displayOrderAsc', by: [{ field: 'displayOrder', direction: 'asc' }] }],
  preview: { select: { title: 'name', category: 'category', public: 'isPublic', media: 'logo' }, prepare({ title, category, public: isPublic, media }) { return { title: title || 'Unnamed partner', subtitle: `${category || 'No relationship'} · ${isPublic ? 'Public' : 'Internal only'}`, media } } },
})
