<template>
  <article class="bg-gradient-to-br from-blue-50/50 to-blue-100/50 border border-blue-100 rounded-xl p-6 flex flex-col h-full transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-blue-600">
    <div class="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-blue-100">
      <div>
        <h3 class="text-xl font-bold text-gray-900 mb-1">{{ department.name }}</h3>
        <span class="inline-block bg-blue-600 text-white px-2 py-0.5 rounded text-sm font-semibold">{{ department.code }}</span>
      </div>
      <span :class="statusBadgeClasses">
        {{ department.status === 'active' ? '✓' : '✗' }}
      </span>
    </div>

    <div class="mb-4 flex-grow">
      <p class="text-gray-600 text-sm leading-relaxed m-0 line-clamp-2">{{ department.description }}</p>
    </div>

    <div class="bg-white rounded-lg p-4 mb-4 border border-blue-50">
      <div class="flex gap-2 mb-2 text-sm">
        <span class="font-semibold text-gray-600 min-w-[50px]">Faculty:</span>
        <span class="text-gray-900 flex-1">{{ department.faculty }}</span>
      </div>
      <div class="flex gap-2 mb-2 text-sm">
        <span class="font-semibold text-gray-600 min-w-[50px]">Head:</span>
        <span class="text-gray-900 flex-1">{{ department.head }}</span>
      </div>
      <div class="flex gap-2 text-sm">
        <span class="font-semibold text-gray-600 min-w-[50px]">Email:</span>
        <span class="text-blue-600 flex-1 break-all">{{ department.headEmail }}</span>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-3 mb-4 bg-white p-4 rounded-lg border border-blue-50">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{{ department.programs }}</div>
        <div class="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Programs</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{{ department.faculty_count }}</div>
        <div class="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Faculty</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{{ department.students }}</div>
        <div class="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Students</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{{ department.establishment_year }}</div>
        <div class="text-xs text-gray-500 uppercase tracking-wider mt-0.5">Est.</div>
      </div>
    </div>

    <div v-if="department.specialization && department.specialization.length" class="mb-4">
      <span class="block text-sm font-semibold text-gray-600 mb-2">Specializations:</span>
      <div class="flex flex-wrap gap-2">
        <span v-for="spec in department.specialization" :key="spec" class="bg-white border border-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-sm font-medium">
          {{ spec }}
        </span>
      </div>
    </div>

    <div class="flex justify-between items-center pt-4 border-t border-blue-100">
      <div class="flex gap-2 items-center">
        <span v-if="department.accredited" class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">✓ Accredited</span>
        <span v-if="department.accreditationBody" class="bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm font-semibold">
          {{ department.accreditationBody }}
        </span>
      </div>
      <div class="flex gap-2">
        <button @click="$emit('view')" class="bg-white border border-blue-100 px-2 py-1 rounded text-sm font-medium transition-all hover:bg-blue-600 hover:border-blue-600 hover:text-white" title="View Details">View</button>
        <button @click="$emit('edit')" class="bg-white border border-blue-100 px-2 py-1 rounded text-sm font-medium transition-all hover:bg-blue-600 hover:border-blue-600 hover:text-white" title="Edit">Edit</button>
        <button @click="$emit('delete')" class="bg-white border border-blue-100 px-2 py-1 rounded text-sm font-medium transition-all hover:bg-red-600 hover:border-red-600 hover:text-white" title="Delete">Delete</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'DepartmentCard' })

const props = defineProps({
  department: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'delete'])

const statusBadgeClasses = computed(() => {
  const baseClasses = 'w-7 h-7 rounded-full flex items-center justify-center font-bold text-base'
  return props.department.status === 'active'
    ? `${baseClasses} bg-green-100 text-green-800`
    : `${baseClasses} bg-red-100 text-red-800`
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
