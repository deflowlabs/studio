import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import announcement from '../schemas/announcement.ts'
import labsProject from '../schemas/labsProject.ts'
import post from '../schemas/post.ts'

test('primary content types own their defaults without duplicate templates', async () => {
  assert.equal(post.type, 'document')
  assert.equal(announcement.type, 'document')
  assert.equal(labsProject.type, 'document')

  const publishedAt = post.fields.find(field => field.name === 'publishedAt')
  const isFeatured = post.fields.find(field => field.name === 'isFeatured')
  const tone = announcement.fields.find(field => field.name === 'tone')
  const isActive = announcement.fields.find(field => field.name === 'isActive')
  const status = labsProject.fields.find(field => field.name === 'status')
  const displayOrder = labsProject.fields.find(field => field.name === 'displayOrder')

  assert.equal(typeof publishedAt?.initialValue, 'function')
  assert.equal(isFeatured?.initialValue, false)
  assert.equal(tone?.initialValue, 'info')
  assert.equal(isActive?.initialValue, false)
  assert.equal(status?.initialValue, 'upcoming')
  assert.equal(displayOrder?.initialValue, 100)

  const config = await readFile(new URL('../sanity.config.ts', import.meta.url), 'utf8')
  assert.doesNotMatch(config, /schema:\s*{[^}]*templates/s)
})

test('legacy Testimonials and unused Releases are absent from the editor experience', async () => {
  const [config, structure, schemaIndex] = await Promise.all([
    readFile(new URL('../sanity.config.ts', import.meta.url), 'utf8'),
    readFile(new URL('../structure.ts', import.meta.url), 'utf8'),
    readFile(new URL('../schemas/index.ts', import.meta.url), 'utf8'),
  ])

  assert.match(config, /releases:\s*{\s*enabled:\s*false\s*}/)
  assert.doesNotMatch(structure, /testimonial|Unused \/ legacy/i)
  assert.doesNotMatch(schemaIndex, /testimonial/i)
})
