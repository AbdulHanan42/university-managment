import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { permissionService } from '@/services/permission.service'

export const usePermissionStore = defineStore('permission', () => {
  const roles = ref([])
  const permissions = ref([])
  const users = ref([])
  const organizations = ref([])
  const loading = ref(false)
  const error = ref(null)

  const rolesByCategory = computed(() => {
    const grouped = {}
    roles.value.forEach(role => {
      if (!grouped[role.name]) {
        grouped[role.name] = role
      }
    })
    return grouped
  })

  const permissionsByCategory = computed(() => {
    const grouped = {}
    permissions.value.forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = []
      }
      grouped[permission.category].push(permission)
    })
    return grouped
  })

  const permissionsByAction = computed(() => {
    const grouped = {}
    permissions.value.forEach(permission => {
      if (!grouped[permission.action]) {
        grouped[permission.action] = []
      }
      grouped[permission.action].push(permission)
    })
    return grouped
  })

  const activeUsers = computed(() => {
    return users.value.filter(u => u.status === 'active')
  })

  const activeOrganizations = computed(() => {
    return organizations.value.filter(o => o.status === 'active')
  })

  const usersByRole = computed(() => {
    const grouped = {}
    users.value.forEach(user => {
      if (!grouped[user.role]) {
        grouped[user.role] = []
      }
      grouped[user.role].push(user)
    })
    return grouped
  })

  const usersByOrganization = computed(() => {
    const grouped = {}
    users.value.forEach(user => {
      if (!grouped[user.organization]) {
        grouped[user.organization] = []
      }
      grouped[user.organization].push(user)
    })
    return grouped
  })

  async function fetchRoles() {
    loading.value = true
    error.value = null
    try {
      const data = await permissionService.getRoles()
      roles.value = data
    } catch (err) {
      error.value = 'Failed to fetch roles'
      console.error('Error fetching roles:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchPermissions() {
    loading.value = true
    error.value = null
    try {
      const data = await permissionService.getPermissions()
      permissions.value = data
    } catch (err) {
      error.value = 'Failed to fetch permissions'
      console.error('Error fetching permissions:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchUsers() {
    loading.value = true
    error.value = null
    try {
      const data = await permissionService.getUsers()
      users.value = data
    } catch (err) {
      error.value = 'Failed to fetch users'
      console.error('Error fetching users:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchOrganizations() {
    loading.value = true
    error.value = null
    try {
      const data = await permissionService.getOrganizations()
      organizations.value = data
    } catch (err) {
      error.value = 'Failed to fetch organizations'
      console.error('Error fetching organizations:', err)
    } finally {
      loading.value = false
    }
  }

  async function createRole(roleData) {
    loading.value = true
    error.value = null
    try {
      const result = await permissionService.createRole(roleData)
      await fetchRoles()
      return result
    } catch (err) {
      error.value = 'Failed to create role'
      console.error('Error creating role:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateRole(roleId, roleData) {
    loading.value = true
    error.value = null
    try {
      const result = await permissionService.updateRole(roleId, roleData)
      await fetchRoles()
      return result
    } catch (err) {
      error.value = 'Failed to update role'
      console.error('Error updating role:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteRole(roleId) {
    loading.value = true
    error.value = null
    try {
      const result = await permissionService.deleteRole(roleId)
      roles.value = roles.value.filter(r => r.id !== roleId)
      return result
    } catch (err) {
      error.value = 'Failed to delete role'
      console.error('Error deleting role:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function assignRole(userId, roleId) {
    loading.value = true
    error.value = null
    try {
      // Assign role to user - permissions come from role definition
      const result = await permissionService.assignRole(userId, roleId)
      await fetchUsers()
      return result
    } catch (err) {
      error.value = 'Failed to assign role'
      console.error('Error assigning role:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateUserRole(userId, newRoleName) {
    loading.value = true
    error.value = null
    try {
      // Update user's role - permissions automatically update based on new role
      const result = await permissionService.updateUserRole(userId, newRoleName)
      await fetchUsers()
      return result
    } catch (err) {
      error.value = 'Failed to update user role'
      console.error('Error updating user role:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function getPermissionsByRoleName(roleName) {
    const role = roles.value.find(r => r.name === roleName)
    if (!role) return []
    if (role.permissions.includes('all')) return permissions.value
    return permissions.value.filter(p => role.permissions.includes(p.name))
  }

  async function updatePermissions(roleId, permissions, organizations) {
    loading.value = true
    error.value = null
    try {
      const result = await permissionService.updatePermissions(roleId, permissions, organizations)
      await fetchRoles()
      return result
    } catch (err) {
      error.value = 'Failed to update permissions'
      console.error('Error updating permissions:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function checkPermission(userRole, permission) {
    try {
      return await permissionService.checkPermission(userRole, permission)
    } catch (err) {
      console.error('Error checking permission:', err)
      return false
    }
  }

  function getRoleById(roleId) {
    return roles.value.find(r => r.id === roleId)
  }

  function getPermissionsByRole(roleId) {
    const role = getRoleById(roleId)
    if (!role) return []
    if (role.permissions.includes('all')) return permissions.value
    return permissions.value.filter(p => role.permissions.includes(p.name))
  }

  function getOrganizationById(orgId) {
    return organizations.value.find(o => o.id === orgId)
  }

  return {
    roles,
    permissions,
    users,
    organizations,
    loading,
    error,
    rolesByCategory,
    permissionsByCategory,
    permissionsByAction,
    activeUsers,
    activeOrganizations,
    usersByRole,
    usersByOrganization,
    fetchRoles,
    fetchPermissions,
    fetchUsers,
    fetchOrganizations,
    createRole,
    updateRole,
    deleteRole,
    assignRole,
    updateUserRole,
    updatePermissions,
    checkPermission,
    getRoleById,
    getPermissionsByRole,
    getPermissionsByRoleName,
    getOrganizationById
  }
})
