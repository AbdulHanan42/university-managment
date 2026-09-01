<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin.store'
import { useToast } from '@/composables/useToast'

defineOptions({ name: 'AdminPanel' })

const router = useRouter()
const adminStore = useAdminStore()
const toast = useToast()

const searchQuery = ref('')
const filterType = ref('all')
const filterStatus = ref('all')
const showRejectModal = ref(false)
const selectedRequest = ref(null)
const rejectionReason = ref('')

onMounted(() => {
  adminStore.initializeAdminPanel()
  if (adminStore.isAuthenticated) {
    adminStore.fetchPendingRequests()
    adminStore.fetchStats()
  } else {
    router.push({ name: 'admin-login' })
  }
})

const filteredRequests = computed(() => {
  let requests = adminStore.pendingRequests

  if (filterType.value !== 'all') {
    requests = requests.filter(r => r.type === filterType.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    requests = requests.filter(r => 
      r.name?.toLowerCase().includes(query) ||
      r.email?.toLowerCase().includes(query) ||
      (r.rollNumber && r.rollNumber.toLowerCase().includes(query))
    )
  }

  return requests
})

const requestTypes = computed(() => {
  const types = new Set(adminStore.pendingRequests.map(r => r.type))
  return ['all', ...Array.from(types)]
})

const handleApprove = async (requestId) => {
  try {
    await adminStore.approveRequest(requestId)
    toast.success('Request approved successfully!')
  } catch (error) {
    toast.error('Failed to approve request')
  }
}

const handleRejectClick = (request) => {
  selectedRequest.value = request
  rejectionReason.value = ''
  showRejectModal.value = true
}

const handleReject = async () => {
  if (!rejectionReason.value.trim()) {
    toast.error('Please provide a rejection reason')
    return
  }

  try {
    await adminStore.rejectRequest(selectedRequest.value.id, rejectionReason.value)
    toast.success('Request rejected successfully')
    showRejectModal.value = false
    selectedRequest.value = null
    rejectionReason.value = ''
  } catch (error) {
    toast.error('Failed to reject request')
  }
}

const handleLogout = async () => {
  await adminStore.adminLogout()
  router.push({ name: 'admin-login' })
}

const handleBackToUMS = () => {
  router.push({ name: 'dashboard' })
}

const getTypeIcon = (type) => {
  const icons = {
    'registration': '👤',
    'enrollment': '📚',
    'hostel_booking': '🏠',
    'leave_request': '🏖️',
    'fee_payment': '💰'
  }
  return icons[type] || '📋'
}

const getTypeColor = (type) => {
  const colors = {
    'registration': 'bg-blue-100 text-blue-700',
    'enrollment': 'bg-green-100 text-green-700',
    'hostel_booking': 'bg-purple-100 text-purple-700',
    'leave_request': 'bg-orange-100 text-orange-700',
    'fee_payment': 'bg-yellow-100 text-yellow-700'
  }
  return colors[type] || 'bg-gray-100 text-gray-700'
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Admin Panel Header -->
    <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-6">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-4">
          <div class="text-4xl">🛡️</div>
          <div>
            <h1 class="text-2xl font-bold m-0">Admin Panel</h1>
            <p class="text-sm opacity-80 m-0 mt-1">Smart UMS Request Management</p>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <button @click="handleBackToUMS" class="px-5 py-2 bg-white/15 text-white border border-white/30 rounded-lg cursor-pointer transition-all hover:bg-white/25">
            ← Back to UMS
          </button>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-semibold text-lg">
                {{ adminStore.admin?.name?.charAt(0) || 'A' }}
              </div>
              <div class="text-right">
                <div class="font-semibold text-sm">{{ adminStore.admin?.name }}</div>
                <div class="text-xs opacity-80">{{ adminStore.admin?.role }}</div>
              </div>
              <button @click="handleLogout" class="px-4 py-2 bg-white/15 text-white border border-white/30 rounded text-sm cursor-pointer transition-all hover:bg-white/25">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto mt-8 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm border-l-4 border-amber-500">
        <div class="text-4xl">⏰</div>
        <div>
          <div class="text-3xl font-bold text-slate-800">{{ adminStore.stats.pending }}</div>
          <div class="text-sm text-slate-600 mt-1">Pending Requests</div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm border-l-4 border-green-500">
        <div class="text-4xl">✅</div>
        <div>
          <div class="text-3xl font-bold text-slate-800">{{ adminStore.stats.approved }}</div>
          <div class="text-sm text-slate-600 mt-1">Approved Today</div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm border-l-4 border-red-500">
        <div class="text-4xl">❌</div>
        <div>
          <div class="text-3xl font-bold text-slate-800">{{ adminStore.stats.rejected }}</div>
          <div class="text-sm text-slate-600 mt-1">Rejected Today</div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm border-l-4 border-blue-500">
        <div class="text-4xl">📊</div>
        <div>
          <div class="text-3xl font-bold text-slate-800">{{ adminStore.stats.total }}</div>
          <div class="text-sm text-slate-600 mt-1">Total Requests</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto mt-6 px-6 flex gap-4">
      <div class="flex-1">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search requests..." 
          class="w-full px-4 py-3.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
        />
      </div>
      <div class="flex-1">
        <select v-model="filterType" class="w-full px-4 py-3.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10">
          <option value="all">All Types</option>
          <option v-for="type in requestTypes.filter(t => t !== 'all')" :key="type" :value="type">
            {{ type.replace('_', ' ').toUpperCase() }}
          </option>
        </select>
      </div>
    </div>

    <!-- Requests List -->
    <div class="max-w-7xl mx-auto mt-6 mb-12 px-6">
      <div v-if="adminStore.loading" class="text-center py-16 text-slate-600">
        <p>Loading requests...</p>
      </div>

      <div v-else-if="filteredRequests.length === 0" class="text-center py-16 text-slate-600">
        <div class="text-6xl mb-4">📭</div>
        <h3 class="text-2xl font-semibold mb-2">No Pending Requests</h3>
        <p>All requests have been processed</p>
      </div>

      <div v-else class="grid gap-6">
        <div 
          v-for="request in filteredRequests" 
          :key="request.id" 
          class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
        >
          <div class="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
            <div class="flex items-center gap-2">
              <span class="text-3xl">{{ getTypeIcon(request.type) }}</span>
              <span class="font-semibold text-slate-800">{{ request.type.replace('_', ' ').toUpperCase() }}</span>
            </div>
            <div class="text-sm text-slate-600">
              {{ new Date(request.createdAt).toLocaleString() }}
            </div>
          </div>

          <div class="flex gap-8 mb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-xl overflow-hidden">
                {{ request.profilePic ? '' : request.name?.charAt(0) }}
                <img v-if="request.profilePic" :src="request.profilePic" class="w-full h-full object-cover" />
              </div>
              <div>
                <h4 class="text-base font-semibold text-slate-800 mb-1">{{ request.name }}</h4>
                <p class="text-sm text-slate-600 m-0">{{ request.email }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 flex-1">
              <div v-if="request.rollNumber" class="flex gap-2">
                <span class="text-sm text-slate-600 font-medium">Roll Number:</span>
                <span class="text-sm text-slate-800 font-semibold">{{ request.rollNumber }}</span>
              </div>
              <div v-if="request.department" class="flex gap-2">
                <span class="text-sm text-slate-600 font-medium">Department:</span>
                <span class="text-sm text-slate-800 font-semibold">{{ request.department }}</span>
              </div>
              <div v-if="request.organization" class="flex gap-2">
                <span class="text-sm text-slate-600 font-medium">Organization:</span>
                <span class="text-sm text-slate-800 font-semibold">{{ request.organization }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-sm text-slate-600 font-medium">Role:</span>
                <span class="text-sm text-slate-800 font-semibold">{{ request.role }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <button 
              @click="handleApprove(request.id)"
              class="flex-1 px-4 py-3.5 bg-green-500 text-white rounded-lg font-semibold cursor-pointer transition-all hover:bg-green-600"
            >
              ✅ Approve
            </button>
            <button 
              @click="handleRejectClick(request)"
              class="flex-1 px-4 py-3.5 bg-red-500 text-white rounded-lg font-semibold cursor-pointer transition-all hover:bg-red-600"
            >
              ❌ Reject
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-8 max-w-lg w-full mx-4">
        <h2 class="text-2xl font-bold text-slate-800 mb-6">Reject Request</h2>
        <div v-if="selectedRequest" class="bg-slate-50 p-4 rounded-lg mb-6">
          <p class="text-sm mb-1"><strong>Name:</strong> {{ selectedRequest.name }}</p>
          <p class="text-sm mb-1"><strong>Email:</strong> {{ selectedRequest.email }}</p>
          <p class="text-sm"><strong>Type:</strong> {{ selectedRequest.type.replace('_', ' ').toUpperCase() }}</p>
        </div>
        <div class="mb-6">
          <label class="block mb-2 font-semibold text-slate-800">Rejection Reason *</label>
          <textarea 
            v-model="rejectionReason" 
            placeholder="Please provide a reason for rejection..." 
            rows="4"
            class="w-full px-4 py-3.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 resize-y"
          ></textarea>
        </div>
        <div class="flex gap-4 justify-end">
          <button @click="showRejectModal = false; selectedRequest = null; rejectionReason = ''" class="px-6 py-3 bg-slate-200 text-slate-800 rounded-lg font-semibold cursor-pointer transition-all hover:bg-slate-300">
            Cancel
          </button>
          <button @click="handleReject" class="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold cursor-pointer transition-all hover:bg-red-600">
            Reject Request
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
