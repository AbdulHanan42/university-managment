import { useAuthStore } from '@/stores/auth.store'

/**
 * Composable for verifying resource ownership
 * Ensures users can only access their own data when required
 */
export function useOwnership() {
  const authStore = useAuthStore()

  /**
   * Check if the authenticated user owns the resource
   * @param {string} resourceUserId - The user ID of the resource owner
   * @returns {boolean} - True if user owns the resource or is admin
   */
  function isOwner(resourceUserId) {
    // Super Admin and Admin can access all resources
    if (authStore.isAdmin) return true
    
    // Check if the resource belongs to the authenticated user
    return authStore.user?.id === resourceUserId
  }

  /**
   * Check if the authenticated user can access the resource
   * This combines permission checks with ownership verification
   * @param {string} permission - The required permission
   * @param {string} resourceUserId - The user ID of the resource owner (optional)
   * @returns {Promise<boolean>} - True if user can access the resource
   */
  async function canAccess(permission, resourceUserId = null) {
    // Check permission first
    const hasPermission = await authStore.hasPermission(permission)
    if (!hasPermission) return false

    // If resourceUserId is provided, verify ownership
    if (resourceUserId) {
      return isOwner(resourceUserId)
    }

    return true
  }

  /**
   * Filter data to show only records owned by the current user
   * Used for student-specific views
   * @param {Array} data - Array of data items with userId field
   * @returns {Array} - Filtered array
   */
  function filterOwnData(data) {
    if (authStore.isAdmin) return data
    return data.filter(item => item.userId === authStore.user?.id || item.id === authStore.user?.id)
  }

  /**
   * Get the current user's ID
   * @returns {string|number} - Current user ID
   */
  function getCurrentUserId() {
    return authStore.user?.id
  }

  return {
    isOwner,
    canAccess,
    filterOwnData,
    getCurrentUserId
  }
}
