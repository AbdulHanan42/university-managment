<template>
  <div class="table-container">
    <div v-if="departments.length === 0" class="empty-state">
      <p>No departments found</p>
    </div>
    <table v-else class="data-table">
      <thead>
        <tr>
          <th style="width: 40px">
            <input 
              type="checkbox" 
              :checked="allSelected"
              @change="toggleSelectAll"
              class="checkbox"
            />
          </th>
          <th @click="sortBy('name')" class="sortable">
            Department Name
            <span v-if="sortField === 'name'" class="sort-indicator">
              {{ sortOrder === 'asc' ? '▲' : '▼' }}
            </span>
          </th>
          <th @click="sortBy('code')" class="sortable">Code</th>
          <th @click="sortBy('faculty')" class="sortable">Faculty</th>
          <th @click="sortBy('head')" class="sortable">Department Head</th>
          <th @click="sortBy('programs')" class="sortable">Programs</th>
          <th @click="sortBy('students')" class="sortable">Students</th>
          <th @click="sortBy('status')" class="sortable">Status</th>
          <th style="width: 120px">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="department in sortedDepartments" :key="department.id" class="table-row">
          <td>
            <input 
              type="checkbox" 
              :checked="selected.includes(department.id)"
              @change="toggleSelect(department.id)"
              class="checkbox"
            />
          </td>
          <td class="name-cell">
            <div class="dept-name">{{ department.name }}</div>
          </td>
          <td><span class="code-badge">{{ department.code }}</span></td>
          <td>{{ department.faculty }}</td>
          <td>
            <div class="head-info">
              <div>{{ department.head }}</div>
              <small>{{ department.headEmail }}</small>
            </div>
          </td>
          <td class="center">{{ department.programs }}</td>
          <td class="center">{{ department.students }}</td>
          <td>
            <span :class="['status-badge', department.status]">
              {{ department.status === 'active' ? '✓ Active' : '✗ Inactive' }}
            </span>
          </td>
          <td class="actions">
            <button @click="$emit('edit', department.id)" class="btn-icon" title="Edit">✎</button>
            <button @click="$emit('delete', department.id)" class="btn-icon delete" title="Delete">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bulk Actions -->
    <div v-if="selected.length > 0" class="bulk-actions">
      <span>{{ selected.length }} selected</span>
      <button @click="handleBulkDelete" class="btn-delete">Delete Selected</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'DepartmentTable' })

const props = defineProps({
  departments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit', 'delete', 'bulk-delete'])

const selected = ref([])
const sortField = ref('name')
const sortOrder = ref('asc')

const allSelected = computed(() => {
  return selected.value.length === props.departments.length && props.departments.length > 0
})

const sortedDepartments = computed(() => {
  const sorted = [...props.departments]
  sorted.sort((a, b) => {
    const aVal = a[sortField.value]
    const bVal = b[sortField.value]
    
    if (typeof aVal === 'string') {
      return sortOrder.value === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
  })
  return sorted
})

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const toggleSelect = (id) => {
  const index = selected.value.indexOf(id)
  if (index > -1) {
    selected.value.splice(index, 1)
  } else {
    selected.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selected.value = []
  } else {
    selected.value = props.departments.map(d => d.id)
  }
}

const handleBulkDelete = () => {
  if (confirm(`Delete ${selected.value.length} departments?`)) {
    emit('bulk-delete', selected.value)
    selected.value = []
  }
}
</script>

<style scoped>
.table-container {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8fa3;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

thead {
  background: #f8fafb;
  border-bottom: 2px solid #dfe7fb;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #5d6d8f;
  font-size: 0.9rem;
  user-select: none;
}

.sortable {
  cursor: pointer;
  transition: background 0.2s;
}

.sortable:hover {
  background: #ecf1ff;
}

.sort-indicator {
  margin-left: 0.4rem;
  font-size: 0.7rem;
}

.table-row {
  border-bottom: 1px solid #eef2f9;
  transition: background 0.2s;
}

.table-row:hover {
  background: #f8fafb;
}

td {
  padding: 1rem;
  font-size: 0.9rem;
}

.name-cell {
  font-weight: 600;
  color: #14213d;
}

.dept-name {
  font-weight: 600;
}

.code-badge {
  background: #eef2f9;
  padding: 0.3rem 0.7rem;
  border-radius: 0.5rem;
  font-weight: 600;
  color: #214d9c;
  font-size: 0.85rem;
}

.head-info {
  font-size: 0.9rem;
}

.head-info small {
  display: block;
  color: #7f8fa3;
  font-size: 0.8rem;
}

.center {
  text-align: center;
  font-weight: 600;
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

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  transition: all 0.2s;
  hover-color: #214d9c;
}

.btn-icon:hover {
  background: #ecf1ff;
  color: #214d9c;
}

.btn-icon.delete:hover {
  background: #f8d7da;
  color: #721c24;
}

.checkbox {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.bulk-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f0f4ff;
  border-top: 1px solid #dfe7fb;
  border-radius: 0 0 1.2rem 1.2rem;
}

.btn-delete {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.6rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-delete:hover {
  background: #c82333;
}
</style>
