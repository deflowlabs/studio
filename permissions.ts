/** Minimal current-user shape required by role-aware document actions. */
interface UserWithRoles {
  roles?: Array<{ name?: string }>
}

const privilegedRoles = new Set(['administrator', 'developer'])

/** Only technical/administrative roles receive publish and destructive actions. */
export function canManagePublishing(user?: UserWithRoles | null) {
  return user?.roles?.some(role => role.name && privilegedRoles.has(role.name)) ?? false
}
