/**
 * DeFlow Labs — Sanity CLI Configuration
 * Required for `sanity build` and `sanity deploy` commands.
 */
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'i34vbeac',
    dataset: 'production',
  },
})
