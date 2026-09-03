import { useAuthStore } from '@/stores/auth.store'

/**
 * Vue directive for role-based permission element visibility
 * Permissions are inherited from the user's role - all users with same role have same permissions
 * Usage: v-permission="'students.view_own'"
 * Usage with ownership: v-permission:owner="'students.view_own'" :data-owner-id="resource.userId"
 */
export const permissionDirective = {
  mounted(el, binding) {
    const authStore = useAuthStore()
    const permission = binding.value
    const ownerId = binding.arg === 'owner' ? el.getAttribute('data-owner-id') : null

    checkPermission(el, permission, ownerId, authStore)
  },
  updated(el, binding) {
    const authStore = useAuthStore()
    const permission = binding.value
    const ownerId = binding.arg === 'owner' ? el.getAttribute('data-owner-id') : null

    checkPermission(el, permission, ownerId, authStore)
  }
}

function checkPermission(el, permission, ownerId, authStore) {
  // Super Admin has all permissions
  if (authStore.isSuperAdmin) {
    return
  }

  // Check if user's role has the permission (role-based)
  const hasPermission = authStore.userPermissions.includes(permission) || 
                        authStore.userPermissions.includes('all')

  if (!hasPermission) {
    el.style.display = 'none'
    return
  }

  // If ownership check is required
  if (ownerId) {
    // Admins can access all resources
    if (authStore.isAdmin) {
      return
    }

    // Check if resource belongs to current user
    if (authStore.user?.id !== ownerId) {
      el.style.display = 'none'
    }
  }
}

/**
 * Install function for registering the directive
 */
export function installPermissionDirective(app) {
  app.directive('permission', permissionDirective)
}
