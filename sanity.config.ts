import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/plugins/structure'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'vaxon-space',
  title: 'Vaxon Space CMS',
  projectId: 'ex3784hw',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
