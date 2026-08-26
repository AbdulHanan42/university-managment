<script setup>
import { ref, onMounted, computed } from 'vue'
import { useHostelStore } from '@/stores/hostel.store'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

defineOptions({ name: 'HostelRequests' })

const router = useRouter()
const hostelStore = useHostelStore()
const toast = useToast()

const requests = ref([])
const selectedRequest = ref(null)
const showAssignModal = ref(false)
const assignmentData = ref({
  roomNumber: '',
  bedNumber: '',
  hostel: ''
})

const filterStatus = ref('all')
const isAuthenticated = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})
const showLoginError = ref(false)

onMounted(() => {
  // Check if already authenticated
  const storedAuth = localStorage.getItem('hostelAuth')
  if (storedAuth === 'true') {
    isAuthenticated.value = true
    loadRequests()
    hostelStore.fetchRooms()
  }
})

const loadRequests = () => {
  const storedRequests = localStorage.getItem('hostelRequests')
  if (storedRequests) {
    requests.value = JSON.parse(storedRequests)
  }
}

const handleLogin = () => {
  if (loginForm.value.username === 'hanan' && loginForm.value.password === '123') {
    isAuthenticated.value = true
    localStorage.setItem('hostelAuth', 'true')
    showLoginError.value = false
    loadRequests()
    hostelStore.fetchRooms()
    toast.success('Login successful!')
  } else {
    showLoginError.value = true
    toast.error('Invalid username or password')
  }
}

const handleLogout = () => {
  isAuthenticated.value = false
  localStorage.removeItem('hostelAuth')
  loginForm.value = {
    username: '',
    password: ''
  }
  toast.success('Logged out successfully')
}

const filteredRequests = computed(() => {
  if (filterStatus.value === 'all') {
    return requests.value
  }
  return requests.value.filter(req => req.status === filterStatus.value)
})

const pendingRequests = computed(() => {
  return requests.value.filter(req => req.status === 'pending')
})

const approvedRequests = computed(() => {
  return requests.value.filter(req => req.status === 'approved')
})

const rejectedRequests = computed(() => {
  return requests.value.filter(req => req.status === 'rejected')
})

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-warning-light text-warning'
    case 'approved': return 'bg-success-light text-success'
    case 'rejected': return 'bg-error-light text-error'
    default: return 'bg-bg-light text-text-muted'
  }
}

const openAssignModal = (request) => {
  selectedRequest.value = request
  assignmentData.value = {
    roomNumber: '',
    bedNumber: '',
    hostel: request.hostelPreference
  }
  showAssignModal.value = true
}

const closeAssignModal = () => {
  showAssignModal.value = false
  selectedRequest.value = null
  assignmentData.value = {
    roomNumber: '',
    bedNumber: '',
    hostel: ''
  }
}

const handleApprove = () => {
  if (!assignmentData.value.roomNumber || !assignmentData.value.bedNumber) {
    toast.error('Please assign room and bed number')
    return
  }

  // Update request status
  const requestIndex = requests.value.findIndex(r => r.id === selectedRequest.value.id)
  if (requestIndex !== -1) {
    requests.value[requestIndex] = {
      ...requests.value[requestIndex],
      status: 'approved',
      assignedRoom: assignmentData.value.roomNumber,
      assignedBed: assignmentData.value.bedNumber,
      assignedHostel: assignmentData.value.hostel,
      approvedAt: new Date().toISOString()
    }
    
    // Save to localStorage
    localStorage.setItem('hostelRequests', JSON.stringify(requests.value))
    
    // Add to allocations
    const existingAllocations = JSON.parse(localStorage.getItem('hostelAllocations') || '[]')
    existingAllocations.push({
      id: Date.now(),
      studentId: selectedRequest.value.studentId,
      studentName: selectedRequest.value.studentName,
      roomNumber: assignmentData.value.roomNumber,
      bedNumber: assignmentData.value.bedNumber,
      hostel: assignmentData.value.hostel
    })
    localStorage.setItem('hostelAllocations', JSON.stringify(existingAllocations))
    
    toast.success('Request approved and room assigned successfully!')
    closeAssignModal()
  }
}

const handleReject = (request) => {
  const requestIndex = requests.value.findIndex(r => r.id === request.id)
  if (requestIndex !== -1) {
    requests.value[requestIndex] = {
      ...requests.value[requestIndex],
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    }
    localStorage.setItem('hostelRequests', JSON.stringify(requests.value))
    toast.success('Request rejected')
  }
}

const handleDelete = (request) => {
  requests.value = requests.value.filter(r => r.id !== request.id)
  localStorage.setItem('hostelRequests', JSON.stringify(requests.value))
  toast.success('Request deleted')
}

