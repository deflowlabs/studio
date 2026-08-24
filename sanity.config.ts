import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './schemas'
import { deskStructure } from './structure'
import { canManagePublishing } from './permissions'
import { DeFlowIcon } from './components/DeFlowIcon'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || '2026-08-17'
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'
const studioHost = process.env.SANITY_STUDIO_HOST || 'http://localhost:3333'
const enableVision = process.env.SANITY_STUDIO_ENABLE_VISION === 'true'

if (!projectId || !dataset) {
  throw new Error('SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET are required. Copy .env.example to .env.')
}

if (process.env.VERCEL_ENV === 'production') {
  const requiredProductionVariables = [
    'SANITY_STUDIO_PROJECT_ID',
    'SANITY_STUDIO_DATASET',
    'SANITY_STUDIO_API_VERSION',
    'SANITY_STUDIO_PREVIEW_URL',
    'SANITY_STUDIO_HOST',
  ]
  const missing = requiredProductionVariables.filter(name => !process.env[name])
  if (missing.length) throw new Error(`Vercel production environment is missing: ${missing.join(', ')}`)
}

function webUrl(value: string, variableName: string) {
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`${variableName} must use http or https`)
  }
  return url
}

const previewOrigin = webUrl(previewUrl, 'SANITY_STUDIO_PREVIEW_URL').origin
const studioHostname = webUrl(studioHost, 'SANITY_STUDIO_HOST').hostname

if (process.env.VERCEL_ENV === 'production' && previewOrigin === 'https://deflowlabs.io') {
  throw new Error('SANITY_STUDIO_PREVIEW_URL must use the dedicated preview deployment, not the public website')
}

export default defineConfig({
  name: 'deflow-labs',
  title: 'DeFlow Labs Content',
  subtitle: studioHostname,
  icon: DeFlowIcon,
  projectId,
  dataset,
  apiVersion,
  basePath: '/',

  plugins: [
    structureTool({ structure: deskStructure }),
    presentationTool({
      allowOrigins: [previewOrigin],
      previewUrl: {
        initial: previewUrl,
        previewMode: {
          enable: '/preview/enable',
          disable: '/preview/disable',
          shareAccess: false,
        },
      },
      resolve: {
        mainDocuments: [
          {
            route: '/blog/:slug',
            filter: '_type == "post" && slug.current == $slug',
            params: ({ params }) => ({ slug: params.slug }),
          },
        ],
        locations: {
          post: { select: { title: 'title', slug: 'slug.current' }, resolve: doc => ({ locations: doc?.slug ? [{ title: doc.title || 'Post', href: `/blog/${doc.slug}` }] : [] }) },
          labsProject: { select: { title: 'title' }, resolve: doc => ({ locations: [{ title: doc?.title || 'Labs', href: '/labs' }] }) },
          announcement: { locations: [{ title: 'Homepage', href: '/' }] },
        },
      },
    }),
    codeInput(),
    ...(enableVision ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],

  schema: {
    types: schemaTypes,
  },

  releases: { enabled: false },

  document: {
    actions: (previous, context) => {
      const canPublish = canManagePublishing(context.currentUser)
      if (canPublish) return previous
      return previous.filter(action => !['publish', 'unpublish', 'delete'].includes(action.action || ''))
    },
  },
})
