<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEnrollmentStore } from '@/stores/enrollment.store'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

defineOptions({ name: 'EnrollmentRegister' })

const router = useRouter()
const enrollmentStore = useEnrollmentStore()
const toast = useToast()

const formData = ref({
  studentId: '',
  studentName: '',
  courseId: '',
  semester: 'Fall 2024'
})

const selectedCourses = ref([])
const isSubmitting = ref(false)

const semesters = ['Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025']

onMounted(() => {
  enrollmentStore.fetchAvailableCourses()
})

const totalCredits = computed(() => {
  return selectedCourses.value.reduce((sum, course) => sum + course.credits, 0)
})

const toggleCourse = (course) => {
  const index = selectedCourses.value.findIndex(c => c.id === course.id)
  if (index !== -1) {
    selectedCourses.value.splice(index, 1)
  } else {
    selectedCourses.value.push(course)
  }
}

const isCourseSelected = (course) => {
  return selectedCourses.value.some(c => c.id === course.id)
}

const handleSubmit = async () => {
  if (selectedCourses.value.length === 0) {
    toast.error('Please select at least one course')
    return
  }

  if (totalCredits.value > 18) {
    toast.error('Maximum credit load is 18 credits')
    return
  }

  isSubmitting.value = true
  
  try {
    // Submit each course enrollment
    for (const course of selectedCourses.value) {
      await enrollmentStore.submitEnrollment({
        studentId: formData.value.studentId,
        studentName: formData.value.studentName,
        courseId: course.code,
        courseName: course.name,
        credits: course.credits,
        semester: formData.value.semester
      })
    }
    
    toast.success('Enrollment submitted successfully!')
    router.push({ name: 'enrollment-history' })
  } catch (error) {
    toast.error('Failed to submit enrollment')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'enrollment' })
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Enrollment Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Course Registration</h1>
        <p class="m-0 text-sm text-text-secondary">Register for courses for the upcoming semester.</p>
      </div>
    </header>

    <div v-if="enrollmentStore.loading" class="text-center py-12 text-text-muted">
      <p>Loading available courses...</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Student Information -->
      <div class="bg-bg-light border border-border rounded-xl p-6">
        <h2 class="mb-4 text-lg font-bold text-text-primary">Student Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Student ID *</label>
            <input 
              v-model="formData.studentId" 
              type="text" 
              required
              placeholder="Enter your student ID"
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Student Name *</label>
            <input 
              v-model="formData.studentName" 
              type="text" 
              required
              placeholder="Enter your full name"
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Semester *</label>
            <select 
              v-model="formData.semester" 
              required
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option v-for="semester in semesters" :key="semester" :value="semester">{{ semester }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Available Courses -->
      <div class="bg-bg-light border border-border rounded-xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-text-primary">Available Courses</h2>
          <div class="text-sm">
            <span class="text-text-muted">Selected Credits: </span>
            <span class="font-bold text-primary">{{ totalCredits }}/18</span>
          </div>
        </div>

        <div v-if="enrollmentStore.availableCourses.length === 0" class="text-center py-12 text-text-muted">
          <p>No courses available for registration.</p>
        </div>

        <div v-else class="space-y-3">
          <div 
            v-for="course in enrollmentStore.availableCourses" 
            :key="course.id"
            @click="toggleCourse(course)"
            :class="isCourseSelected(course) ? 'border-primary bg-primary-light' : 'border-border'"
            class="bg-bg-white border rounded-lg p-4 cursor-pointer hover:border-primary transition-all"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <input 
                    type="checkbox" 
                    :checked="isCourseSelected(course)"
                    class="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <h3 class="text-lg font-bold text-text-primary">{{ course.code }} - {{ course.name }}</h3>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span class="text-text-muted">Credits:</span>
                    <span class="font-semibold text-text-primary ml-1">{{ course.credits }}</span>
                  </div>
                  <div>
                    <span class="text-text-muted">Department:</span>
                    <span class="font-semibold text-text-primary ml-1">{{ course.department }}</span>
                  </div>
                  <div>
                    <span class="text-text-muted">Instructor:</span>
                    <span class="font-semibold text-text-primary ml-1">{{ course.instructor }}</span>
                  </div>
                  <div>
                    <span class="text-text-muted">Capacity:</span>
                    <span class="font-semibold text-text-primary ml-1">{{ course.enrolled }}/{{ course.capacity }}</span>
                  </div>
                </div>
              </div>
              <div :class="course.enrolled >= course.capacity ? 'text-error' : 'text-success'" class="text-xs font-semibold">
                {{ course.enrolled >= course.capacity ? 'Full' : 'Available' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Courses Summary -->
      <div v-if="selectedCourses.length > 0" class="bg-success-light border border-border rounded-xl p-6">
        <h2 class="mb-4 text-lg font-bold text-text-primary">Selected Courses ({{ selectedCourses.length }})</h2>
        <div class="space-y-2">
          <div v-for="course in selectedCourses" :key="course.id" class="flex justify-between items-center bg-bg-white rounded-lg p-3">
            <div>
              <span class="font-semibold text-text-primary">{{ course.code }}</span>
              <span class="text-text-secondary ml-2">{{ course.name }}</span>
            </div>
            <span class="text-sm font-bold text-primary">{{ course.credits }} credits</span>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-border">
          <div class="flex justify-between items-center">
            <span class="text-text-secondary">Total Credits:</span>
            <span class="text-xl font-bold text-primary">{{ totalCredits }}</span>
          </div>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="flex gap-4 justify-end">
        <button 
          type="button" 
          @click="handleCancel"
          class="px-6 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit"
          :disabled="isSubmitting || selectedCourses.length === 0"
          class="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Enrollment' }}
        </button>
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
