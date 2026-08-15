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
  <section class="page-card">
    <header class="page-header">
      <div>
        <p class="eyebrow">Department Management</p>
        <h1>Department Details</h1>
        <p>View detailed information about this department.</p>
      </div>
      <div class="header-actions">
        <AppButton @click="handleEdit">Edit Department</AppButton>
        <button @click="handleDelete" class="btn-delete">Delete</button>
      </div>
    </header>

    <div v-if="loading" class="loading-state">
      <p>Loading department data...</p>
    </div>

    <div v-else-if="department" class="department-detail">
      <!-- Basic Info Card -->
      <div class="detail-card">
        <h2>Basic Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Department Name</span>
            <span class="value">{{ department.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">Department Code</span>
            <span class="value code-badge">{{ department.code }}</span>
          </div>
          <div class="info-item">
            <span class="label">Faculty</span>
            <span class="value">{{ department.faculty }}</span>
          </div>
          <div class="info-item">
            <span class="label">Status</span>
            <span :class="['status-badge', department.status]">
              {{ department.status === 'active' ? '✓ Active' : '✗ Inactive' }}
            </span>
          </div>
          <div class="info-item full-width">
            <span class="label">Description</span>
            <span class="value">{{ department.description }}</span>
          </div>
        </div>
      </div>

      <!-- Administrative Card -->
      <div class="detail-card">
        <h2>Administrative Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Department Head</span>
            <span class="value">{{ department.head }}</span>
          </div>
          <div class="info-item">
            <span class="label">Head Email</span>
            <span class="value email">{{ department.headEmail }}</span>
          </div>
          <div class="info-item">
            <span class="label">Phone</span>
            <span class="value">{{ department.phone || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Building</span>
            <span class="value">{{ department.building || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Floor</span>
            <span class="value">{{ department.floor || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Office Hours</span>
            <span class="value">{{ department.office_hours || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- Resources Card -->
      <div class="detail-card">
        <h2>Resources & Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ department.programs }}</div>
            <div class="stat-label">Programs</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ department.faculty_count }}</div>
            <div class="stat-label">Faculty Members</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ department.students }}</div>
            <div class="stat-label">Total Students</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ department.establishment_year }}</div>
            <div class="stat-label">Established</div>
          </div>
        </div>
      </div>

      <!-- Accreditation Card -->
      <div class="detail-card">
        <h2>Accreditation</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Accredited</span>
            <span :class="['value', department.accredited ? 'accredited' : 'not-accredited']">
              {{ department.accredited ? '✓ Yes' : '✗ No' }}
            </span>
          </div>
          <div class="info-item" v-if="department.accreditationBody">
            <span class="label">Accreditation Body</span>
            <span class="value">{{ department.accreditationBody }}</span>
          </div>
        </div>
      </div>

      <!-- Specializations Card -->
      <div v-if="department.specialization && department.specialization.length" class="detail-card">
        <h2>Specializations</h2>
        <div class="specialization-tags">
          <span v-for="spec in department.specialization" :key="spec" class="spec-tag">
            {{ spec }}
          </span>
        </div>
      </div>

      <!-- Back Button -->
      <div class="back-section">
        <button @click="handleBack" class="btn-back">← Back to Departments</button>
      </div>
    </div>

    <div v-else class="error-state">
      <p>Department not found</p>
      <button @click="handleBack" class="btn-back">Back to Departments</button>
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
  margin-bottom: 2rem;
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

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-delete {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-delete:hover {
  background: #c82333;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
  color: #7f8fa3;
}

.error-state {
  color: #dc3545;
}

.department-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-card {
  background: #f8fafb;
  border: 1px solid #eef2f9;
  border-radius: 1rem;
  padding: 1.5rem;
}

.detail-card h2 {
  margin: 0 0 1.25rem;
  font-size: 1.1rem;
  color: #14213d;
  font-weight: 700;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #5d6d8f;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-size: 1rem;
  color: #14213d;
  font-weight: 500;
}

.value.email {
  color: #214d9c;
}

.code-badge {
  display: inline-block;
  background: #214d9c;
  color: white;
  padding: 0.35rem 0.7rem;
  border-radius: 0.4rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.value.accredited {
  color: #155724;
  font-weight: 600;
}

.value.not-accredited {
  color: #721c24;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border: 1px solid #dfe7fb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #214d9c;
  margin-bottom: 0.35rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #7f8fa3;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.specialization-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.spec-tag {
  background: white;
  border: 1px solid #dfe7fb;
  color: #214d9c;
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.back-section {
  margin-top: 1rem;
}

.btn-back {
  background: #f0f4ff;
  color: #214d9c;
  border: 1px solid #dfe7fb;
  padding: 0.75rem 1.5rem;
  border-radius: 0.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #ecf1ff;
  border-color: #214d9c;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .header-actions button {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
