import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { facultyService } from '@/services/faculty.service'

export const useFacultyStore = defineStore('faculty', () => {
  // State
  const faculty = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    status: null,
    department: null,
    search: ''
  })

  // Computed - Filtered faculty
  const filteredFaculty = computed(() => {
    return faculty.value.filter(fac => {
      if (filters.value.status && fac.status !== filters.value.status) return false
      if (filters.value.department && fac.department !== filters.value.department) return false
      if (filters.value.search) {
        const query = filters.value.search.toLowerCase()
        return (
          fac.name.toLowerCase().includes(query) ||
          fac.email.toLowerCase().includes(query) ||
          fac.department.toLowerCase().includes(query) ||
          fac.designation.toLowerCase().includes(query)
        )
      }
      return true
    })
  })

  // Computed - Statistics
  const statistics = computed(() => {
    const total = faculty.value.length
    const active = faculty.value.filter(f => f.status === 'active').length
    const onLeave = faculty.value.filter(f => f.status === 'on-leave').length
    const totalStudents = faculty.value.reduce((sum, f) => sum + (f.totalStudents || 0), 0)
    const totalCourses = faculty.value.reduce((sum, f) => sum + (f.courses || 0), 0)
    const departmentHeads = faculty.value.filter(f => f.isHead).length
    const departments = [...new Set(faculty.value.map(f => f.department))]
    
    return {
      total,
      active,
      onLeave,
      totalStudents,
      totalCourses,
      departmentHeads,
      departments
    }
  })

  // Actions
  const fetchFaculty = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await facultyService.getAll()
      faculty.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchFacultyById = async (id) => {
    try {
      const response = await facultyService.getById(id)
      return response.data
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const createFaculty = async (data) => {
    loading.value = true
    try {
      const response = await facultyService.create(data)
      faculty.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateFaculty = async (id, data) => {
    loading.value = true
    try {
      const response = await facultyService.update(id, data)
      const index = faculty.value.findIndex(f => f.id == id)
      if (index !== -1) {
        faculty.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteFaculty = async (id) => {
    try {
      await facultyService.delete(id)
      faculty.value = faculty.value.filter(f => f.id != id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteMultipleFaculty = async (ids) => {
    try {
      await facultyService.deleteBulk(ids)
      faculty.value = faculty.value.filter(f => !ids.includes(String(f.id)))
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const searchFaculty = async (query) => {
    filters.value.search = query
  }

  const setStatusFilter = (status) => {
    filters.value.status = status
  }

  const setDepartmentFilter = (department) => {
    filters.value.department = department
  }

  const clearFilters = () => {
    filters.value = { status: null, department: null, search: '' }
  }

  const getFacultyWorkload = async (id) => {
    try {
      const response = await facultyService.getWorkload(id)
      return response.data
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const getFacultyLeaveHistory = async (id) => {
    try {
      const response = await facultyService.getLeaveHistory(id)
      return response.data
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  return {
    faculty,
    filteredFaculty,
    loading,
    error,
    filters,
    statistics,
    fetchFaculty,
    fetchFacultyById,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    deleteMultipleFaculty,
    searchFaculty,
    setStatusFilter,
    setDepartmentFilter,
    clearFilters,
    getFacultyWorkload,
    getFacultyLeaveHistory
  }
})
