import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'imageWithAlt',
  title: 'Accessible image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({ name: 'alt', title: 'Alternative text', type: 'string', description: 'Describe the image purpose. Leave decorative images out instead of using an empty description.', validation: Rule => Rule.required().min(3).max(180) }),
    defineField({ name: 'caption', title: 'Caption', type: 'string', validation: Rule => Rule.max(200) }),
  ],
})
