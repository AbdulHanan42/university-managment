<script setup>
import { ref, onMounted } from 'vue'
import { useEnrollmentStore } from '@/stores/enrollment.store'
import { useRouter } from 'vue-router'

defineOptions({ name: 'EnrollmentIndex' })

const router = useRouter()
const enrollmentStore = useEnrollmentStore()

onMounted(() => {
  enrollmentStore.fetchEnrollmentData()
})

const handleViewHistory = () => {
  router.push({ name: 'enrollment-history' })
}

const handleNewRegistration = () => {
  router.push({ name: 'enrollment-register' })
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Enrollment Management</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Enrollment</h1>
        <p class="m-0 text-sm text-text-secondary">Review registration activity, course requests, and student progression.</p>
      </div>
    </header>

    <div v-if="enrollmentStore.loading" class="text-center py-12 text-text-muted">
      <p>Loading enrollment data...</p>
    </div>

    <div v-else-if="enrollmentStore.error" class="text-center py-12 text-error">
      <p>{{ enrollmentStore.error }}</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <article v-for="card in enrollmentStore.summaryCards" :key="card.title" class="bg-primary-light rounded-xl p-5 border border-border transition-all hover:bg-primary">
          <h2 class="mb-2 text-sm text-text-secondary font-semibold">{{ card.title }}</h2>
          <p class="mb-1 text-3xl font-bold text-text-primary">{{ card.value }}</p>
          <span class="text-xs text-text-muted">{{ card.subtitle }}</span>
        </article>
      </div>

      <!-- Quick Actions -->
      <div class="bg-bg-light border border-border rounded-xl p-6">
        <h2 class="mb-4 text-lg font-bold text-text-primary">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button @click="handleNewRegistration" class="bg-bg-white border border-border rounded-lg p-4 text-left hover:border-primary transition-all">
            <div class="text-2xl mb-2">📝</div>
            <div class="font-semibold text-text-primary">New Registration</div>
            <div class="text-sm text-text-muted">Register for courses</div>
          </button>
          <button @click="handleViewHistory" class="bg-bg-white border border-border rounded-lg p-4 text-left hover:border-primary transition-all">
            <div class="text-2xl mb-2">📊</div>
            <div class="font-semibold text-text-primary">Enrollment History</div>
            <div class="text-sm text-text-muted">View past enrollments</div>
          </button>
        </div>
      </div>

      <!-- Statistics Overview -->
      <div v-if="enrollmentStore.statistics" class="bg-bg-light border border-border rounded-xl p-6">
        <h2 class="mb-4 text-lg font-bold text-text-primary">Enrollment Statistics</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-bg-white border border-border rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-primary mb-1">{{ enrollmentStore.statistics.totalStudents }}</div>
            <div class="text-xs text-text-secondary uppercase tracking-wider">Total Students</div>
          </div>
          <div class="bg-bg-white border border-border rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-secondary mb-1">{{ enrollmentStore.statistics.totalCourses }}</div>
            <div class="text-xs text-text-secondary uppercase tracking-wider">Total Courses</div>
          </div>
          <div class="bg-bg-white border border-border rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-success mb-1">{{ enrollmentStore.statistics.activeEnrollments }}</div>
            <div class="text-xs text-text-secondary uppercase tracking-wider">Active Enrollments</div>
          </div>
          <div class="bg-bg-white border border-border rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-warning mb-1">{{ enrollmentStore.statistics.pendingApprovals }}</div>
            <div class="text-xs text-text-secondary uppercase tracking-wider">Pending Approvals</div>
          </div>
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
</style>
