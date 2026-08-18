import { createElement } from 'react'

const steps = [
  'Create or open a draft and complete every required field.',
  'Use Preview to check the real page at desktop and mobile sizes.',
  'Ask an administrator to review the draft and publish it.',
]

export function EditorGuide() {
  return createElement(
    'main',
    { style: { maxWidth: 720, margin: '0 auto', padding: 'clamp(24px, 5vw, 64px)' } },
    createElement('h1', null, 'A simple publishing workflow'),
    createElement(
      'p',
      null,
      'Editors can write and preview safely. Administrators handle publishing, unpublishing and deletion.',
    ),
    createElement(
      'ol',
      null,
      ...steps.map((step) => createElement('li', { key: step, style: { marginBlock: 12 } }, step)),
    ),
    createElement(
      'p',
      null,
      'If a field is marked with an error, follow the message beside it. Use the Needs review and Incomplete content views to find work that still needs attention.',
    ),
  )
}
