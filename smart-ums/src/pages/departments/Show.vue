<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDepartmentStore } from '@/stores/department.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'

defineOptions({ name: 'DepartmentShow' })

const router = useRouter()
const route = useRoute()
const departmentStore = useDepartmentStore()
const toast = useToast()

const department = ref(null)
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
    department.value = await departmentStore.fetchDepartmentById(route.params.id)
  } catch (error) {
    toast.error('Failed to load department data')
    console.error('Failed to fetch department:', error)
  } finally {
    loading.value = false
  }
})

const handleEdit = () => {
  router.push({ name: 'departments-edit', params: { id: route.params.id } })
}

const handleDelete = () => {
  confirmDialog.value = {
    visible: true,
    title: 'Delete Department',
    message: `Are you sure you want to delete ${department.value?.name || 'this department'}?`,
    detail: 'This action cannot be undone.',
    type: 'danger',
    onConfirm: async () => {
      try {
        await departmentStore.deleteDepartment(route.params.id)
        toast.success('Department deleted successfully')
        router.push({ name: 'departments' })
      } catch (error) {
        toast.error('Failed to delete department')
        console.error('Failed to delete department:', error)
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
  router.push({ name: 'departments' })
}
</script>

<template>
  <section class="bg-white border border-blue-100 rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-8 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">Department Management</p>
        <h1 class="mb-1 text-2xl font-bold text-gray-900">Department Details</h1>
        <p class="m-0 text-sm text-gray-600">View detailed information about this department.</p>
      </div>
      <div class="flex gap-3">
        <AppButton @click="handleEdit">Edit Department</AppButton>
        <button @click="handleDelete" class="bg-red-600 text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors hover:bg-red-700">Delete</button>
      </div>
    </header>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      <p>Loading department data...</p>
    </div>

    <div v-else-if="department" class="flex flex-col gap-6">
      <!-- Basic Info Card -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Basic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Department Name</span>
            <span class="text-base font-medium text-gray-900">{{ department.name }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Department Code</span>
            <span class="inline-block bg-blue-600 text-white px-3 py-1 rounded font-semibold text-sm">{{ department.code }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Faculty</span>
            <span class="text-base font-medium text-gray-900">{{ department.faculty }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</span>
            <span :class="department.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-block px-3 py-1 rounded-full text-xs font-semibold">
              {{ department.status === 'active' ? '✓ Active' : '✗ Inactive' }}
            </span>
          </div>
          <div class="flex flex-col gap-1 md:col-span-2 lg:col-span-3">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</span>
            <span class="text-base font-medium text-gray-900">{{ department.description }}</span>
          </div>
        </div>
      </div>

      <!-- Administrative Card -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Administrative Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Department Head</span>
            <span class="text-base font-medium text-gray-900">{{ department.head }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Head Email</span>
            <span class="text-base font-medium text-blue-600">{{ department.headEmail }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</span>
            <span class="text-base font-medium text-gray-900">{{ department.phone || 'N/A' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Building</span>
            <span class="text-base font-medium text-gray-900">{{ department.building || 'N/A' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Floor</span>
            <span class="text-base font-medium text-gray-900">{{ department.floor || 'N/A' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Office Hours</span>
            <span class="text-base font-medium text-gray-900">{{ department.office_hours || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- Resources Card -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Resources & Statistics</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white border border-blue-100 rounded-lg p-5 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ department.programs }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">Programs</div>
          </div>
          <div class="bg-white border border-blue-100 rounded-lg p-5 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ department.faculty_count }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">Faculty Members</div>
          </div>
          <div class="bg-white border border-blue-100 rounded-lg p-5 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ department.students }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">Total Students</div>
          </div>
          <div class="bg-white border border-blue-100 rounded-lg p-5 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ department.establishment_year }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">Established</div>
          </div>
        </div>
      </div>

      <!-- Accreditation Card -->
      <div class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Accreditation</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Accredited</span>
            <span :class="department.accredited ? 'text-green-800 font-semibold' : 'text-red-800 font-semibold'" class="text-base">
              {{ department.accredited ? '✓ Yes' : '✗ No' }}
            </span>
          </div>
          <div v-if="department.accreditationBody" class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">Accreditation Body</span>
            <span class="text-base font-medium text-gray-900">{{ department.accreditationBody }}</span>
          </div>
        </div>
      </div>

      <!-- Specializations Card -->
      <div v-if="department.specialization && department.specialization.length" class="bg-gray-50 border border-blue-100 rounded-xl p-6">
        <h2 class="mb-5 text-lg font-bold text-gray-900">Specializations</h2>
        <div class="flex flex-wrap gap-2">
          <span v-for="spec in department.specialization" :key="spec" class="bg-white border border-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            {{ spec }}
          </span>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-4">
        <button @click="handleBack" class="bg-blue-50 text-blue-600 border border-blue-100 px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all hover:bg-blue-100 hover:border-blue-600">← Back to Departments</button>
      </div>
    </div>

    <div v-else class="text-center py-12 text-red-600">
      <p>Department not found</p>
      <button @click="handleBack" class="bg-blue-50 text-blue-600 border border-blue-100 px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all hover:bg-blue-100 hover:border-blue-600 mt-4">Back to Departments</button>
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
