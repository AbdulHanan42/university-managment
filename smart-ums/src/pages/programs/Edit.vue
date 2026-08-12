<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProgramStore } from '@/stores/program.store'
import ProgramForm from '@/components/programs/ProgramForm.vue'

defineOptions({ name: 'ProgramsEdit' })

const router = useRouter()
const route = useRoute()
const programStore = useProgramStore()

const isSubmitting = ref(false)
const program = ref(null)
const loading = ref(true)

onMounted(async () => {
  const id = parseInt(route.params.id)
  try {
    await programStore.fetchProgramById(id)
    program.value = programStore.selectedProgram
  } catch (error) {
    console.error('Error loading program:', error)
    router.push({ name: 'programs' })
  } finally {
    loading.value = false
  }
})

const handleSubmit = async (formData) => {
  isSubmitting.value = true
  try {
    await programStore.updateProgram(program.value.id, formData)
    router.push({ name: 'programs' })
  } catch (error) {
    console.error('Error updating program:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <div class="edit-page">
    <div class="page-header">
      <div>
        <p class="breadcrumb">
          <router-link :to="{ name: 'programs' }">Programs</router-link>
          / Edit Program
        </p>
        <h1>Edit Program</h1>
        <p v-if="program">Editing: {{ program.name }}</p>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading program details...</div>

    <ProgramForm
      v-else-if="program"
      :program="program"
      :is-submitting="isSubmitting"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
    <div v-else class="error">Program not found</div>
  </div>
</template>

<style scoped>
.edit-page {
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

.loading,
.error {
  text-align: center;
  padding: 3rem;
  color: #7f8fa3;
}

.error {
  color: #c0392b;
}
</style>
