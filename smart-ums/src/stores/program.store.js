import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { program_service } from '@/services/program.service'

export const useProgramStore = defineStore('program', () => {
  const programs = ref([
    {
      id: 1,
      name: 'Bachelor of Science in Computer Science',
      code: 'BSC-CS',
      department: 'Computer Science',
      duration: '4 years',
      level: 'Undergraduate',
      credits: 120,
      status: 'Active',
      studentsEnrolled: 450,
      accreditation: 'Accredited',
      description: 'Comprehensive program covering core computer science concepts, algorithms, and practical software development.',
      createdAt: '2024-01-15',
      updatedAt: '2024-06-20',
      faculty: 'Dr. James Wilson',
      admissionRequirements: 'High School Diploma with Math & Science',
      careerOutcomes: 'Software Developer, Systems Engineer, Data Scientist'
    },
    {
      id: 2,
      name: 'Master of Business Administration',
      code: 'MBA',
      department: 'Business',
      duration: '2 years',
      level: 'Graduate',
      credits: 60,
      status: 'Active',
      studentsEnrolled: 280,
      accreditation: 'Accredited',
      description: 'Advanced business management and leadership program with focus on strategic decision-making and organizational management.',
      createdAt: '2024-01-10',
      updatedAt: '2024-07-01',
      faculty: 'Dr. Sarah Martinez',
      admissionRequirements: 'Bachelor Degree & GMAT Score (500+)',
      careerOutcomes: 'Business Manager, Executive Director, Consultant'
    },
    {
      id: 3,
      name: 'Bachelor of Arts in Psychology',
      code: 'BA-PSYCH',
      department: 'Social Sciences',
      duration: '4 years',
      level: 'Undergraduate',
      credits: 120,
      status: 'Active',
      studentsEnrolled: 320,
      accreditation: 'Accredited',
      description: 'Study human behavior, mental processes, and psychological principles with practical research experience.',
      createdAt: '2024-02-05',
      updatedAt: '2024-06-15',
      faculty: 'Prof. Emily Richardson',
      admissionRequirements: 'High School Diploma',
      careerOutcomes: 'Clinical Psychologist, Counselor, HR Specialist'
    },
    {
      id: 4,
      name: 'Doctor of Philosophy in Engineering',
      code: 'PhD-ENG',
      department: 'Engineering',
      duration: '3-5 years',
      level: 'Doctoral',
      credits: 90,
      status: 'Active',
      studentsEnrolled: 65,
      accreditation: 'Accredited',
      description: 'Advanced research-focused program in engineering with specializations in civil, mechanical, or electrical engineering.',
      createdAt: '2024-01-20',
      updatedAt: '2024-07-05',
      faculty: 'Dr. Michael Chen',
      admissionRequirements: 'Master Degree & Research Proposal',
      careerOutcomes: 'Research Scientist, University Professor, Senior Engineer'
    },
    {
      id: 5,
      name: 'Bachelor of Science in Nursing',
      code: 'BSC-NUR',
      department: 'Health Sciences',
      duration: '4 years',
      level: 'Undergraduate',
      credits: 128,
      status: 'Active',
      studentsEnrolled: 380,
      accreditation: 'Accredited',
      description: 'Professional nursing program combining theoretical knowledge with hands-on clinical experience and patient care training.',
      createdAt: '2024-03-01',
      updatedAt: '2024-06-25',
      faculty: 'Dr. Patricia Johnson',
      admissionRequirements: 'High School Diploma + Science Prerequisites',
      careerOutcomes: 'Registered Nurse, Nurse Manager, Healthcare Administrator'
    }
  ])

  const loading = ref(false)
  const error = ref(null)
  const selectedProgram = ref(null)
  const filters = ref({
    status: '',
    level: '',
    department: '',
    search: ''
  })

  // Computed: Filtered programs
  const filteredPrograms = computed(() => {
    let result = programs.value

    if (filters.value.status) {
      result = result.filter(p => p.status === filters.value.status)
    }

    if (filters.value.level) {
      result = result.filter(p => p.level === filters.value.level)
    }

    if (filters.value.department) {
      result = result.filter(p => p.department === filters.value.department)
    }

    if (filters.value.search) {
      const query = filters.value.search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query) ||
        p.department.toLowerCase().includes(query)
      )
    }

    return result
  })

  // Computed: Statistics
  const statistics = computed(() => ({
    total: programs.value.length,
    active: programs.value.filter(p => p.status === 'Active').length,
    totalStudents: programs.value.reduce((sum, p) => sum + p.studentsEnrolled, 0),
    accredited: programs.value.filter(p => p.accreditation === 'Accredited').length
  }))

  // Computed: Unique departments
  const departments = computed(() => [...new Set(programs.value.map(p => p.department))])

  // Computed: Unique levels
  const levels = computed(() => [...new Set(programs.value.map(p => p.level))])

  // Fetch programs
  const fetchPrograms = async () => {
    loading.value = true
    error.value = null
    try {
      // In real app, this would call the service
      // const data = await program_service.getPrograms()
      // programs.value = data
      return programs.value
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Fetch single program
  const fetchProgramById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const program = programs.value.find(p => p.id === id)
      selectedProgram.value = program
      return program
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Create program
  const createProgram = async (data) => {
    loading.value = true
    error.value = null
    try {
      const newProgram = {
        id: Math.max(...programs.value.map(p => p.id)) + 1,
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      programs.value.push(newProgram)
      return newProgram
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update program
  const updateProgram = async (id, data) => {
    loading.value = true
    error.value = null
    try {
      const index = programs.value.findIndex(p => p.id === id)
      if (index !== -1) {
        programs.value[index] = {
          ...programs.value[index],
          ...data,
          updatedAt: new Date().toISOString().split('T')[0]
        }
        return programs.value[index]
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete program
  const deleteProgram = async (id) => {
    loading.value = true
    error.value = null
    try {
      programs.value = programs.value.filter(p => p.id !== id)
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete multiple programs
  const deleteMultiplePrograms = async (ids) => {
    loading.value = true
    error.value = null
    try {
      programs.value = programs.value.filter(p => !ids.includes(p.id))
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Set filters
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  // Reset filters
  const resetFilters = () => {
    filters.value = {
      status: '',
      level: '',
      department: '',
      search: ''
    }
  }

  return {
    programs,
    filteredPrograms,
    selectedProgram,
    loading,
    error,
    filters,
    statistics,
    departments,
    levels,
    fetchPrograms,
    fetchProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    deleteMultiplePrograms,
    setFilters,
    resetFilters
  }
})
