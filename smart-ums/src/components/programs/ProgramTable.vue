<template>
  <div class="program-table-container">
    <div class="table-header">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search programs..."
          class="search-input"
        />
      </div>
      <div class="table-actions">
        <button v-if="selectedPrograms.length > 0" class="btn-delete-multi" @click="handleBulkDelete">
          Delete ({{ selectedPrograms.length }})
        </button>
        <button class="btn-add" @click="$emit('add')">+ Add Program</button>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="program-table">
        <thead>
          <tr>
            <th class="checkbox-col">
              <input
                type="checkbox"
                @change="toggleSelectAll"
                :checked="selectedPrograms.length === programs.length && programs.length > 0"
              />
            </th>
            <th @click="sortBy('name')" class="sortable">
              Program Name {{ sortKey === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th @click="sortBy('code')" class="sortable">Code</th>
            <th>Department</th>
            <th @click="sortBy('level')" class="sortable">Level</th>
            <th @click="sortBy('studentsEnrolled')" class="sortable">Students</th>
            <th>Status</th>
            <th>Accreditation</th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="sortedPrograms.length === 0" class="empty-row">
            <td colspan="9" class="empty-message">No programs found</td>
          </tr>
          <tr v-for="program in sortedPrograms" :key="program.id" :class="{ selected: isSelected(program.id) }">
            <td class="checkbox-col">
              <input
                type="checkbox"
                :checked="isSelected(program.id)"
                @change="toggleSelect(program.id)"
              />
            </td>
            <td class="program-name">
              <div class="program-info">
                <p class="name">{{ program.name }}</p>
                <p class="faculty">{{ program.faculty }}</p>
              </div>
            </td>
            <td class="code">{{ program.code }}</td>
            <td>{{ program.department }}</td>
            <td>
              <span class="badge" :class="`badge-${program.level.toLowerCase()}`">
                {{ program.level }}
              </span>
            </td>
            <td>{{ program.studentsEnrolled }}</td>
            <td>
              <span class="status" :class="`status-${program.status.toLowerCase()}`">
                {{ program.status }}
              </span>
            </td>
            <td>
              <span class="accreditation" :class="`acc-${program.accreditation.toLowerCase()}`">
                {{ program.accreditation }}
              </span>
            </td>
            <td class="actions-col">
              <div class="action-buttons">
                <button class="btn-action btn-view" @click="$emit('view', program.id)" title="View">
                  👁️
                </button>
                <button class="btn-action btn-edit" @click="$emit('edit', program.id)" title="Edit">
                  ✎
                </button>
                <button class="btn-action btn-delete" @click="handleDelete(program)" title="Delete">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Program"
      :message="`Are you sure you want to delete program ${selectedProgram?.name}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="handleConfirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

defineOptions({ name: 'ProgramTable' })

const props = defineProps({
  programs: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['add', 'view', 'edit', 'delete', 'bulk-delete'])

const searchQuery = ref('')
const selectedPrograms = ref([])
const sortKey = ref('name')
const sortOrder = ref('asc')
const showDeleteModal = ref(false)
const selectedProgram = ref(null)

const filteredPrograms = computed(() => {
  if (!searchQuery.value) return props.programs
  const query = searchQuery.value.toLowerCase()
  return props.programs.filter(
    p =>
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query) ||
      p.department.toLowerCase().includes(query)
  )
})

const sortedPrograms = computed(() => {
  const sorted = [...filteredPrograms.value]
  sorted.sort((a, b) => {
    let aVal = a[sortKey.value]
    let bVal = b[sortKey.value]

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
  return sorted
})

const isSelected = (id) => selectedPrograms.value.includes(id)

const toggleSelect = (id) => {
  const index = selectedPrograms.value.indexOf(id)
  if (index > -1) {
    selectedPrograms.value.splice(index, 1)
  } else {
    selectedPrograms.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (selectedPrograms.value.length === props.programs.length) {
    selectedPrograms.value = []
  } else {
    selectedPrograms.value = props.programs.map(p => p.id)
  }
}

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const handleDelete = (program) => {
  selectedProgram.value = program
  showDeleteModal.value = true
}

const handleConfirmDelete = () => {
  emit('delete', selectedProgram.value.id)
  showDeleteModal.value = false
  selectedProgram.value = null
}

const handleBulkDelete = () => {
  if (confirm(`Delete ${selectedPrograms.value.length} selected programs?`)) {
    emit('bulk-delete', selectedPrograms.value)
    selectedPrograms.value = []
  }
}
</script>

<style scoped>
.program-table-container {
  background: white;
  border-radius: 1rem;
  border: 1px solid #dfe7fb;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid #eef2f9;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #dfe7fb;
  border-radius: 0.75rem;
  font-size: 0.95rem;
}

.search-input:focus {
  outline: none;
  border-color: #214d9c;
  box-shadow: 0 0 0 3px rgba(33, 77, 156, 0.1);
}

.table-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-add,
.btn-delete-multi {
  padding: 0.65rem 1.2rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-add {
  background: #214d9c;
  color: white;
}

.btn-add:hover {
  background: #1a3a6f;
}

.btn-delete-multi {
  background: #fee8e8;
  color: #c0392b;
}

.btn-delete-multi:hover {
  background: #fdd5d5;
}

.table-wrapper {
  overflow-x: auto;
}

.program-table {
  width: 100%;
  border-collapse: collapse;
}

.program-table thead {
  background: #f8fafb;
}

.program-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #5d6d8f;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #dfe7fb;
}

.program-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.program-table th.sortable:hover {
  background: #eef2f9;
}

.program-table td {
  padding: 1rem;
  border-bottom: 1px solid #eef2f9;
}

.program-table tbody tr:hover {
  background: #f8fafb;
}

.program-table tbody tr.selected {
  background: #f0f4ff;
}

.checkbox-col {
  width: 50px;
}

.checkbox-col input[type='checkbox'] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.program-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.program-info .name {
  margin: 0;
  color: #14213d;
  font-weight: 500;
}

.program-info .faculty {
  margin: 0;
  color: #7f8fa3;
  font-size: 0.85rem;
}

.code {
  font-weight: 500;
  color: #214d9c;
}

.badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-undergraduate {
  background: #e8f4ff;
  color: #0066cc;
}

.badge-graduate {
  background: #f0e8ff;
  color: #7c3aed;
}

.badge-doctoral {
  background: #ffe8f0;
  color: #c2185b;
}

.badge-certificate {
  background: #ffe8cc;
  color: #d97706;
}

.status {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-inactive {
  background: #f8d7da;
  color: #721c24;
}

.status-under-review {
  background: #fff3cd;
  color: #856404;
}

.status-under\ review {
  background: #fff3cd;
  color: #856404;
}

.accreditation {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.acc-accredited {
  background: #d4edda;
  color: #155724;
}

.acc-pending {
  background: #fff3cd;
  color: #856404;
}

.acc-not-required {
  background: #e7e7e7;
  color: #666;
}

.actions-col {
  width: 130px;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #dfe7fb;
  border-radius: 0.6rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-view:hover {
  background: #e8f4ff;
  border-color: #0066cc;
}

.btn-edit:hover {
  background: #f0e8ff;
  border-color: #7c3aed;
}

.btn-delete:hover {
  background: #fee8e8;
  border-color: #c0392b;
}

.empty-row {
  background: white !important;
}

.empty-message {
  text-align: center;
  color: #7f8fa3;
  padding: 2rem !important;
}
</style>
