<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTransportStore } from '@/stores/transport.store'
import AppButton from '@/components/common/AppButton.vue'
import Vehicles from './Vehicles.vue'
import Routes from './Routes.vue'
import Drivers from './Drivers.vue'
import StudentTransport from '@/components/transport/StudentTransport.vue'

defineOptions({ name: 'TransportIndex' })

const transportStore = useTransportStore()
const activeTab = ref('overview')

const summaryCards = computed(() => {
  const stats = transportStore.statistics
  if (!stats) return []
  
  return [
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      subtitle: `${stats.activeVehicles} active on routes`
    },
    {
      title: 'Total Routes',
      value: stats.totalRoutes,
      subtitle: 'Covering all campus areas'
    },
    {
      title: 'Student Assignments',
      value: stats.totalAssignments,
      subtitle: `${stats.activeAssignments} active passes`
    },
    {
      title: 'Capacity Utilization',
      value: `${stats.utilizationRate}%`,
      subtitle: `${stats.currentOccupancy}/${stats.totalCapacity} students`
    }
  ]
})

onMounted(() => {
  transportStore.initializeTransport()
})
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <!-- Header -->
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Transport Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Transport System</h1>
        <p class="m-0 text-sm text-text-secondary">Manage vehicles, routes, drivers, and student transportation.</p>
      </div>
    </header>

    <!-- Tab Navigation -->
    <div class="flex gap-2 mb-6 border-b border-border">
      <button
        @click="activeTab = 'overview'"
        :class="activeTab === 'overview' ? 'bg-primary text-white' : 'bg-bg-light text-text-primary'"
        class="px-4 py-2 rounded-t-lg font-semibold transition-all"
      >
        Overview
      </button>
      <button
        @click="activeTab = 'vehicles'"
        :class="activeTab === 'vehicles' ? 'bg-primary text-white' : 'bg-bg-light text-text-primary'"
        class="px-4 py-2 rounded-t-lg font-semibold transition-all"
      >
        Vehicles
      </button>
      <button
        @click="activeTab = 'routes'"
        :class="activeTab === 'routes' ? 'bg-primary text-white' : 'bg-bg-light text-text-primary'"
        class="px-4 py-2 rounded-t-lg font-semibold transition-all"
      >
        Routes
      </button>
      <button
        @click="activeTab = 'drivers'"
        :class="activeTab === 'drivers' ? 'bg-primary text-white' : 'bg-bg-light text-text-primary'"
        class="px-4 py-2 rounded-t-lg font-semibold transition-all"
      >
        Drivers
      </button>
      <button
        @click="activeTab = 'assignments'"
        :class="activeTab === 'assignments' ? 'bg-primary text-white' : 'bg-bg-light text-text-primary'"
        class="px-4 py-2 rounded-t-lg font-semibold transition-all"
      >
        Student Assignments
      </button>
    </div>

    <!-- Overview Tab -->
    <div v-if="activeTab === 'overview'" class="animate-fade-in">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <article v-for="card in summaryCards" :key="card.title" class="bg-primary-light rounded-xl p-5 border border-border transition-all hover:bg-primary">
          <h2 class="mb-2 text-sm text-text-secondary font-semibold">{{ card.title }}</h2>
          <p class="mb-1 text-3xl font-bold text-text-primary">{{ card.value }}</p>
          <span class="text-xs text-text-muted">{{ card.subtitle }}</span>
        </article>
      </div>

      <!-- Quick Stats Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Active Vehicles -->
        <div class="bg-bg-light rounded-xl p-6 border border-border">
          <h3 class="text-lg font-semibold text-text-primary mb-4">Active Vehicles</h3>
          <div v-if="transportStore.activeVehicles.length > 0" class="space-y-3">
            <div v-for="vehicle in transportStore.activeVehicles.slice(0, 3)" :key="vehicle.id" class="flex items-center justify-between bg-white p-3 rounded-lg">
              <div>
                <p class="font-semibold text-text-primary">{{ vehicle.registrationNumber }}</p>
                <p class="text-sm text-text-muted">{{ vehicle.model }} - {{ vehicle.routeName }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-primary">{{ vehicle.capacity }} seats</p>
                <p class="text-sm text-text-muted">{{ vehicle.driverName }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-text-muted">No active vehicles</p>
        </div>

        <!-- Active Routes -->
        <div class="bg-bg-light rounded-xl p-6 border border-border">
          <h3 class="text-lg font-semibold text-text-primary mb-4">Active Routes</h3>
          <div v-if="transportStore.activeRoutes.length > 0" class="space-y-3">
            <div v-for="route in transportStore.activeRoutes.slice(0, 3)" :key="route.id" class="flex items-center justify-between bg-white p-3 rounded-lg">
              <div>
                <p class="font-semibold text-text-primary">{{ route.name }}</p>
                <p class="text-sm text-text-muted">{{ route.startPoint }} → {{ route.endPoint }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-primary">{{ route.currentOccupancy }}/{{ route.capacity }}</p>
                <p class="text-sm text-text-muted">{{ route.fee }} PKR</p>
              </div>
            </div>
          </div>
          <p v-else class="text-text-muted">No active routes</p>
        </div>
      </div>
    </div>

    <!-- Vehicles Tab -->
    <div v-if="activeTab === 'vehicles'" class="animate-fade-in">
      <Vehicles />
    </div>

    <!-- Routes Tab -->
    <div v-if="activeTab === 'routes'" class="animate-fade-in">
      <Routes />
    </div>

    <!-- Drivers Tab -->
    <div v-if="activeTab === 'drivers'" class="animate-fade-in">
      <Drivers />
    </div>

    <!-- Assignments Tab -->
    <div v-if="activeTab === 'assignments'" class="animate-fade-in">
      <StudentTransport />
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
