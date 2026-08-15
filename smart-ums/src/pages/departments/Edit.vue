<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDepartmentStore } from '@/stores/department.store'
import { useToast } from '@/composables/useToast'
import DepartmentForm from '@/components/departments/DepartmentForm.vue'

defineOptions({ name: 'DepartmentEdit' })

const router = useRouter()
const route = useRoute()
const departmentStore = useDepartmentStore()
const toast = useToast()

const department = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    department.value = await departmentStore.fetchDepartmentById(route.params.id)
  } catch (error) {
    toast.error('Failed to load department data')
    console.error('Failed to fetch department:', error)
  } finally {
    loading.value = false
  }
})

const handleSubmit = async (formData) => {
  try {
    await departmentStore.updateDepartment(route.params.id, formData)
    toast.success('Department updated successfully')
    router.push({ name: 'departments' })
  } catch (error) {
    toast.error('Failed to update department')
    console.error('Failed to update department:', error)
  }
}

const handleCancel = () => {
  router.push({ name: 'departments' })
}
</script>

<template>
  <section class="bg-white border border-blue-100 rounded-xl shadow-lg p-5">
    <header class="mb-6">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">Department Management</p>
        <h1 class="mb-1 text-2xl font-bold text-gray-900">Edit Department</h1>
        <p class="m-0 text-sm text-gray-600">Update department information in the university system.</p>
      </div>
    </header>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      <p>Loading department data...</p>
    </div>

    <DepartmentForm
      v-else-if="department"
      :initial-data="department"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <div v-else class="text-center py-12 text-red-600">
      <p>Department not found</p>
      <button @click="router.push({ name: 'departments' })" class="mt-4 px-6 py-3 bg-blue-600 text-white border-none rounded-lg font-semibold cursor-pointer transition-colors hover:bg-blue-700">
        Back to Departments
      </button>
    </div>
  </section>
</template>
