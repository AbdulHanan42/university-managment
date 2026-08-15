<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDepartmentStore } from '@/stores/department.store'
import { useToast } from '@/composables/useToast'
import DepartmentForm from '@/components/departments/DepartmentForm.vue'

defineOptions({ name: 'DepartmentCreate' })

const router = useRouter()
const departmentStore = useDepartmentStore()
const toast = useToast()

const handleSubmit = async (formData) => {
  try {
    await departmentStore.createDepartment(formData)
    toast.success('Department created successfully')
    router.push({ name: 'departments' })
  } catch (error) {
    toast.error('Failed to create department')
    console.error('Failed to create department:', error)
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
        <h1 class="mb-1 text-2xl font-bold text-gray-900">Create Department</h1>
        <p class="m-0 text-sm text-gray-600">Add a new department to the system.</p>
      </div>
    </header>

    <DepartmentForm @submit="handleSubmit" @cancel="handleCancel" />
  </section>
</template>
