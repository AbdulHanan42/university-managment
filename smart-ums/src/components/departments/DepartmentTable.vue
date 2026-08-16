<template>
  <div class="department-table-container">
    <div v-if="departments.length === 0" class="text-center py-12 text-gray-500">
      <p>No departments found</p>
    </div>
    <div v-else class="table-wrapper">
      <table class="department-table">
        <thead>
          <tr>
            <th class="checkbox-col">
              <input
                type="checkbox"
                @change="toggleSelectAll"
                :checked="selected.length === departments.length && departments.length > 0"
              />
            </th>
            <th @click="sortBy('name')" class="sortable">
              Department Name {{ sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th @click="sortBy('code')" class="sortable">Code</th>
            <th @click="sortBy('faculty')" class="sortable">Faculty</th>
            <th @click="sortBy('head')" class="sortable">Department Head</th>
            <th @click="sortBy('programs')" class="sortable">Programs</th>
            <th @click="sortBy('students')" class="sortable">Students</th>
            <th @click="sortBy('status')" class="sortable">Status</th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="department in sortedDepartments" :key="department.id" :class="{ selected: isSelected(department.id) }">
            <td class="checkbox-col">
              <input
                type="checkbox"
                :checked="isSelected(department.id)"
                @change="toggleSelect(department.id)"
              />
            </td>
            <td class="department-name">
              <div class="department-info">
                <p class="name">{{ department.name }}</p>
                <p class="description">{{ department.description }}</p>
              </div>
            </td>
            <td class="code">{{ department.code }}</td>
            <td>{{ department.faculty }}</td>
            <td>
              <div class="head-info">
                <p class="head-name">{{ department.head }}</p>
                <p class="head-email">{{ department.headEmail }}</p>
              </div>
            </td>
            <td>{{ department.programs }}</td>
            <td>{{ department.students }}</td>
            <td>
              <span class="status" :class="`status-${department.status.toLowerCase()}`">
                {{ department.status === 'active' ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="actions-col">
              <div class="action-buttons">
                <button class="btn-action btn-view" @click="$emit('view', department.id)" title="View">
                  👁️
                </button>
                <button class="btn-action btn-edit" @click="$emit('edit', department.id)" title="Edit">
                  ✎
                </button>
                <button class="btn-action btn-delete" @click="handleDelete(department.id)" title="Delete">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selected.length > 0" class="bulk-actions">
      <span>{{ selected.length }} selected</span>
      <button @click="handleBulkDelete" class="btn-delete-multi">Delete ({{ selected.length }})</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'DepartmentTable' })

const props = defineProps({
  departments: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'delete', 'bulk-delete'])

const selected = ref([])
const sortField = ref('name')
const sortOrder = ref('asc')

const sortedDepartments = computed(() => {
  const sorted = [...props.departments]
  sorted.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]

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

const isSelected = (id) => selected.value.includes(id)

const toggleSelect = (id) => {
  const index = selected.value.indexOf(id)
  if (index > -1) {
    selected.value.splice(index, 1)
  } else {
    selected.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (selected.value.length === props.departments.length) {
    selected.value = []
  } else {
    selected.value = props.departments.map(d => d.id)
  }
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const handleDelete = (id) => {
  if (confirm('Are you sure you want to delete this department?')) {
    emit('delete', id)
  }
}

const handleBulkDelete = () => {
  if (confirm(`Delete ${selected.value.length} selected departments?`)) {
    emit('bulk-delete', selected.value)
    selected.value = []
  }
}
</script>

<style scoped>
.department-table-container {
  background: white;
  border-radius: 1rem;
  border: 1px solid #dfe7fb;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.department-table {
  width: 100%;
  border-collapse: collapse;
}

.department-table thead {
  background: #f8fafb;
}

.department-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #5d6d8f;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #dfe7fb;
}

.department-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.department-table th.sortable:hover {
  background: #eef2f9;
}

.department-table td {
  padding: 1rem;
  border-bottom: 1px solid #eef2f9;
}

.department-table tbody tr:hover {
  background: #f8fafb;
}

.department-table tbody tr.selected {
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

.department-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.department-info .name {
  margin: 0;
  color: #14213d;
  font-weight: 500;
}

.department-info .description {
  margin: 0;
  color: #7f8fa3;
  font-size: 0.85rem;
}

.code {
  font-weight: 500;
  color: #214d9c;
}

.head-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.head-info .head-name {
  margin: 0;
  color: #14213d;
  font-weight: 500;
}

.head-info .head-email {
  margin: 0;
  color: #7f8fa3;
  font-size: 0.85rem;
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

.bulk-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8fafb;
  border-top: 1px solid #dfe7fb;
}

.btn-delete-multi {
  background: #fee8e8;
  color: #c0392b;
  padding: 0.65rem 1.2rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete-multi:hover {
  background: #fdd5d5;
}
</style>
