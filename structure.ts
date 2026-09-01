import type { StructureResolver } from 'sanity/structure'
import { BellIcon } from '@sanity/icons/Bell'
import { BookIcon } from '@sanity/icons/Book'
import { ClockIcon } from '@sanity/icons/Clock'
import { ComposeIcon } from '@sanity/icons/Compose'
import { DocumentIcon } from '@sanity/icons/Document'
import { HelpCircleIcon } from '@sanity/icons/HelpCircle'
import { IceCreamIcon } from '@sanity/icons/IceCream'
import { ProjectsIcon } from '@sanity/icons/Projects'
import { RocketIcon } from '@sanity/icons/Rocket'
import { TagIcon } from '@sanity/icons/Tag'
import { UserIcon } from '@sanity/icons/User'
import { UsersIcon } from '@sanity/icons/Users'
import { WarningOutlineIcon } from '@sanity/icons/WarningOutline'
import { EditorGuide } from './components/EditorGuide'

const apiVersion = '2026-08-17'
const contentTypes = ['post', 'author', 'category', 'labsProject', 'announcement', 'partner']

export const deskStructure: StructureResolver = S =>
  S.list()
    .title('DeFlow content')
    .items([
      S.listItem()
        .title('Start here')
        .icon(RocketIcon)
        .child(
          S.list().title('Editorial workflow').items([
            S.listItem().title('Drafts ready for review').icon(ComposeIcon).child(
              S.documentList().title('Drafts ready for review').filter('_id in path("drafts.**")').apiVersion(apiVersion).defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
            ),
            S.listItem().title('Needs attention').icon(WarningOutlineIcon).child(
              S.documentList().title('Needs attention').filter('_type in $types && (!defined(title) && !defined(name) && !defined(text))').params({ types: contentTypes }).apiVersion(apiVersion),
            ),
            S.listItem().title('Recently edited').icon(ClockIcon).child(
              S.documentList().title('Recently edited').filter('_type in $types').params({ types: contentTypes }).apiVersion(apiVersion).defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
            ),
            S.listItem().title('How to publish').icon(HelpCircleIcon).child(
              S.component(EditorGuide).title('How to publish'),
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
          S.documentTypeListItem('announcement').title('Website banners').icon(BellIcon),
          S.documentTypeListItem('partner').title('Partners').icon(UsersIcon),
        ]),
      ),
    ])
