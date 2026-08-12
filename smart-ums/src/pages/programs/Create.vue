<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProgramStore } from '@/stores/program.store'
import ProgramForm from '@/components/programs/ProgramForm.vue'

defineOptions({ name: 'ProgramsCreate' })

const router = useRouter()
const programStore = useProgramStore()

const isSubmitting = ref(false)

const handleSubmit = async (formData) => {
  isSubmitting.value = true
  try {
    await programStore.createProgram(formData)
    router.push({ name: 'programs' })
  } catch (error) {
    console.error('Error creating program:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <div class="create-page">
    <div class="page-header">
      <div>
        <p class="breadcrumb">
          <router-link :to="{ name: 'programs' }">Programs</router-link>
          / Create New Program
        </p>
        <h1>Create New Program</h1>
        <p>Add a new academic program to the system</p>
      </div>
    </div>

    <ProgramForm
      :is-submitting="isSubmitting"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.create-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.breadcrumb {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: #7f8fa3;
}

.breadcrumb a {
  color: #214d9c;
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

h1 {
  margin: 0 0 0.5rem;
  color: #14213d;
}

.page-header > p {
  margin: 0;
  color: #5d6d8f;
  font-size: 0.95rem;
}
</style>
