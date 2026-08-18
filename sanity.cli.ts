import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET

if (!projectId || !dataset) {
  throw new Error('SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET are required. Copy .env.example to .env.')
}

export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    path: '../website/{app,server}/**/*.{ts,tsx,js,jsx,vue}',
    schema: 'schema.json',
    generates: '../website/app/types/sanity.generated.ts',
  },
})
