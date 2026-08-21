<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/course.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'

defineOptions({ name: 'CourseShow' })

const router = useRouter()
const route = useRoute()
const courseStore = useCourseStore()
const toast = useToast()

const course = ref(null)
const showDeleteModal = ref(false)
const loading = ref(false)

const enrollmentPercentage = computed(() => {
  if (!course.value || course.value.capacity === 0) return 0
  return Math.round((course.value.enrolled / course.value.capacity) * 100)
})

const enrollmentColor = computed(() => {
  const percentage = enrollmentPercentage.value
  if (percentage >= 90) return 'var(--color-error)'
  if (percentage >= 70) return 'var(--color-warning)'
  return 'var(--color-success)'
})

onMounted(async () => {
  try {
    course.value = await courseStore.fetchCourseById(route.params.id)
    if (!course.value) {
      toast.error('Course not found')
      router.push({ name: 'courses' })
    }
  } catch (error) {
    toast.error('Failed to load course')
    console.error('Load error:', error)
    router.push({ name: 'courses' })
  }
})

const handleEdit = () => {
  router.push({ name: 'course-edit', params: { id: route.params.id } })
}

const handleDelete = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  loading.value = true
  try {
    await courseStore.deleteCourse(route.params.id)
    toast.success('Course deleted successfully')
    router.push({ name: 'courses' })
  } catch (error) {
    toast.error('Failed to delete course')
    console.error('Delete error:', error)
  } finally {
    loading.value = false
    showDeleteModal.value = false
  }
}

const handleBack = () => {
  router.push({ name: 'courses' })
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <!-- Header -->
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Course Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Course Details</h1>
        <p class="m-0 text-sm text-text-secondary">View course information and faculty assignment.</p>
      </div>
      <div class="flex gap-2">
        <AppButton @click="handleBack" variant="secondary">Back</AppButton>
        <AppButton @click="handleEdit" variant="primary">Edit</AppButton>
        <AppButton @click="handleDelete" variant="danger">Delete</AppButton>
      </div>
    </header>

    <!-- Course Details -->
    <div v-if="course" class="animate-fade-in">
      <!-- Course Header Card -->
      <div class="bg-primary-light rounded-xl p-6 mb-6 border border-border">
        <div class="flex flex-wrap gap-4 items-start justify-between">
          <div>
            <h2 class="text-3xl font-bold text-text-primary mb-2">{{ course.code }} - {{ course.name }}</h2>
            <p class="text-text-secondary mb-4">{{ course.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span class="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                {{ course.department }}
              </span>
              <span class="inline-block bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                {{ course.program }}
              </span>
              <span class="inline-block bg-success-bg text-success px-3 py-1 rounded-full text-sm font-semibold">
                {{ course.credits }} Credits
              </span>
              <span class="inline-block" :class="`status-${course.status.toLowerCase().replace('-', '')} px-3 py-1 rounded-full text-sm font-semibold`">
                {{ course.status === 'active' ? 'Active' : course.status === 'on-leave' ? 'On Leave' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <!-- Faculty Assignment -->
        <div class="bg-bg-light rounded-xl p-5 border border-border">
          <h3 class="text-lg font-semibold text-text-primary mb-3">Faculty Assignment</h3>
          <div v-if="course.facultyName" class="flex items-center gap-3">
            <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
              {{ course.facultyName.charAt(0) }}
            </div>
            <div>
              <p class="font-semibold text-text-primary">{{ course.facultyName }}</p>
              <p class="text-sm text-text-muted">Instructor</p>
            </div>
          </div>
          <p v-else class="text-text-muted italic">No faculty assigned</p>
        </div>

        <!-- Enrollment -->
        <div class="bg-bg-light rounded-xl p-5 border border-border">
          <h3 class="text-lg font-semibold text-text-primary mb-3">Enrollment</h3>
          <div class="flex items-end gap-2 mb-2">
            <span class="text-3xl font-bold" :style="{ color: enrollmentColor }">{{ course.enrolled }}</span>
            <span class="text-text-muted mb-1">/ {{ course.capacity }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all"
              :style="{ width: enrollmentPercentage + '%', backgroundColor: enrollmentColor }"
            ></div>
          </div>
          <p class="text-sm text-text-muted mt-2">{{ enrollmentPercentage }}% capacity</p>
        </div>

        <!-- Schedule -->
        <div class="bg-bg-light rounded-xl p-5 border border-border">
          <h3 class="text-lg font-semibold text-text-primary mb-3">Schedule</h3>
          <div class="space-y-2">
            <p class="text-text-primary"><strong>Time:</strong> {{ course.schedule || 'Not set' }}</p>
            <p class="text-text-primary"><strong>Room:</strong> {{ course.room || 'Not set' }}</p>
            <p class="text-text-primary"><strong>Semester:</strong> {{ course.semester }}</p>
          </div>
        </div>

        <!-- Course Info -->
        <div class="bg-bg-light rounded-xl p-5 border border-border">
          <h3 class="text-lg font-semibold text-text-primary mb-3">Course Information</h3>
          <div class="space-y-2">
            <p class="text-text-primary"><strong>Level:</strong> {{ course.level }}</p>
            <p class="text-text-primary"><strong>Category:</strong> {{ course.category }}</p>
            <p class="text-text-primary"><strong>Status:</strong> {{ course.status }}</p>
          </div>
        </div>

        <!-- Prerequisites -->
        <div class="bg-bg-light rounded-xl p-5 border border-border md:col-span-2">
          <h3 class="text-lg font-semibold text-text-primary mb-3">Prerequisites</h3>
          <div v-if="course.prerequisites && course.prerequisites.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="prereq in course.prerequisites"
              :key="prereq"
              class="inline-block bg-warning-bg text-warning px-3 py-1 rounded-full text-sm font-semibold"
            >
              {{ prereq }}
            </span>
          </div>
          <p v-else class="text-text-muted italic">No prerequisites</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-gray-500">
      <p>Loading course data...</p>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold text-text-primary mb-4">Delete Course</h3>
        <p class="text-text-secondary mb-6">
          Are you sure you want to delete this course? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 rounded-lg border border-border text-text-primary hover:bg-bg-light">
            Cancel
          </button>
          <button
            @click="confirmDelete"
            :disabled="loading"
            class="px-4 py-2 rounded-lg bg-error text-white hover:bg-error-dark disabled:opacity-50"
          >
            {{ loading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
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

.status-active {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.status-onleave {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.status-inactive {
  background: var(--color-error-bg);
  color: var(--color-error);
}
</style>
