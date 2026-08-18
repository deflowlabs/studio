import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  groups: [{ name: 'profile', title: 'Profile', default: true }, { name: 'links', title: 'Public links' }],
  fields: [
    defineField({ name: 'name', title: 'Display name', type: 'string', group: 'profile', validation: Rule => Rule.required().min(2).max(80) }),
    defineField({ name: 'slug', title: 'URL slug', type: 'slug', group: 'profile', options: { source: 'name', isUnique: async (value, context) => context.defaultIsUnique(value, context) }, validation: Rule => Rule.required() }),
    defineField({ name: 'avatar', title: 'Portrait', type: 'image', group: 'profile', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: Rule => Rule.required().min(3).max(180) })] }),
    defineField({ name: 'role', title: 'Role or attribution', type: 'string', group: 'profile', description: 'For example: Founder or Guest researcher.', validation: Rule => Rule.required().max(100) }),
    defineField({ name: 'bio', title: 'Short biography', type: 'text', rows: 4, group: 'profile', validation: Rule => Rule.required().min(40).max(500) }),
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url', group: 'links', validation: Rule => Rule.uri({ scheme: ['https'] }) }),
    defineField({ name: 'twitter', title: 'X URL', type: 'url', group: 'links', validation: Rule => Rule.uri({ scheme: ['https'] }) }),
  ],
  orderings: [{ title: 'Name', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role', media: 'avatar' } },
})
