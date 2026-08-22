<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTransportStore } from '@/stores/transport.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'

defineOptions({ name: 'Vehicles' })

const transportStore = useTransportStore()
const toast = useToast()

const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedVehicle = ref(null)
const loading = ref(false)

const fuelPercentage = computed(() => (vehicle) => {
  if (!vehicle || vehicle.fuelCapacity === 0) return 0
  return Math.round((vehicle.currentFuel / vehicle.fuelCapacity) * 100)
})

const fuelColor = computed(() => (percentage) => {
  if (percentage >= 50) return 'var(--color-success)'
  if (percentage >= 25) return 'var(--color-warning)'
  return 'var(--color-error)'
})

onMounted(() => {
  transportStore.fetchVehicles()
})

const handleAddVehicle = () => {
  selectedVehicle.value = null
  showAddModal.value = true
}

const handleEditVehicle = (vehicle) => {
  selectedVehicle.value = vehicle
  showEditModal.value = true
}

const handleDeleteVehicle = async (id) => {
  if (confirm('Are you sure you want to delete this vehicle?')) {
    try {
      await transportStore.deleteVehicle(id)
      toast.success('Vehicle deleted successfully')
    } catch (error) {
      toast.error('Failed to delete vehicle')
      console.error('Delete error:', error)
    }
  }
}

const handleMaintenance = (vehicle) => {
  toast.info(`Maintenance scheduled for ${vehicle.registrationNumber}`)
}
</script>

<template>
  <div class="vehicles-container">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-text-primary">Vehicle Fleet</h2>
      <AppButton @click="handleAddVehicle">+ Add Vehicle</AppButton>
    </div>

    <!-- Vehicle Table -->
    <div v-if="transportStore.vehicles.length > 0" class="overflow-x-auto">
      <table class="w-full border-collapse bg-white rounded-lg overflow-hidden">
        <thead class="bg-bg-light">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Registration</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Model</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Type</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Driver</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Capacity</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Fuel</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Status</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Route</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-text-primary">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vehicle in transportStore.vehicles" :key="vehicle.id" class="border-t border-border hover:bg-bg-light">
            <td class="px-4 py-3">
              <span class="font-semibold text-primary">{{ vehicle.registrationNumber }}</span>
            </td>
            <td class="px-4 py-3 text-text-primary">{{ vehicle.model }}</td>
            <td class="px-4 py-3">
              <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold" :class="vehicle.type === 'bus' ? 'bg-primary-light text-primary' : 'bg-secondary-light text-secondary'">
                {{ vehicle.type }}
              </span>
            </td>
            <td class="px-4 py-3 text-text-primary">{{ vehicle.driverName }}</td>
            <td class="px-4 py-3 text-text-primary">{{ vehicle.capacity }} seats</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <div class="w-16 bg-gray-200 rounded-full h-2">
                  <div class="h-2 rounded-full" :style="{ width: fuelPercentage(vehicle) + '%', backgroundColor: fuelColor(fuelPercentage(vehicle)) }"></div>
                </div>
                <span class="text-sm text-text-muted">{{ fuelPercentage(vehicle) }}%</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="inline-block px-2 py-1 rounded-full text-xs font-semibold" :class="vehicle.status === 'active' ? 'bg-success-bg text-success' : vehicle.status === 'maintenance' ? 'bg-warning-bg text-warning' : 'bg-error-bg text-error'">
                {{ vehicle.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-text-primary">{{ vehicle.routeName || 'Not assigned' }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button @click="handleEditVehicle(vehicle)" class="text-primary hover:text-primary-dark" title="Edit">✎</button>
                <button @click="handleMaintenance(vehicle)" class="text-secondary hover:text-secondary-dark" title="Maintenance">🔧</button>
                <button @click="handleDeleteVehicle(vehicle.id)" class="text-error hover:text-error-dark" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center py-12 text-text-muted">
      <p>No vehicles found. Add your first vehicle to get started.</p>
    </div>
  </div>
</template>

<style scoped>
.vehicles-container {
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
