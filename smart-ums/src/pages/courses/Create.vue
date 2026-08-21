<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course.store'
import { useToast } from '@/composables/useToast'
import CourseForm from '@/components/courses/CourseForm.vue'

defineOptions({ name: 'CourseCreate' })

const router = useRouter()
const courseStore = useCourseStore()
const toast = useToast()

const loading = ref(false)

const handleSubmit = async (formData) => {
  loading.value = true
  try {
    await courseStore.createCourse(formData)
    toast.success('Course created successfully')
    router.push({ name: 'courses' })
  } catch (error) {
    toast.error('Failed to create course')
    console.error('Create error:', error)
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
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Add New Course</h1>
        <p class="m-0 text-sm text-text-secondary">Create a new course and assign faculty members.</p>
      </div>
    </header>

    <!-- Course Form -->
    <CourseForm
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </section>
</template>
