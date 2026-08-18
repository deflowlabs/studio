import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Button text', type: 'string', validation: Rule => Rule.required().min(2).max(40) }),
    defineField({ name: 'url', title: 'Destination URL', type: 'url', validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] }) }),
    defineField({ name: 'style', title: 'Style', type: 'string', options: { list: [{ title: 'Primary', value: 'primary' }, { title: 'Secondary', value: 'secondary' }, { title: 'Text link', value: 'link' }], layout: 'radio' }, initialValue: 'primary' }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
})
