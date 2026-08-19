import type { ValidationContext } from 'sanity'

type SanityImageValue = {
  asset?: { _ref?: string }
}

type ImageDimensions = {
  width?: number
  height?: number
}

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

/** Warn when an uploaded image is smaller than the editorial recommendation. */
export function recommendedImageDimensions(
  minimumWidth: number,
  minimumHeight: number,
  label: string,
  expectedRatio?: number,
  ratioLabel = '16:9',
) {
  return async (value: SanityImageValue | undefined, context: ValidationContext) => {
    const assetId = value?.asset?._ref
    if (!assetId) return true

    const client = context.getClient({ apiVersion: '2026-08-17' })
    const dimensions = await client.fetch<ImageDimensions | null>(
      '*[_id == $assetId][0].metadata.dimensions{width, height}',
      { assetId },
    )
    const width = dimensions?.width || 0
    const height = dimensions?.height || 0

    if (width < minimumWidth || height < minimumHeight) {
      return `${label} should be at least ${minimumWidth}×${minimumHeight}px. The current image is ${width}×${height}px.`
    }

    if (expectedRatio && Math.abs(width / height - expectedRatio) > 0.04) {
      return `${label} should use a ${ratioLabel} composition. Use the crop and hotspot controls to keep the subject visible.`
    }

    return true
  }
}

/** Warn when an announcement-category article is also selected as the featured story. */
export async function announcementFeaturedConflict(
  document: Record<string, any> | undefined,
  context: ValidationContext,
) {
  if (!document?.isFeatured) return true
  const categoryIds = (document.categories || [])
    .map((category: { _ref?: string }) => category?._ref?.replace(/^drafts\./, ''))
    .filter(Boolean)
  if (!categoryIds.length) return true

  const client = context.getClient({ apiVersion: '2026-08-17' })
  const isAnnouncement = await client.fetch<boolean>(
    'count(*[_type == "category" && slug.current == "announcements" && _id in $categoryIds]) > 0',
    { categoryIds },
  )

  return isAnnouncement
    ? 'This article will appear as the announcement story, so the Featured post setting will not create a second placement.'
    : true
}
