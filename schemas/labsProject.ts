import { defineField, defineType } from 'sanity'
import { ProjectsIcon } from '@sanity/icons'
import { dateOrder } from '../validators'

export default defineType({
  name: 'labsProject',
  title: 'Labs project',
  type: 'document',
  icon: ProjectsIcon,
  groups: [
    { name: 'content', title: 'Project', default: true },
    { name: 'publishing', title: 'Publishing' },
    { name: 'seo', title: 'Search and sharing' },
  ],
  validation: Rule => Rule.custom(document => dateOrder(document as Record<string, unknown>)),
  fields: [
    defineField({ name: 'title', title: 'Project name', type: 'string', group: 'content', validation: Rule => Rule.required().min(4).max(120) }),
    defineField({ name: 'slug', title: 'URL slug', type: 'slug', group: 'publishing', options: { source: 'title', isUnique: async (value, context) => context.defaultIsUnique(value, context) }, validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Card summary', type: 'text', rows: 4, group: 'content', validation: Rule => Rule.required().min(40).max(400) }),
    defineField({ name: 'body', title: 'Project details', type: 'portableText', group: 'content' }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', group: 'content', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: Rule => Rule.required().min(3).max(180) })] }),
    defineField({ name: 'tags', title: 'Topics', type: 'array', group: 'content', of: [{ type: 'string' }], options: { layout: 'tags' }, validation: Rule => Rule.unique().max(8) }),
    defineField({ name: 'partnerRef', title: 'Partner', type: 'reference', group: 'content', to: [{ type: 'partner' }], description: 'Choose a maintained partner record.' }),
    defineField({ name: 'partner', title: 'Legacy partner name', type: 'string', group: 'content', readOnly: true, hidden: ({ value }) => !value, description: 'Preserved until this record is linked to a partner.' }),
    defineField({ name: 'status', title: 'Project status', type: 'string', group: 'publishing', options: { list: [{ title: 'Upcoming', value: 'upcoming' }, { title: 'Active', value: 'active' }, { title: 'Completed', value: 'completed' }], layout: 'radio' }, initialValue: 'upcoming', validation: Rule => Rule.required() }),
    defineField({ name: 'displayOrder', title: 'Display order', type: 'number', group: 'publishing', description: 'Lower numbers appear first.', initialValue: 100, validation: Rule => Rule.required().integer().min(0).max(10000) }),
    defineField({ name: 'startDate', title: 'Start date', type: 'date', group: 'publishing' }),
    defineField({ name: 'endDate', title: 'End date', type: 'date', group: 'publishing' }),
    defineField({ name: 'publicationUrl', title: 'Publication URL', type: 'url', group: 'publishing', validation: Rule => Rule.uri({ scheme: ['https'] }) }),
    defineField({ name: 'cta', title: 'Primary action', type: 'cta', group: 'publishing' }),
    defineField({ name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: 'Website order', name: 'displayOrderAsc', by: [{ field: 'displayOrder', direction: 'asc' }] },
    { title: 'Start date, newest', name: 'startDateDesc', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', partner: 'partnerRef.name', legacyPartner: 'partner', status: 'status', media: 'coverImage' },
    prepare({ title, partner, legacyPartner, status, media }) { return { title: title || 'Untitled project', subtitle: `${status || 'No status'} · ${partner || legacyPartner || 'No partner'}`, media } },
  },
})
