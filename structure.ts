/**
 * Custom Studio desk structure — organized content sections
 * with icons, descriptions, and logical grouping.
 *
 * Sections:
 *   📝 Editorial — Blog posts, authors, categories
 *   🔬 Labs — Research projects
 */
import type { StructureResolver } from 'sanity/structure'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('DeFlow Labs Content')
    .items([
      // ── Editorial Section ──────────────────────────
      S.listItem()
        .title('Editorial')
        .icon(() => '📝')
        .child(
          S.list()
            .title('Editorial')
            .items([
              S.listItem()
                .title('Blog Posts')
                .icon(() => '📰')
                .schemaType('post')
                .child(
                  S.documentTypeList('post')
                    .title('Blog Posts')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Authors')
                .icon(() => '👤')
                .schemaType('author')
                .child(S.documentTypeList('author').title('Authors')),
              S.listItem()
                .title('Categories')
                .icon(() => '🏷️')
                .schemaType('category')
                .child(S.documentTypeList('category').title('Categories')),
            ]),
        ),

      // ── Announcements ───────────────────────────────
      S.listItem()
        .title('Announcements')
        .icon(() => '📢')
        .schemaType('announcement')
        .child(
          S.documentTypeList('announcement')
            .title('Announcement Banners')
            .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
        ),

      S.divider(),

      // ── Labs Section ───────────────────────────────
      S.listItem()
        .title('Labs Projects')
        .icon(() => '🔬')
        .schemaType('labsProject')
        .child(
          S.documentTypeList('labsProject')
            .title('Research Projects')
            .defaultOrdering([{ field: 'status', direction: 'asc' }]),
        ),

      S.listItem()
        .title('Testimonials')
        .icon(() => '💬')
        .schemaType('testimonial')
        .child(
          S.documentTypeList('testimonial')
            .title('Testimonials'),
        ),

      S.listItem()
        .title('Partners')
        .icon(() => '🤝')
        .schemaType('partner')
        .child(
          S.documentTypeList('partner')
            .title('Partners & Integrations'),
        ),

      S.divider(),

      // ── Quick Access ───────────────────────────────
      S.listItem()
        .title('Drafts')
        .icon(() => '📋')
        .child(
          S.documentList()
            .title('All Drafts')
            .filter('_id in path("drafts.**")')
            .apiVersion('2026-07-17'),
        ),

      S.listItem()
        .title('Recently Edited')
        .icon(() => '🕐')
        .child(
          S.documentList()
            .title('Recently Edited')
            .filter('_type in ["post", "labsProject", "author"]')
            .apiVersion('2026-07-17')
            .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
        ),
    ])
