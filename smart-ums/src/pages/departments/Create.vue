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
  <section class="page-card">
    <header class="page-header">
      <div>
        <p class="eyebrow">Department Management</p>
        <h1>Create Department</h1>
        <p>Add a new department to the university system.</p>
      </div>
    </header>

    <DepartmentForm @submit="handleSubmit" @cancel="handleCancel" />
  </section>
</template>

<style scoped>
.page-card {
  background: white;
  border: 1px solid #dfe7fb;
  border-radius: 1.2rem;
  box-shadow: 0 16px 40px rgba(20, 33, 61, 0.06);
  padding: 1.25rem;
}

.page-header {
  margin-bottom: 2rem;
}

.eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #60708f;
  font-weight: 600;
}

h1 {
  margin: 0 0 0.4rem;
  color: #14213d;
}

.page-header > div > p:last-child {
  margin: 0;
  color: #5d6d8f;
  font-size: 0.95rem;
}
</style>
