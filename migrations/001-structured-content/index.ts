import { at, defineMigration, patch, set, setIfMissing } from 'sanity/migrate'
import type { SanityDocument } from 'sanity'

type LegacyDocument = SanityDocument & {
  _type: 'post' | 'announcement' | 'labsProject' | 'partner'
  seo?: Record<string, unknown>
  seoTitle?: string
  seoDescription?: string
  link?: string
  linkText?: string
  backgroundColor?: string
}

function announcementTone(colour?: string) {
  if (!colour) return 'info'
  const value = colour.toLowerCase()
  if (value.includes('green') || value.includes('success')) return 'success'
  if (value.includes('yellow') || value.includes('orange') || value.includes('warning')) return 'warning'
  return 'info'
}

export default defineMigration({
  title: 'Backfill structured SEO, calls to action and display defaults',
  documentTypes: ['post', 'announcement', 'labsProject', 'partner'],
  migrate: {
    document(document) {
      const doc = document as LegacyDocument
      const operations = []

      if (doc._type === 'post' && !doc.seo && (doc.seoTitle || doc.seoDescription)) {
        operations.push(at('seo', set({
          _type: 'seo',
          title: doc.seoTitle,
          description: doc.seoDescription,
        })))
      }

      if (doc._type === 'announcement') {
        operations.push(at('tone', setIfMissing(announcementTone(doc.backgroundColor))))
        if (doc.link && doc.linkText) {
          operations.push(at('cta', setIfMissing({ _type: 'cta', label: doc.linkText, url: doc.link })))
        }
      }

      if (['labsProject', 'partner'].includes(doc._type)) {
        operations.push(at('displayOrder', setIfMissing(100)))
      }

      if (doc._type === 'partner') {
        operations.push(at('isPublic', setIfMissing(false)))
      }

      return operations.length ? patch(doc._id, operations) : undefined
    },
  },
})
