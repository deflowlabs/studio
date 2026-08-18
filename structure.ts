import type { StructureResolver } from 'sanity/structure'
import {
  BellIcon,
  BookIcon,
  ClockIcon,
  ComposeIcon,
  DocumentIcon,
  FolderIcon,
  HelpCircleIcon,
  IceCreamIcon,
  ProjectsIcon,
  RocketIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
  WarningOutlineIcon,
} from '@sanity/icons'
import { EditorGuide } from './components/EditorGuide'

const apiVersion = '2026-08-17'
const contentTypes = ['post', 'author', 'category', 'labsProject', 'announcement', 'partner', 'testimonial']

export const deskStructure: StructureResolver = S =>
  S.list()
    .title('DeFlow content')
    .items([
      S.listItem()
        .title('Start here')
        .icon(RocketIcon)
        .child(
          S.list().title('Editorial workflow').items([
            S.listItem().title('Drafts awaiting review').icon(ComposeIcon).child(
              S.documentList().title('Drafts awaiting review').filter('_id in path("drafts.**")').apiVersion(apiVersion).defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
            ),
            S.listItem().title('Incomplete content').icon(WarningOutlineIcon).child(
              S.documentList().title('Incomplete content').filter('_type in $types && (!defined(title) && !defined(name) && !defined(text))').params({ types: contentTypes }).apiVersion(apiVersion),
            ),
            S.listItem().title('Recently edited').icon(ClockIcon).child(
              S.documentList().title('Recently edited').filter('_type in $types').params({ types: contentTypes }).apiVersion(apiVersion).defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
            ),
            S.listItem().title('Editor guide').icon(HelpCircleIcon).child(
              S.component(EditorGuide).title('Editor guide'),
            ),
          ]),
        ),

      S.divider(),
      S.listItem().title('Editorial').icon(BookIcon).child(
        S.list().title('Editorial').items([
          S.documentTypeListItem('post').title('Blog posts').icon(DocumentIcon),
          S.documentTypeListItem('author').title('Authors').icon(UserIcon),
          S.documentTypeListItem('category').title('Categories').icon(TagIcon),
        ]),
      ),
      S.listItem().title('Product').icon(ProjectsIcon).child(
        S.list().title('Product content').items([
          S.documentTypeListItem('labsProject').title('Labs projects').icon(IceCreamIcon),
        ]),
      ),
      S.listItem().title('Marketing').icon(BellIcon).child(
        S.list().title('Marketing').items([
          S.documentTypeListItem('announcement').title('Announcements').icon(BellIcon),
          S.documentTypeListItem('partner').title('Partners').icon(UsersIcon),
        ]),
      ),

      S.divider(),
      S.listItem().title('Unused / legacy content').icon(FolderIcon).child(
        S.list().title('Not currently displayed').items([
          S.documentTypeListItem('testimonial').title('Testimonials — not displayed'),
        ]),
      ),
    ])
