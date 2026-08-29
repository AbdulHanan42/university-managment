<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEnrollmentStore } from '@/stores/enrollment.store'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

defineOptions({ name: 'EnrollmentHistory' })

const router = useRouter()
const enrollmentStore = useEnrollmentStore()
const toast = useToast()

const filterStatus = ref('all')
const searchQuery = ref('')

onMounted(() => {
  enrollmentStore.fetchEnrollments()
})

const filteredEnrollments = computed(() => {
  let enrollments = enrollmentStore.enrollments

  if (filterStatus.value !== 'all') {
    enrollments = enrollments.filter(e => e.status === filterStatus.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    enrollments = enrollments.filter(e => 
      e.studentName.toLowerCase().includes(query) ||
      e.studentId.toLowerCase().includes(query) ||
      e.courseName.toLowerCase().includes(query) ||
      e.courseId.toLowerCase().includes(query)
    )
  }

  return enrollments
})

const getStatusColor = (status) => {
  switch (status) {
    case 'approved': return 'bg-success-light text-success'
    case 'pending': return 'bg-warning-light text-warning'
    case 'rejected': return 'bg-error-light text-error'
    default: return 'bg-bg-light text-text-muted'
  }
}

const handleApprove = async (enrollmentId) => {
  try {
    await enrollmentStore.approveEnrollment(enrollmentId)
    toast.success('Enrollment approved successfully')
  } catch (error) {
    toast.error('Failed to approve enrollment')
  }
}

const handleReject = async (enrollmentId) => {
  try {
    await enrollmentStore.rejectEnrollment(enrollmentId)
    toast.success('Enrollment rejected successfully')
  } catch (error) {
    toast.error('Failed to reject enrollment')
  }
}

const handleDelete = (enrollmentId) => {
  enrollmentStore.enrollments = enrollmentStore.enrollments.filter(e => e.id !== enrollmentId)
  toast.success('Enrollment deleted')
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
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Enrollment History</h1>
        <p class="m-0 text-sm text-text-secondary">View and manage all course enrollments.</p>
      </div>
      <button 
        @click="handleNewRegistration"
        class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all"
      >
        + New Registration
      </button>
    </header>

    <div v-if="enrollmentStore.loading" class="text-center py-12 text-text-muted">
      <p>Loading enrollment data...</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-primary-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-primary mb-1">{{ enrollmentStore.enrollments.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Total Enrollments</div>
        </div>
        <div class="bg-warning-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-warning mb-1">{{ enrollmentStore.pendingEnrollments.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Pending</div>
        </div>
        <div class="bg-success-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-success mb-1">{{ enrollmentStore.approvedEnrollments.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Approved</div>
        </div>
        <div class="bg-error-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-error mb-1">{{ enrollmentStore.rejectedEnrollments.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Rejected</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-bg-light border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Search</label>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search students or courses..." 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Status</label>
            <select 
              v-model="filterStatus" 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div class="flex items-end">
            <button 
              @click="enrollmentStore.fetchEnrollments()" 
              class="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex gap-2">
        <button 
          v-for="status in ['all', 'pending', 'approved', 'rejected']"
          :key="status"
          @click="filterStatus = status"
          :class="filterStatus === status ? 'bg-primary text-white' : 'bg-bg-light text-text-primary'"
          class="px-4 py-2 rounded-lg font-medium text-sm transition-all"
        >
          {{ status.charAt(0).toUpperCase() + status.slice(1) }}
        </button>
      </div>

      <!-- Enrollments Table -->
      <div v-if="filteredEnrollments.length === 0" class="text-center py-12 text-text-muted">
        <p>No enrollments found matching your criteria.</p>
      </div>

      <div v-else class="bg-bg-white border border-border rounded-xl overflow-hidden">
        <table class="w-full">
          <thead class="bg-bg-light">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Student ID</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Student Name</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Course</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Credits</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Semester</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Status</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Date</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="enrollment in filteredEnrollments" 
              :key="enrollment.id" 
              class="border-b border-border-light hover:bg-bg-light transition-all"
            >
              <td class="px-4 py-3 text-sm text-text-primary font-mono">{{ enrollment.studentId }}</td>
              <td class="px-4 py-3 text-sm text-text-primary font-semibold">{{ enrollment.studentName }}</td>
              <td class="px-4 py-3 text-sm text-text-primary">
                <div>{{ enrollment.courseId }}</div>
                <div class="text-xs text-text-secondary">{{ enrollment.courseName }}</div>
              </td>
              <td class="px-4 py-3 text-sm text-text-primary">{{ enrollment.credits }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ enrollment.semester }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="getStatusColor(enrollment.status)" class="px-2 py-1 rounded text-xs font-semibold">
                  {{ enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ new Date(enrollment.enrolledDate).toLocaleDateString() }}</td>
              <td class="px-4 py-3 text-sm">
                <div class="flex gap-2">
                  <button 
                    v-if="enrollment.status === 'pending'"
                    @click="handleApprove(enrollment.id)"
                    class="text-success hover:text-success-dark font-medium"
                  >
                    Approve
                  </button>
                  <button 
                    v-if="enrollment.status === 'pending'"
                    @click="handleReject(enrollment.id)"
                    class="text-error hover:text-error-dark font-medium"
                  >
                    Reject
                  </button>
                  <button 
                    @click="handleDelete(enrollment.id)"
                    class="text-text-muted hover:text-text-primary font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
