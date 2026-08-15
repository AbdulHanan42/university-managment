<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDepartmentStore } from '@/stores/department.store'
import { useToast } from '@/composables/useToast'
import AppButton from '@/components/common/AppButton.vue'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'
import DepartmentTable from '@/components/departments/DepartmentTable.vue'
import DepartmentCard from '@/components/departments/DepartmentCard.vue'

defineOptions({ name: 'DepartmentsIndex' })

const router = useRouter()
const departmentStore = useDepartmentStore()
const toast = useToast()

const viewMode = ref('table') // 'table' or 'grid'
const summaryCards = ref([
  { title: 'Total departments', value: '5', subtitle: 'Across 5 faculties' },
  { title: 'Faculty members', value: '59', subtitle: 'Across all departments' },
  { title: 'Total students', value: '1,900', subtitle: 'Enrolled in departments' }
])

// Confirm dialog state
const confirmDialog = ref({
  visible: false,
  title: '',
  message: '',
  detail: '',
  type: 'danger',
  onConfirm: null
})

onMounted(() => {
  departmentStore.fetchDepartments()
})

const handleAddDepartment = () => {
  router.push({ name: 'departments-create' })
}

const handleViewDepartment = (id) => {
  router.push({ name: 'departments-show', params: { id } })
}

const handleEditDepartment = (id) => {
  router.push({ name: 'departments-edit', params: { id } })
}

const showDeleteConfirm = (id, isBulk = false, ids = []) => {
  const count = isBulk ? ids.length : 1
  confirmDialog.value = {
    visible: true,
    title: 'Delete Department' + (isBulk ? 's' : ''),
    message: `Are you sure you want to delete ${count} department${isBulk ? 's' : ''}?`,
    detail: isBulk ? 'This action cannot be undone and will affect all selected departments.' : 'This action cannot be undone.',
    type: 'danger',
    onConfirm: async () => {
      try {
        if (isBulk) {
          await departmentStore.deleteMultipleDepartments(ids)
          toast.success(`${count} departments deleted successfully`)
        } else {
          await departmentStore.deleteDepartment(id)
          toast.success('Department deleted successfully')
        }
        confirmDialog.value.visible = false
      } catch (error) {
        toast.error('Failed to delete department(s)')
        console.error('Delete error:', error)
      }
    }
  }
}

const handleDeleteDepartment = (id) => {
  showDeleteConfirm(id)
}

const handleBulkDelete = (ids) => {
  showDeleteConfirm(null, true, ids)
}

const handleConfirmDialogCancel = () => {
  confirmDialog.value.visible = false
}

const updateSummary = () => {
  const stats = departmentStore.statistics
  summaryCards.value = [
    {
      title: 'Total departments',
      value: stats.total,
      subtitle: `Across ${stats.faculties.length} faculties`
    },
    {
      title: 'Faculty members',
      value: stats.totalFaculty,
      subtitle: 'Across all departments'
    },
    {
      title: 'Total students',
      value: stats.totalStudents.toLocaleString(),
      subtitle: 'Enrolled in departments'
    }
  ]
}

watch(() => departmentStore.departments, updateSummary, { deep: true })

onMounted(updateSummary)
</script>

<template>
  <section class="bg-white border border-blue-100 rounded-xl shadow-lg p-5">
    <!-- Header Section -->
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-gray-500 font-semibold">Department Management</p>
        <h1 class="mb-1 text-2xl font-bold text-gray-900">Departments</h1>
        <p class="m-0 text-sm text-gray-600">Manage departments, faculty heads, and academic resources.</p>
      </div>
      <AppButton @click="handleAddDepartment">+ Add Department</AppButton>
    </header>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <article v-for="card in summaryCards" :key="card.title" class="bg-blue-50 rounded-xl p-5 border border-blue-100 transition-all hover:bg-blue-100">
        <h2 class="mb-2 text-sm text-gray-600 font-semibold">{{ card.title }}</h2>
        <p class="mb-1 text-3xl font-bold text-gray-900">{{ card.value }}</p>
        <span class="text-xs text-gray-500">{{ card.subtitle }}</span>
      </article>
    </div>

    <!-- View Toggle & Controls -->
    <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div class="flex gap-2 bg-gray-50 p-2 rounded-lg">
        <button
          :class="viewMode === 'table' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-blue-100'"
          @click="viewMode = 'table'"
          title="Table View"
          class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
        >
          📋 Table
        </button>
        <button
          :class="viewMode === 'grid' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-blue-100'"
          @click="viewMode = 'grid'"
          title="Grid View"
          class="px-4 py-2 border rounded-lg cursor-pointer transition-all font-medium text-sm"
        >
          ⊞ Grid
        </button>
      </div>
      <div class="text-sm text-gray-500">
        Showing {{ departmentStore.filteredDepartments.length }} of {{ departmentStore.departments.length }} departments
      </div>
    </div>

    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="animate-fade-in">
      <DepartmentTable
        :departments="departmentStore.filteredDepartments"
        @view="handleViewDepartment"
        @edit="handleEditDepartment"
        @delete="handleDeleteDepartment"
        @bulk-delete="handleBulkDelete"
      />
    </div>

    <!-- Grid View -->
    <div v-else class="animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DepartmentCard
          v-for="department in departmentStore.filteredDepartments"
          :key="department.id"
          :department="department"
          @view="handleViewDepartment(department.id)"
          @edit="handleEditDepartment(department.id)"
          @delete="handleDeleteDepartment(department.id)"
        />
      </div>
      <div v-if="departmentStore.filteredDepartments.length === 0" class="text-center py-12 text-gray-500">
        <p>No departments found</p>
      </div>
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
