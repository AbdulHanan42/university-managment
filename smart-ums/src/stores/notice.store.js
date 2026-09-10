import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNoticeStore = defineStore('notice', () => {
  const notices = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Mock data for notices
  const mockNotices = [
    { id: 1, title: 'Mid-Semester Examination Schedule', content: 'Mid-semester examinations will commence from October 15th, 2024. Please check your individual schedules for exact timings and venues.', category: 'Exam', priority: 'High', targetAudience: ['Student', 'Faculty'], createdBy: 'Super Admin', createdAt: '2024-09-01', expiryDate: '2024-10-20', status: 'active', attachments: [] },
    { id: 2, title: 'University Holiday Announcement', content: 'The university will remain closed on October 2nd, 2024 on account of Gandhi Jayanti. Regular classes will resume on October 3rd.', category: 'General', priority: 'Medium', targetAudience: ['Student', 'Faculty', 'Staff'], createdBy: 'Super Admin', createdAt: '2024-09-05', expiryDate: '2024-10-05', status: 'active', attachments: [] },
    { id: 3, title: 'Library Renovation Notice', content: 'The main library will undergo renovation from September 20th to October 10th. Students can use the departmental libraries during this period.', category: 'General', priority: 'Low', targetAudience: ['Student', 'Faculty'], createdBy: 'Admin', createdAt: '2024-09-10', expiryDate: '2024-10-15', status: 'active', attachments: [] },
    { id: 4, title: 'Final Examination Results', content: 'Final examination results for the Spring 2024 semester have been published. Students can access their results through the student portal.', category: 'Exam', priority: 'High', targetAudience: ['Student'], createdBy: 'Super Admin', createdAt: '2024-09-12', expiryDate: '2024-12-31', status: 'active', attachments: [] },
    { id: 5, title: 'Faculty Meeting Schedule', content: 'All faculty members are required to attend the departmental meeting on September 25th at 2:00 PM in Conference Room A.', category: 'Faculty', priority: 'High', targetAudience: ['Faculty'], createdBy: 'Dept Head', createdAt: '2024-09-15', expiryDate: '2024-09-25', status: 'active', attachments: [] },
    { id: 6, title: 'Scholarship Application Deadline', content: 'Last date to submit scholarship applications for the academic year 2024-25 is September 30th. Late applications will not be entertained.', category: 'General', priority: 'High', targetAudience: ['Student'], createdBy: 'Admin', createdAt: '2024-09-08', expiryDate: '2024-09-30', status: 'active', attachments: [] },
    { id: 7, title: 'Sports Day Registration', content: 'Registration for the annual sports day is now open. Students can register through the sports portal before October 5th.', category: 'Event', priority: 'Medium', targetAudience: ['Student'], createdBy: 'Admin', createdAt: '2024-09-18', expiryDate: '2024-10-05', status: 'active', attachments: [] },
    { id: 8, title: 'Campus Maintenance Work', content: 'Electrical maintenance work will be carried out in Block B on September 22nd. Power interruption is expected between 9 AM to 5 PM.', category: 'General', priority: 'Low', targetAudience: ['Student', 'Faculty', 'Staff'], createdBy: 'Admin', createdAt: '2024-09-19', expiryDate: '2024-09-22', status: 'active', attachments: [] },
  ]

  // Computed properties
  const activeNotices = computed(() => notices.value.filter(notice => notice.status === 'active'))
  const expiredNotices = computed(() => notices.value.filter(notice => notice.status === 'expired'))
  const examNotices = computed(() => notices.value.filter(notice => notice.category === 'Exam'))
  const generalNotices = computed(() => notices.value.filter(notice => notice.category === 'General'))
  const facultyNotices = computed(() => notices.value.filter(notice => notice.category === 'Faculty'))
  const eventNotices = computed(() => notices.value.filter(notice => notice.category === 'Event'))

  const statistics = computed(() => ({
    total: notices.value.length,
    active: activeNotices.value.length,
    expired: expiredNotices.value.length,
    exam: examNotices.value.length,
    general: generalNotices.value.length,
    highPriority: notices.value.filter(n => n.priority === 'High').length
  }))

  // Actions
  async function fetchNotices() {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      notices.value = mockNotices
    } catch (err) {
      error.value = 'Failed to fetch notices'
      console.error('Error fetching notices:', err)
    } finally {
      loading.value = false
    }
  }

  async function createNotice(noticeData) {
    loading.value = true
    error.value = null
    try {
      const newNotice = {
        id: Date.now(),
        ...noticeData,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        attachments: noticeData.attachments || []
      }
      notices.value.unshift(newNotice)
      return newNotice
    } catch (err) {
      error.value = 'Failed to create notice'
      console.error('Error creating notice:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateNotice(noticeId, noticeData) {
    loading.value = true
    error.value = null
    try {
      const index = notices.value.findIndex(notice => notice.id === noticeId)
      if (index !== -1) {
        notices.value[index] = { ...notices.value[index], ...noticeData }
        return notices.value[index]
      }
      throw new Error('Notice not found')
    } catch (err) {
      error.value = 'Failed to update notice'
      console.error('Error updating notice:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteNotice(noticeId) {
    loading.value = true
    error.value = null
    try {
      notices.value = notices.value.filter(notice => notice.id !== noticeId)
      return true
    } catch (err) {
      error.value = 'Failed to delete notice'
      console.error('Error deleting notice:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function archiveNotice(noticeId) {
    return updateNotice(noticeId, { status: 'expired' })
  }

  async function activateNotice(noticeId) {
    return updateNotice(noticeId, { status: 'active' })
  }

  function getNoticesByCategory(category) {
    return notices.value.filter(notice => notice.category === category)
  }

  function getNoticesByPriority(priority) {
    return notices.value.filter(notice => notice.priority === priority)
  }

  function getNoticesByAudience(audience) {
    return notices.value.filter(notice => notice.targetAudience.includes(audience))
  }

  function getNoticesByCreator(creator) {
    return notices.value.filter(notice => notice.createdBy === creator)
  }

  function getNoticeById(noticeId) {
    return notices.value.find(notice => notice.id === noticeId)
  }

  function isNoticeExpired(notice) {
    if (!notice.expiryDate) return false
    const expiryDate = new Date(notice.expiryDate)
    const today = new Date()
    return today > expiryDate
  }

  return {
    notices,
    loading,
    error,
    activeNotices,
    expiredNotices,
    examNotices,
    generalNotices,
    facultyNotices,
    eventNotices,
    statistics,
    fetchNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    archiveNotice,
    activateNotice,
    getNoticesByCategory,
    getNoticesByPriority,
    getNoticesByAudience,
    getNoticesByCreator,
    getNoticeById,
    isNoticeExpired
  }
})
