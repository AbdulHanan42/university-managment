import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { departmentService } from '@/services/department.service'

export const useDepartmentStore = defineStore('department', () => {
  // State
  const departments = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    status: null,
    faculty: null,
    search: ''
  })

  // Computed - Filtered departments
  const filteredDepartments = computed(() => {
    return departments.value.filter(dept => {
      if (filters.value.status && dept.status !== filters.value.status) return false
      if (filters.value.faculty && dept.faculty !== filters.value.faculty) return false
      if (filters.value.search) {
        const query = filters.value.search.toLowerCase()
        return (
          dept.name.toLowerCase().includes(query) ||
          dept.head.toLowerCase().includes(query) ||
          dept.code.toLowerCase().includes(query)
        )
      }
      return true
    })
  })

  // Computed - Statistics
  const statistics = computed(() => {
    const total = departments.value.length
    const active = departments.value.filter(d => d.status === 'active').length
    const totalStudents = departments.value.reduce((sum, d) => sum + (d.students || 0), 0)
    const totalFaculty = departments.value.reduce((sum, d) => sum + (d.faculty_count || 0), 0)
    const accredited = departments.value.filter(d => d.accredited).length
    const faculties = [...new Set(departments.value.map(d => d.faculty))]
    
    return {
      total,
      active,
      totalStudents,
      totalFaculty,
      accredited,
      faculties
    }
  })

  // Actions
  const fetchDepartments = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await departmentService.getAll()
      departments.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchDepartmentById = async (id) => {
    try {
      const response = await departmentService.getById(id)
      return response.data
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const createDepartment = async (data) => {
    loading.value = true
    try {
      const response = await departmentService.create(data)
      departments.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDepartment = async (id, data) => {
    loading.value = true
    try {
      const response = await departmentService.update(id, data)
      const index = departments.value.findIndex(d => d.id === id)
      if (index !== -1) {
        departments.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteDepartment = async (id) => {
    try {
      await departmentService.delete(id)
      departments.value = departments.value.filter(d => d.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteMultipleDepartments = async (ids) => {
    try {
      await departmentService.deleteBulk(ids)
      departments.value = departments.value.filter(d => !ids.includes(d.id))
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const searchDepartments = async (query) => {
    filters.value.search = query
  }

  const setStatusFilter = (status) => {
    filters.value.status = status
  }

  const setFacultyFilter = (faculty) => {
    filters.value.faculty = faculty
  }

  const clearFilters = () => {
    filters.value = { status: null, faculty: null, search: '' }
  }

  return {
    departments,
    filteredDepartments,
    loading,
    error,
    filters,
    statistics,
    fetchDepartments,
    fetchDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    deleteMultipleDepartments,
    searchDepartments,
    setStatusFilter,
    setFacultyFilter,
    clearFilters
  }
})

