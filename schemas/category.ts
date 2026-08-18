import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'title', title: 'Name', type: 'string', description: 'Use a broad, reusable editorial topic.', validation: Rule => Rule.required().min(2).max(40) }),
    defineField({ name: 'slug', title: 'URL slug', type: 'slug', options: { source: 'title', isUnique: async (value, context) => context.defaultIsUnique(value, context) }, validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Editor guidance', type: 'text', rows: 3, description: 'Explain when this category should be used.', validation: Rule => Rule.required().min(20).max(240) }),
  ],
  orderings: [{ title: 'Name', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'description' } },
})
