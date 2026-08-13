<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDepartmentStore } from '@/stores/department.store'
import AppButton from '@/components/common/AppButton.vue'
import DepartmentTable from '@/components/departments/DepartmentTable.vue'
import DepartmentCard from '@/components/departments/DepartmentCard.vue'

defineOptions({ name: 'DepartmentsIndex' })

const router = useRouter()
const departmentStore = useDepartmentStore()

const viewMode = ref('table') // 'table' or 'grid'
const summaryCards = ref([
  { title: 'Total departments', value: '5', subtitle: 'Across 5 faculties' },
  { title: 'Faculty members', value: '59', subtitle: 'Across all departments' },
  { title: 'Total students', value: '1,900', subtitle: 'Enrolled in departments' }
])

onMounted(() => {
  departmentStore.fetchDepartments()
})

const handleAddDepartment = () => {
  router.push({ name: 'departments-create' })
}

const handleEditDepartment = (id) => {
  router.push({ name: 'departments-edit', params: { id } })
}

const handleDeleteDepartment = async (id) => {
  if (confirm('Are you sure you want to delete this department?')) {
    await departmentStore.deleteDepartment(id)
  }
}

const handleBulkDelete = async (ids) => {
  if (confirm(`Are you sure you want to delete ${ids.length} departments?`)) {
    await departmentStore.deleteMultipleDepartments(ids)
  }
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
  <section class="page-card">
    <!-- Header Section -->
    <header class="page-header">
      <div>
        <p class="eyebrow">Department Management</p>
        <h1>Departments</h1>
        <p>Manage departments, faculty heads, and academic resources.</p>
      </div>
      <AppButton @click="handleAddDepartment">+ Add Department</AppButton>
    </header>

    <!-- Summary Cards -->
    <div class="card-grid">
      <article v-for="card in summaryCards" :key="card.title" class="summary-card">
        <h2>{{ card.title }}</h2>
        <p class="value">{{ card.value }}</p>
        <span>{{ card.subtitle }}</span>
      </article>
    </div>

    <!-- View Toggle & Controls -->
    <div class="controls-section">
      <div class="view-toggle">
        <button
          :class="{ active: viewMode === 'table' }"
          @click="viewMode = 'table'"
          title="Table View"
        >
          📋 Table
        </button>
        <button
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
          title="Grid View"
        >
          ⊞ Grid
        </button>
      </div>
      <div class="filter-info">
        Showing {{ departmentStore.filteredDepartments.length }} of {{ departmentStore.departments.length }} departments
      </div>
    </div>

    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="content-section">
      <DepartmentTable
        :departments="departmentStore.filteredDepartments"
        @edit="handleEditDepartment"
        @delete="handleDeleteDepartment"
        @bulk-delete="handleBulkDelete"
      />
    </div>

    <!-- Grid View -->
    <div v-else class="content-section">
      <div class="departments-grid">
        <DepartmentCard
          v-for="department in departmentStore.filteredDepartments"
          :key="department.id"
          :department="department"
          @edit="handleEditDepartment(department.id)"
          @delete="handleDeleteDepartment(department.id)"
        />
      </div>
      <div v-if="departmentStore.filteredDepartments.length === 0" class="empty-state">
        <p>No departments found</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-card {
  background: white;
  border: 1px solid #dfe7fb;
  border-radius: 1.2rem;
  box-shadow: 0 16px 40px rgba(20, 33, 61, 0.06);
  padding: 1.25rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #60708f;
  font-weight: 600;
}

h1 {
  margin: 0 0 0.4rem;
  color: #14213d;
}

.page-header > div > p:last-child {
  margin: 0;
  color: #5d6d8f;
  font-size: 0.95rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: #f6f9ff;
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid #eef2f9;
  transition: all 0.3s ease;
}

.summary-card:hover {
  background: #ecf1ff;
  border-color: #dfe7fb;
}

.summary-card h2 {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: #5d6d8f;
  font-weight: 600;
}

.summary-card .value {
  margin: 0 0 0.35rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #14213d;
}

.summary-card span {
  font-size: 0.85rem;
  color: #7f8fa3;
}

.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: #f8fafb;
  padding: 0.5rem;
  border-radius: 0.75rem;
}

.view-toggle button {
  padding: 0.6rem 1rem;
  border: 1px solid #dfe7fb;
  background: white;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.view-toggle button.active {
  background: #214d9c;
  color: white;
  border-color: #214d9c;
}

.filter-info {
  color: #7f8fa3;
  font-size: 0.9rem;
}

.content-section {
  animation: fadeIn 0.3s ease-in;
}

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

.departments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8fa3;
}
</style>
