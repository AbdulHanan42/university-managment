import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Composable for permission-based UI element visibility
 * Uses role-based permissions - all users with the same role have the same permissions
 */
export function usePermission() {
  const authStore = useAuthStore()

  /**
   * Check if user has a specific permission based on their role
   * @param {string} permission - The permission to check
   * @returns {Promise<boolean>} - True if user's role has permission
   */
  async function hasPermission(permission) {
    return await authStore.hasPermission(permission)
  }

  /**
   * Computed property for synchronous permission checking
   * Uses cached role permissions for immediate UI updates
   * @param {string} permission - The permission to check
   * @returns {ComputedRef<boolean>} - Reactive boolean
   */
  function can(permission) {
    return computed(() => {
      if (!authStore.user) return false
      if (authStore.user.role === 'Super Admin') return true
      
      // Check if user's role has the permission
      return authStore.userPermissions.includes(permission) || 
             authStore.userPermissions.includes('all')
    })
  }

  /**
   * Check if user can perform a specific action on a resource
   * Combines permission check with ownership verification
   * @param {string} permission - The required permission
   * @param {string|number} resourceUserId - The owner user ID of the resource
   * @returns {ComputedRef<boolean>} - Reactive boolean
   */
  function canAccess(permission, resourceUserId = null) {
    return computed(() => {
      // Check permission first
      const hasPerm = can(permission).value
      if (!hasPerm) return false

      // If resourceUserId is provided, verify ownership
      if (resourceUserId) {
        // Admins can access all resources
        if (authStore.isAdmin) return true
        // Students can only access their own resources
        return authStore.user?.id === resourceUserId
      }

      return true
    })
  }

  /**
   * Check if user can create resources
   * @param {string} resourceType - The type of resource (e.g., 'students', 'courses')
   * @returns {ComputedRef<boolean>} - Reactive boolean
   */
  function canCreate(resourceType) {
    return can(`${resourceType}.manage`)
  }

  /**
   * Check if user can edit resources
   * @param {string} resourceType - The type of resource (e.g., 'students', 'courses')
   * @param {string|number} resourceUserId - The owner user ID (optional)
   * @returns {ComputedRef<boolean>} - Reactive boolean
   */
  function canEdit(resourceType, resourceUserId = null) {
    return canAccess(`${resourceType}.manage`, resourceUserId)
  }

  /**
   * Check if user can delete resources
   * @param {string} resourceType - The type of resource (e.g., 'students', 'courses')
   * @param {string|number} resourceUserId - The owner user ID (optional)
   * @returns {ComputedRef<boolean>} - Reactive boolean
   */
  function canDelete(resourceType, resourceUserId = null) {
    return canAccess(`${resourceType}.manage`, resourceUserId)
  }

  /**
   * Check if user can approve resources
   * @param {string} resourceType - The type of resource (e.g., 'enrollment', 'hostel')
   * @returns {ComputedRef<boolean>} - Reactive boolean
   */
  function canApprove(resourceType) {
    return can(`${resourceType}.approve`)
  }

  /**
   * Check if user can reject resources
   * @param {string} resourceType - The type of resource (e.g., 'enrollment', 'hostel')
   * @returns {ComputedRef<boolean>} - Reactive boolean
   */
  function canReject(resourceType) {
    return can(`${resourceType}.reject`)
  }

  /**
   * Check if user is an admin (Super Admin or Admin)
   * @returns {ComputedRef<boolean>} - Reactive boolean
   */
  function isAdmin() {
    return computed(() => authStore.isAdmin)
  }

  /**
   * Check if user is a Super Admin
   * @returns {ComputedRef<boolean>} - Reactive boolean
   */
  function isSuperAdmin() {
    return computed(() => authStore.isSuperAdmin)
  }

  /**
   * Check if user is a student
   * @returns {ComputedRef<boolean>} - Reactive boolean
   */
  function isStudent() {
    return computed(() => authStore.isStudent)
  }

  /**
   * Get the current user's role name
   * @returns {ComputedRef<string>} - Role name
   */
  function userRole() {
    return computed(() => authStore.user?.role || '')
  }

  return {
    hasPermission,
    can,
    canAccess,
    canCreate,
    canEdit,
    canDelete,
    canApprove,
    canReject,
    isAdmin,
    isSuperAdmin,
    isStudent,
    userRole
  }
}
