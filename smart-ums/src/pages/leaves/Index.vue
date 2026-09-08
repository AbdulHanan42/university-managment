<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLeaveStore } from '@/stores/leave.store'
import { useAuthStore } from '@/stores/auth.store'
import { usePermission } from '@/composables/usePermission'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'

defineOptions({ name: 'LeaveIndex' })

const leaveStore = useLeaveStore()
const authStore = useAuthStore()
const { can } = usePermission()
const toast = useToast()

const activeTab = ref('all')
const showApplyModal = ref(false)
const selectedLeave = ref(null)
const showRejectModal = ref(false)
const rejectionReason = ref('')

const leaveForm = ref({
  type: '',
  startDate: '',
  endDate: '',
  reason: ''
})

const leaveTypes = ['Sick Leave', 'Annual Leave', 'Personal Leave', 'Emergency Leave', 'Maternity Leave', 'Paternity Leave']

onMounted(() => {
  leaveStore.fetchLeaves()
})

const filteredLeaves = computed(() => {
  switch (activeTab.value) {
    case 'student':
      return leaveStore.studentLeaves
    case 'faculty':
      return leaveStore.facultyLeaves
    case 'pending':
      return leaveStore.pendingLeaves
    case 'approved':
      return leaveStore.approvedLeaves
    case 'rejected':
      return leaveStore.rejectedLeaves
    default:
      return leaveStore.leaves
  }
})

const summaryCards = computed(() => [
  { title: 'Total Requests', value: leaveStore.statistics.total, subtitle: 'All leave requests' },
  { title: 'Pending', value: leaveStore.statistics.pending, subtitle: 'Awaiting approval' },
  { title: 'Approved', value: leaveStore.statistics.approved, subtitle: 'Processed successfully' },
  { title: 'Rejected', value: leaveStore.statistics.rejected, subtitle: 'Not approved' },
])

const myLeaves = computed(() => {
  if (authStore.user) {
    return leaveStore.getLeavesByUserId(authStore.user.id)
  }
  return []
})

async function handleApplyLeave() {
  try {
    const leaveData = {
      userId: authStore.user.id,
      userName: authStore.user.name,
      userRole: authStore.user.role,
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

async function handleApproveLeave(leaveId) {
  try {
    await leaveStore.approveLeave(leaveId)
    toast.success('Leave request approved')
  } catch (error) {
    toast.error('Failed to approve leave request')
  }
}

function handleRejectClick(leave) {
  selectedLeave.value = leave
  showRejectModal.value = true
}

async function handleRejectLeave() {
  try {
    await leaveStore.rejectLeave(selectedLeave.value.id, rejectionReason.value)
    toast.success('Leave request rejected')
    showRejectModal.value = false
    rejectionReason.value = ''
    selectedLeave.value = null
  } catch (error) {
    toast.error('Failed to reject leave request')
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

function getRoleBadge(role) {
  const roleClasses = {
    Student: 'bg-blue-100 text-blue-800',
    Faculty: 'bg-purple-100 text-purple-800',
    Admin: 'bg-green-100 text-green-800'
  }
  return roleClasses[role] || 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <!-- Header Section -->
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Leave Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Leaves</h1>
        <p class="m-0 text-sm text-text-secondary">Manage leave requests for students and faculty.</p>
      </div>
      <AppButton 
        v-if="can('leave.create')" 
        @click="showApplyModal = true"
      >
        + Apply for Leave
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

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 bg-bg-light p-2 rounded-lg">
      <button
        :class="activeTab === 'all' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'all'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        All Leaves
      </button>
      <button
        :class="activeTab === 'student' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'student'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Student Leaves
      </button>
      <button
        :class="activeTab === 'faculty' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
        @click="activeTab = 'faculty'"
        class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
      >
        Faculty Leaves
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
    </div>

    <!-- My Leaves Section (for students/faculty viewing their own leaves) -->
    <div v-if="authStore.isStudent || authStore.user?.role === 'Faculty'" class="mb-8">
      <h2 class="text-lg font-bold text-text-primary mb-4">My Leave Requests</h2>
      <div v-if="myLeaves.length === 0" class="text-center py-8 text-text-muted">
        <p>No leave requests found</p>
      </div>
      <div v-else class="space-y-4">
        <div v-for="leave in myLeaves" :key="leave.id" class="bg-bg-light border border-border rounded-lg p-4">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-semibold text-text-primary">{{ leave.type }}</h3>
              <p class="text-sm text-text-secondary">{{ leave.startDate }} to {{ leave.endDate }}</p>
            </div>
            <span :class="['px-3 py-1 rounded-full text-xs font-medium', getStatusBadge(leave.status)]">
              {{ leave.status.charAt(0).toUpperCase() + leave.status.slice(1) }}
            </span>
          </div>
          <p class="text-sm text-text-secondary mb-3">{{ leave.reason }}</p>
          <div class="flex gap-2">
            <button
              v-if="leave.status === 'pending' && can('leave.cancel')"
              @click="handleCancelLeave(leave.id)"
              class="px-3 py-1 bg-warning text-white rounded text-sm hover:bg-warning-dark transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- All Leaves Table (for admins) -->
    <div v-if="can('leaves.manage') || can('leaves.approve')">
      <h2 class="text-lg font-bold text-text-primary mb-4">All Leave Requests</h2>
      <div v-if="filteredLeaves.length === 0" class="text-center py-8 text-text-muted">
        <p>No leave requests found</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-bg-light">
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Name</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Role</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Type</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Duration</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Reason</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Status</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="leave in filteredLeaves" :key="leave.id" class="border-b border-border">
              <td class="px-4 py-3 text-sm text-text-primary">{{ leave.userName }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getRoleBadge(leave.userRole)]">
                  {{ leave.userRole }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-text-primary">{{ leave.type }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ leave.startDate }} - {{ leave.endDate }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ leave.reason }}</td>
              <td class="px-4 py-3">
                <span :class="['px-3 py-1 rounded-full text-xs font-medium', getStatusBadge(leave.status)]">
                  {{ leave.status.charAt(0).toUpperCase() + leave.status.slice(1) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    v-if="leave.status === 'pending' && can('leaves.approve')"
                    @click="handleApproveLeave(leave.id)"
                    class="px-3 py-1 bg-success text-white rounded text-sm hover:bg-success-dark transition-all"
                  >
                    Approve
                  </button>
                  <button
                    v-if="leave.status === 'pending' && can('leaves.reject')"
                    @click="handleRejectClick(leave)"
                    class="px-3 py-1 bg-error text-white rounded text-sm hover:bg-error-dark transition-all"
                  >
                    Reject
                  </button>
                  <button
                    v-if="can('leaves.manage')"
                    @click="leaveStore.deleteLeave(leave.id)"
                    class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
            <textarea v-model="leaveForm.reason" required rows="3" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
          </div>
          <div class="flex gap-3 justify-end">
            <button type="button" @click="showApplyModal = false" class="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-bg-light transition-all">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-text-primary mb-4">Reject Leave Request</h2>
        <p class="text-sm text-text-secondary mb-4">Please provide a reason for rejection:</p>
        <textarea v-model="rejectionReason" rows="3" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"></textarea>
        <div class="flex gap-3 justify-end">
          <button @click="showRejectModal = false; rejectionReason = ''" class="px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-bg-light transition-all">
            Cancel
          </button>
          <button @click="handleRejectLeave" class="px-4 py-2 bg-error text-white rounded-lg hover:bg-error-dark transition-all">
            Reject
          </button>
        </div>
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
