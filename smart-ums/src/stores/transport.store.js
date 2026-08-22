import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { transportService } from '@/services/transport.service'

export const useTransportStore = defineStore('transport', () => {
  // State
  const vehicles = ref([])
  const routes = ref([])
  const assignments = ref([])
  const loading = ref(false)
  const error = ref(null)
  const statistics = ref(null)

  // Computed - Active vehicles
  const activeVehicles = computed(() => {
    return vehicles.value.filter(v => v.status === 'active')
  })

  // Computed - Active routes
  const activeRoutes = computed(() => {
    return routes.value.filter(r => r.status === 'active')
  })

  // Computed - Active assignments
  const activeAssignments = computed(() => {
    return assignments.value.filter(a => a.status === 'active')
  })

  // Actions - Vehicles
  const fetchVehicles = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await transportService.getAllVehicles()
      vehicles.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchVehicleById = async (id) => {
    try {
      const response = await transportService.getVehicleById(id)
      return response.data
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const createVehicle = async (data) => {
    loading.value = true
    try {
      const response = await transportService.createVehicle(data)
      vehicles.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateVehicle = async (id, data) => {
    loading.value = true
    try {
      const response = await transportService.updateVehicle(id, data)
      const index = vehicles.value.findIndex(v => v.id == id)
      if (index !== -1) {
        vehicles.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteVehicle = async (id) => {
    try {
      await transportService.deleteVehicle(id)
      vehicles.value = vehicles.value.filter(v => v.id != id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Actions - Routes
  const fetchRoutes = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await transportService.getAllRoutes()
      routes.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchRouteById = async (id) => {
    try {
      const response = await transportService.getRouteById(id)
      return response.data
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const createRoute = async (data) => {
    loading.value = true
    try {
      const response = await transportService.createRoute(data)
      routes.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRoute = async (id, data) => {
    loading.value = true
    try {
      const response = await transportService.updateRoute(id, data)
      const index = routes.value.findIndex(r => r.id == id)
      if (index !== -1) {
        routes.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRoute = async (id) => {
    try {
      await transportService.deleteRoute(id)
      routes.value = routes.value.filter(r => r.id != id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Actions - Assignments
  const fetchAssignments = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await transportService.getAllAssignments()
      assignments.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createAssignment = async (data) => {
    loading.value = true
    try {
      const response = await transportService.createAssignment(data)
      assignments.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAssignment = async (id, data) => {
    loading.value = true
    try {
      const response = await transportService.updateAssignment(id, data)
      const index = assignments.value.findIndex(a => a.id == id)
      if (index !== -1) {
        assignments.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteAssignment = async (id) => {
    try {
      await transportService.deleteAssignment(id)
      assignments.value = assignments.value.filter(a => a.id != id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // Actions - Statistics
  const fetchStatistics = async () => {
    try {
      const response = await transportService.getStatistics()
      statistics.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  // Actions - Initialize all data
  const initializeTransport = async () => {
    await Promise.all([
      fetchVehicles(),
      fetchRoutes(),
      fetchAssignments(),
      fetchStatistics()
    ])
  }

  return {
    vehicles,
    routes,
    assignments,
    loading,
    error,
    statistics,
    activeVehicles,
    activeRoutes,
    activeAssignments,
    fetchVehicles,
    fetchVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    fetchRoutes,
    fetchRouteById,
    createRoute,
    updateRoute,
    deleteRoute,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    fetchStatistics,
    initializeTransport
  }
})
