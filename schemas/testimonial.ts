import { defineField, defineType } from 'sanity'
import { CommentIcon } from '@sanity/icons'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial (not displayed)',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: Rule => Rule.required().min(20).max(500) }),
    defineField({ name: 'author', title: 'Attributed name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'company', title: 'Organisation', type: 'string' }),
    defineField({ name: 'avatar', title: 'Portrait', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: Rule => Rule.required().min(3).max(180) })] }),
    defineField({ name: 'consentRecorded', title: 'Publication consent recorded', type: 'boolean', initialValue: false, validation: Rule => Rule.required() }),
    defineField({ name: 'consentNote', title: 'Consent source', type: 'text', rows: 3, description: 'Internal evidence or reference. Never displayed publicly.' }),
    defineField({ name: 'isPublic', title: 'Approved for future public use', type: 'boolean', initialValue: false, description: 'The website does not currently display testimonials.' }),
    defineField({ name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 100, validation: Rule => Rule.integer().min(0).max(10000) }),
  ],
  validation: Rule => Rule.custom(document => !document?.isPublic || Boolean(document?.consentRecorded) || 'Record publication consent before marking a testimonial public.'),
  preview: { select: { title: 'author', company: 'company', public: 'isPublic', media: 'avatar' }, prepare({ title, company, public: isPublic, media }) { return { title: title || 'Unnamed testimonial', subtitle: `${company || 'No organisation'} · ${isPublic ? 'Approved' : 'Not approved'}`, media } } },
})
