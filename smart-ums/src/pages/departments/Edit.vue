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
  <section class="page-card">
    <header class="page-header">
      <div>
        <p class="eyebrow">Department Management</p>
        <h1>Edit Department</h1>
        <p>Update department information in the university system.</p>
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <p>Loading department data...</p>
    </div>

    <DepartmentForm
      v-else-if="department"
      :initial-data="department"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <div v-else class="error-state">
      <p>Department not found</p>
      <button @click="router.push({ name: 'departments' })" class="btn-back">
        Back to Departments
      </button>
    </div>
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

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
  color: #7f8fa3;
}

.error-state {
  color: #dc3545;
}

.btn-back {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #214d9c;
  color: white;
  border: none;
  border-radius: 0.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-back:hover {
  background: #1a3d7a;
}
</style>
