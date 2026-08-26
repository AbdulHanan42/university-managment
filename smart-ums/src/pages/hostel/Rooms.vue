<script setup>
import { ref, onMounted, computed } from 'vue'
import { useHostelStore } from '@/stores/hostel.store'
import { useToast } from '@/composables/useToast'

defineOptions({ name: 'HostelRooms' })

const hostelStore = useHostelStore()
const toast = useToast()

const searchQuery = ref('')
const selectedHostel = ref('all')
const selectedFloor = ref('all')

onMounted(() => {
  hostelStore.fetchRooms()
})

const filteredRooms = computed(() => {
  let rooms = hostelStore.rooms

  if (selectedHostel.value !== 'all') {
    rooms = rooms.filter(room => room.hostel === selectedHostel.value)
  }

  if (selectedFloor.value !== 'all') {
    rooms = rooms.filter(room => room.floor === parseInt(selectedFloor.value))
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    rooms = rooms.filter(room => 
      room.number.toLowerCase().includes(query) ||
      room.hostel.toLowerCase().includes(query)
    )
  }

  return rooms
})

const hostels = computed(() => {
  const uniqueHostels = [...new Set(hostelStore.rooms.map(room => room.hostel))]
  return uniqueHostels
})

const floors = computed(() => {
  const uniqueFloors = [...new Set(hostelStore.rooms.map(room => room.floor))]
  return uniqueFloors.sort((a, b) => a - b)
})

const getOccupancyStatus = (room) => {
  const occupancy = (room.occupied / room.capacity) * 100
  if (occupancy === 100) return 'full'
  if (occupancy === 0) return 'empty'
  return 'partial'
}

const getOccupancyColor = (room) => {
  const status = getOccupancyStatus(room)
  switch (status) {
    case 'full': return 'bg-error-light text-error'
    case 'empty': return 'bg-success-light text-success'
    default: return 'bg-warning-light text-warning'
  }
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Hostel Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Rooms</h1>
        <p class="m-0 text-sm text-text-secondary">View and manage hostel rooms across all buildings.</p>
      </div>
    </header>

    <div v-if="hostelStore.loading" class="text-center py-12 text-text-muted">
      <p>Loading rooms data...</p>
    </div>

    <div v-else-if="hostelStore.error" class="text-center py-12 text-error">
      <p>{{ hostelStore.error }}</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Filters -->
      <div class="bg-bg-light border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Search</label>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search rooms..." 
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
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Floor</label>
            <select 
              v-model="selectedFloor" 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">All Floors</option>
              <option v-for="floor in floors" :key="floor" :value="floor">Floor {{ floor }}</option>
            </select>
          </div>
          <div class="flex items-end">
            <button 
              @click="hostelStore.fetchRooms()" 
              class="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-primary-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-primary mb-1">{{ hostelStore.rooms.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Total Rooms</div>
        </div>
        <div class="bg-success-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-success mb-1">{{ hostelStore.rooms.filter(r => r.occupied === 0).length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Available</div>
        </div>
        <div class="bg-warning-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-warning mb-1">{{ hostelStore.rooms.filter(r => r.occupied > 0 && r.occupied < r.capacity).length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Partial</div>
        </div>
        <div class="bg-error-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-error mb-1">{{ hostelStore.rooms.filter(r => r.occupied === r.capacity).length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Full</div>
        </div>
      </div>

      <!-- Rooms Grid -->
      <div v-if="filteredRooms.length === 0" class="text-center py-12 text-text-muted">
        <p>No rooms found matching your criteria.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="room in filteredRooms" 
          :key="room.id" 
          class="bg-bg-white border border-border rounded-lg p-4 hover:border-primary transition-all"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-bold text-text-primary">Room {{ room.number }}</h3>
              <p class="text-sm text-text-secondary">{{ room.hostel }} - Floor {{ room.floor }}</p>
            </div>
            <span :class="getOccupancyColor(room)" class="px-2 py-1 rounded text-xs font-semibold">
              {{ room.occupied }}/{{ room.capacity }}
            </span>
          </div>
          <div class="bg-bg-light rounded-lg p-3">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-text-secondary">Capacity:</span>
              <span class="text-text-primary font-semibold">{{ room.capacity }} beds</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Occupied:</span>
              <span class="text-text-primary font-semibold">{{ room.occupied }} beds</span>
            </div>
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
