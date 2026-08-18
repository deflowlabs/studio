import type { ValidationContext } from 'sanity'

/** Accept blank optional fields or valid HTTP(S) destinations only. */
export function isHttpUrl(value?: string) {
  if (!value) return true
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) || 'Use an http:// or https:// URL.'
  } catch {
    return 'Enter a valid URL.'
  }
}

/** Keep optional project end dates on or after their start dates. */
export function dateOrder(document: Record<string, unknown>) {
  const start = document.startDate
  const end = document.endDate
  if (!start || !end) return true
  return String(end) >= String(start) || 'End date must be on or after the start date.'
}

/** Prevent editors from publishing a CTA with only a label or destination. */
export function requireCtaPair(document: Record<string, any>) {
  const cta = document.cta
  if (!cta) return true
  return Boolean(cta.label && cta.url) || 'CTA label and URL must be completed together.'
}

/** Build an asynchronous uniqueness validator for featured/active documents. */
export function uniqueEnabledDocument(type: string, field: string) {
  return async (value: boolean | undefined, context: ValidationContext) => {
    if (!value || !context.document?._id) return true
    const id = context.document._id.replace(/^drafts\./, '')
    const client = context.getClient({ apiVersion: '2026-08-17' })
    const count = await client.fetch<number>(
      `count(*[_type == $type && ${field} == true && !(_id in [$id, $draftId])])`,
      { type, id, draftId: `drafts.${id}` },
    )
    return count === 0 || `Only one ${type === 'post' ? 'featured post' : 'active announcement'} is allowed.`
  }
}
