<template>
  <section class="bg-white border border-blue-100 rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-8 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">Faculty Management</p>
        <h1 class="mb-1 text-2xl font-bold text-gray-900">Faculty Details</h1>
        <p class="m-0 text-sm text-gray-600">View detailed information about this faculty member.</p>
      </div>
      <div class="flex gap-3">
        <AppButton @click="handleEdit">Edit Faculty</AppButton>
        <button @click="handleDelete" class="bg-red-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors hover:bg-red-700">Delete</button>
      </div>
    </header>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      <p>Loading faculty data...</p>
    </div>

    <div v-else-if="faculty" class="flex flex-col gap-6">
      <!-- Profile Image Card -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <div class="flex items-center gap-6">
          <div class="flex-shrink-0">
            <div class="w-32 h-32 rounded-lg border-2 border-blue-200 bg-white flex items-center justify-center overflow-hidden">
              <img v-if="faculty.imageUrl" :src="faculty.imageUrl" :alt="faculty.name" class="w-full h-full object-cover" />
              <span v-else class="text-4xl font-bold text-gray-400">{{ faculty.name?.charAt(0) || '?' }}</span>
            </div>
          </div>
          <div class="flex-grow">
            <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ faculty.name }}</h2>
            <p class="text-lg text-blue-600 font-medium mb-2">{{ faculty.designation }}</p>
            <p class="text-sm text-gray-600">{{ faculty.department }}</p>
          </div>
        </div>
      </div>

      <!-- Basic Info Card -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Personal Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</span>
            <span class="text-base font-medium text-gray-900">{{ faculty.name }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</span>
            <span class="text-base font-medium text-blue-600">{{ faculty.email }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</span>
            <span class="text-base font-medium text-gray-900">{{ faculty.phone || 'N/A' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</span>
            <span :class="faculty.status === 'active' ? 'bg-green-100 text-green-800' : faculty.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'" class="inline-block px-3 py-1 rounded-full text-xs font-semibold">
              {{ faculty.status === 'active' ? '✓ Active' : faculty.status === 'on-leave' ? '⏸ On Leave' : '✗ Inactive' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Academic Information Card -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Academic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</span>
            <span class="text-base font-medium text-gray-900">{{ faculty.department }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Designation</span>
            <span class="inline-block bg-blue-600 text-white px-3 py-1 rounded font-semibold text-sm">{{ faculty.designation }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Specialization</span>
            <span class="text-base font-medium text-gray-900">{{ faculty.specialization }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Qualification</span>
            <span class="text-base font-medium text-gray-900">{{ faculty.qualification }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Experience</span>
            <span class="text-base font-medium text-gray-900">{{ faculty.experience }} years</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Joining Date</span>
            <span class="text-base font-medium text-gray-900">{{ faculty.joiningDate }}</span>
          </div>
        </div>
      </div>

      <!-- Workload Card -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Workload & Statistics</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white border border-blue-100 rounded-lg p-5 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ faculty.courses }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">Courses</div>
          </div>
          <div class="bg-white border border-blue-100 rounded-lg p-5 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ faculty.teachingHours }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">Teaching Hrs</div>
          </div>
          <div class="bg-white border border-blue-100 rounded-lg p-5 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ faculty.totalStudents }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">Students</div>
          </div>
          <div class="bg-white border border-blue-100 rounded-lg p-5 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ faculty.publications }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">Publications</div>
          </div>
        </div>
      </div>

      <!-- Office Information Card -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Office Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Office Location</span>
            <span class="text-base font-medium text-gray-900">{{ faculty.office || 'N/A' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Office Hours</span>
            <span class="text-base font-medium text-gray-900">{{ faculty.officeHours || 'N/A' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Department Head</span>
            <span :class="faculty.isHead ? 'text-green-800 font-semibold' : 'text-gray-600'" class="text-base">
              {{ faculty.isHead ? '✓ Yes' : '✗ No' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Research Interests Card -->
      <div v-if="faculty.researchInterests && faculty.researchInterests.length" class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Research Interests</h2>
        <div class="flex flex-wrap gap-2">
          <span v-for="interest in faculty.researchInterests" :key="interest" class="bg-white border border-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            {{ interest }}
          </span>
        </div>
      </div>

      <!-- Additional Info Card -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Additional Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Research Hours/Week</span>
            <span class="text-base font-medium text-gray-900">{{ faculty.researchHours || 0 }} hours</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Admin Hours/Week</span>
            <span class="text-base font-medium text-gray-900">{{ faculty.adminHours || 0 }} hours</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Promotion</span>
            <span class="text-base font-medium text-gray-900">{{ faculty.lastPromotion || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-4">
        <button @click="handleBack" class="bg-blue-50 text-blue-600 border border-blue-100 px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all hover:bg-blue-100 hover:border-blue-600">← Back to Faculty</button>
      </div>
    </div>

    <div v-else class="text-center py-12 text-red-600">
      <p>Faculty member not found</p>
      <button @click="handleBack" class="bg-blue-50 text-blue-600 border border-blue-100 px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all hover:bg-blue-100 hover:border-blue-600 mt-4">Back to Faculty</button>
    </div>

    <!-- Confirm Dialog -->
    <AppConfirmDialog
      :visible="confirmDialog.visible"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :detail="confirmDialog.detail"
      :type="confirmDialog.type"
      confirmText="Delete"
      cancelText="Cancel"
      @confirm="confirmDialog.onConfirm"
      @cancel="handleConfirmDialogCancel"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFacultyStore } from '@/stores/faculty.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'

defineOptions({ name: 'FacultyShow' })

const router = useRouter()
const route = useRoute()
const facultyStore = useFacultyStore()
const toast = useToast()

const faculty = ref(null)
const loading = ref(true)

// Confirm dialog state
const confirmDialog = ref({
  visible: false,
  title: '',
  message: '',
  detail: '',
  type: 'danger',
  onConfirm: null
})

onMounted(async () => {
  try {
    faculty.value = await facultyStore.fetchFacultyById(route.params.id)
  } catch (error) {
    toast.error('Failed to load faculty data')
    console.error('Failed to fetch faculty:', error)
  } finally {
    loading.value = false
  }
})

const handleEdit = () => {
  router.push({ name: 'faculty-edit', params: { id: route.params.id } })
}

const handleDelete = () => {
  confirmDialog.value = {
    visible: true,
    title: 'Delete Faculty',
    message: `Are you sure you want to delete ${faculty.value?.name || 'this faculty member'}?`,
    detail: 'This action cannot be undone.',
    type: 'danger',
    onConfirm: async () => {
      try {
        await facultyStore.deleteFaculty(route.params.id)
        toast.success('Faculty member deleted successfully')
        router.push({ name: 'faculty' })
      } catch (error) {
        toast.error('Failed to delete faculty member')
        console.error('Failed to delete faculty:', error)
      } finally {
        confirmDialog.value.visible = false
      }
    }
  }
}

const handleConfirmDialogCancel = () => {
  confirmDialog.value.visible = false
}

const handleBack = () => {
  router.push({ name: 'faculty' })
}
</script>

<style scoped>
.placeholder { padding: 1rem; }
</style>
