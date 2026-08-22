<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTransportStore } from '@/stores/transport.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'

defineOptions({ name: 'StudentTransport' })

const transportStore = useTransportStore()
const toast = useToast()

const showAddModal = ref(false)
const selectedAssignment = ref(null)
const filterStatus = ref('all')

const filteredAssignments = computed(() => {
  if (filterStatus.value === 'all') return transportStore.assignments
  return transportStore.assignments.filter(a => a.status === filterStatus.value)
})

const feeStatusColor = computed(() => (status) => {
  switch (status) {
    case 'paid': return 'bg-success-bg text-success'
    case 'pending': return 'bg-warning-bg text-warning'
    case 'overdue': return 'bg-error-bg text-error'
    default: return 'bg-bg-light text-text-muted'
  }
})

const statusColor = computed(() => (status) => {
  switch (status) {
    case 'active': return 'bg-success-bg text-success'
    case 'suspended': return 'bg-error-bg text-error'
    case 'inactive': return 'bg-bg-light text-text-muted'
    default: return 'bg-bg-light text-text-muted'
  }
})

onMounted(() => {
  transportStore.fetchAssignments()
})

const handleAddAssignment = () => {
  selectedAssignment.value = null
  showAddModal.value = true
}

const handleEditAssignment = (assignment) => {
  selectedAssignment.value = assignment
  showAddModal.value = true
}

const handleDeleteAssignment = async (id) => {
  if (confirm('Are you sure you want to delete this assignment?')) {
    try {
      await transportStore.deleteAssignment(id)
      toast.success('Assignment deleted successfully')
    } catch (error) {
      toast.error('Failed to delete assignment')
      console.error('Delete error:', error)
    }
  }
}

const handleMarkPaid = async (assignment) => {
  try {
    await transportStore.updateAssignment(assignment.id, { feeStatus: 'paid', status: 'active' })
    toast.success('Fee marked as paid')
  } catch (error) {
    toast.error('Failed to update fee status')
    console.error('Update error:', error)
  }
}
</script>

<template>
  <div class="assignments-container">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-text-primary">Student Transport Assignments</h2>
      <div class="flex gap-3">
        <select v-model="filterStatus" class="px-3 py-2 border border-border rounded-lg text-sm">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
        <AppButton @click="handleAddAssignment">+ Add Assignment</AppButton>
      </div>
    </div>

    <!-- Assignment Table -->
    <div v-if="filteredAssignments.length > 0" class="overflow-x-auto">
      <table class="w-full border-collapse bg-white rounded-lg overflow-hidden">
        <thead class="bg-bg-light">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Student</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Roll No</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Route</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Pickup</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Drop</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Fee</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Fee Status</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Pass</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Status</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="assignment in filteredAssignments" :key="assignment.id" class="border-t border-border hover:bg-bg-light">
            <td class="px-4 py-3">
              <span class="font-semibold text-text-primary">{{ assignment.studentName }}</span>
            </td>
            <td class="px-4 py-3 text-text-muted">{{ assignment.studentRollNo }}</td>
            <td class="px-4 py-3 text-primary font-semibold">{{ assignment.routeName }}</td>
            <td class="px-4 py-3 text-text-primary">{{ assignment.pickupPoint }}</td>
            <td class="px-4 py-3 text-text-primary">{{ assignment.dropPoint }}</td>
            <td class="px-4 py-3 font-semibold text-text-primary">{{ assignment.fee }} PKR</td>
            <td class="px-4 py-3">
              <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold" :class="feeStatusColor(assignment.feeStatus)">
                {{ assignment.feeStatus }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="text-sm">
                <p class="font-semibold text-primary">{{ assignment.passNumber }}</p>
                <p class="text-xs text-text-muted">Exp: {{ assignment.passExpiry }}</p>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold" :class="statusColor(assignment.status)">
                {{ assignment.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button @click="handleEditAssignment(assignment)" class="text-primary hover:text-primary-dark" title="Edit">✎</button>
                <button v-if="assignment.feeStatus !== 'paid'" @click="handleMarkPaid(assignment)" class="text-success hover:text-success-dark" title="Mark Paid">💰</button>
                <button @click="handleDeleteAssignment(assignment.id)" class="text-error hover:text-error-dark" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center py-12 text-text-muted">
      <p>No assignments found. Add your first student assignment to get started.</p>
    </div>
  </div>
</template>

<style scoped>
.assignments-container {
  animation: fadeIn 0.3s ease-in;
}

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
</style>
