<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTransportStore } from '@/stores/transport.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'

defineOptions({ name: 'Drivers' })

const transportStore = useTransportStore()
const toast = useToast()

const drivers = computed(() => {
  // Extract unique drivers from vehicles
  const driverMap = new Map()
  transportStore.vehicles.forEach(vehicle => {
    if (vehicle.driverId && vehicle.driverName) {
      driverMap.set(vehicle.driverId, {
        id: vehicle.driverId,
        name: vehicle.driverName,
        phone: vehicle.driverPhone,
        photo: vehicle.driverPhoto,
        vehicle: vehicle.registrationNumber,
        route: vehicle.routeName,
        status: vehicle.status,
        vehicleId: vehicle.id
      })
    }
  })
  return Array.from(driverMap.values())
})

onMounted(() => {
  transportStore.fetchVehicles()
})

const handleContactDriver = (driver) => {
  toast.info(`Contacting ${driver.name} at ${driver.phone}`)
}

const handleViewSchedule = (driver) => {
  toast.info(`Viewing schedule for ${driver.name}`)
}
</script>

<template>
  <div class="drivers-container">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-text-primary">Transport Drivers</h2>
      <AppButton>+ Add Driver</AppButton>
    </div>

    <!-- Drivers Grid -->
    <div v-if="drivers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="driver in drivers" :key="driver.id" class="bg-white border border-border rounded-lg p-5 hover:shadow-lg transition-shadow">
        <!-- Driver Header -->
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-border">
            <img 
              v-if="driver.photo" 
              :src="driver.photo" 
              :alt="driver.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
              {{ driver.name.charAt(0) }}
            </div>
          </div>
          <div>
            <h3 class="font-bold text-text-primary text-lg">{{ driver.name }}</h3>
            <p class="text-sm text-text-muted">{{ driver.phone }}</p>
          </div>
        </div>

        <!-- Driver Details -->
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-text-muted">🚌</span>
            <span class="text-text-primary font-semibold">{{ driver.vehicle }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-text-muted">📍</span>
            <span class="text-text-primary">{{ driver.route || 'Not assigned' }}</span>
          </div>
        </div>

        <!-- Status -->
        <div class="mb-4">
          <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold" :class="driver.status === 'active' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'">
            {{ driver.status === 'active' ? 'On Duty' : 'Off Duty' }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-3 border-t border-border">
          <button @click="handleContactDriver(driver)" class="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
            Contact
          </button>
          <button @click="handleViewSchedule(driver)" class="flex-1 px-3 py-2 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-secondary-dark transition-colors">
            Schedule
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-text-muted">
      <p>No drivers found. Add vehicles with drivers to get started.</p>
    </div>
  </div>
</template>

<style scoped>
.drivers-container {
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
