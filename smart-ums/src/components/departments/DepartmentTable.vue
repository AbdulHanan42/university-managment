<template>
  <div class="w-full">
    <div v-if="departments.length === 0" class="text-center py-12 text-gray-500">
      <p>No departments found</p>
    </div>
    <div v-else class="overflow-hidden rounded-xl shadow-lg border border-blue-100">
      <table class="w-full border-collapse bg-white">
        <thead class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <tr>
            <th class="w-12 p-4 text-left font-semibold text-sm select-none">
              <input 
                type="checkbox" 
                :checked="allSelected"
                @change="toggleSelectAll"
                class="cursor-pointer w-[18px] h-[18px] accent-white"
              />
            </th>
            <th @click="sortBy('name')" class="p-4 text-left font-semibold text-sm select-none cursor-pointer transition-colors hover:bg-blue-500/80">
              Department Name
              <span v-if="sortField === 'name'" class="ml-2 text-xs">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortBy('code')" class="w-24 p-4 text-left font-semibold text-sm select-none cursor-pointer transition-colors hover:bg-blue-500/80">Code</th>
            <th @click="sortBy('faculty')" class="w-32 p-4 text-left font-semibold text-sm select-none cursor-pointer transition-colors hover:bg-blue-500/80">Faculty</th>
            <th @click="sortBy('head')" class="w-48 p-4 text-left font-semibold text-sm select-none cursor-pointer transition-colors hover:bg-blue-500/80">Department Head</th>
            <th @click="sortBy('programs')" class="w-20 p-4 text-center font-semibold text-sm select-none cursor-pointer transition-colors hover:bg-blue-500/80">Programs</th>
            <th @click="sortBy('students')" class="w-20 p-4 text-center font-semibold text-sm select-none cursor-pointer transition-colors hover:bg-blue-500/80">Students</th>
            <th @click="sortBy('status')" class="w-24 p-4 text-center font-semibold text-sm select-none cursor-pointer transition-colors hover:bg-blue-500/80">Status</th>
            <th class="w-40 p-4 text-center font-semibold text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(department, index) in sortedDepartments" 
            :key="department.id" 
            :class="[
              'border-b border-blue-100 transition-all duration-200',
              index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30',
              'hover:bg-blue-100 hover:shadow-md'
            ]"
          >
            <td class="p-4">
              <input 
                type="checkbox" 
                :checked="selected.includes(department.id)"
                @change="toggleSelect(department.id)"
                class="cursor-pointer w-[18px] h-[18px] accent-blue-600"
              />
            </td>
            <td class="p-4">
              <div class="font-semibold text-gray-900">{{ department.name }}</div>
            </td>
            <td class="p-4">
              <span class="inline-block bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold text-xs shadow-sm">{{ department.code }}</span>
            </td>
            <td class="p-4 text-sm text-gray-700">{{ department.faculty }}</td>
            <td class="p-4">
              <div class="text-sm">
                <div class="font-medium text-gray-900">{{ department.head }}</div>
                <small class="block text-gray-500 text-xs">{{ department.headEmail }}</small>
              </div>
            </td>
            <td class="p-4 text-center">
              <span class="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold text-sm">{{ department.programs }}</span>
            </td>
            <td class="p-4 text-center">
              <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">{{ department.students }}</span>
            </td>
            <td class="p-4 text-center">
              <span :class="statusBadgeClasses(department.status)">
                {{ department.status === 'active' ? '✓ Active' : '✗ Inactive' }}
              </span>
            </td>
            <td class="p-4">
              <div class="flex gap-2 justify-center">
                <button @click="$emit('view', department.id)" class="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-blue-600 hover:text-white hover:shadow-md" title="View">View</button>
                <button @click="$emit('edit', department.id)" class="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-amber-600 hover:text-white hover:shadow-md" title="Edit">Edit</button>
                <button @click="$emit('delete', department.id)" class="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-red-600 hover:text-white hover:shadow-md" title="Delete">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selected.length > 0" class="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-200 rounded-b-xl shadow-md mt-4">
      <span class="font-semibold text-gray-700">{{ selected.length }} selected</span>
      <button @click="handleBulkDelete" class="bg-red-600 text-white border-none px-6 py-2.5 rounded-lg font-semibold cursor-pointer transition-all hover:bg-red-700 hover:shadow-lg">Delete Selected</button>
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

const emit = defineEmits(['view', 'edit', 'delete', 'bulk-delete'])

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
  emit('bulk-delete', selected.value)
  selected.value = []
}

const statusBadgeClasses = (status) => {
  const baseClasses = 'inline-block px-3 py-1 rounded-full text-xs font-semibold'
  return status === 'active'
    ? `${baseClasses} bg-green-100 text-green-800`
    : `${baseClasses} bg-red-100 text-red-800`
}
</script>
