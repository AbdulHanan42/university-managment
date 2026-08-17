<template>
  <div class="faculty-table-container">
    <div v-if="faculty.length === 0" class="text-center py-12 text-gray-500">
      <p>No faculty found</p>
    </div>
    <div v-else class="table-wrapper">
      <table class="faculty-table">
        <thead>
          <tr>
            <th class="checkbox-col">
              <input
                type="checkbox"
                @change="toggleSelectAll"
                :checked="selected.length === faculty.length && faculty.length > 0"
              />
            </th>
            <th class="image-col">Photo</th>
            <th @click="sortBy('name')" class="sortable">
              Name {{ sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th @click="sortBy('email')" class="sortable">Email</th>
            <th @click="sortBy('department')" class="sortable">Department</th>
            <th @click="sortBy('designation')" class="sortable">Designation</th>
            <th @click="sortBy('experience')" class="sortable">Experience</th>
            <th @click="sortBy('courses')" class="sortable">Courses</th>
            <th @click="sortBy('status')" class="sortable">Status</th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="facultyMember in sortedFaculty" :key="facultyMember.id" :class="{ selected: isSelected(facultyMember.id) }">
            <td class="checkbox-col">
              <input
                type="checkbox"
                :checked="isSelected(facultyMember.id)"
                @change="toggleSelect(facultyMember.id)"
              />
            </td>
            <td class="image-col">
              <div class="faculty-avatar">
                <img v-if="facultyMember.imageUrl" :src="facultyMember.imageUrl" :alt="facultyMember.name" class="avatar-img" />
                <span v-else class="avatar-initial">{{ facultyMember.name?.charAt(0) || '?' }}</span>
              </div>
            </td>
            <td class="faculty-name">
              <div class="faculty-info">
                <p class="name">{{ facultyMember.name }}</p>
                <p class="specialization">{{ facultyMember.specialization }}</p>
              </div>
            </td>
            <td class="email">{{ facultyMember.email }}</td>
            <td>{{ facultyMember.department }}</td>
            <td>
              <span class="designation">{{ facultyMember.designation }}</span>
            </td>
            <td>{{ facultyMember.experience }} years</td>
            <td>{{ facultyMember.courses }}</td>
            <td>
              <span class="status" :class="`status-${facultyMember.status.toLowerCase().replace('-', '')}`">
                {{ facultyMember.status === 'active' ? 'Active' : facultyMember.status === 'on-leave' ? 'On Leave' : 'Inactive' }}
              </span>
            </td>
            <td class="actions-col">
              <div class="action-buttons">
                <button class="btn-action btn-view" @click="$emit('view', facultyMember.id)" title="View">
                  👁️
                </button>
                <button class="btn-action btn-edit" @click="$emit('edit', facultyMember.id)" title="Edit">
                  ✎
                </button>
                <button class="btn-action btn-delete" @click="handleDelete(facultyMember.id)" title="Delete">
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

defineOptions({ name: 'FacultyTable' })

const props = defineProps({
  faculty: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'delete', 'bulk-delete'])

const selected = ref([])
const sortField = ref('name')
const sortOrder = ref('asc')

const sortedFaculty = computed(() => {
  const sorted = [...props.faculty]
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
  if (selected.value.length === props.faculty.length) {
    selected.value = []
  } else {
    selected.value = props.faculty.map(f => f.id)
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
  if (confirm('Are you sure you want to delete this faculty member?')) {
    emit('delete', id)
  }
}

const handleBulkDelete = () => {
  if (confirm(`Delete ${selected.value.length} selected faculty members?`)) {
    emit('bulk-delete', selected.value)
    selected.value = []
  }
}
</script>

<style scoped>
.faculty-table-container {
  background: var(--color-bg-white);
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
  overflow-y: visible;
}

.faculty-table {
  width: 100%;
  border-collapse: collapse;
}

.faculty-table thead {
  background: var(--color-bg-light);
}

.faculty-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid var(--color-border);
}

.faculty-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.faculty-table th.sortable:hover {
  background: var(--color-border-light);
}

.faculty-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border-light);
}

.faculty-table tbody tr:hover {
  background: var(--color-bg-light);
}

.faculty-table tbody tr.selected {
  background: var(--color-bg-selected);
}

.checkbox-col {
  width: 50px;
}

.checkbox-col input[type='checkbox'] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.image-col {
  width: 60px;
  text-align: center;
}

.faculty-avatar {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  background: var(--color-bg-light);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initial {
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-text-muted);
}

.faculty-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.faculty-info .name {
  margin: 0;
  color: var(--color-text-primary);
  font-weight: 500;
}

.faculty-info .specialization {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.email {
  color: var(--color-primary);
  font-size: 0.9rem;
}

.designation {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.status {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-active {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.status-onleave {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.status-inactive {
  background: var(--color-error-bg);
  color: var(--color-error);
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
  border: 1px solid var(--color-border);
  border-radius: 0.6rem;
  background: var(--color-bg-white);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-view:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary-accent);
}

.btn-edit:hover {
  background: var(--color-secondary-light);
  border-color: var(--color-secondary);
}

.btn-delete:hover {
  background: var(--color-error-light);
  border-color: var(--color-error-dark);
}

.bulk-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--color-bg-light);
  border-top: 1px solid var(--color-border);
}

.btn-delete-multi {
  background: var(--color-error-light);
  color: var(--color-error-dark);
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
