<script setup>
import { ref, onMounted, computed } from 'vue'
import { useNoticeStore } from '@/stores/notice.store'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'

defineOptions({ name: 'NoticeIndex' })

const noticeStore = useNoticeStore()
const authStore = useAuthStore()
const isSuperAdmin = computed(() => authStore.user?.role === 'Super Admin')
const toast = useToast()

const activeTab = ref('all')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedNotice = ref(null)
const searchQuery = ref('')

const noticeForm = ref({
  title: '',
  content: '',
  category: 'General',
  priority: 'Medium',
  targetAudience: ['Student'],
  expiryDate: ''
})

const categories = ['Exam', 'General', 'Faculty', 'Event', 'Emergency']
const priorities = ['Low', 'Medium', 'High']
const audienceOptions = ['Student', 'Faculty', 'Staff']

onMounted(() => {
  noticeStore.fetchNotices()
})

const filteredNotices = computed(() => {
  let filtered = []
  
  switch (activeTab.value) {
    case 'exam':
      filtered = noticeStore.examNotices
      break
    case 'general':
      filtered = noticeStore.generalNotices
      break
    case 'faculty':
      filtered = noticeStore.facultyNotices
      break
    case 'event':
      filtered = noticeStore.eventNotices
      break
    case 'active':
      filtered = noticeStore.activeNotices
      break
    case 'expired':
      filtered = noticeStore.expiredNotices
      break
    default:
      filtered = noticeStore.notices
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(notice =>
      notice.title.toLowerCase().includes(query) ||
      notice.content.toLowerCase().includes(query)
    )
  }

  // Filter by audience for students
  if (authStore.isStudent) {
    filtered = filtered.filter(notice => 
      notice.targetAudience.includes('Student') || notice.targetAudience.includes('All')
    )
  }

  return filtered
})

const summaryCards = computed(() => [
  { title: 'Total Notices', value: noticeStore.statistics.total, subtitle: 'All announcements' },
  { title: 'Active', value: noticeStore.statistics.active, subtitle: 'Currently visible' },
  { title: 'Exam Notices', value: noticeStore.statistics.exam, subtitle: 'Examination related' },
  { title: 'High Priority', value: noticeStore.statistics.highPriority, subtitle: 'Urgent announcements' },
])

async function handleCreateNotice() {
  try {
    const noticeData = {
      ...noticeForm.value,
      createdBy: authStore.user?.name || 'Admin',
      targetAudience: noticeForm.value.targetAudience
    }
    await noticeStore.createNotice(noticeData)
    toast.success('Notice created successfully')
    showCreateModal.value = false
    noticeForm.value = { title: '', content: '', category: 'General', priority: 'Medium', targetAudience: ['Student'], expiryDate: '' }
  } catch (error) {
    toast.error('Failed to create notice')
  }
}

function handleEditClick(notice) {
  selectedNotice.value = notice
  noticeForm.value = {
    title: notice.title,
    content: notice.content,
    category: notice.category,
    priority: notice.priority,
    targetAudience: notice.targetAudience,
    expiryDate: notice.expiryDate
  }
  showEditModal.value = true
}

async function handleUpdateNotice() {
  try {
    await noticeStore.updateNotice(selectedNotice.value.id, noticeForm.value)
    toast.success('Notice updated successfully')
    showEditModal.value = false
    selectedNotice.value = null
    noticeForm.value = { title: '', content: '', category: 'General', priority: 'Medium', targetAudience: ['Student'], expiryDate: '' }
  } catch (error) {
    toast.error('Failed to update notice')
  }
}

async function handleDeleteNotice(noticeId) {
  if (confirm('Are you sure you want to delete this notice?')) {
    try {
      await noticeStore.deleteNotice(noticeId)
      toast.success('Notice deleted successfully')
    } catch (error) {
      toast.error('Failed to delete notice')
    }
  }
}

