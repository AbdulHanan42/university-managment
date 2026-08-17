<template>
  <section class="bg-white border border-blue-100 rounded-xl shadow-lg p-5">
    <header class="mb-6">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">Faculty Management</p>
        <h1 class="mb-1 text-2xl font-bold text-gray-900">Create Faculty</h1>
        <p class="m-0 text-sm text-gray-600">Add a new faculty member to the system.</p>
      </div>
    </header>

    <FacultyForm @submit="handleSubmit" @cancel="handleCancel" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFacultyStore } from '@/stores/faculty.store'
import { useToast } from '@/composables/useToast'
import FacultyForm from '@/components/faculty/FacultyForm.vue'

defineOptions({ name: 'FacultyCreate' })

const router = useRouter()
const facultyStore = useFacultyStore()
const toast = useToast()

const handleSubmit = async (formData) => {
  try {
    await facultyStore.createFaculty(formData)
    toast.success('Faculty member created successfully')
    router.push({ name: 'faculty' })
  } catch (error) {
    toast.error('Failed to create faculty member')
    console.error('Failed to create faculty:', error)
  }
}

const handleCancel = () => {
  router.push({ name: 'faculty' })
}
</script>

<style scoped>
/* No styles defined */
</style>
