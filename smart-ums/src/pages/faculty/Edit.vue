<template>
  <section class="bg-white border border-blue-100 rounded-xl shadow-lg p-5">
    <header class="mb-6">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">Faculty Management</p>
        <h1 class="mb-1 text-2xl font-bold text-gray-900">Edit Faculty</h1>
        <p class="m-0 text-sm text-gray-600">Update faculty member information in the university system.</p>
      </div>
    </header>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      <p>Loading faculty data...</p>
    </div>

    <FacultyForm
      v-else-if="faculty"
      :initial-data="faculty"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <div v-else class="text-center py-12 text-red-600">
      <p>Faculty member not found</p>
      <button @click="router.push({ name: 'faculty' })" class="mt-4 px-6 py-3 bg-blue-600 text-white border-none rounded-lg font-semibold cursor-pointer transition-colors hover:bg-blue-700">
        Back to Faculty
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFacultyStore } from '@/stores/faculty.store'
import { useToast } from '@/composables/useToast'
import FacultyForm from '@/components/faculty/FacultyForm.vue'

defineOptions({ name: 'FacultyEdit' })

const router = useRouter()
const route = useRoute()
const facultyStore = useFacultyStore()
const toast = useToast()

const faculty = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    faculty.value = await facultyStore.fetchFacultyById(route.params.id)
  } catch (error) {
    toast.error('Failed to load faculty data')
    console.error('Failed to fetch faculty:', error)
  } finally {
    loading.value = false
  }
})

const handleSubmit = async (formData) => {
  try {
    await facultyStore.updateFaculty(route.params.id, formData)
    toast.success('Faculty member updated successfully')
    router.push({ name: 'faculty' })
  } catch (error) {
    toast.error('Failed to update faculty member')
    console.error('Failed to update faculty:', error)
  }
}

const handleCancel = () => {
  router.push({ name: 'faculty' })
}
</script>

<style scoped>
/* No styles defined */
</style>
