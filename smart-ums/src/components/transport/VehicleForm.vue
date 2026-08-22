<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTransportStore } from '@/stores/transport.store'
import { useToast } from '@/composables/useToast'

defineOptions({ name: 'VehicleForm' })

const props = defineProps({
  vehicle: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const transportStore = useTransportStore()
const toast = useToast()

// Load routes on mount
onMounted(() => {
  transportStore.fetchRoutes()
})

const formData = ref({
  registrationNumber: '',
  model: '',
  type: 'bus',
  capacity: 45,
  driverId: '',
  driverName: '',
  driverPhone: '',
  driverPhoto: '',
  status: 'active',
  fuelType: 'diesel',
  fuelCapacity: 60,
  currentFuel: 60,
  lastMaintenance: '',
  nextMaintenance: '',
  insuranceExpiry: '',
  routeId: null,
  routeName: ''
})

const errors = ref({})
const submitting = ref(false)

// Watch for vehicle prop changes to populate form
watch(() => props.vehicle, (newVehicle) => {
  if (newVehicle) {
    formData.value = {
      registrationNumber: newVehicle.registrationNumber || '',
      model: newVehicle.model || '',
      type: newVehicle.type || 'bus',
      capacity: newVehicle.capacity || 45,
      driverId: newVehicle.driverId || '',
      driverName: newVehicle.driverName || '',
      driverPhone: newVehicle.driverPhone || '',
      driverPhoto: newVehicle.driverPhoto || '',
      status: newVehicle.status || 'active',
      fuelType: newVehicle.fuelType || 'diesel',
      fuelCapacity: newVehicle.fuelCapacity || 60,
      currentFuel: newVehicle.currentFuel || 60,
      lastMaintenance: newVehicle.lastMaintenance || '',
      nextMaintenance: newVehicle.nextMaintenance || '',
      insuranceExpiry: newVehicle.insuranceExpiry || '',
      routeId: newVehicle.routeId || null,
      routeName: newVehicle.routeName || ''
    }
  }
}, { immediate: true })

// Watch for routeId changes to update routeName
watch(() => formData.value.routeId, (newRouteId) => {
  if (newRouteId) {
    const route = transportStore.routes.find(r => r.id == newRouteId)
    if (route) {
      formData.value.routeName = route.name
    }
  } else {
    formData.value.routeName = ''
  }
})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.registrationNumber.trim()) {
    errors.value.registrationNumber = 'Registration number is required'
  }
  if (!formData.value.model.trim()) {
    errors.value.model = 'Model is required'
  }
  if (!formData.value.capacity || formData.value.capacity <= 0) {
    errors.value.capacity = 'Capacity must be greater than 0'
  }
  if (!formData.value.driverName.trim()) {
    errors.value.driverName = 'Driver name is required'
  }
  if (!formData.value.driverPhone.trim()) {
    errors.value.driverPhone = 'Driver phone is required'
  }
  if (!formData.value.fuelCapacity || formData.value.fuelCapacity <= 0) {
    errors.value.fuelCapacity = 'Fuel capacity must be greater than 0'
  }
  if (formData.value.currentFuel > formData.value.fuelCapacity) {
    errors.value.currentFuel = 'Current fuel cannot exceed fuel capacity'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please fix the errors in the form')
    return
  }

  submitting.value = true
  try {
    const submitData = {
      ...formData.value,
      driverId: formData.value.driverId || Date.now(),
      routeId: formData.value.routeId || null
    }
    
    let vehicleId = props.isEdit ? props.vehicle.id : null
    
    if (props.isEdit && props.vehicle) {
      await transportStore.updateVehicle(props.vehicle.id, submitData)
      vehicleId = props.vehicle.id
      toast.success('Vehicle updated successfully')
    } else {
      const result = await transportStore.createVehicle(submitData)
      vehicleId = result.id
      toast.success('Vehicle added successfully')
    }
    
    // Update route's vehicle assignment if route is selected
    if (submitData.routeId && vehicleId) {
      await transportStore.updateRoute(submitData.routeId, { vehicleId })
    }
    
    emit('submit')
  } catch (error) {
    toast.error(props.isEdit ? 'Failed to update vehicle' : 'Failed to add vehicle')
    console.error('Submit error:', error)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

const fuelPercentage = computed(() => {
  if (!formData.value.fuelCapacity || formData.value.fuelCapacity === 0) return 0
  return Math.round((formData.value.currentFuel / formData.value.fuelCapacity) * 100)
})
</script>

<template>
  <div class="vehicle-form">
    <div class="form-header mb-6">
      <h2 class="text-xl font-bold text-text-primary">{{ isEdit ? 'Edit Vehicle' : 'Add New Vehicle' }}</h2>
      <p class="text-sm text-text-muted">{{ isEdit ? 'Update vehicle information' : 'Register a new vehicle in the fleet' }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
            <input
              v-model="formData.registrationNumber"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.registrationNumber }"
              placeholder="e.g., BUS-001"
            />
            <p v-if="errors.registrationNumber" class="text-xs text-red-500 mt-1">{{ errors.registrationNumber }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Model *</label>
            <input
              v-model="formData.model"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.model }"
              placeholder="e.g., Toyota Coaster"
            />
            <p v-if="errors.model" class="text-xs text-red-500 mt-1">{{ errors.model }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select
              v-model="formData.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bus">Bus</option>
              <option value="van">Van</option>
              <option value="minibus">Minibus</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Capacity (seats) *</label>
            <input
              v-model.number="formData.capacity"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.capacity }"
              placeholder="e.g., 45"
            />
            <p v-if="errors.capacity" class="text-xs text-red-500 mt-1">{{ errors.capacity }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="formData.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Driver Information -->
      <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Driver Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Driver Name *</label>
            <input
              v-model="formData.driverName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.driverName }"
              placeholder="e.g., Ahmed Khan"
            />
            <p v-if="errors.driverName" class="text-xs text-red-500 mt-1">{{ errors.driverName }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Driver Phone *</label>
            <input
              v-model="formData.driverPhone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.driverPhone }"
              placeholder="e.g., +92-300-1234567"
            />
            <p v-if="errors.driverPhone" class="text-xs text-red-500 mt-1">{{ errors.driverPhone }}</p>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Driver Photo URL</label>
            <input
              v-model="formData.driverPhoto"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., https://example.com/driver-photo.jpg"
            />
          </div>
        </div>
      </div>

      <!-- Fuel Information -->
      <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Fuel Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
            <select
              v-model="formData.fuelType"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="diesel">Diesel</option>
              <option value="petrol">Petrol</option>
              <option value="cng">CNG</option>
              <option value="electric">Electric</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fuel Capacity (liters) *</label>
            <input
              v-model.number="formData.fuelCapacity"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.fuelCapacity }"
              placeholder="e.g., 60"
            />
            <p v-if="errors.fuelCapacity" class="text-xs text-red-500 mt-1">{{ errors.fuelCapacity }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Current Fuel (liters)</label>
            <input
              v-model.number="formData.currentFuel"
              type="number"
              min="0"
              :max="formData.fuelCapacity"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.currentFuel }"
              placeholder="e.g., 45"
            />
            <p v-if="errors.currentFuel" class="text-xs text-red-500 mt-1">{{ errors.currentFuel }}</p>
            <div class="mt-2">
              <div class="flex justify-between text-xs text-gray-600 mb-1">
                <span>Fuel Level</span>
                <span>{{ fuelPercentage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="h-2 rounded-full" :style="{ width: fuelPercentage + '%', backgroundColor: fuelPercentage >= 50 ? '#10b981' : fuelPercentage >= 25 ? '#f59e0b' : '#ef4444' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Maintenance Information -->
      <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Maintenance Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Maintenance Date</label>
            <input
              v-model="formData.lastMaintenance"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Next Maintenance Date</label>
            <input
              v-model="formData.nextMaintenance"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry Date</label>
            <input
              v-model="formData.insuranceExpiry"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Route Assignment -->
      <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Route Assignment</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Assign to Route</label>
            <select
              v-model="formData.routeId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="null">Not Assigned</option>
              <option v-for="route in transportStore.routes" :key="route.id" :value="route.id">
                {{ route.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          type="button"
          @click="handleCancel"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          :disabled="submitting"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          :disabled="submitting"
        >
          {{ submitting ? 'Saving...' : (isEdit ? 'Update Vehicle' : 'Add Vehicle') }}
        </button>
      </div>
    </form>
  </div>
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

.vehicle-form {
  animation: fadeIn 0.3s ease-in;
}
</style>
