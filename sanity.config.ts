import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './schemas'
import { deskStructure } from './structure'
import { templates } from './templates'
import { canManagePublishing } from './permissions'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || '2026-08-17'
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'
const enableVision = process.env.SANITY_STUDIO_ENABLE_VISION === 'true'

if (!projectId || !dataset) {
  throw new Error('SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET are required. Copy .env.example to .env.')
}

export default defineConfig({
  name: 'deflow-labs',
  title: 'DeFlow Labs Content',
  projectId,
  dataset,
  apiVersion,
  basePath: '/',

  plugins: [
    structureTool({ structure: deskStructure }),
    presentationTool({
      previewUrl: {
        origin: previewUrl,
        previewMode: { enable: '/api/preview/enable' },
      },
      resolve: {
        locations: {
          post: { select: { title: 'title', slug: 'slug.current' }, resolve: doc => ({ locations: doc?.slug ? [{ title: doc.title || 'Post', href: `/blog/${doc.slug}` }] : [] }) },
          labsProject: { locations: [{ title: 'Labs', href: '/labs' }] },
          announcement: { locations: [{ title: 'Homepage', href: '/' }] },
        },
      },
    }),
    codeInput(),
    ...(enableVision ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],

  schema: {
    types: schemaTypes,
    templates,
  },

  document: {
    actions: (previous, context) => {
      const canPublish = canManagePublishing(context.currentUser)
      if (canPublish) return previous
      return previous.filter(action => !['publish', 'unpublish', 'delete'].includes(action.action || ''))
    },
  },
})
