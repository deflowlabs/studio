import { defineField, defineType } from 'sanity'
import { recommendedImageDimensions } from '../validators.ts'

export default defineType({
  name: 'seo',
  title: 'Search and sharing',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Search title', type: 'string', description: 'Use 50–60 characters. Falls back to the document title.', validation: Rule => Rule.max(60) }),
    defineField({ name: 'description', title: 'Search description', type: 'text', rows: 3, description: 'Use a clear 120–160 character summary.', validation: Rule => Rule.max(160) }),
    defineField({ name: 'image', title: 'Sharing image', type: 'imageWithAlt', description: 'Recommended: 1200×630px for social previews.', validation: Rule => Rule.custom(recommendedImageDimensions(1200, 630, 'Sharing image', 1200 / 630, '1200:630')).warning() }),
    defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', description: 'Adds a noindex directive and removes this page from the sitemap. The page remains accessible by its direct URL.', initialValue: false }),
  ],
})
