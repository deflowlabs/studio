import type { Template } from 'sanity'

/** Nontechnical starting values that avoid accidental featured/active content. */
export const templates: Template[] = [
  {
    id: 'post-default',
    title: 'Blog post',
    schemaType: 'post',
    value: { isFeatured: false, publishedAt: new Date().toISOString() },
  },
  {
    id: 'announcement-default',
    title: 'Announcement',
    schemaType: 'announcement',
    value: { isActive: false, tone: 'info' },
  },
  {
    id: 'labs-project-default',
    title: 'Labs project',
    schemaType: 'labsProject',
    value: { status: 'upcoming', displayOrder: 100 },
  },
]
