<template>
  <section class="bg-white border border-blue-100 rounded-xl shadow-lg p-5">
    <header class="mb-8">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">Faculty Management</p>
        <h1 class="mb-1 text-2xl font-bold text-gray-900">Faculty Workload Overview</h1>
        <p class="m-0 text-sm text-gray-600">View workload distribution and teaching assignments across faculty.</p>
      </div>
    </header>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      <p>Loading workload data...</p>
    </div>

    <div v-else-if="workloadData" class="flex flex-col gap-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 border border-blue-100 rounded-lg p-5 text-center">
          <div class="text-3xl font-bold text-blue-600 mb-1">{{ workloadData.totalFaculty }}</div>
          <div class="text-xs text-gray-600 uppercase tracking-wider">Total Faculty</div>
        </div>
        <div class="bg-green-50 border border-green-100 rounded-lg p-5 text-center">
          <div class="text-3xl font-bold text-green-600 mb-1">{{ workloadData.activeFaculty }}</div>
          <div class="text-xs text-gray-600 uppercase tracking-wider">Active Faculty</div>
        </div>
        <div class="bg-purple-50 border border-purple-100 rounded-lg p-5 text-center">
          <div class="text-3xl font-bold text-purple-600 mb-1">{{ workloadData.totalCourses }}</div>
          <div class="text-xs text-gray-600 uppercase tracking-wider">Total Courses</div>
        </div>
        <div class="bg-orange-50 border border-orange-100 rounded-lg p-5 text-center">
          <div class="text-3xl font-bold text-orange-600 mb-1">{{ workloadData.totalStudents }}</div>
          <div class="text-xs text-gray-600 uppercase tracking-wider">Total Students</div>
        </div>
      </div>

      <!-- Hours Distribution -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Hours Distribution (Weekly)</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white border border-blue-100 rounded-lg p-5 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ workloadData.totalTeachingHours }}</div>
            <div class="text-xs text-gray-600 uppercase tracking-wider">Teaching Hours</div>
          </div>
          <div class="bg-white border border-blue-100 rounded-lg p-5 text-center">
            <div class="text-3xl font-bold text-green-600 mb-1">{{ workloadData.totalResearchHours }}</div>
            <div class="text-xs text-gray-600 uppercase tracking-wider">Research Hours</div>
          </div>
          <div class="bg-white border border-blue-100 rounded-lg p-5 text-center">
            <div class="text-3xl font-bold text-purple-600 mb-1">{{ workloadData.totalAdminHours }}</div>
            <div class="text-xs text-gray-600 uppercase tracking-wider">Admin Hours</div>
          </div>
        </div>
      </div>

      <!-- Department Distribution -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Faculty by Department</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="(count, department) in workloadData.facultyByDepartment" :key="department" class="bg-white border border-blue-100 rounded-lg p-4">
            <div class="text-2xl font-bold text-blue-600 mb-1">{{ count }}</div>
            <div class="text-sm text-gray-600">{{ department }}</div>
          </div>
        </div>
      </div>

      <!-- Designation Distribution -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Faculty by Designation</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="(count, designation) in workloadData.facultyByDesignation" :key="designation" class="bg-white border border-blue-100 rounded-lg p-4">
            <div class="text-2xl font-bold text-blue-600 mb-1">{{ count }}</div>
            <div class="text-sm text-gray-600">{{ designation }}</div>
          </div>
        </div>
      </div>

      <!-- Department Heads -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Leadership</h2>
        <div class="bg-white border border-blue-100 rounded-lg p-5 text-center">
          <div class="text-3xl font-bold text-blue-600 mb-1">{{ workloadData.departmentHeads }}</div>
          <div class="text-xs text-gray-600 uppercase tracking-wider">Department Heads</div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-red-600">
      <p>Failed to load workload data</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFacultyStore } from '@/stores/faculty.store'
import { useToast } from '@/composables/useToast'

defineOptions({ name: 'FacultyWorkload' })

const facultyStore = useFacultyStore()
const toast = useToast()

const workloadData = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    await facultyStore.fetchFaculty()
    // Calculate workload statistics from faculty data
    const faculty = facultyStore.faculty
    workloadData.value = {
      totalFaculty: faculty.length,
      activeFaculty: faculty.filter(f => f.status === 'active').length,
      totalCourses: faculty.reduce((sum, f) => sum + (f.courses || 0), 0),
      totalTeachingHours: faculty.reduce((sum, f) => sum + (f.teachingHours || 0), 0),
      totalStudents: faculty.reduce((sum, f) => sum + (f.totalStudents || 0), 0),
      totalResearchHours: faculty.reduce((sum, f) => sum + (f.researchHours || 0), 0),
      totalAdminHours: faculty.reduce((sum, f) => sum + (f.adminHours || 0), 0),
      departmentHeads: faculty.filter(f => f.isHead).length,
      facultyByDepartment: faculty.reduce((acc, f) => {
        acc[f.department] = (acc[f.department] || 0) + 1
        return acc
      }, {}),
      facultyByDesignation: faculty.reduce((acc, f) => {
        acc[f.designation] = (acc[f.designation] || 0) + 1
        return acc
      }, {})
    }
  } catch (error) {
    toast.error('Failed to load workload data')
    console.error('Failed to fetch workload:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Add styles here */
</style>
