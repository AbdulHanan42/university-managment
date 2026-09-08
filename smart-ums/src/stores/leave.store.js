import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLeaveStore = defineStore('leave', () => {
  const leaves = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Mock data for leaves
  const mockLeaves = [
    { id: 1, userId: 1, userName: 'John Doe', userRole: 'Student', type: 'Sick Leave', startDate: '2024-09-10', endDate: '2024-09-12', reason: 'Fever and flu', status: 'pending', createdAt: '2024-09-05', department: 'Computer Science' },
    { id: 2, userId: 2, userName: 'Jane Smith', userRole: 'Faculty', type: 'Annual Leave', startDate: '2024-09-15', endDate: '2024-09-20', reason: 'Family vacation', status: 'approved', createdAt: '2024-09-01', department: 'Computer Science' },
    { id: 3, userId: 3, userName: 'Mike Johnson', userRole: 'Student', type: 'Personal Leave', startDate: '2024-09-18', endDate: '2024-09-19', reason: 'Personal matters', status: 'rejected', createdAt: '2024-09-04', department: 'Electrical Engineering' },
    { id: 4, userId: 4, userName: 'Sarah Williams', userRole: 'Faculty', type: 'Sick Leave', startDate: '2024-09-08', endDate: '2024-09-09', reason: 'Medical appointment', status: 'approved', createdAt: '2024-09-03', department: 'Mechanical Engineering' },
    { id: 5, userId: 5, userName: 'Tom Brown', userRole: 'Student', type: 'Emergency Leave', startDate: '2024-09-11', endDate: '2024-09-11', reason: 'Family emergency', status: 'pending', createdAt: '2024-09-06', department: 'Computer Science' },
  ]

  // Computed properties
  const studentLeaves = computed(() => leaves.value.filter(leave => leave.userRole === 'Student'))
  const facultyLeaves = computed(() => leaves.value.filter(leave => leave.userRole === 'Faculty'))
  const pendingLeaves = computed(() => leaves.value.filter(leave => leave.status === 'pending'))
  const approvedLeaves = computed(() => leaves.value.filter(leave => leave.status === 'approved'))
  const rejectedLeaves = computed(() => leaves.value.filter(leave => leave.status === 'rejected'))

  const statistics = computed(() => ({
    total: leaves.value.length,
    pending: pendingLeaves.value.length,
    approved: approvedLeaves.value.length,
    rejected: rejectedLeaves.value.length,
    studentLeaves: studentLeaves.value.length,
    facultyLeaves: facultyLeaves.value.length
  }))

  // Actions
  async function fetchLeaves() {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      leaves.value = mockLeaves
    } catch (err) {
      error.value = 'Failed to fetch leaves'
      console.error('Error fetching leaves:', err)
    } finally {
      loading.value = false
    }
  }

  async function createLeave(leaveData) {
    loading.value = true
    error.value = null
    try {
      const newLeave = {
        id: Date.now(),
        ...leaveData,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      }
      leaves.value.push(newLeave)
      return newLeave
    } catch (err) {
      error.value = 'Failed to create leave request'
      console.error('Error creating leave:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateLeave(leaveId, leaveData) {
    loading.value = true
    error.value = null
    try {
      const index = leaves.value.findIndex(leave => leave.id === leaveId)
      if (index !== -1) {
        leaves.value[index] = { ...leaves.value[index], ...leaveData }
        return leaves.value[index]
      }
      throw new Error('Leave not found')
    } catch (err) {
      error.value = 'Failed to update leave request'
      console.error('Error updating leave:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function approveLeave(leaveId) {
    return updateLeave(leaveId, { status: 'approved' })
  }

  async function rejectLeave(leaveId, reason = '') {
    return updateLeave(leaveId, { status: 'rejected', rejectionReason: reason })
  }

  async function cancelLeave(leaveId) {
    loading.value = true
    error.value = null
    try {
      const index = leaves.value.findIndex(leave => leave.id === leaveId)
      if (index !== -1) {
        if (leaves.value[index].status !== 'pending') {
          throw new Error('Only pending leaves can be cancelled')
        }
        leaves.value[index].status = 'cancelled'
        return leaves.value[index]
      }
      throw new Error('Leave not found')
    } catch (err) {
      error.value = 'Failed to cancel leave request'
      console.error('Error cancelling leave:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteLeave(leaveId) {
    loading.value = true
    error.value = null
    try {
      leaves.value = leaves.value.filter(leave => leave.id !== leaveId)
      return true
    } catch (err) {
      error.value = 'Failed to delete leave request'
      console.error('Error deleting leave:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function getLeavesByUserId(userId) {
    return leaves.value.filter(leave => leave.userId === userId)
  }

  function getLeavesByStatus(status) {
    return leaves.value.filter(leave => leave.status === status)
  }

  function getLeavesByRole(role) {
    return leaves.value.filter(leave => leave.userRole === role)
  }

  return {
    leaves,
    loading,
    error,
    studentLeaves,
    facultyLeaves,
    pendingLeaves,
    approvedLeaves,
    rejectedLeaves,
    statistics,
    fetchLeaves,
    createLeave,
    updateLeave,
    approveLeave,
    rejectLeave,
    cancelLeave,
    deleteLeave,
    getLeavesByUserId,
    getLeavesByStatus,
    getLeavesByRole
  }
})