const availableRooms = computed(() => {
  return hostelStore.rooms.filter(room => room.occupied < room.capacity)
})
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Hostel Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Booking Requests</h1>
        <p class="m-0 text-sm text-text-secondary">Review and manage hostel accommodation requests.</p>
      </div>
      <button 
        v-if="isAuthenticated"
        @click="router.push({ name: 'hostel-booking' })"
        class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all"
      >
        + New Booking
      </button>
      <button 
        v-if="isAuthenticated"
        @click="handleLogout"
        class="px-4 py-2 bg-error text-white rounded-lg font-medium hover:bg-error-dark transition-all"
      >
        Logout
      </button>
    </header>

    <!-- Login Form -->
    <div v-if="!isAuthenticated" class="max-w-md mx-auto">
      <div class="bg-bg-light border border-border rounded-xl p-6">
        <h2 class="mb-4 text-lg font-bold text-text-primary text-center">Admin Login</h2>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Username</label>
            <input 
              v-model="loginForm.username" 
              type="text" 
              placeholder="Enter username"
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Password</label>
            <input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="Enter password"
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div v-if="showLoginError" class="text-error text-sm text-center">
            Invalid username or password
          </div>
          <button 
            type="submit" 
            class="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>

    <!-- Requests Content (shown when authenticated) -->
    <div v-else class="flex flex-col gap-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-primary-light border border-border rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-primary mb-1">{{ requests.length }}</div>
        <div class="text-xs text-text-secondary uppercase tracking-wider">Total Requests</div>
      </div>
      <div class="bg-warning-light border border-border rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-warning mb-1">{{ pendingRequests.length }}</div>
        <div class="text-xs text-text-secondary uppercase tracking-wider">Pending</div>
      </div>
      <div class="bg-success-light border border-border rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-success mb-1">{{ approvedRequests.length }}</div>
        <div class="text-xs text-text-secondary uppercase tracking-wider">Approved</div>
      </div>
      <div class="bg-error-light border border-border rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-error mb-1">{{ rejectedRequests.length }}</div>
        <div class="text-xs text-text-secondary uppercase tracking-wider">Rejected</div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6">
      <button 
        v-for="status in ['all', 'pending', 'approved', 'rejected']"
        :key="status"
        @click="filterStatus = status"
        :class="filterStatus === status ? 'bg-primary text-white' : 'bg-bg-light text-text-primary'"
        class="px-4 py-2 rounded-lg font-medium text-sm transition-all"
      >
        {{ status.charAt(0).toUpperCase() + status.slice(1) }}
      </button>
    </div>

    <!-- Requests List -->
    <div v-if="filteredRequests.length === 0" class="text-center py-12 text-text-muted">
      <p>No requests found.</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="request in filteredRequests" 
        :key="request.id"
        class="bg-bg-light border border-border rounded-xl p-5 hover:border-primary transition-all"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-bold text-text-primary">{{ request.studentName }}</h3>
              <span :class="getStatusColor(request.status)" class="px-2 py-1 rounded text-xs font-semibold">
                {{ request.status.charAt(0).toUpperCase() + request.status.slice(1) }}
              </span>
            </div>
            <p class="text-sm text-text-secondary">ID: {{ request.studentId }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-text-muted">Submitted: {{ new Date(request.submittedAt).toLocaleDateString() }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p class="text-xs text-text-muted mb-1">Department</p>
            <p class="text-sm font-semibold text-text-primary">{{ request.department }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Program</p>
            <p class="text-sm font-semibold text-text-primary">{{ request.program }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Semester</p>
            <p class="text-sm font-semibold text-text-primary">{{ request.semester }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Preferred Hostel</p>
            <p class="text-sm font-semibold text-text-primary">{{ request.hostelPreference }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p class="text-xs text-text-muted mb-1">Room Type</p>
            <p class="text-sm font-semibold text-text-primary">{{ request.roomType }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Mess Required</p>
            <p class="text-sm font-semibold text-text-primary">{{ request.messRequired ? 'Yes' : 'No' }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Phone</p>
            <p class="text-sm font-semibold text-text-primary">{{ request.phone }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">Email</p>
            <p class="text-sm font-semibold text-text-primary">{{ request.email }}</p>
          </div>
        </div>

        <div class="mb-4">
          <p class="text-xs text-text-muted mb-1">Reason</p>
          <p class="text-sm text-text-primary">{{ request.reason }}</p>
        </div>

        <!-- Assigned Room Info (for approved requests) -->
        <div v-if="request.status === 'approved'" class="bg-success-light border border-border rounded-lg p-3 mb-4">
          <p class="text-sm font-semibold text-success">
            Assigned: {{ request.assignedHostel }} - Room {{ request.assignedRoom }}, Bed {{ request.assignedBed }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button 
            v-if="request.status === 'pending'"
            @click="openAssignModal(request)"
            class="px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-success-dark transition-all"
          >
            Approve & Assign
          </button>
          <button 
            v-if="request.status === 'pending'"
            @click="handleReject(request)"
            class="px-4 py-2 bg-error text-white rounded-lg font-medium hover:bg-error-dark transition-all"
          >
            Reject
          </button>
          <button 
            @click="handleDelete(request)"
            class="px-4 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Assignment Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-bg-white border border-border rounded-xl p-6 max-w-md w-full mx-4">
        <h2 class="mb-4 text-lg font-bold text-text-primary">Assign Room</h2>
        
        <div class="mb-4">
          <p class="text-sm text-text-secondary mb-2">Student: {{ selectedRequest?.studentName }}</p>
          <p class="text-sm text-text-secondary">Preferred: {{ selectedRequest?.hostelPreference }}</p>
        </div>

        <div class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Hostel *</label>
            <select 
              v-model="assignmentData.hostel" 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option value="Hostel A">Hostel A</option>
              <option value="Hostel B">Hostel B</option>
              <option value="Hostel C">Hostel C</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Room Number *</label>
            <input 
              v-model="assignmentData.roomNumber" 
              type="text" 
              placeholder="e.g., 101"
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Bed Number *</label>
            <input 
              v-model="assignmentData.bedNumber" 
              type="number" 
              min="1"
              placeholder="e.g., 1"
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div class="flex gap-2 mt-6">
          <button 
            @click="closeAssignModal"
            class="flex-1 px-4 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all"
          >
            Cancel
          </button>
          <button 
            @click="handleApprove"
            class="flex-1 px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-success-dark transition-all"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}
</style>
