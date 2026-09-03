import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pendingUsers = ref([])
  const allUsers = ref([])

  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'Super Admin' || user.value?.role === 'Admin')
  const isSuperAdmin = computed(() => user.value?.role === 'Super Admin')
  const isStudent = computed(() => user.value?.role === 'Student')
  const isEmployee = computed(() => user.value?.role === 'Employee')

  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(email, password)
      user.value = response.user
      token.value = response.token
      localStorage.setItem('currentUser', JSON.stringify(response.user))
      localStorage.setItem('authToken', response.token)
      return response
    } catch (err) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function signup(userData) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.signup(userData)
      return response
    } catch (err) {
      error.value = err.message || 'Signup failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await authService.logout()
      user.value = null
      token.value = null
    } catch (err) {
      error.value = err.message || 'Logout failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    loading.value = true
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        user.value = currentUser
        token.value = localStorage.getItem('authToken')
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch current user'
    } finally {
      loading.value = false
    }
  }

  async function fetchPendingUsers() {
    loading.value = true
    error.value = null
    try {
      const users = await authService.getPendingUsers()
      pendingUsers.value = users
    } catch (err) {
      error.value = err.message || 'Failed to fetch pending users'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAllUsers() {
    loading.value = true
    error.value = null
    try {
      const users = await authService.getAllUsers()
      allUsers.value = users
    } catch (err) {
      error.value = err.message || 'Failed to fetch users'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function approveUser(userId) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.approveUser(userId)
      await fetchPendingUsers()
      await fetchAllUsers()
      return response
    } catch (err) {
      error.value = err.message || 'Failed to approve user'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function rejectUser(userId, reason) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.rejectUser(userId, reason)
      await fetchPendingUsers()
      await fetchAllUsers()
      return response
    } catch (err) {
      error.value = err.message || 'Failed to reject user'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateUser(userId, userData) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.updateUser(userId, userData)
      await fetchAllUsers()
      if (user.value?.id === userId) {
        user.value = { ...user.value, ...userData }
        localStorage.setItem('currentUser', JSON.stringify(user.value))
      }
      return response
    } catch (err) {
      error.value = err.message || 'Failed to update user'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(userId) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.deleteUser(userId)
      await fetchAllUsers()
      await fetchPendingUsers()
      return response
    } catch (err) {
      error.value = err.message || 'Failed to delete user'
      throw err
    } finally {
      loading.value = false
    }
  }

  function initializeAuth() {
    authService.initializeDefaultAdmin()
    fetchCurrentUser()
  }

  return {
    user,
    token,
    loading,
    error,
    pendingUsers,
    allUsers,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    isStudent,
    isEmployee,
    login,
    signup,
    logout,
    fetchCurrentUser,
    fetchPendingUsers,
    fetchAllUsers,
    approveUser,
    rejectUser,
    updateUser,
    deleteUser,
    initializeAuth
  }
})

