<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'
import CourseTable from '@/components/courses/CourseTable.vue'

defineOptions({ name: 'CourseIndex' })

const router = useRouter()
const courseStore = useCourseStore()
const toast = useToast()

const viewMode = ref('table')
const summaryCards = ref([
  { title: 'Total courses', value: '12', subtitle: 'Across 5 departments' },
  { title: 'Active courses', value: '11', subtitle: 'Currently offered' },
  { title: 'Total enrolled', value: '531', subtitle: 'Students registered' }
])

onMounted(() => {
  courseStore.fetchCourses()
})

const handleAddCourse = () => {
  router.push({ name: 'course-create' })
}

const handleViewCourse = (id) => {
  router.push({ name: 'course-show', params: { id } })
}

const handleEditCourse = (id) => {
  router.push({ name: 'course-edit', params: { id } })
}

const handleAssignFaculty = (id) => {
  router.push({ name: 'course-assign', params: { id } })
}

const handleDeleteCourse = async (id) => {
  try {
    await courseStore.deleteCourse(id)
    toast.success('Course deleted successfully')
  } catch (error) {
    toast.error('Failed to delete course')
    console.error('Delete error:', error)
  }
}

const handleBulkDelete = async (ids) => {
  try {
    await courseStore.deleteMultipleCourses(ids)
    toast.success(`${ids.length} courses deleted successfully`)
  } catch (error) {
    toast.error('Failed to delete courses')
    console.error('Bulk delete error:', error)
  }
}

const updateSummary = () => {
  const stats = courseStore.statistics
  summaryCards.value = [
    {
      title: 'Total courses',
      value: stats.total,
      subtitle: `Across ${stats.departments.length} departments`
    },
    {
      title: 'Active courses',
      value: stats.active,
      subtitle: 'Currently offered'
    },
    {
      title: 'Total enrolled',
      value: stats.totalEnrolled.toLocaleString(),
      subtitle: 'Students registered'
    }
  ]
}

watch(() => courseStore.courses, updateSummary, { deep: true })

onMounted(updateSummary)
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <!-- Header Section -->
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Course Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Courses</h1>
        <p class="m-0 text-sm text-text-secondary">Manage course catalog, faculty assignments, and enrollment.</p>
      </div>
      <AppButton @click="handleAddCourse">+ Add Course</AppButton>
    </header>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <article v-for="card in summaryCards" :key="card.title" class="bg-primary-light rounded-xl p-5 border border-border transition-all hover:bg-primary">
        <h2 class="mb-2 text-sm text-text-secondary font-semibold">{{ card.title }}</h2>
        <p class="mb-1 text-3xl font-bold text-text-primary">{{ card.value }}</p>
        <span class="text-xs text-text-muted">{{ card.subtitle }}</span>
      </article>
    </div>

    <!-- Course Table -->
    <div class="animate-fade-in">
      <CourseTable
        :courses="courseStore.filteredCourses"
        @view="handleViewCourse"
        @edit="handleEditCourse"
        @assign="handleAssignFaculty"
        @delete="handleDeleteCourse"
        @bulk-delete="handleBulkDelete"
      />
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
