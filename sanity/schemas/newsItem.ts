import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'newsItem',
  title: 'News Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Display Date',
      type: 'string',
      description: 'e.g. APR 23 2026',
    }),
    defineField({
      name: 'body',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'source',
      title: 'Source Label',
      type: 'string',
      description: 'e.g. SPACENEWS, LINKEDIN, YOUTUBE',
    }),
    defineField({
      name: 'link',
      title: 'Article URL',
      type: 'url',
    }),
    defineField({
      name: 'orderRank',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = shown first',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'date' },
  },
})
