import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'
import { announcementFeaturedConflict, recommendedImageDimensions, uniqueEnabledDocument } from '../validators.ts'

export default defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'publishing', title: 'Publishing' },
    { name: 'seo', title: 'Search and sharing' },
  ],
  validation: Rule => Rule.custom(announcementFeaturedConflict).warning(),
  fields: [
    defineField({ name: 'title', title: 'Headline', type: 'string', group: 'content', description: 'Clear, specific, and no more than 120 characters.', validation: Rule => Rule.required().min(8).max(120) }),
    defineField({ name: 'slug', title: 'URL slug', type: 'slug', group: 'publishing', options: { source: 'title', maxLength: 96, isUnique: async (value, context) => context.defaultIsUnique(value, context) }, validation: Rule => Rule.required() }),
    defineField({ name: 'excerpt', title: 'Summary', type: 'text', rows: 3, group: 'content', description: 'Used in cards and feeds. Write a complete sentence.', validation: Rule => Rule.required().min(40).max(300) }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', group: 'content', description: 'Recommended: 1600×900px. Minimum: 1200×675px. Compose at 16:9 and use crop/hotspot to keep the subject visible on every screen.', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: Rule => Rule.required().min(3).max(180) })], validation: Rule => [Rule.required(), Rule.custom(recommendedImageDimensions(1200, 675, 'Blog cover', 16 / 9)).warning()] }),
    defineField({ name: 'body', title: 'Article body', type: 'portableText', group: 'content', description: 'Use Heading 2 and Heading 3 in order. Every image requires alternative text.', validation: Rule => Rule.required().min(1) }),
    defineField({ name: 'author', title: 'Author', type: 'reference', group: 'publishing', to: [{ type: 'author' }], validation: Rule => Rule.required() }),
    defineField({ name: 'categories', title: 'Categories', type: 'array', group: 'publishing', description: 'The first category becomes the card badge. Website filters match every selected category. The category with URL slug “announcements” is eligible for the top announcement-story position.', of: [{ type: 'reference', to: [{ type: 'category' }] }], validation: Rule => Rule.required().min(1).unique() }),
    defineField({ name: 'publishedAt', title: 'Publication date and time', type: 'datetime', group: 'publishing', initialValue: () => new Date().toISOString(), description: 'Future dates remain hidden from the public website.', validation: Rule => Rule.required() }),
    defineField({ name: 'isFeatured', title: 'Featured post', type: 'boolean', group: 'publishing', initialValue: false, description: 'Select one explicit featured story. The website never promotes the newest article automatically. Announcement stories take placement precedence.', validation: Rule => Rule.custom(uniqueEnabledDocument('post', 'isFeatured')) }),
    defineField({ name: 'readingTime', title: 'Reading time', type: 'number', group: 'publishing', description: 'Optional estimated minutes.', validation: Rule => Rule.integer().min(1).max(60) }),
    defineField({ name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo' }),
    defineField({ name: 'seoTitle', title: 'Legacy search title', type: 'string', group: 'seo', readOnly: true, hidden: ({ value }) => !value, deprecated: { reason: 'Moved to Search and sharing.' } }),
    defineField({ name: 'seoDescription', title: 'Legacy search description', type: 'text', group: 'seo', readOnly: true, hidden: ({ value }) => !value, deprecated: { reason: 'Moved to Search and sharing.' } }),
  ],
  orderings: [
    { title: 'Publication date, newest', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Last edited', name: 'updatedAtDesc', by: [{ field: '_updatedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', author: 'author.name', media: 'coverImage', date: 'publishedAt', featured: 'isFeatured' },
    prepare({ title, author, media, date, featured }) {
      return { title: `${featured ? 'Featured · ' : ''}${title || 'Untitled post'}`, subtitle: `${author || 'No author'} · ${date ? new Date(date).toLocaleDateString('en-GB') : 'No publication date'}`, media }
    },
  },
})