async function handleArchiveNotice(noticeId) {
  try {
    await noticeStore.archiveNotice(noticeId)
    toast.success('Notice archived successfully')
  } catch (error) {
    toast.error('Failed to archive notice')
  }
}

async function handleActivateNotice(noticeId) {
  try {
    await noticeStore.activateNotice(noticeId)
    toast.success('Notice activated successfully')
  } catch (error) {
    toast.error('Failed to activate notice')
  }
}

function getCategoryBadge(category) {
  const categoryClasses = {
    Exam: 'bg-purple-100 text-purple-800',
    General: 'bg-blue-100 text-blue-800',
    Faculty: 'bg-green-100 text-green-800',
    Event: 'bg-orange-100 text-orange-800',
    Emergency: 'bg-red-100 text-red-800'
  }
  return categoryClasses[category] || 'bg-gray-100 text-gray-800'
}

function getPriorityBadge(priority) {
  const priorityClasses = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800'
  }
  return priorityClasses[priority] || 'bg-gray-100 text-gray-800'
}

function getStatusBadge(status) {
  return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
}

function isExpired(notice) {
  return noticeStore.isNoticeExpired(notice)
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <!-- Header Section -->
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Announcements</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Notices</h1>
        <p class="m-0 text-sm text-text-secondary">Publish official announcements and campus-wide updates.</p>
      </div>
      <AppButton 
        v-if="isSuperAdmin" 
        @click="showCreateModal = true"
      >
        + Create Notice
      </AppButton>
    </header>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <article v-for="card in summaryCards" :key="card.title" class="bg-primary-light rounded-xl p-5 border border-border transition-all hover:bg-primary">
        <h2 class="mb-2 text-sm text-text-secondary font-semibold">{{ card.title }}</h2>
        <p class="mb-1 text-3xl font-bold text-text-primary">{{ card.value }}</p>
        <span class="text-xs text-text-muted">{{ card.subtitle }}</span>
      </article>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search notices..."
        class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 bg-bg-light p-2 rounded-lg flex-wrap">
      <button
        :class="activeTab === 'all' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'all'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        All Notices
      </button>
      <button
        :class="activeTab === 'exam' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'exam'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Exam
      </button>
      <button
        :class="activeTab === 'general' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'general'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        General
      </button>
      <button
        :class="activeTab === 'faculty' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'faculty'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Faculty
      </button>
      <button
        :class="activeTab === 'event' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'event'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Events
      </button>
      <button
        v-if="isSuperAdmin"
        :class="activeTab === 'active' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'active'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Active
      </button>
      <button
        v-if="isSuperAdmin"
        :class="activeTab === 'expired' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'expired'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Expired
      </button>
    </div>

    <!-- Notices List -->
    <div v-if="filteredNotices.length === 0" class="text-center py-12 text-text-muted">
      <p>No notices found</p>
    </div>
    <div v-else class="space-y-4">
      <div v-for="notice in filteredNotices" :key="notice.id" class="bg-bg-light border border-border rounded-lg p-5">
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <div class="flex gap-2 mb-2">
              <span :class="['px-2 py-1 rounded text-xs font-medium', getCategoryBadge(notice.category)]">
                {{ notice.category }}
              </span>
              <span :class="['px-2 py-1 rounded text-xs font-medium', getPriorityBadge(notice.priority)]">
                {{ notice.priority }} Priority
              </span>
              <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusBadge(notice.status)]">
                {{ notice.status.charAt(0).toUpperCase() + notice.status.slice(1) }}
              </span>
              <span v-if="isExpired(notice)" class="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                Expired
              </span>
            </div>
            <h3 class="font-semibold text-text-primary text-lg mb-2">{{ notice.title }}</h3>
            <p class="text-sm text-text-secondary mb-2">{{ notice.content }}</p>
            <div class="flex gap-4 text-xs text-text-muted">
              <span>Created: {{ notice.createdAt }}</span>
              <span v-if="notice.expiryDate">Expires: {{ notice.expiryDate }}</span>
              <span>By: {{ notice.createdBy }}</span>
              <span>Audience: {{ notice.targetAudience.join(', ') }}</span>
            </div>
          </div>
          <div v-if="isSuperAdmin" class="flex gap-2 ml-4">
            <button
              @click="handleEditClick(notice)"
              class="px-3 py-1 bg-secondary text-white rounded text-sm hover:bg-secondary-dark transition-all"
            >
              Edit
            </button>
            <button
              v-if="notice.status === 'active'"
              @click="handleArchiveNotice(notice.id)"
              class="px-3 py-1 bg-warning text-white rounded text-sm hover:bg-warning-dark transition-all"
            >
              Archive
            </button>
            <button
              v-if="notice.status === 'expired'"
              @click="handleActivateNotice(notice.id)"
              class="px-3 py-1 bg-success text-white rounded text-sm hover:bg-success-dark transition-all"
            >
              Activate
            </button>
            <button
              @click="handleDeleteNotice(notice.id)"
              class="px-3 py-1 bg-error text-white rounded text-sm hover:bg-error-dark transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Notice Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold text-text-primary mb-4">Create New Notice</h2>
        <form @submit.prevent="handleCreateNotice" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Title</label>
            <input v-model="noticeForm.title" type="text" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter notice title">
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Content</label>
            <textarea v-model="noticeForm.content" required rows="4" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter notice content"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Category</label>
              <select v-model="noticeForm.category" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Priority</label>
              <select v-model="noticeForm.priority" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option v-for="prio in priorities" :key="prio" :value="prio">{{ prio }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Target Audience</label>
              <div class="space-y-2">
                <label v-for="audience in audienceOptions" :key="audience" class="flex items-center">
                  <input type="checkbox" v-model="noticeForm.targetAudience" :value="audience" class="mr-2">
                  <span>{{ audience }}</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Expiry Date (Optional)</label>
              <input v-model="noticeForm.expiryDate" type="date" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
          </div>
          <div class="flex gap-3 justify-end">
            <button type="button" @click="showCreateModal = false" class="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-bg-light transition-all">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">
              Create Notice
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Notice Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold text-text-primary mb-4">Edit Notice</h2>
        <form @submit.prevent="handleUpdateNotice" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Title</label>
            <input v-model="noticeForm.title" type="text" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Content</label>
            <textarea v-model="noticeForm.content" required rows="4" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Category</label>
              <select v-model="noticeForm.category" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Priority</label>
              <select v-model="noticeForm.priority" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option v-for="prio in priorities" :key="prio" :value="prio">{{ prio }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Target Audience</label>
              <div class="space-y-2">
                <label v-for="audience in audienceOptions" :key="audience" class="flex items-center">
                  <input type="checkbox" v-model="noticeForm.targetAudience" :value="audience" class="mr-2">
                  <span>{{ audience }}</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Expiry Date (Optional)</label>
              <input v-model="noticeForm.expiryDate" type="date" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
          </div>
          <div class="flex gap-3 justify-end">
            <button type="button" @click="showEditModal = false; selectedNotice = null" class="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-bg-light transition-all">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">
              Update Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-card { background: white; border: 1px solid #dfe7fb; border-radius: 1.2rem; padding: 1.25rem; box-shadow: 0 16px 40px rgba(20, 33, 61, 0.06); }
.page-header { margin-bottom: 1rem; }
.eyebrow { margin: 0 0 0.25rem; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.2em; color: #60708f; }
h1 { margin: 0 0 0.4rem; }
.card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
.summary-card { background: #f6f9ff; border-radius: 1rem; padding: 1rem; }
.summary-card h2 { margin: 0 0 0.4rem; font-size: 1rem; color: #5d6d8f; }
.value { margin: 0 0 0.2rem; font-size: 1.5rem; font-weight: 700; color: #14213d; }
</style>
