<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTransportStore } from '@/stores/transport.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'
import VehicleForm from '@/components/transport/VehicleForm.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

defineOptions({ name: 'Vehicles' })

const transportStore = useTransportStore()
const toast = useToast()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showMaintenanceModal = ref(false)
const showDeleteModal = ref(false)
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
  transportStore.fetchRoutes()
})

const handleAddVehicle = () => {
  selectedVehicle.value = null
  showAddModal.value = true
}

const handleEditVehicle = (vehicle) => {
  selectedVehicle.value = vehicle
  showEditModal.value = true
}

const handleDeleteVehicle = (vehicle) => {
  selectedVehicle.value = vehicle
  showDeleteModal.value = true
}

const handleConfirmDelete = async () => {
  try {
    await transportStore.deleteVehicle(selectedVehicle.value.id)
    toast.success('Vehicle deleted successfully')
    showDeleteModal.value = false
    selectedVehicle.value = null
  } catch (error) {
    toast.error('Failed to delete vehicle')
    console.error('Delete error:', error)
  }
}

const handleMaintenance = (vehicle) => {
  selectedVehicle.value = vehicle
  showMaintenanceModal.value = true
}

const handleFormSubmit = () => {
  showAddModal.value = false
  showEditModal.value = false
  selectedVehicle.value = null
}

const handleFormCancel = () => {
  showAddModal.value = false
  showEditModal.value = false
  showMaintenanceModal.value = false
  showDeleteModal.value = false
  selectedVehicle.value = null
}

const handleMaintenanceSubmit = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    await transportStore.updateVehicle(selectedVehicle.value.id, {
      lastMaintenance: today,
      status: 'active'
    })
    toast.success('Maintenance recorded successfully')
    showMaintenanceModal.value = false
    selectedVehicle.value = null
  } catch (error) {
    toast.error('Failed to record maintenance')
    console.error('Maintenance error:', error)
  }
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
                <button @click="handleDeleteVehicle(vehicle)" class="text-error hover:text-error-dark" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center py-12 text-text-muted">
      <p>No vehicles found. Add your first vehicle to get started.</p>
    </div>

    <!-- Add Vehicle Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" @click.self="handleFormCancel">
      <div class="bg-white rounded-xl max-w-3xl w-[90%] max-h-[90vh] overflow-y-auto p-8 animate-slide-up shadow-2xl">
        <VehicleForm
          :is-edit="false"
          @submit="handleFormSubmit"
          @cancel="handleFormCancel"
        />
      </div>
    </div>

    <!-- Edit Vehicle Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" @click.self="handleFormCancel">
      <div class="bg-white rounded-xl max-w-3xl w-[90%] max-h-[90vh] overflow-y-auto p-8 animate-slide-up shadow-2xl">
        <VehicleForm
          :vehicle="selectedVehicle"
          :is-edit="true"
          @submit="handleFormSubmit"
          @cancel="handleFormCancel"
        />
      </div>
    </div>

    <!-- Maintenance Modal -->
    <div v-if="showMaintenanceModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" @click.self="handleFormCancel">
      <div class="bg-white rounded-xl max-w-md w-[90%] p-8 animate-slide-up shadow-2xl">
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900">Record Maintenance</h2>
          <p class="text-sm text-gray-600">Record maintenance for {{ selectedVehicle?.registrationNumber }}</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
            <input
              :value="selectedVehicle?.registrationNumber + ' - ' + selectedVehicle?.model"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Driver</label>
            <input
              :value="selectedVehicle?.driverName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Maintenance</label>
            <input
              :value="selectedVehicle?.lastMaintenance || 'No previous maintenance recorded'"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              disabled
            />
          </div>
          <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              @click="handleFormCancel"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleMaintenanceSubmit"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Record Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Vehicle"
      :message="`Are you sure you want to delete vehicle ${selectedVehicle?.registrationNumber}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="handleConfirmDelete"
      @cancel="handleFormCancel"
    />
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-in;
}

.vehicles-container {
  animation: fadeIn 0.3s ease-in;
}
</style>
