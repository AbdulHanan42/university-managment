import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminService } from '@/services/admin.service'

export const useAdminStore = defineStore('admin', () => {
  const admin = ref(null)
  const token = ref(null)
  const requests = ref([])
  const pendingRequests = ref([])
  const loading = ref(false)
  const error = ref(null)
  const stats = ref({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    today: 0
  })

  const isAuthenticated = computed(() => !!admin.value && !!token.value)
  const isSuperAdmin = computed(() => admin.value?.role === 'Super Admin')

  async function adminLogin(email, password) {
    loading.value = true
    error.value = null
    try {
      const response = await adminService.adminLogin(email, password)
      admin.value = response.admin
      token.value = response.token
      localStorage.setItem('adminPanelUser', JSON.stringify(response.admin))
      localStorage.setItem('adminPanelToken', response.token)
      return response
    } catch (err) {
      error.value = err.message || 'Admin login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function adminLogout() {
    loading.value = true
    try {
      localStorage.removeItem('adminPanelUser')
      localStorage.removeItem('adminPanelToken')
      admin.value = null
      token.value = null
    } catch (err) {
      error.value = err.message || 'Logout failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRequests() {
    loading.value = true
    error.value = null
    try {
      const data = await adminService.getAllRequests()
      requests.value = data
    } catch (err) {
      error.value = err.message || 'Failed to fetch requests'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPendingRequests() {
    loading.value = true
    error.value = null
    try {
      const data = await adminService.getPendingRequests()
      pendingRequests.value = data
    } catch (err) {
      error.value = err.message || 'Failed to fetch pending requests'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    loading.value = true
    error.value = null
    try {
      const data = await adminService.getRequestStats()
      stats.value = data
    } catch (err) {
      error.value = err.message || 'Failed to fetch stats'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function approveRequest(requestId) {
    loading.value = true
    error.value = null
    try {
      const response = await adminService.approveRequest(requestId, admin.value?.id)
      await fetchRequests()
      await fetchPendingRequests()
      await fetchStats()
      return response
    } catch (err) {
      error.value = err.message || 'Failed to approve request'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function rejectRequest(requestId, reason) {
    loading.value = true
    error.value = null
    try {
      const response = await adminService.rejectRequest(requestId, admin.value?.id, reason)
      await fetchRequests()
      await fetchPendingRequests()
      await fetchStats()
      return response
    } catch (err) {
      error.value = err.message || 'Failed to reject request'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createRequest(requestData) {
    loading.value = true
    error.value = null
    try {
      const response = await adminService.createRequest(requestData)
      await fetchRequests()
      await fetchStats()
      return response
    } catch (err) {
      error.value = err.message || 'Failed to create request'
      throw err
    } finally {
      loading.value = false
    }
  }

  function initializeAdminPanel() {
    adminService.initializeAdminPanel()
    
    // Check for existing admin session
    const savedAdmin = localStorage.getItem('adminPanelUser')
    const savedToken = localStorage.getItem('adminPanelToken')
    if (savedAdmin && savedToken) {
      admin.value = JSON.parse(savedAdmin)
      token.value = savedToken
    }
  }

  return {
    admin,
    token,
    requests,
    pendingRequests,
    loading,
    error,
    stats,
    isAuthenticated,
    isSuperAdmin,
    adminLogin,
    adminLogout,
    fetchRequests,
    fetchPendingRequests,
    fetchStats,
    approveRequest,
    rejectRequest,
    createRequest,
    initializeAdminPanel
  }
})
