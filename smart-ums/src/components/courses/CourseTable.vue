<template>
  <div class="course-table-container">
    <div v-if="courses.length === 0" class="text-center py-12 text-gray-500">
      <p>No courses found</p>
    </div>
    <div v-else class="table-wrapper">
      <table class="course-table">
        <thead>
          <tr>
            <th class="checkbox-col">
              <input
                type="checkbox"
                @change="toggleSelectAll"
                :checked="selected.length === courses.length && courses.length > 0"
              />
            </th>
            <th @click="sortBy('code')" class="sortable">
              Code {{ sortField === 'code' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th @click="sortBy('name')" class="sortable">
              Name {{ sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th @click="sortBy('department')" class="sortable">Department</th>
            <th @click="sortBy('program')" class="sortable">Program</th>
            <th @click="sortBy('facultyName')" class="sortable">Faculty</th>
            <th @click="sortBy('credits')" class="sortable">Credits</th>
            <th @click="sortBy('enrolled')" class="sortable">Enrolled</th>
            <th @click="sortBy('status')" class="sortable">Status</th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in sortedCourses" :key="course.id" :class="{ selected: isSelected(course.id) }">
            <td class="checkbox-col">
              <input
                type="checkbox"
                :checked="isSelected(course.id)"
                @change="toggleSelect(course.id)"
              />
            </td>
            <td class="course-code">
              <span class="code-badge">{{ course.code }}</span>
            </td>
            <td class="course-name">
              <div class="course-info">
                <p class="name">{{ course.name }}</p>
                <p class="description">{{ course.description }}</p>
              </div>
            </td>
            <td>{{ course.department }}</td>
            <td>{{ course.program }}</td>
            <td>
              <span v-if="course.facultyName" class="faculty-name">{{ course.facultyName }}</span>
              <span v-else class="unassigned">Unassigned</span>
            </td>
            <td>{{ course.credits }}</td>
            <td>
              <div class="enrollment-info">
                <span class="enrolled">{{ course.enrolled }}</span>
                <span class="separator">/</span>
                <span class="capacity">{{ course.capacity }}</span>
              </div>
            </td>
            <td>
              <span class="status" :class="`status-${course.status.toLowerCase().replace('-', '')}`">
                {{ course.status === 'active' ? 'Active' : course.status === 'on-leave' ? 'On Leave' : 'Inactive' }}
              </span>
            </td>
            <td class="actions-col">
              <div class="action-buttons">
                <button class="btn-action btn-view" @click="$emit('view', course.id)" title="View">
                  👁️
                </button>
                <button class="btn-action btn-edit" @click="$emit('edit', course.id)" title="Edit">
                  ✎
                </button>
                <button class="btn-action btn-delete" @click="handleDelete(course.id)" title="Delete">
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

defineOptions({ name: 'CourseTable' })

const props = defineProps({
  courses: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'delete', 'bulk-delete'])

const selected = ref([])
const sortField = ref('code')
const sortOrder = ref('asc')

const sortedCourses = computed(() => {
  const sorted = [...props.courses].sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
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
  if (selected.value.length === props.courses.length) {
    selected.value = []
  } else {
    selected.value = props.courses.map(c => c.id)
  }
}

const handleDelete = (id) => {
  emit('delete', id)
}

const handleBulkDelete = () => {
  emit('bulk-delete', selected.value)
  selected.value = []
}
</script>

<style scoped>
.course-table-container {
  width: 100%;
}

.table-wrapper {
  overflow-x: auto;
}

.course-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-bg-white);
  border-radius: 0.5rem;
  overflow: hidden;
}

.course-table thead {
  background: var(--color-bg-light);
}

.course-table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-border-light);
}

.course-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.course-table th.sortable:hover {
  background: var(--color-border-light);
}

.course-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border-light);
}

.course-table tbody tr:hover {
  background: var(--color-bg-light);
}

.course-table tbody tr.selected {
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

.course-code {
  width: 100px;
}

.code-badge {
  display: inline-block;
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.85rem;
}

.course-name {
  min-width: 250px;
}

.course-info {
  display: flex;
}

.course-info .name {
  margin: 0;
  color: var(--color-text-primary);
  font-weight: 500;
}

.course-info .description {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.faculty-name {
  color: var(--color-primary);
  font-weight: 500;
}

.unassigned {
  color: var(--color-text-muted);
  font-style: italic;
}

.enrollment-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.enrolled {
  color: var(--color-text-primary);
  font-weight: 600;
}

.separator {
  color: var(--color-text-muted);
}

.capacity {
  color: var(--color-text-muted);
}

.status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
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
  width: 120px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--color-border);
  background: var(--color-bg-white);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-action:hover {
  background: var(--color-bg-light);
  transform: translateY(-1px);
}

.btn-view:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
}

.btn-edit:hover {
  background: var(--color-secondary-light);
  border-color: var(--color-secondary);
}

.btn-delete:hover {
  background: var(--color-error-light);
  border-color: var(--color-error);
}

.bulk-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--color-primary-light);
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.btn-delete-multi {
  background: var(--color-error);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-delete-multi:hover {
  background: var(--color-error-dark);
}
</style>
