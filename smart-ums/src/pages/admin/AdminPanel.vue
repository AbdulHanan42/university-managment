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
  <div class="admin-panel-container">
    <!-- Admin Panel Header -->
    <header class="admin-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">🛡️</div>
          <div>
            <h1>Admin Panel</h1>
            <p class="subtitle">Smart UMS Request Management</p>
          </div>
        </div>
        <div class="header-actions">
          <button @click="handleBackToUMS" class="back-button">
            ← Back to UMS
          </button>
          <div class="admin-info">
            <div class="admin-avatar">
              {{ adminStore.admin?.name?.charAt(0) || 'A' }}
            </div>
            <div class="admin-details">
              <div class="admin-name">{{ adminStore.admin?.name }}</div>
              <div class="admin-role">{{ adminStore.admin?.role }}</div>
            </div>
            <button @click="handleLogout" class="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="stats-section">
      <div class="stat-card urgent">
        <div class="stat-icon">⏰</div>
        <div class="stat-content">
          <div class="stat-value">{{ adminStore.stats.pending }}</div>
          <div class="stat-label">Pending Requests</div>
        </div>
      </div>
      <div class="stat-card success">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ adminStore.stats.approved }}</div>
          <div class="stat-label">Approved Today</div>
        </div>
      </div>
      <div class="stat-card rejected">
        <div class="stat-icon">❌</div>
        <div class="stat-content">
          <div class="stat-value">{{ adminStore.stats.rejected }}</div>
          <div class="stat-label">Rejected Today</div>
        </div>
      </div>
      <div class="stat-card total">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ adminStore.stats.total }}</div>
          <div class="stat-label">Total Requests</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search requests..." 
          class="search-input"
        />
      </div>
      <div class="filter-group">
        <select v-model="filterType" class="filter-select">
          <option value="all">All Types</option>
          <option v-for="type in requestTypes.filter(t => t !== 'all')" :key="type" :value="type">
            {{ type.replace('_', ' ').toUpperCase() }}
          </option>
        </select>
      </div>
    </div>

    <!-- Requests List -->
    <div class="requests-section">
      <div v-if="adminStore.loading" class="loading-state">
        <p>Loading requests...</p>
      </div>

      <div v-else-if="filteredRequests.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No Pending Requests</h3>
        <p>All requests have been processed</p>
      </div>

      <div v-else class="requests-list">
        <div 
          v-for="request in filteredRequests" 
          :key="request.id" 
          class="request-card"
        >
          <div class="request-header">
            <div class="request-type">
              <span class="type-icon">{{ getTypeIcon(request.type) }}</span>
              <span class="type-label">{{ request.type.replace('_', ' ').toUpperCase() }}</span>
            </div>
            <div class="request-date">
              {{ new Date(request.createdAt).toLocaleString() }}
            </div>
          </div>

          <div class="request-body">
            <div class="requester-info">
              <div class="requester-avatar">
                {{ request.profilePic ? '' : request.name?.charAt(0) }}
                <img v-if="request.profilePic" :src="request.profilePic" class="avatar-image" />
              </div>
              <div class="requester-details">
                <h4>{{ request.name }}</h4>
                <p>{{ request.email }}</p>
              </div>
            </div>

            <div class="request-details">
              <div v-if="request.rollNumber" class="detail-item">
                <span class="detail-label">Roll Number:</span>
                <span class="detail-value">{{ request.rollNumber }}</span>
              </div>
              <div v-if="request.department" class="detail-item">
                <span class="detail-label">Department:</span>
                <span class="detail-value">{{ request.department }}</span>
              </div>
              <div v-if="request.organization" class="detail-item">
                <span class="detail-label">Organization:</span>
                <span class="detail-value">{{ request.organization }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Role:</span>
                <span class="detail-value">{{ request.role }}</span>
              </div>
            </div>
          </div>

          <div class="request-actions">
            <button 
              @click="handleApprove(request.id)"
              class="action-button approve"
            >
              ✅ Approve
            </button>
            <button 
              @click="handleRejectClick(request)"
              class="action-button reject"
            >
              ❌ Reject
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Reject Request</h2>
        <div v-if="selectedRequest" class="request-summary">
          <p><strong>Name:</strong> {{ selectedRequest.name }}</p>
          <p><strong>Email:</strong> {{ selectedRequest.email }}</p>
          <p><strong>Type:</strong> {{ selectedRequest.type.replace('_', ' ').toUpperCase() }}</p>
        </div>
        <div class="form-group">
          <label>Rejection Reason *</label>
          <textarea 
            v-model="rejectionReason" 
            placeholder="Please provide a reason for rejection..." 
            rows="4"
          ></textarea>
        </div>
        <div class="modal-actions">
          <button @click="showRejectModal = false; selectedRequest = null; rejectionReason = ''" class="cancel-button">
            Cancel
          </button>
          <button @click="handleReject" class="reject-confirm-button">
            Reject Request
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-panel-container {
  min-height: 100vh;
  background: #f8fafc;
}

.admin-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 1.5rem 2rem;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  font-size: 2.5rem;
}

.admin-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 0.25rem 0 0 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.back-button {
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.25);
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.admin-details {
  text-align: right;
}

.admin-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.admin-role {
  font-size: 0.8rem;
  opacity: 0.8;
}

.logout-button {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.25);
}

.stats-section {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stat-card.urgent {
  border-left: 4px solid #f59e0b;
}

.stat-card.success {
  border-left: 4px solid #10b981;
}

.stat-card.rejected {
  border-left: 4px solid #ef4444;
}

.stat-card.total {
  border-left: 4px solid #3b82f6;
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.filters-section {
  max-width: 1400px;
  margin: 0 auto 2rem;
  padding: 0 2rem;
  display: flex;
  gap: 1rem;
}

.filter-group {
  flex: 1;
}

.search-input,
.filter-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
}

.requests-section {
  max-width: 1400px;
  margin: 0 auto 3rem;
  padding: 0 2rem;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}

.requests-list {
  display: grid;
  gap: 1.5rem;
}

.request-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.request-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.request-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.type-icon {
  font-size: 1.5rem;
}

.type-label {
  font-weight: 600;
  color: #1e293b;
}

.request-date {
  font-size: 0.875rem;
  color: #64748b;
}

.request-body {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.requester-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.requester-avatar {
  width: 50px;
  height: 50px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.requester-details h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  color: #1e293b;
}

.requester-details p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.request-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  flex: 1;
}

.detail-item {
  display: flex;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 600;
}

.request-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button.approve {
  background: #10b981;
  color: white;
}

.action-button.approve:hover {
  background: #059669;
}

.action-button.reject {
  background: #ef4444;
  color: white;
}

.action-button.reject:hover {
  background: #dc2626;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
}

.modal-content h2 {
  margin: 0 0 1.5rem;
  color: #1e293b;
}

.request-summary {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.request-summary p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1e293b;
}

.form-group textarea {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background: #e2e8f0;
  color: #1e293b;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background: #cbd5e1;
}

.reject-confirm-button {
  padding: 0.75rem 1.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reject-confirm-button:hover {
  background: #dc2626;
}
</style>
