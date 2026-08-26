<script setup>
import { ref, onMounted, computed } from 'vue'
import { useHostelStore } from '@/stores/hostel.store'
import { useToast } from '@/composables/useToast'

defineOptions({ name: 'HostelMess' })

const hostelStore = useHostelStore()
const toast = useToast()

const selectedHostel = ref('all')
const selectedMeal = ref('all')

onMounted(() => {
  hostelStore.fetchHostelData()
})

// Simulated mess data
const messData = ref([
  { id: 1, hostel: 'Hostel A', meal: 'Breakfast', time: '7:00 AM - 9:00 AM', compliance: 98, students: 250 },
  { id: 2, hostel: 'Hostel A', meal: 'Lunch', time: '12:00 PM - 2:00 PM', compliance: 95, students: 245 },
  { id: 3, hostel: 'Hostel A', meal: 'Dinner', time: '7:00 PM - 9:00 PM', compliance: 92, students: 248 },
  { id: 4, hostel: 'Hostel B', meal: 'Breakfast', time: '7:00 AM - 9:00 AM', compliance: 96, students: 180 },
  { id: 5, hostel: 'Hostel B', meal: 'Lunch', time: '12:00 PM - 2:00 PM', compliance: 94, students: 175 },
  { id: 6, hostel: 'Hostel B', meal: 'Dinner', time: '7:00 PM - 9:00 PM', compliance: 91, students: 178 },
  { id: 7, hostel: 'Hostel C', meal: 'Breakfast', time: '7:00 AM - 9:00 AM', compliance: 97, students: 150 },
  { id: 8, hostel: 'Hostel C', meal: 'Lunch', time: '12:00 PM - 2:00 PM', compliance: 93, students: 148 },
  { id: 9, hostel: 'Hostel C', meal: 'Dinner', time: '7:00 PM - 9:00 PM', compliance: 90, students: 145 },
])

const filteredMessData = computed(() => {
  let data = messData.value

  if (selectedHostel.value !== 'all') {
    data = data.filter(item => item.hostel === selectedHostel.value)
  }

  if (selectedMeal.value !== 'all') {
    data = data.filter(item => item.meal === selectedMeal.value)
  }

  return data
})

const hostels = computed(() => {
  const uniqueHostels = [...new Set(messData.value.map(item => item.hostel))]
  return uniqueHostels
})

const meals = computed(() => {
  const uniqueMeals = [...new Set(messData.value.map(item => item.meal))]
  return uniqueMeals
})

const averageCompliance = computed(() => {
  if (filteredMessData.value.length === 0) return 0
  const total = filteredMessData.value.reduce((sum, item) => sum + item.compliance, 0)
  return Math.round(total / filteredMessData.value.length)
})

const totalStudents = computed(() => {
  if (filteredMessData.value.length === 0) return 0
  return filteredMessData.value.reduce((sum, item) => sum + item.students, 0)
})

const getComplianceColor = (compliance) => {
  if (compliance >= 95) return 'bg-success-light text-success'
  if (compliance >= 90) return 'bg-warning-light text-warning'
  return 'bg-error-light text-error'
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Hostel Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Mess Service</h1>
        <p class="m-0 text-sm text-text-secondary">Manage mess schedules, meal plans, and compliance tracking.</p>
      </div>
      <button class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all">
        + Add Schedule
      </button>
    </header>

    <div v-if="hostelStore.loading" class="text-center py-12 text-text-muted">
      <p>Loading mess data...</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Filters -->
      <div class="bg-bg-light border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label class="block text-sm font-semibold text-text-secondary mb-2">Meal Type</label>
            <select 
              v-model="selectedMeal" 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">All Meals</option>
              <option v-for="meal in meals" :key="meal" :value="meal">{{ meal }}</option>
            </select>
          </div>
          <div class="flex items-end">
            <button 
              @click="hostelStore.fetchHostelData()" 
              class="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-primary-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-primary mb-1">{{ messData.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Total Schedules</div>
        </div>
        <div class="bg-success-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-success mb-1">{{ averageCompliance }}%</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Avg Compliance</div>
        </div>
        <div class="bg-secondary-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-secondary mb-1">{{ totalStudents }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Total Students</div>
        </div>
        <div class="bg-warning-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-warning mb-1">{{ hostels.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Hostels Served</div>
        </div>
      </div>

      <!-- Mess Schedule Cards -->
      <div v-if="filteredMessData.length === 0" class="text-center py-12 text-text-muted">
        <p>No mess schedules found matching your criteria.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="mess in filteredMessData" 
          :key="mess.id" 
          class="bg-bg-white border border-border rounded-lg p-4 hover:border-primary transition-all"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-bold text-text-primary">{{ mess.hostel }}</h3>
              <p class="text-sm text-text-secondary">{{ mess.meal }}</p>
            </div>
            <span :class="getComplianceColor(mess.compliance)" class="px-2 py-1 rounded text-xs font-semibold">
              {{ mess.compliance }}%
            </span>
          </div>
          <div class="bg-bg-light rounded-lg p-3 mb-3">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-text-secondary">Time:</span>
              <span class="text-text-primary font-semibold">{{ mess.time }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-text-secondary">Students:</span>
              <span class="text-text-primary font-semibold">{{ mess.students }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="flex-1 px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-primary-dark transition-all">
              Edit
            </button>
            <button class="flex-1 px-3 py-2 bg-bg-light text-text-primary border border-border rounded text-sm font-medium hover:bg-bg-white transition-all">
              Details
            </button>
          </div>
        </div>
      </div>

      <!-- Meal Compliance Chart -->
      <div class="bg-bg-light border border-border rounded-xl p-6">
        <h2 class="mb-4 text-lg font-bold text-text-primary">Daily Meal Compliance</h2>
        <div class="space-y-3">
          <div v-for="meal in meals" :key="meal" class="flex items-center gap-4">
            <div class="w-24 text-sm font-semibold text-text-secondary">{{ meal }}</div>
            <div class="flex-1 bg-bg-white rounded-full h-4 overflow-hidden">
              <div 
                class="h-full transition-all duration-500"
                :class="meal === 'Breakfast' ? 'bg-primary' : meal === 'Lunch' ? 'bg-success' : 'bg-secondary'"
                :style="{ width: `${messData.filter(m => m.meal === meal).reduce((sum, m) => sum + m.compliance, 0) / messData.filter(m => m.meal === meal).length}%` }"
              ></div>
            </div>
            <div class="w-16 text-sm font-bold text-text-primary text-right">
              {{ Math.round(messData.filter(m => m.meal === meal).reduce((sum, m) => sum + m.compliance, 0) / messData.filter(m => m.meal === meal).length) }}%
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
