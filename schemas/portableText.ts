import { defineArrayMember, defineType } from 'sanity'

export default defineType({
  name: 'portableText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bulleted list', value: 'bullet' }, { title: 'Numbered list', value: 'number' }],
      marks: {
        decorators: [{ title: 'Strong', value: 'strong' }, { title: 'Emphasis', value: 'em' }, { title: 'Code', value: 'code' }],
        annotations: [defineArrayMember({ type: 'object', name: 'externalLink', title: 'Link', fields: [{ name: 'href', title: 'URL', type: 'url', validation: Rule => Rule.required().uri({ scheme: ['http', 'https', 'mailto'] }) }] })],
      },
    }),
    defineArrayMember({ type: 'imageWithAlt' }),
    defineArrayMember({ type: 'code', title: 'Code block' }),
  ],
})
