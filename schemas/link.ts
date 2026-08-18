import { defineField, defineType } from 'sanity'
import { isHttpUrl } from '../validators'

export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Link text', type: 'string', validation: Rule => Rule.required().min(2).max(50) }),
    defineField({ name: 'url', title: 'Destination URL', type: 'url', validation: Rule => Rule.required().custom(isHttpUrl) }),
    defineField({ name: 'openInNewTab', title: 'Open in a new tab', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
})
