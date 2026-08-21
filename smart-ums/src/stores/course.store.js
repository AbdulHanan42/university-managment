import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { courseService } from '@/services/course.service'

export const useCourseStore = defineStore('course', () => {
  // State
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    department: null,
    program: null,
    facultyId: null,
    status: null,
    search: ''
  })

  // Computed - Filtered courses
  const filteredCourses = computed(() => {
    return courses.value.filter(course => {
      if (filters.value.department && course.department !== filters.value.department) return false
      if (filters.value.program && course.program !== filters.value.program) return false
      if (filters.value.facultyId && course.facultyId != filters.value.facultyId) return false
      if (filters.value.status && course.status !== filters.value.status) return false
      if (filters.value.search) {
        const query = filters.value.search.toLowerCase()
        return (
          course.code.toLowerCase().includes(query) ||
          course.name.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
        )
      }
      return true
    })
  })

  // Computed - Statistics
  const statistics = computed(() => {
    const total = courses.value.length
    const active = courses.value.filter(c => c.status === 'active').length
    const onLeave = courses.value.filter(c => c.status === 'on-leave').length
    const totalEnrolled = courses.value.reduce((sum, c) => sum + (c.enrolled || 0), 0)
    const totalCapacity = courses.value.reduce((sum, c) => sum + (c.capacity || 0), 0)
    const departments = [...new Set(courses.value.map(c => c.department))]
    const programs = [...new Set(courses.value.map(c => c.program))]
    
    return {
      total,
      active,
      onLeave,
      totalEnrolled,
      totalCapacity,
      departments,
      programs
    }
  })

  // Actions
  const fetchCourses = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await courseService.getAll()
      courses.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchCourseById = async (id) => {
    try {
      const response = await courseService.getById(id)
      return response.data
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  const createCourse = async (data) => {
    loading.value = true
    try {
      const response = await courseService.create(data)
      courses.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCourse = async (id, data) => {
    loading.value = true
    try {
      const response = await courseService.update(id, data)
      const index = courses.value.findIndex(c => c.id == id)
      if (index !== -1) {
        courses.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCourse = async (id) => {
    try {
      await courseService.delete(id)
      courses.value = courses.value.filter(c => c.id != id)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteMultipleCourses = async (ids) => {
    try {
      await courseService.deleteBulk(ids)
      courses.value = courses.value.filter(c => !ids.includes(String(c.id)))
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const assignFaculty = async (courseId, facultyId) => {
    try {
      const response = await courseService.assignFaculty(courseId, facultyId)
      const index = courses.value.findIndex(c => c.id == courseId)
      if (index !== -1) {
        courses.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const searchCourses = async (query) => {
    filters.value.search = query
  }

  const setDepartmentFilter = (department) => {
    filters.value.department = department
  }

  const setProgramFilter = (program) => {
    filters.value.program = program
  }

  const setFacultyFilter = (facultyId) => {
    filters.value.facultyId = facultyId
  }

  const setStatusFilter = (status) => {
    filters.value.status = status
  }

  const clearFilters = () => {
    filters.value = { department: null, program: null, facultyId: null, status: null, search: '' }
  }

  return {
    courses,
    filteredCourses,
    loading,
    error,
    filters,
    statistics,
    fetchCourses,
    fetchCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    deleteMultipleCourses,
    assignFaculty,
    searchCourses,
    setDepartmentFilter,
    setProgramFilter,
    setFacultyFilter,
    setStatusFilter,
    clearFilters
  }
})
