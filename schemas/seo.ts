import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'Search and sharing',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Search title', type: 'string', description: 'Use 50–60 characters. Falls back to the document title.', validation: Rule => Rule.max(60) }),
    defineField({ name: 'description', title: 'Search description', type: 'text', rows: 3, description: 'Use a clear 120–160 character summary.', validation: Rule => Rule.max(160) }),
    defineField({ name: 'image', title: 'Sharing image', type: 'imageWithAlt', description: 'Optional image for social sharing.' }),
    defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
  ],
})
