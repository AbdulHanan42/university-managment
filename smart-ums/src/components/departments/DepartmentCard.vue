<template>
  <article class="bg-gradient-to-br from-primary-light/50 to-bg-page/50 border border-border rounded-xl p-6 flex flex-col h-full transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-primary">
    <div class="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-border">
      <div>
        <h3 class="text-xl font-bold text-text-primary mb-1">{{ department.name }}</h3>
        <span class="inline-block bg-primary text-white px-2 py-0.5 rounded text-sm font-semibold">{{ department.code }}</span>
      </div>
      <span :class="statusBadgeClasses">
        {{ department.status === 'active' ? '✓' : '✗' }}
      </span>
    </div>

    <div class="mb-4 flex-grow">
      <p class="text-text-secondary text-sm leading-relaxed m-0 line-clamp-2">{{ department.description }}</p>
    </div>

    <div class="bg-white rounded-lg p-4 mb-4 border border-border-light">
      <div class="flex gap-2 mb-2 text-sm">
        <span class="font-semibold text-text-secondary min-w-[50px]">Faculty:</span>
        <span class="text-text-primary flex-1">{{ department.faculty }}</span>
      </div>
      <div class="flex gap-2 mb-2 text-sm">
        <span class="font-semibold text-text-secondary min-w-[50px]">Head:</span>
        <span class="text-text-primary flex-1">{{ department.head }}</span>
      </div>
      <div class="flex gap-2 text-sm">
        <span class="font-semibold text-text-secondary min-w-[50px]">Email:</span>
        <span class="text-primary flex-1 break-all">{{ department.headEmail }}</span>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-3 mb-4 bg-white p-4 rounded-lg border border-border-light">
      <div class="text-center">
        <div class="text-2xl font-bold text-primary">{{ department.programs }}</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-0.5">Programs</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-primary">{{ department.faculty_count }}</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-0.5">Faculty</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-primary">{{ department.students }}</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-0.5">Students</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-primary">{{ department.establishment_year }}</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-0.5">Est.</div>
      </div>
    </div>

    <div v-if="department.specialization && department.specialization.length" class="mb-4">
      <span class="block text-sm font-semibold text-text-secondary mb-2">Specializations:</span>
      <div class="flex flex-wrap gap-2">
        <span v-for="spec in department.specialization" :key="spec" class="bg-white border border-border text-primary px-2 py-0.5 rounded-full text-sm font-medium">
          {{ spec }}
        </span>
      </div>
    </div>

    <div class="flex justify-between items-center pt-4 border-t border-border">
      <div class="flex gap-2 items-center">
        <span v-if="department.accredited" class="inline-block bg-success-bg text-success px-3 py-1 rounded text-sm font-semibold">✓ Accredited</span>
        <span v-if="department.accreditationBody" class="bg-primary-light text-primary px-3 py-1 rounded text-sm font-semibold">
          {{ department.accreditationBody }}
        </span>
      </div>
      <div class="flex gap-2">
        <button @click="$emit('view', department.id)" class="bg-primary-light text-primary border border-border px-3 py-1.5 rounded text-sm font-semibold transition-all hover:bg-primary hover:text-white">View</button>
        <button @click="$emit('edit', department.id)" class="bg-primary-light text-primary border border-border px-3 py-1.5 rounded text-sm font-semibold transition-all hover:bg-primary hover:text-white">Edit</button>
        <button @click="handleDelete" class="bg-error-light text-error border border-border px-3 py-1.5 rounded text-sm font-semibold transition-all hover:bg-error hover:text-white">Delete</button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Department"
      :message="`Are you sure you want to delete department ${department.name}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="handleConfirmDelete"
      @cancel="showDeleteModal = false"
    />
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

defineOptions({ name: 'DepartmentCard' })

const props = defineProps({
  department: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'delete'])

const showDeleteModal = ref(false)

const handleDelete = () => {
  showDeleteModal.value = true
}

const handleConfirmDelete = () => {
  emit('delete', props.department.id)
  showDeleteModal.value = false
}

const statusBadgeClasses = computed(() => {
  return department.status === 'active'
    ? 'bg-success-bg text-success px-3 py-1 rounded-full text-sm font-semibold'
    : 'bg-error-bg text-error px-3 py-1 rounded-full text-sm font-semibold'
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
