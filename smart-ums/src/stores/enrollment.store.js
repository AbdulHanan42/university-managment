import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { enrollmentService } from '@/services/enrollment.service'

export const useEnrollmentStore = defineStore('enrollment', () => {
  const enrollmentData = ref(null)
  const enrollments = ref([])
  const availableCourses = ref([])
  const loading = ref(false)
  const error = ref(null)

  const statistics = computed(() => {
    if (!enrollmentData.value) return null
    return {
      registeredThisTerm: enrollmentData.value.registeredThisTerm,
      pendingApprovals: enrollmentData.value.pendingApprovals,
      creditLoadAverage: enrollmentData.value.creditLoadAverage,
      totalStudents: enrollmentData.value.totalStudents,
      totalCourses: enrollmentData.value.totalCourses,
      activeEnrollments: enrollmentData.value.activeEnrollments
    }
  })

  const summaryCards = computed(() => {
    if (!statistics.value) return []
    return [
      {
        title: 'Registered this term',
        value: statistics.value.registeredThisTerm.toLocaleString(),
        subtitle: 'Course selections confirmed'
      },
      {
        title: 'Pending approvals',
        value: statistics.value.pendingApprovals,
        subtitle: 'Waiting for review'
      },
      {
        title: 'Credit load average',
        value: statistics.value.creditLoadAverage,
        subtitle: 'Credit hours per student'
      }
    ]
  })

  const pendingEnrollments = computed(() => {
    return enrollments.value.filter(e => e.status === 'pending')
  })

  const approvedEnrollments = computed(() => {
    return enrollments.value.filter(e => e.status === 'approved')
  })

  const rejectedEnrollments = computed(() => {
    return enrollments.value.filter(e => e.status === 'rejected')
  })

  async function fetchEnrollmentData() {
    loading.value = true
    error.value = null
    try {
      const data = await enrollmentService.getEnrollmentData()
      enrollmentData.value = data
    } catch (err) {
      error.value = 'Failed to fetch enrollment data'
      console.error('Error fetching enrollment data:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchEnrollments() {
    loading.value = true
    error.value = null
    try {
      const data = await enrollmentService.getEnrollments()
      enrollments.value = data
    } catch (err) {
      error.value = 'Failed to fetch enrollments'
      console.error('Error fetching enrollments:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchAvailableCourses() {
    loading.value = true
    error.value = null
    try {
      const data = await enrollmentService.getAvailableCourses()
      availableCourses.value = data
    } catch (err) {
      error.value = 'Failed to fetch available courses'
      console.error('Error fetching available courses:', err)
    } finally {
      loading.value = false
    }
  }

  async function submitEnrollment(enrollmentData) {
    loading.value = true
    error.value = null
    try {
      const result = await enrollmentService.submitEnrollment(enrollmentData)
      return result
    } catch (err) {
      error.value = 'Failed to submit enrollment'
      console.error('Error submitting enrollment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function approveEnrollment(enrollmentId) {
    loading.value = true
    error.value = null
    try {
      const result = await enrollmentService.approveEnrollment(enrollmentId)
      // Update local state
      const index = enrollments.value.findIndex(e => e.id === enrollmentId)
      if (index !== -1) {
        enrollments.value[index].status = 'approved'
      }
      return result
    } catch (err) {
      error.value = 'Failed to approve enrollment'
      console.error('Error approving enrollment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function rejectEnrollment(enrollmentId) {
    loading.value = true
    error.value = null
    try {
      const result = await enrollmentService.rejectEnrollment(enrollmentId)
      // Update local state
      const index = enrollments.value.findIndex(e => e.id === enrollmentId)
      if (index !== -1) {
        enrollments.value[index].status = 'rejected'
      }
      return result
    } catch (err) {
      error.value = 'Failed to reject enrollment'
      console.error('Error rejecting enrollment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    enrollmentData,
    enrollments,
    availableCourses,
    loading,
    error,
    statistics,
    summaryCards,
    pendingEnrollments,
    approvedEnrollments,
    rejectedEnrollments,
    fetchEnrollmentData,
    fetchEnrollments,
    fetchAvailableCourses,
    submitEnrollment,
    approveEnrollment,
    rejectEnrollment
  }
})

