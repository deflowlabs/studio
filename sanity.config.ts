/**
 * DeFlow Labs — Sanity Studio Configuration
 * Content management for blog posts, authors, labs projects, and legal pages.
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './schemas'
import { deskStructure } from './structure'

export default defineConfig({
  name: 'deflow-labs',
  title: 'DeFlow Labs',

  projectId: 'i34vbeac',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },
})
