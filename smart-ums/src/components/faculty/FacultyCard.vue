<template>
  <article class="bg-gradient-to-br from-primary-light/50 to-bg-page/50 border border-border rounded-xl p-6 flex flex-col h-full transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-primary">
    <div class="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-border">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-lg border-2 border-border bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
          <img v-if="faculty.imageUrl" :src="faculty.imageUrl" :alt="faculty.name" class="w-full h-full object-cover" />
          <span v-else class="text-gray-400 text-2xl font-bold">{{ faculty.name?.charAt(0) || '?' }}</span>
        </div>
        <div>
          <h3 class="text-xl font-bold text-text-primary mb-1">{{ faculty.name }}</h3>
          <span class="inline-block bg-primary text-white px-2 py-0.5 rounded text-sm font-semibold">{{ faculty.designation }}</span>
        </div>
      </div>
      <span :class="statusBadgeClasses">
        {{ faculty.status === 'active' ? '✓' : faculty.status === 'on-leave' ? '⏸' : '✗' }}
      </span>
    </div>

    <div class="mb-4 flex-grow">
      <p class="text-text-secondary text-sm leading-relaxed m-0">{{ faculty.specialization }}</p>
    </div>

    <div class="bg-white rounded-lg p-4 mb-4 border border-border-light">
      <div class="flex gap-2 mb-2 text-sm">
        <span class="font-semibold text-text-secondary min-w-[70px]">Email:</span>
        <span class="text-primary flex-1 break-all">{{ faculty.email }}</span>
      </div>
      <div class="flex gap-2 mb-2 text-sm">
        <span class="font-semibold text-text-secondary min-w-[70px]">Phone:</span>
        <span class="text-text-primary flex-1">{{ faculty.phone }}</span>
      </div>
      <div class="flex gap-2 text-sm">
        <span class="font-semibold text-text-secondary min-w-[70px]">Office:</span>
        <span class="text-text-primary flex-1">{{ faculty.office }}</span>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-3 mb-4 bg-white p-4 rounded-lg border border-border-light">
      <div class="text-center">
        <div class="text-2xl font-bold text-primary">{{ faculty.courses }}</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-0.5">Courses</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-primary">{{ faculty.totalStudents }}</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-0.5">Students</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-primary">{{ faculty.experience }}</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-0.5">Years</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-primary">{{ faculty.publications }}</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-0.5">Pubs</div>
      </div>
    </div>

    <div v-if="faculty.researchInterests && faculty.researchInterests.length" class="mb-4">
      <span class="block text-sm font-semibold text-text-secondary mb-2">Research Interests:</span>
      <div class="flex flex-wrap gap-2">
        <span v-for="interest in faculty.researchInterests" :key="interest" class="bg-white border border-border text-primary px-2 py-0.5 rounded-full text-sm font-medium">
          {{ interest }}
        </span>
      </div>
    </div>

    <div class="flex justify-between items-center pt-4 border-t border-border">
      <div class="flex gap-2 items-center">
        <span v-if="faculty.isHead" class="inline-block bg-success-bg text-success px-3 py-1 rounded text-sm font-semibold">👑 Dept Head</span>
      </div>
      <div class="flex gap-2">
        <button @click="$emit('view', faculty.id)" class="bg-primary-light text-primary border border-border px-3 py-1.5 rounded text-sm font-semibold transition-all hover:bg-primary hover:text-white">View</button>
        <button @click="$emit('edit', faculty.id)" class="bg-primary-light text-primary border border-border px-3 py-1.5 rounded text-sm font-semibold transition-all hover:bg-primary hover:text-white">Edit</button>
        <button @click="$emit('delete', faculty.id)" class="bg-error-light text-error border border-border px-3 py-1.5 rounded text-sm font-semibold transition-all hover:bg-error hover:text-white">Delete</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'FacultyCard' })

const props = defineProps({
  faculty: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'delete'])

const statusBadgeClasses = computed(() => {
  if (props.faculty.status === 'active') {
    return 'bg-success-bg text-success px-3 py-1 rounded-full text-sm font-semibold'
  } else if (props.faculty.status === 'on-leave') {
    return 'bg-warning-bg text-warning px-3 py-1 rounded-full text-sm font-semibold'
  } else {
    return 'bg-error-bg text-error px-3 py-1 rounded-full text-sm font-semibold'
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
