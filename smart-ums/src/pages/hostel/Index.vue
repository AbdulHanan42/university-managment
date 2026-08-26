<script setup>
import { ref, onMounted } from 'vue'
import { useHostelStore } from '@/stores/hostel.store'
import { useRouter } from 'vue-router'

defineOptions({ name: 'HostelIndex' })

const router = useRouter()
const hostelStore = useHostelStore()

const viewMode = ref('overview') // 'overview', 'rooms', 'allocations', 'mess'

onMounted(() => {
  hostelStore.fetchHostelData()
})

const handleViewRooms = () => {
  router.push({ name: 'hostel-rooms' })
}

const handleViewAllocations = () => {
  router.push({ name: 'hostel-allocations' })
}

const handleViewMess = () => {
  router.push({ name: 'hostel-mess' })
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Hostel Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Hostel</h1>
        <p class="m-0 text-sm text-text-secondary">Manage rooms, occupancy, and mess services with real-time visibility.</p>
      </div>
    </header>

    <div v-if="hostelStore.loading" class="text-center py-12 text-text-muted">
      <p>Loading hostel data...</p>
    </div>

    <div v-else-if="hostelStore.error" class="text-center py-12 text-error">
      <p>{{ hostelStore.error }}</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <article v-for="card in hostelStore.summaryCards" :key="card.title" class="bg-primary-light rounded-xl p-5 border border-border transition-all hover:bg-primary">
          <h2 class="mb-2 text-sm text-text-secondary font-semibold">{{ card.title }}</h2>
          <p class="mb-1 text-3xl font-bold text-text-primary">{{ card.value }}</p>
          <span class="text-xs text-text-muted">{{ card.subtitle }}</span>
        </article>
      </div>

      <!-- Quick Actions -->
      <div class="bg-bg-light border border-border rounded-xl p-6">
        <h2 class="mb-4 text-lg font-bold text-text-primary">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button @click="handleViewRooms" class="bg-bg-white border border-border rounded-lg p-4 text-left hover:border-primary transition-all">
            <div class="text-2xl mb-2">🏠</div>
            <div class="font-semibold text-text-primary">Rooms</div>
            <div class="text-sm text-text-muted">View and manage hostel rooms</div>
          </button>
          <button @click="handleViewAllocations" class="bg-bg-white border border-border rounded-lg p-4 text-left hover:border-primary transition-all">
            <div class="text-2xl mb-2">👥</div>
            <div class="font-semibold text-text-primary">Allocations</div>
            <div class="text-sm text-text-muted">Manage student room allocations</div>
          </button>
          <button @click="handleViewMess" class="bg-bg-white border border-border rounded-lg p-4 text-left hover:border-primary transition-all">
            <div class="text-2xl mb-2">🍽️</div>
            <div class="font-semibold text-text-primary">Mess Service</div>
            <div class="text-sm text-text-muted">Manage mess and meal services</div>
          </button>
        </div>
      </div>

      <!-- Statistics Overview -->
      <div v-if="hostelStore.statistics" class="bg-bg-light border border-border rounded-xl p-6">
        <h2 class="mb-4 text-lg font-bold text-text-primary">Occupancy Overview</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-bg-white border border-border rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-primary mb-1">{{ hostelStore.statistics.totalHostels }}</div>
            <div class="text-xs text-text-secondary uppercase tracking-wider">Total Hostels</div>
          </div>
          <div class="bg-bg-white border border-border rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-secondary mb-1">{{ hostelStore.statistics.totalRooms }}</div>
            <div class="text-xs text-text-secondary uppercase tracking-wider">Total Rooms</div>
          </div>
          <div class="bg-bg-white border border-border rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-success mb-1">{{ hostelStore.statistics.totalBeds }}</div>
            <div class="text-xs text-text-secondary uppercase tracking-wider">Total Beds</div>
          </div>
          <div class="bg-bg-white border border-border rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-warning mb-1">{{ hostelStore.statistics.occupancyRate }}%</div>
            <div class="text-xs text-text-secondary uppercase tracking-wider">Occupancy Rate</div>
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
