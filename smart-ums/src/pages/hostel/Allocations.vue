<script setup>
import { ref, onMounted, computed } from 'vue'
import { useHostelStore } from '@/stores/hostel.store'
import { useToast } from '@/composables/useToast'

defineOptions({ name: 'HostelAllocations' })

const hostelStore = useHostelStore()
const toast = useToast()

const searchQuery = ref('')
const selectedHostel = ref('all')

onMounted(() => {
  hostelStore.fetchAllocations()
})

const filteredAllocations = computed(() => {
  let allocations = hostelStore.allocations

  if (selectedHostel.value !== 'all') {
    allocations = allocations.filter(allocation => allocation.hostel === selectedHostel.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    allocations = allocations.filter(allocation => 
      allocation.studentName.toLowerCase().includes(query) ||
      allocation.studentId.toLowerCase().includes(query) ||
      allocation.roomNumber.toLowerCase().includes(query)
    )
  }

  return allocations
})

const hostels = computed(() => {
  const uniqueHostels = [...new Set(hostelStore.allocations.map(allocation => allocation.hostel))]
  return uniqueHostels
})

const handleDeleteAllocation = (id) => {
  toast.success('Allocation removed successfully')
  // In a real app, you would call an API to delete the allocation
  hostelStore.allocations = hostelStore.allocations.filter(a => a.id !== id)
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Hostel Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Allocations</h1>
        <p class="m-0 text-sm text-text-secondary">Manage student room allocations across all hostels.</p>
      </div>
      <button class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all">
        + New Allocation
      </button>
    </header>

    <div v-if="hostelStore.loading" class="text-center py-12 text-text-muted">
      <p>Loading allocations data...</p>
    </div>

    <div v-else-if="hostelStore.error" class="text-center py-12 text-error">
      <p>{{ hostelStore.error }}</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Filters -->
      <div class="bg-bg-light border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Search</label>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search students..." 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Hostel</label>
            <select 
              v-model="selectedHostel" 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">All Hostels</option>
              <option v-for="hostel in hostels" :key="hostel" :value="hostel">{{ hostel }}</option>
            </select>
          </div>
          <div class="flex items-end">
            <button 
              @click="hostelStore.fetchAllocations()" 
              class="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-primary-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-primary mb-1">{{ hostelStore.allocations.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Total Allocations</div>
        </div>
        <div class="bg-secondary-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-secondary mb-1">{{ hostels.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Hostels Used</div>
        </div>
        <div class="bg-success-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-success mb-1">{{ new Set(hostelStore.allocations.map(a => a.roomNumber)).size }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Rooms Occupied</div>
        </div>
      </div>

      <!-- Allocations Table -->
      <div v-if="filteredAllocations.length === 0" class="text-center py-12 text-text-muted">
        <p>No allocations found matching your criteria.</p>
      </div>

      <div v-else class="bg-bg-white border border-border rounded-xl overflow-hidden">
        <table class="w-full">
          <thead class="bg-bg-light">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Student ID</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Student Name</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Room</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Hostel</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Bed</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="allocation in filteredAllocations" 
              :key="allocation.id" 
              class="border-b border-border-light hover:bg-bg-light transition-all"
            >
              <td class="px-4 py-3 text-sm text-text-primary font-mono">{{ allocation.studentId }}</td>
              <td class="px-4 py-3 text-sm text-text-primary font-semibold">{{ allocation.studentName }}</td>
              <td class="px-4 py-3 text-sm text-text-primary">{{ allocation.roomNumber }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ allocation.hostel }}</td>
              <td class="px-4 py-3 text-sm text-text-primary">{{ allocation.bedNumber }}</td>
              <td class="px-4 py-3 text-sm">
                <button 
                  @click="handleDeleteAllocation(allocation.id)"
                  class="text-error hover:text-error-dark font-medium"
                >
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
