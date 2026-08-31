import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { permissionService } from '@/services/permission.service'

export const usePermissionStore = defineStore('permission', () => {
  const roles = ref([])
  const permissions = ref([])
  const users = ref([])
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

  const activeUsers = computed(() => {
    return users.value.filter(u => u.status === 'active')
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

  async function updatePermissions(roleId, permissions) {
    loading.value = true
    error.value = null
    try {
      const result = await permissionService.updatePermissions(roleId, permissions)
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

  function getRoleById(roleId) {
    return roles.value.find(r => r.id === roleId)
  }

  function getPermissionsByRole(roleId) {
    const role = getRoleById(roleId)
    if (!role) return []
    if (role.permissions.includes('all')) return permissions.value
    return permissions.value.filter(p => role.permissions.includes(p.name))
  }

  return {
    roles,
    permissions,
    users,
    loading,
    error,
    rolesByCategory,
    permissionsByCategory,
    activeUsers,
    usersByRole,
    fetchRoles,
    fetchPermissions,
    fetchUsers,
    createRole,
    updateRole,
    deleteRole,
    assignRole,
    updatePermissions,
    getRoleById,
    getPermissionsByRole
  }
})
