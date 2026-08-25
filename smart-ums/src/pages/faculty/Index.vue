<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFacultyStore } from '@/stores/faculty.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'
import FacultyTable from '@/components/faculty/FacultyTable.vue'
import FacultyCard from '@/components/faculty/FacultyCard.vue'

defineOptions({ name: 'FacultyIndex' })

const router = useRouter()
const facultyStore = useFacultyStore()
const toast = useToast()

const viewMode = ref('table') // 'table' or 'grid'
const summaryCards = ref([
  { title: 'Total faculty', value: '12', subtitle: 'Across 5 departments' },
  { title: 'Active faculty', value: '11', subtitle: 'Currently teaching' },
  { title: 'Total students', value: '895', subtitle: 'Under faculty supervision' }
])

onMounted(() => {
  facultyStore.fetchFaculty()
})

const handleAddFaculty = () => {
  router.push({ name: 'faculty-create' })
}

const handleViewFaculty = (id) => {
  router.push({ name: 'faculty-show', params: { id } })
}

const handleEditFaculty = (id) => {
  router.push({ name: 'faculty-edit', params: { id } })
}

const handleDeleteFaculty = async (id) => {
  try {
    await facultyStore.deleteFaculty(id)
    toast.success('Faculty member deleted successfully')
  } catch (error) {
    toast.error('Failed to delete faculty member')
    console.error('Delete error:', error)
  }
}

const handleBulkDelete = async (ids) => {
  try {
    await facultyStore.deleteMultipleFaculty(ids)
    toast.success(`${ids.length} faculty members deleted successfully`)
  } catch (error) {
    toast.error('Failed to delete faculty members')
    console.error('Bulk delete error:', error)
  }
}

const updateSummary = () => {
  const stats = facultyStore.statistics
  summaryCards.value = [
    {
      title: 'Total faculty',
      value: stats.total,
      subtitle: `Across ${stats.departments.length} departments`
    },
    {
      title: 'Active faculty',
      value: stats.active,
      subtitle: 'Currently teaching'
    },
    {
      title: 'Total students',
      value: stats.totalStudents.toLocaleString(),
      subtitle: 'Under faculty supervision'
    }
  ]
}

watch(() => facultyStore.faculty, updateSummary, { deep: true })

onMounted(updateSummary)
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <!-- Header Section -->
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Faculty Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Faculty</h1>
        <p class="m-0 text-sm text-text-secondary">Manage faculty members, workloads, and academic assignments.</p>
      </div>
      <AppButton @click="handleAddFaculty">+ Add Faculty</AppButton>
    </header>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <article v-for="card in summaryCards" :key="card.title" class="bg-primary-light rounded-xl p-5 border border-border transition-all hover:bg-primary">
        <h2 class="mb-2 text-sm text-text-secondary font-semibold">{{ card.title }}</h2>
        <p class="mb-1 text-3xl font-bold text-text-primary">{{ card.value }}</p>
        <span class="text-xs text-text-muted">{{ card.subtitle }}</span>
      </article>
    </div>

    <!-- View Toggle & Controls -->
    <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div class="flex gap-2 bg-bg-light p-2 rounded-lg">
        <button
          :class="viewMode === 'table' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
          @click="viewMode = 'table'"
          title="Table View"
          class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
        >
          📋 Table
        </button>
        <button
          :class="viewMode === 'grid' ? 'bg-primary text-white border-primary' : 'bg-white border-border'"
          @click="viewMode = 'grid'"
          title="Grid View"
          class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
        >
          ⊞ Grid
        </button>
      </div>
      <div class="text-sm text-text-muted">
        Showing {{ facultyStore.filteredFaculty.length }} of {{ facultyStore.faculty.length }} faculty
      </div>
    </div>

    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="animate-fade-in">
      <FacultyTable
        :faculty="facultyStore.filteredFaculty"
        @view="handleViewFaculty"
        @edit="handleEditFaculty"
        @delete="handleDeleteFaculty"
        @bulk-delete="handleBulkDelete"
      />
    </div>

    <!-- Grid View -->
    <div v-else class="animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FacultyCard
          v-for="facultyMember in facultyStore.filteredFaculty"
          :key="facultyMember.id"
          :faculty="facultyMember"
          @view="handleViewFaculty(facultyMember.id)"
          @edit="handleEditFaculty(facultyMember.id)"
          @delete="handleDeleteFaculty(facultyMember.id)"
        />
      </div>
      <div v-if="facultyStore.filteredFaculty.length === 0" class="text-center py-12 text-text-muted">
        <p>No faculty found</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}
</style>
