import { defineField, defineType } from 'sanity'
import { ProjectsIcon } from '@sanity/icons'
import { dateOrder, recommendedImageDimensions } from '../validators.ts'

export default defineType({
  name: 'labsProject',
  title: 'Labs project',
  type: 'document',
  icon: ProjectsIcon,
  groups: [
    { name: 'content', title: 'Project' },
    { name: 'publishing', title: 'Publishing' },
  ],
  validation: Rule => Rule.custom(document => dateOrder(document as Record<string, unknown>)),
  fields: [
    defineField({ name: 'title', title: 'Project name', type: 'string', group: 'content', validation: Rule => Rule.required().min(4).max(120) }),
    defineField({ name: 'slug', title: 'Legacy URL slug', type: 'slug', group: 'publishing', hidden: true, readOnly: true, deprecated: { reason: 'Labs projects no longer have individual public pages.' }, options: { source: 'title', isUnique: async (value, context) => context.defaultIsUnique(value, context) }, description: 'Preserved for existing documents. Labs projects no longer have individual public pages.' }),
    defineField({ name: 'description', title: 'Card summary', type: 'text', rows: 4, group: 'content', validation: Rule => Rule.required().min(40).max(400) }),
    defineField({ name: 'body', title: 'Legacy project details', type: 'portableText', group: 'content', hidden: true, readOnly: true, deprecated: { reason: 'Public Labs cards use the card summary.' }, description: 'Preserved for existing documents. Public Labs cards use the card summary.' }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', group: 'content', description: 'Recommended: 1600×900px. Minimum: 1200×675px. Compose at 16:9 and use crop/hotspot for responsive cards.', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: Rule => Rule.required().min(3).max(180) })], validation: Rule => Rule.custom(recommendedImageDimensions(1200, 675, 'Labs cover', 16 / 9)).warning() }),
    defineField({ name: 'tags', title: 'Topics', type: 'array', group: 'content', of: [{ type: 'string' }], options: { layout: 'tags' }, validation: Rule => Rule.unique().max(8) }),
    defineField({ name: 'partnerRef', title: 'Partner', type: 'reference', group: 'content', to: [{ type: 'partner' }], description: 'Choose a maintained partner record. Partners not approved for public display remain internal and are omitted from the website.' }),
    defineField({ name: 'partner', title: 'Legacy partner name', type: 'string', group: 'content', readOnly: true, hidden: ({ value }) => !value, description: 'Preserved until this record is linked to a partner.' }),
    defineField({ name: 'status', title: 'Project status', type: 'string', group: 'publishing', options: { list: [{ title: 'Upcoming', value: 'upcoming' }, { title: 'Active', value: 'active' }, { title: 'Completed', value: 'completed' }], layout: 'radio' }, initialValue: 'upcoming', validation: Rule => Rule.required() }),
    defineField({ name: 'displayOrder', title: 'Display order', type: 'number', group: 'publishing', description: 'Lower numbers appear first.', initialValue: 100, validation: Rule => Rule.required().integer().min(0).max(10000) }),
    defineField({ name: 'startDate', title: 'Start date', type: 'date', group: 'publishing' }),
    defineField({ name: 'endDate', title: 'End date', type: 'date', group: 'publishing' }),
    defineField({ name: 'publicationUrl', title: 'Legacy publication URL', type: 'url', group: 'publishing', hidden: true, readOnly: true, deprecated: { reason: 'Labs cards do not link to a publication or detail page.' }, validation: Rule => Rule.uri({ scheme: ['https'] }), description: 'Preserved for existing documents and not displayed publicly.' }),
    defineField({ name: 'cta', title: 'Legacy primary action', type: 'cta', group: 'publishing', hidden: true, readOnly: true, deprecated: { reason: 'Labs cards are intentionally non-interactive.' }, description: 'Preserved for existing documents and not displayed publicly.' }),
    defineField({ name: 'seo', title: 'Legacy search and sharing', type: 'seo', hidden: true, readOnly: true, deprecated: { reason: 'Labs projects no longer have individual search-indexed pages.' }, description: 'Preserved for existing documents. Labs projects no longer have individual search-indexed pages.' }),
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
