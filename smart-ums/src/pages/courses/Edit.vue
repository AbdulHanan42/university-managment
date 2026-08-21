<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/course.store'
import { useToast } from '@/composables/useToast'
import CourseForm from '@/components/courses/CourseForm.vue'

defineOptions({ name: 'CourseEdit' })

const router = useRouter()
const route = useRoute()
const courseStore = useCourseStore()
const toast = useToast()

const loading = ref(false)
const initialData = ref({})

onMounted(async () => {
  try {
    const course = await courseStore.fetchCourseById(route.params.id)
    if (course) {
      initialData.value = course
    } else {
      toast.error('Course not found')
      router.push({ name: 'courses' })
    }
  } catch (error) {
    toast.error('Failed to load course')
    console.error('Load error:', error)
    router.push({ name: 'courses' })
  }
})

const handleSubmit = async (formData) => {
  loading.value = true
  try {
    await courseStore.updateCourse(route.params.id, formData)
    toast.success('Course updated successfully')
    router.push({ name: 'courses' })
  } catch (error) {
    toast.error('Failed to update course')
    console.error('Update error:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'courses' })
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <!-- Header -->
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Course Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Edit Course</h1>
        <p class="m-0 text-sm text-text-secondary">Update course details and faculty assignment.</p>
      </div>
    </header>

    <!-- Course Form -->
    <CourseForm
      v-if="Object.keys(initialData).length > 0"
      :initial-data="initialData"
      :is-edit="true"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
    <div v-else class="text-center py-12 text-gray-500">
      <p>Loading course data...</p>
    </div>
  </section>
</template>
