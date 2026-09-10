<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <!-- Header Section -->
    <header class="mb-6">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Parent Portal</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Notices & Announcements</h1>
        <p class="m-0 text-sm text-text-secondary">Stay updated with university announcements and exam schedules.</p>
      </div>
    </header>

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
        :class="activeTab === 'event' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'event'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Events
      </button>
    </div>

    <!-- Notices List -->
    <div v-if="filteredNotices.length === 0" class="text-center py-12 text-text-muted">
      <p>No notices found</p>
    </div>
    <div v-else class="space-y-4">
      <div v-for="notice in filteredNotices" :key="notice.id" class="bg-bg-light border border-border rounded-lg p-5">
        <div class="flex gap-2 mb-2">
          <span :class="['px-2 py-1 rounded text-xs font-medium', getCategoryBadge(notice.category)]">
            {{ notice.category }}
          </span>
          <span :class="['px-2 py-1 rounded text-xs font-medium', getPriorityBadge(notice.priority)]">
            {{ notice.priority }} Priority
          </span>
          <span v-if="isExpired(notice)" class="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
            Expired
          </span>
        </div>
        <h3 class="font-semibold text-text-primary text-lg mb-2">{{ notice.title }}</h3>
        <p class="text-sm text-text-secondary mb-3">{{ notice.content }}</p>
        <div class="flex gap-4 text-xs text-text-muted">
          <span>Created: {{ notice.createdAt }}</span>
          <span v-if="notice.expiryDate">Expires: {{ notice.expiryDate }}</span>
          <span>By: {{ notice.createdBy }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useNoticeStore } from '@/stores/notice.store'
import { useAuthStore } from '@/stores/auth.store'

defineOptions({ name: 'ParentNotices' })

const noticeStore = useNoticeStore()
const authStore = useAuthStore()

const activeTab = ref('all')
const searchQuery = ref('')

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
    case 'event':
      filtered = noticeStore.eventNotices
      break
    default:
      filtered = noticeStore.activeNotices
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(notice =>
      notice.title.toLowerCase().includes(query) ||
      notice.content.toLowerCase().includes(query)
    )
  }

  // Filter by audience for parents (show notices for students and general)
  filtered = filtered.filter(notice => 
    notice.targetAudience.includes('Student') || 
    notice.targetAudience.includes('All') ||
    notice.targetAudience.includes('Parent')
  )

  return filtered
})

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

function isExpired(notice) {
  return noticeStore.isNoticeExpired(notice)
}
</script>

<style scoped>
/* Removed the placeholder style as it's not being used */
</style>
