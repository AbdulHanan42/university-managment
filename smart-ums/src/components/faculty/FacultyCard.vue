<template>
  <article class="faculty-card bg-white border border-border rounded-xl p-6 flex flex-col h-full transition-all duration-300 cursor-pointer">
    <div class="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-border">
      <div class="flex items-center gap-4">
        <div class="faculty-avatar w-16 h-16 rounded-lg border-2 border-border bg-white flex items-center justify-center overflow-hidden flex-shrink-0 transition-all duration-300">
          <img v-if="faculty.imageUrl" :src="faculty.imageUrl" :alt="faculty.name" class="w-full h-full object-cover" />
          <span v-else class="text-gray-400 text-2xl font-bold">{{ faculty.name?.charAt(0) || '?' }}</span>
        </div>
        <div>
          <h3 class="text-xl font-bold text-text-primary mb-1 transition-colors duration-300">{{ faculty.name }}</h3>
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

    <div class="bg-bg-light rounded-lg p-4 mb-4 border border-border-light transition-all duration-300">
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

    <div class="grid grid-cols-4 gap-3 mb-4 bg-bg-light p-4 rounded-lg border border-border-light transition-all duration-300">
      <div class="text-center stat-item">
        <div class="text-2xl font-bold text-primary transition-colors duration-300">{{ faculty.courses }}</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-0.5">Courses</div>
      </div>
      <div class="text-center stat-item">
        <div class="text-2xl font-bold text-primary transition-colors duration-300">{{ faculty.totalStudents }}</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-0.5">Students</div>
      </div>
      <div class="text-center stat-item">
        <div class="text-2xl font-bold text-primary transition-colors duration-300">{{ faculty.experience }}</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-0.5">Years</div>
      </div>
      <div class="text-center stat-item">
        <div class="text-2xl font-bold text-primary transition-colors duration-300">{{ faculty.publications }}</div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-0.5">Pubs</div>
      </div>
    </div>

    <div v-if="faculty.researchInterests && faculty.researchInterests.length" class="mb-4">
      <span class="block text-sm font-semibold text-text-secondary mb-2">Research Interests:</span>
      <div class="flex flex-wrap gap-2">
        <span v-for="interest in faculty.researchInterests" :key="interest" class="bg-bg-light border border-border text-primary px-2 py-0.5 rounded-full text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary cursor-default">
          {{ interest }}
        </span>
      </div>
    </div>

    <div class="flex justify-between items-center pt-4 border-t border-border">
      <div class="flex gap-2 items-center">
        <span v-if="faculty.isHead" class="inline-block bg-success-bg text-success px-3 py-1 rounded text-sm font-semibold transition-all duration-300 hover:bg-success hover:text-white">👑 Dept Head</span>
      </div>
      <div class="flex gap-2">
        <button @click="$emit('view', faculty.id)" class="action-btn btn-view bg-primary-light text-primary border border-border px-3 py-1.5 rounded text-sm font-semibold transition-all duration-300">View</button>
        <button @click="$emit('edit', faculty.id)" class="action-btn btn-edit bg-primary-light text-primary border border-border px-3 py-1.5 rounded text-sm font-semibold transition-all duration-300">Edit</button>
        <button @click="handleDelete" class="action-btn btn-delete bg-error-light text-error border border-border px-3 py-1.5 rounded text-sm font-semibold transition-all duration-300">Delete</button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Faculty Member"
      :message="`Are you sure you want to delete faculty member ${faculty.name}? This action cannot be undone.`"
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

defineOptions({ name: 'FacultyCard' })

const props = defineProps({
  faculty: {
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
  emit('delete', props.faculty.id)
  showDeleteModal.value = false
}

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
.faculty-card {
  position: relative;
  overflow: hidden;
}

.faculty-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary);
}

.faculty-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-accent));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.faculty-card:hover::before {
  transform: scaleX(1);
}

.faculty-avatar {
  transition: all 0.3s ease;
}

.faculty-card:hover .faculty-avatar {
  transform: scale(1.1);
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(33, 77, 156, 0.3);
}

.faculty-card:hover h3 {
  color: var(--color-primary);
}

.faculty-card:hover .bg-bg-light {
  background: var(--color-bg-light);
  border-color: var(--color-primary-light);
}

.stat-item {
  transition: all 0.3s ease;
}

.faculty-card:hover .stat-item {
  transform: translateY(-2px);
}

.faculty-card:hover .stat-item .text-2xl {
  color: var(--color-primary-accent);
  transform: scale(1.1);
}

.action-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.action-btn:hover::before {
  width: 200px;
  height: 200px;
}

.btn-view:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 77, 156, 0.4);
}

.btn-edit:hover {
  background: var(--color-secondary);
  color: white;
  border-color: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-delete:hover {
  background: var(--color-error);
  color: white;
  border-color: var(--color-error);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
