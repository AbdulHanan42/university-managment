<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <!-- Header Section -->
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Faculty Portal</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">My Leaves</h1>
        <p class="m-0 text-sm text-text-secondary">Manage your leave requests and view status.</p>
      </div>
      <AppButton @click="showApplyModal = true">
        + Apply for Leave
      </AppButton>
    </header>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <article class="bg-primary-light rounded-xl p-5 border border-border transition-all hover:bg-primary">
        <h2 class="mb-2 text-sm text-text-secondary font-semibold">Total Requests</h2>
        <p class="mb-1 text-3xl font-bold text-text-primary">{{ statistics.total }}</p>
        <span class="text-xs text-text-muted">All leave requests</span>
      </article>
      <article class="bg-warning-light rounded-xl p-5 border border-border transition-all hover:bg-warning">
        <h2 class="mb-2 text-sm text-text-secondary font-semibold">Pending</h2>
        <p class="mb-1 text-3xl font-bold text-text-primary">{{ statistics.pending }}</p>
        <span class="text-xs text-text-muted">Awaiting approval</span>
      </article>
      <article class="bg-success-light rounded-xl p-5 border border-border transition-all hover:bg-success">
        <h2 class="mb-2 text-sm text-text-secondary font-semibold">Approved</h2>
        <p class="mb-1 text-3xl font-bold text-text-primary">{{ statistics.approved }}</p>
        <span class="text-xs text-text-muted">Processed successfully</span>
      </article>
      <article class="bg-error-light rounded-xl p-5 border border-border transition-all hover:bg-error">
        <h2 class="mb-2 text-sm text-text-secondary font-semibold">Rejected</h2>
        <p class="mb-1 text-3xl font-bold text-text-primary">{{ statistics.rejected }}</p>
        <span class="text-xs text-text-muted">Not approved</span>
      </article>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 bg-bg-light p-2 rounded-lg">
      <button
        :class="activeTab === 'all' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'all'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        All
      </button>
      <button
        :class="activeTab === 'pending' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'pending'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Pending
      </button>
      <button
        :class="activeTab === 'approved' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'approved'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Approved
      </button>
      <button
        :class="activeTab === 'rejected' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'rejected'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Rejected
      </button>
      <button
        :class="activeTab === 'cancelled' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'cancelled'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Cancelled
      </button>
    </div>

    <!-- Leave Requests List -->
    <div v-if="filteredMyLeaves.length === 0" class="text-center py-12 text-text-muted">
      <p>No leave requests found</p>
    </div>
    <div v-else class="space-y-4">
      <div v-for="leave in filteredMyLeaves" :key="leave.id" class="bg-bg-light border border-border rounded-lg p-5">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="font-semibold text-text-primary text-lg">{{ leave.type }}</h3>
            <p class="text-sm text-text-secondary">{{ leave.startDate }} to {{ leave.endDate }} ({{ calculateDays(leave.startDate, leave.endDate) }} days)</p>
          </div>
          <span :class="['px-3 py-1 rounded-full text-xs font-medium', getStatusBadge(leave.status)]">
            {{ leave.status.charAt(0).toUpperCase() + leave.status.slice(1) }}
          </span>
        </div>
        <p class="text-sm text-text-secondary mb-3">{{ leave.reason }}</p>
        <div class="flex justify-between items-center">
          <p class="text-xs text-text-muted">Applied on: {{ leave.createdAt }}</p>
          <div class="flex gap-2">
            <button
              v-if="leave.status === 'pending'"
              @click="handleCancelLeave(leave.id)"
              class="px-3 py-1 bg-warning text-white rounded text-sm hover:bg-warning-dark transition-all"
            >
              Cancel Request
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Apply Leave Modal -->
    <div v-if="showApplyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-text-primary mb-4">Apply for Leave</h2>
        <form @submit.prevent="handleApplyLeave" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Leave Type</label>
            <select v-model="leaveForm.type" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select type</option>
              <option v-for="type in leaveTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
              <input v-model="leaveForm.startDate" type="date" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div>
              <label class="block text-sm font-medium text-text-secondary mb-1">End Date</label>
              <input v-model="leaveForm.endDate" type="date" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1">Reason</label>
            <textarea v-model="leaveForm.reason" required rows="3" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Please provide a reason for your leave request"></textarea>
          </div>
          <div class="flex gap-3 justify-end">
            <button type="button" @click="showApplyModal = false" class="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-bg-light transition-all">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLeaveStore } from '@/stores/leave.store'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'

defineOptions({ name: 'FacultyLeaves' })

const leaveStore = useLeaveStore()
const authStore = useAuthStore()
const toast = useToast()

const showApplyModal = ref(false)
const activeTab = ref('all')

const leaveForm = ref({
  type: '',
  startDate: '',
  endDate: '',
  reason: ''
})

const leaveTypes = ['Sick Leave', 'Annual Leave', 'Personal Leave', 'Emergency Leave', 'Maternity Leave', 'Paternity Leave', 'Research Leave']

onMounted(() => {
  leaveStore.fetchLeaves()
})

const myLeaves = computed(() => {
  if (authStore.user) {
    return leaveStore.getLeavesByUserId(authStore.user.id)
  }
  return []
})

const filteredMyLeaves = computed(() => {
  switch (activeTab.value) {
    case 'pending':
      return myLeaves.value.filter(leave => leave.status === 'pending')
    case 'approved':
      return myLeaves.value.filter(leave => leave.status === 'approved')
    case 'rejected':
      return myLeaves.value.filter(leave => leave.status === 'rejected')
    case 'cancelled':
      return myLeaves.value.filter(leave => leave.status === 'cancelled')
    default:
      return myLeaves.value
  }
})

const statistics = computed(() => ({
  total: myLeaves.value.length,
  pending: myLeaves.value.filter(l => l.status === 'pending').length,
  approved: myLeaves.value.filter(l => l.status === 'approved').length,
  rejected: myLeaves.value.filter(l => l.status === 'rejected').length
}))

async function handleApplyLeave() {
  try {
    const leaveData = {
      userId: authStore.user.id,
      userName: authStore.user.name,
      userRole: 'Faculty',
      department: authStore.user.department || 'Not Assigned',
      ...leaveForm.value
    }
    await leaveStore.createLeave(leaveData)
    toast.success('Leave request submitted successfully')
    showApplyModal.value = false
    leaveForm.value = { type: '', startDate: '', endDate: '', reason: '' }
  } catch (error) {
    toast.error('Failed to submit leave request')
  }
}

async function handleCancelLeave(leaveId) {
  try {
    await leaveStore.cancelLeave(leaveId)
    toast.success('Leave request cancelled')
  } catch (error) {
    toast.error(error.message || 'Failed to cancel leave request')
  }
}

function getStatusBadge(status) {
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

function calculateDays(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
}
</script>

<style scoped>
/* Removed the placeholder style */
</style>
