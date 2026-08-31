<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

defineOptions({ name: 'UserApproval' })

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const searchQuery = ref('')
const filterRole = ref('all')
const showRejectModal = ref(false)
const selectedUser = ref(null)
const rejectionReason = ref('')

onMounted(() => {
  authStore.fetchPendingUsers()
})

const filteredUsers = computed(() => {
  let users = authStore.pendingUsers

  if (filterRole.value !== 'all') {
    users = users.filter(u => u.role === filterRole.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    users = users.filter(u => 
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(query))
    )
  }

  return users
})

const roleOptions = computed(() => {
  const roles = new Set(authStore.pendingUsers.map(u => u.role))
  return ['all', ...Array.from(roles)]
})

const handleApprove = async (userId) => {
  try {
    await authStore.approveUser(userId)
    toast.success('User approved successfully')
  } catch (error) {
    toast.error('Failed to approve user')
  }
}

const handleRejectClick = (user) => {
  selectedUser.value = user
  rejectionReason.value = ''
  showRejectModal.value = true
}

const handleReject = async () => {
  if (!rejectionReason.value.trim()) {
    toast.error('Please provide a rejection reason')
    return
  }

  try {
    await authStore.rejectUser(selectedUser.value.id, rejectionReason.value)
    toast.success('User rejected successfully')
    showRejectModal.value = false
    selectedUser.value = null
    rejectionReason.value = ''
  } catch (error) {
    toast.error('Failed to reject user')
  }
}

const handleBack = () => {
  router.push({ name: 'dashboard' })
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-success-light text-success'
    case 'pending': return 'bg-warning-light text-warning'
    case 'rejected': return 'bg-error-light text-error'
    case 'inactive': return 'bg-bg-light text-text-muted'
    default: return 'bg-bg-light text-text-muted'
  }
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">User Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">User Approval</h1>
        <p class="m-0 text-sm text-text-secondary">Review and approve pending user registrations.</p>
      </div>
      <button @click="handleBack" class="px-4 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all">
        Back to Dashboard
      </button>
    </header>

    <div v-if="authStore.loading" class="text-center py-12 text-text-muted">
      <p>Loading pending users...</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-warning-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-warning mb-1">{{ authStore.pendingUsers.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Pending Approvals</div>
        </div>
        <div class="bg-success-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-success mb-1">{{ authStore.allUsers.filter(u => u.status === 'active').length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Active Users</div>
        </div>
        <div class="bg-error-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-error mb-1">{{ authStore.allUsers.filter(u => u.status === 'rejected').length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Rejected Users</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-bg-light border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Search</label>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search by name, email, or roll number..." 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Role</label>
            <select 
              v-model="filterRole" 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option v-for="role in roleOptions" :key="role" :value="role">
                {{ role === 'all' ? 'All Roles' : role }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Pending Users List -->
      <div v-if="filteredUsers.length === 0" class="text-center py-12 text-text-muted">
        <p>No pending users found matching your criteria.</p>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="user in filteredUsers" 
          :key="user.id" 
          class="bg-bg-light border border-border rounded-xl p-5 hover:border-primary transition-all"
        >
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Profile Section -->
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-2xl">
                {{ user.profilePic ? '' : user.name.charAt(0) }}
                <img v-if="user.profilePic" :src="user.profilePic" class="w-full h-full rounded-full object-cover" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-text-primary">{{ user.name }}</h3>
                <p class="text-sm text-text-secondary">{{ user.email }}</p>
                <div class="flex gap-2 mt-2">
                  <span class="bg-secondary-light text-secondary px-2 py-1 rounded text-xs font-semibold">{{ user.role }}</span>
                  <span class="bg-bg-white text-text-secondary px-2 py-1 rounded text-xs">{{ user.organization }}</span>
                </div>
              </div>
            </div>

            <!-- Details Section -->
            <div class="flex-1 grid grid-cols-2 gap-4 text-sm">
              <div v-if="user.rollNumber">
                <div class="text-text-muted">Roll Number</div>
                <div class="font-semibold text-text-primary">{{ user.rollNumber }}</div>
              </div>
              <div v-if="user.department">
                <div class="text-text-muted">Department</div>
                <div class="font-semibold text-text-primary">{{ user.department }}</div>
              </div>
              <div v-if="user.phone">
                <div class="text-text-muted">Phone</div>
                <div class="font-semibold text-text-primary">{{ user.phone }}</div>
              </div>
              <div>
                <div class="text-text-muted">Registered On</div>
                <div class="font-semibold text-text-primary">{{ new Date(user.createdAt).toLocaleDateString() }}</div>
              </div>
            </div>

            <!-- Actions Section -->
            <div class="flex gap-2 items-start">
              <button 
                @click="handleApprove(user.id)"
                class="flex-1 px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-success-dark transition-all"
              >
                Approve
              </button>
              <button 
                @click="handleRejectClick(user)"
                class="flex-1 px-4 py-2 bg-error text-white rounded-lg font-medium hover:bg-error-dark transition-all"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-bg-white border border-border rounded-xl p-6 max-w-md w-full">
        <h2 class="mb-4 text-xl font-bold text-text-primary">Reject User Registration</h2>
        
        <div v-if="selectedUser" class="mb-4 p-3 bg-bg-light rounded-lg">
          <div class="font-semibold text-text-primary">{{ selectedUser.name }}</div>
          <div class="text-sm text-text-secondary">{{ selectedUser.email }}</div>
        </div>

        <div class="flex flex-col gap-4 mb-6">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Rejection Reason *</label>
            <textarea 
              v-model="rejectionReason" 
              placeholder="Please provide a reason for rejection..." 
              rows="3"
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            ></textarea>
          </div>
        </div>

        <div class="flex gap-3 justify-end">
          <button @click="showRejectModal = false; selectedUser = null; rejectionReason = ''" class="px-4 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all">
            Cancel
          </button>
          <button 
            @click="handleReject"
            class="px-4 py-2 bg-error text-white rounded-lg font-medium hover:bg-error-dark transition-all"
          >
            Reject User
          </button>
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
