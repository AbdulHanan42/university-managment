<template>
  <form @submit.prevent="handleSubmit" class="bg-white border border-blue-100 rounded-xl p-8">
    <!-- Basic Information Section -->
    <fieldset class="border-none p-0 pb-8 mb-6 border-b border-blue-50">
      <legend class="text-lg font-bold text-gray-900 mb-4 p-0">Basic Information</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div class="flex flex-col">
          <label for="name" class="font-semibold text-gray-600 mb-2 text-sm">Department Name *</label>
          <input 
            id="name"
            v-model="formData.name" 
            type="text" 
            placeholder="e.g., Computer Science"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
          <span v-if="errors.name" class="text-red-600 text-xs mt-1">{{ errors.name }}</span>
        </div>
        <div class="flex flex-col">
          <label for="code" class="font-semibold text-gray-600 mb-2 text-sm">Department Code *</label>
          <input 
            id="code"
            v-model="formData.code" 
            type="text" 
            placeholder="e.g., CS"
            maxlength="5"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
          <span v-if="errors.code" class="text-red-600 text-xs mt-1">{{ errors.code }}</span>
        </div>
      </div>

      <div class="flex flex-col">
        <label for="description" class="font-semibold text-gray-600 mb-2 text-sm">Description</label>
        <textarea 
          id="description"
          v-model="formData.description" 
          placeholder="Brief description of the department"
          rows="3"
          class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 resize-y"
        ></textarea>
      </div>
    </fieldset>

    <!-- Administrative Section -->
    <fieldset class="border-none p-0 pb-8 mb-6 border-b border-blue-50">
      <legend class="text-lg font-bold text-gray-900 mb-4 p-0">Administrative</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div class="flex flex-col">
          <label for="faculty" class="font-semibold text-gray-600 mb-2 text-sm">Faculty *</label>
          <input 
            id="faculty"
            v-model="formData.faculty" 
            type="text" 
            placeholder="e.g., Engineering"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="status" class="font-semibold text-gray-600 mb-2 text-sm">Status *</label>
          <select v-model="formData.status" required class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div class="flex flex-col">
          <label for="head" class="font-semibold text-gray-600 mb-2 text-sm">Department Head *</label>
          <input 
            id="head"
            v-model="formData.head" 
            type="text" 
            placeholder="Full name of department head"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="headEmail" class="font-semibold text-gray-600 mb-2 text-sm">Head Email *</label>
          <input 
            id="headEmail"
            v-model="formData.headEmail" 
            type="email" 
            placeholder="head@university.edu"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div class="flex flex-col">
          <label for="phone" class="font-semibold text-gray-600 mb-2 text-sm">Phone</label>
          <input 
            id="phone"
            v-model="formData.phone" 
            type="tel" 
            placeholder="+1-555-0101"
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="building" class="font-semibold text-gray-600 mb-2 text-sm">Building</label>
          <input 
            id="building"
            v-model="formData.building" 
            type="text" 
            placeholder="e.g., Tech Building"
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col">
          <label for="floor" class="font-semibold text-gray-600 mb-2 text-sm">Floor</label>
          <input 
            id="floor"
            v-model="formData.floor" 
            type="text" 
            placeholder="e.g., 3rd Floor"
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="office_hours" class="font-semibold text-gray-600 mb-2 text-sm">Office Hours</label>
          <input 
            id="office_hours"
            v-model="formData.office_hours" 
            type="text" 
            placeholder="e.g., Monday-Friday, 9:00 AM - 5:00 PM"
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
      </div>
    </fieldset>

    <!-- Resources Section -->
    <fieldset class="border-none p-0 pb-8 mb-6 border-b border-blue-50">
      <legend class="text-lg font-bold text-gray-900 mb-4 p-0">Resources</legend>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex flex-col">
          <label for="programs" class="font-semibold text-gray-600 mb-2 text-sm">Number of Programs *</label>
          <input 
            id="programs"
            v-model.number="formData.programs" 
            type="number" 
            min="1"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="faculty_count" class="font-semibold text-gray-600 mb-2 text-sm">Faculty Count *</label>
          <input 
            id="faculty_count"
            v-model.number="formData.faculty_count" 
            type="number" 
            min="1"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="students" class="font-semibold text-gray-600 mb-2 text-sm">Total Students *</label>
          <input 
            id="students"
            v-model.number="formData.students" 
            type="number" 
            min="0"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
      </div>
    </fieldset>

    <!-- Accreditation Section -->
    <fieldset class="border-none p-0 pb-8 mb-6 border-b border-blue-50">
      <legend class="text-lg font-bold text-gray-900 mb-4 p-0">Accreditation</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div class="flex flex-row items-center">
          <label class="flex items-center gap-2 font-normal">
            <input v-model="formData.accredited" type="checkbox" class="m-0" />
            Accredited
          </label>
        </div>
        <div class="flex flex-col">
          <label for="accreditationBody" class="font-semibold text-gray-600 mb-2 text-sm">Accreditation Body</label>
          <input 
            id="accreditationBody"
            v-model="formData.accreditationBody" 
            type="text" 
            placeholder="e.g., ABET, AACSB"
            :disabled="!formData.accredited"
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div class="flex flex-col">
        <label for="establishment_year" class="font-semibold text-gray-600 mb-2 text-sm">Year Established</label>
        <input 
          id="establishment_year"
          v-model.number="formData.establishment_year" 
          type="number" 
          min="1900"
          :max="new Date().getFullYear()"
          class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
        />
      </div>
    </fieldset>

    <!-- Specializations Section -->
    <fieldset class="border-none p-0 pb-8 mb-6 border-b border-blue-50 last:border-b-0">
      <legend class="text-lg font-bold text-gray-900 mb-4 p-0">Specializations</legend>
      <div class="flex flex-col">
        <label for="specialization" class="font-semibold text-gray-600 mb-2 text-sm">Specializations (comma-separated)</label>
        <input 
          id="specialization"
          v-model="specializationInput" 
          type="text" 
          placeholder="e.g., AI, Machine Learning, Cloud Computing"
          class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
        />
        <small class="text-gray-500 text-xs mt-1">Enter specializations separated by commas</small>
      </div>
    </fieldset>

    <!-- Form Actions -->
    <div class="flex gap-4 mt-8 pt-6 border-t border-blue-50">
      <button type="submit" :disabled="isSubmitting" class="px-6 py-3 border-none rounded-lg font-semibold cursor-pointer transition-all text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
        {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Department' : 'Create Department') }}
      </button>
      <button type="button" @click="$emit('cancel')" class="px-6 py-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg font-semibold cursor-pointer transition-all text-sm hover:bg-blue-100">Cancel</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

defineOptions({ name: 'DepartmentForm' })

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isSubmitting = ref(false)
const errors = ref({})

const isEditing = computed(() => !!props.initialData?.id)

const formData = ref({
  name: '',
  code: '',
  faculty: '',
  head: '',
  headEmail: '',
  description: '',
  status: 'active',
  phone: '',
  building: '',
  floor: '',
  office_hours: '',
  programs: 1,
  faculty_count: 1,
  students: 0,
  accredited: false,
  accreditationBody: '',
  establishment_year: new Date().getFullYear(),
  specialization: []
})

const specializationInput = computed({
  get: () => formData.value.specialization.join(', '),
  set: (value) => {
    formData.value.specialization = value
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
  }
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = { ...newData }
      if (!formData.value.specialization) {
        formData.value.specialization = []
      }
    }
  },
  { immediate: true }
)

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Department name is required'
  }
  if (!formData.value.code.trim()) {
    errors.value.code = 'Department code is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  try {
    emit('submit', { ...formData.value })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
@media (max-width: 768px) {
  .grid.grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .grid.grid-cols-1.md\:grid-cols-3 {
    grid-template-columns: 1fr;
  }

  .p-8 {
    padding: 1.5rem;
  }

  .flex.gap-4 {
    flex-direction: column;
  }

  .px-6.py-3 {
    width: 100%;
  }
}
</style>
