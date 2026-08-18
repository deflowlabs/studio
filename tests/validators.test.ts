import assert from 'node:assert/strict'
import test from 'node:test'
import type { ValidationContext } from 'sanity'
import { canManagePublishing } from '../permissions.ts'
import { dateOrder, isHttpUrl, requireCtaPair, uniqueEnabledDocument } from '../validators.ts'

test('safe URL validation allows only HTTP and HTTPS', () => {
  assert.equal(isHttpUrl('https://deflowlabs.io'), true)
  assert.equal(isHttpUrl('http://localhost:3000'), true)
  assert.match(String(isHttpUrl('javascript:alert(1)')), /http/)
  assert.match(String(isHttpUrl('not a url')), /valid URL/)
})

test('cross-field validators enforce date and CTA pairs', () => {
  assert.equal(dateOrder({ startDate: '2026-08-01', endDate: '2026-08-17' }), true)
  assert.match(String(dateOrder({ startDate: '2026-08-17', endDate: '2026-08-01' })), /End date/)
  assert.equal(requireCtaPair({ cta: { label: 'Read', url: 'https://deflowlabs.io' } }), true)
  assert.match(String(requireCtaPair({ cta: { label: 'Read' } })), /completed together/)
})

test('uniqueness validator excludes the current draft and published pair', async () => {
  let receivedParams: Record<string, string> | undefined
  const context = {
    document: { _id: 'drafts.post-1' },
    getClient: () => ({
      fetch: async (_query: string, params: Record<string, string>) => {
        receivedParams = params
        return 0
      },
    }),
  } as unknown as ValidationContext

  assert.equal(await uniqueEnabledDocument('post', 'isFeatured')(true, context), true)
  assert.deepEqual(receivedParams, { type: 'post', id: 'post-1', draftId: 'drafts.post-1' })
})

test('only administrator and developer roles receive publishing actions', () => {
  assert.equal(canManagePublishing({ roles: [{ name: 'administrator' }] }), true)
  assert.equal(canManagePublishing({ roles: [{ name: 'developer' }] }), true)
  assert.equal(canManagePublishing({ roles: [{ name: 'editor' }] }), false)
  assert.equal(canManagePublishing(null), false)
})
