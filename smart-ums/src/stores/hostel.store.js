import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hostelService } from '@/services/hostel.service'

export const useHostelStore = defineStore('hostel', () => {
  const hostelData = ref(null)
  const rooms = ref([])
  const allocations = ref([])
  const loading = ref(false)
  const error = ref(null)

  const statistics = computed(() => {
    if (!hostelData.value) return null
    return {
      occupiedBeds: hostelData.value.occupiedBeds,
      vacantRooms: hostelData.value.vacantRooms,
      messCompliance: hostelData.value.messCompliance,
      totalHostels: hostelData.value.totalHostels,
      totalRooms: hostelData.value.totalRooms,
      totalBeds: hostelData.value.totalBeds,
      occupancyRate: Math.round((hostelData.value.occupiedBeds / hostelData.value.totalBeds) * 100)
    }
  })

  const summaryCards = computed(() => {
    if (!statistics.value) return []
    return [
      {
        title: 'Occupied beds',
        value: statistics.value.occupiedBeds,
        subtitle: `Across ${statistics.value.totalHostels} hostels`
      },
      {
        title: 'Vacant rooms',
        value: statistics.value.vacantRooms,
        subtitle: 'Ready for allocation'
      },
      {
        title: 'Mess service',
        value: `${statistics.value.messCompliance}%`,
        subtitle: 'Daily meal compliance'
      }
    ]
  })

  async function fetchHostelData() {
    loading.value = true
    error.value = null
    try {
      const data = await hostelService.getHostelData()
      hostelData.value = data
    } catch (err) {
      error.value = 'Failed to fetch hostel data'
      console.error('Error fetching hostel data:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchRooms() {
    loading.value = true
    error.value = null
    try {
      const data = await hostelService.getRooms()
      rooms.value = data
    } catch (err) {
      error.value = 'Failed to fetch rooms data'
      console.error('Error fetching rooms:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchAllocations() {
    loading.value = true
    error.value = null
    try {
      const data = await hostelService.getAllocations()
      allocations.value = data
    } catch (err) {
      error.value = 'Failed to fetch allocations data'
      console.error('Error fetching allocations:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    hostelData,
    rooms,
    allocations,
    loading,
    error,
    statistics,
    summaryCards,
    fetchHostelData,
    fetchRooms,
    fetchAllocations
  }
})

