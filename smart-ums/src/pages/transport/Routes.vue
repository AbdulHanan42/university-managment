<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTransportStore } from '@/stores/transport.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'

defineOptions({ name: 'Routes' })

const transportStore = useTransportStore()
const toast = useToast()

const showAddModal = ref(false)
const selectedRoute = ref(null)

const occupancyPercentage = computed(() => (route) => {
  if (!route || route.capacity === 0) return 0
  return Math.round((route.currentOccupancy / route.capacity) * 100)
})

const occupancyColor = computed(() => (percentage) => {
  if (percentage >= 90) return 'var(--color-error)'
  if (percentage >= 70) return 'var(--color-warning)'
  return 'var(--color-success)'
})

onMounted(() => {
  transportStore.fetchRoutes()
})

const handleAddRoute = () => {
  selectedRoute.value = null
  showAddModal.value = true
}

const handleEditRoute = (route) => {
  selectedRoute.value = route
  showAddModal.value = true
}

const handleDeleteRoute = async (id) => {
  if (confirm('Are you sure you want to delete this route?')) {
    try {
      await transportStore.deleteRoute(id)
      toast.success('Route deleted successfully')
    } catch (error) {
      toast.error('Failed to delete route')
      console.error('Delete error:', error)
    }
  }
}
</script>

<template>
  <div class="routes-container">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-text-primary">Transport Routes</h2>
      <AppButton @click="handleAddRoute">+ Add Route</AppButton>
    </div>

    <!-- Routes Grid -->
    <div v-if="transportStore.routes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="route in transportStore.routes" :key="route.id" class="bg-white border border-border rounded-lg p-5 hover:shadow-lg transition-shadow">
        <!-- Route Header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-bold text-text-primary text-lg">{{ route.name }}</h3>
            <p class="text-sm text-text-muted">{{ route.code }}</p>
          </div>
          <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold" :class="route.status === 'active' ? 'bg-success-bg text-success' : 'bg-error-bg text-error'">
            {{ route.status }}
          </span>
        </div>

        <!-- Route Details -->
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-text-muted">📍</span>
            <span class="text-text-primary">{{ route.startPoint }} → {{ route.endPoint }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-text-muted">📏</span>
            <span class="text-text-primary">{{ route.distance }} km • {{ route.estimatedTime }} min</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-text-muted">💰</span>
            <span class="text-text-primary font-semibold">{{ route.fee }} PKR/month</span>
          </div>
        </div>

        <!-- Schedule -->
        <div class="bg-bg-light rounded-lg p-3 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-text-muted">Morning: {{ route.morningSchedule }}</span>
            <span class="text-text-muted">Evening: {{ route.eveningSchedule }}</span>
          </div>
        </div>

        <!-- Occupancy -->
        <div class="mb-4">
          <div class="flex justify-between text-sm mb-1">
            <span class="text-text-primary">Occupancy</span>
            <span class="font-semibold" :style="{ color: occupancyColor(occupancyPercentage(route)) }">
              {{ route.currentOccupancy }}/{{ route.capacity }}
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="h-2 rounded-full transition-all" :style="{ width: occupancyPercentage(route) + '%', backgroundColor: occupancyColor(occupancyPercentage(route)) }"></div>
          </div>
          <p class="text-xs text-text-muted mt-1">{{ occupancyPercentage(route) }}% capacity</p>
        </div>

        <!-- Stops -->
        <div class="mb-4">
          <p class="text-sm font-semibold text-text-primary mb-2">Stops:</p>
          <div class="flex flex-wrap gap-1">
            <span v-for="(stop, index) in route.stops.slice(0, 4)" :key="index" class="inline-block bg-primary-light text-primary px-2 py-1 rounded text-xs">
              {{ stop }}
            </span>
            <span v-if="route.stops.length > 4" class="inline-block bg-bg-light text-text-muted px-2 py-1 rounded text-xs">
              +{{ route.stops.length - 4 }} more
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-3 border-t border-border">
          <button @click="handleEditRoute(route)" class="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
            Edit
          </button>
          <button @click="handleDeleteRoute(route.id)" class="px-3 py-2 bg-error text-white rounded-lg text-sm font-semibold hover:bg-error-dark transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-text-muted">
      <p>No routes found. Add your first route to get started.</p>
    </div>
  </div>
</template>

<style scoped>
.routes-container {
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
