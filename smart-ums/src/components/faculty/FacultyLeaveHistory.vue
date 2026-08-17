<template>
  <div class="leave-history">
    <h3>Leave History</h3>
    <div v-if="leaveHistory.length === 0" class="no-leaves">
      <p>No leave history available</p>
    </div>
    <div v-else class="leave-list">
      <div v-for="leave in leaveHistory" :key="leave.id" class="leave-item">
        <div class="leave-header">
          <span class="leave-type">{{ leave.type }}</span>
          <span :class="['leave-status', `status-${leave.status}`]">
            {{ leave.status.charAt(0).toUpperCase() + leave.status.slice(1) }}
          </span>
        </div>
        <div class="leave-details">
          <div class="detail-row">
            <span class="label">Duration:</span>
            <span class="value">{{ formatDate(leave.startDate) }} - {{ formatDate(leave.endDate) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Days:</span>
            <span class="value">{{ leave.days }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Reason:</span>
            <span class="value">{{ leave.reason }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Applied:</span>
            <span class="value">{{ formatDate(leave.appliedOn) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'FacultyLeaveHistory' })

defineProps({
  leaveHistory: {
    type: Array,
    default: () => []
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}
</script>

<style scoped>
.leave-history {
  background: white;
  border: 1px solid #dfe7fb;
  border-radius: 1rem;
  padding: 1.5rem;
}

.leave-history h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #14213d;
}

.no-leaves {
  text-align: center;
  padding: 2rem;
  color: #7f8fa3;
}

.leave-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.leave-item {
  background: #f6f9ff;
  border: 1px solid #dfe7fb;
  border-radius: 0.75rem;
  padding: 1rem;
}

.leave-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #dfe7fb;
}

.leave-type {
  font-weight: 600;
  color: #14213d;
}

.leave-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-approved {
  background: #d4edda;
  color: #155724;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-rejected {
  background: #f8d7da;
  color: #721c24;
}

.leave-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  gap: 0.5rem;
}

.detail-row .label {
  font-weight: 600;
  color: #5d6d8f;
  min-width: 80px;
}

.detail-row .value {
  color: #14213d;
}
</style>
