<template>
  <form @submit.prevent="handleSubmit" class="department-form">
    <!-- Basic Information Section -->
    <fieldset class="form-section">
      <legend>Basic Information</legend>
      <div class="form-row">
        <div class="form-group">
          <label for="name">Department Name *</label>
          <input 
            id="name"
            v-model="formData.name" 
            type="text" 
            placeholder="e.g., Computer Science"
            required
          />
          <span v-if="errors.name" class="error">{{ errors.name }}</span>
        </div>
        <div class="form-group">
          <label for="code">Department Code *</label>
          <input 
            id="code"
            v-model="formData.code" 
            type="text" 
            placeholder="e.g., CS"
            maxlength="5"
            required
          />
          <span v-if="errors.code" class="error">{{ errors.code }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description"
          v-model="formData.description" 
          placeholder="Brief description of the department"
          rows="3"
        ></textarea>
      </div>
    </fieldset>

    <!-- Administrative Section -->
    <fieldset class="form-section">
      <legend>Administrative</legend>
      <div class="form-row">
        <div class="form-group">
          <label for="faculty">Faculty *</label>
          <input 
            id="faculty"
            v-model="formData.faculty" 
            type="text" 
            placeholder="e.g., Engineering"
            required
          />
        </div>
        <div class="form-group">
          <label for="status">Status *</label>
          <select v-model="formData.status" required>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="head">Department Head *</label>
          <input 
            id="head"
            v-model="formData.head" 
            type="text" 
            placeholder="Full name of department head"
            required
          />
        </div>
        <div class="form-group">
          <label for="headEmail">Head Email *</label>
          <input 
            id="headEmail"
            v-model="formData.headEmail" 
            type="email" 
            placeholder="head@university.edu"
            required
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="phone">Phone</label>
          <input 
            id="phone"
            v-model="formData.phone" 
            type="tel" 
            placeholder="+1-555-0101"
          />
        </div>
        <div class="form-group">
          <label for="building">Building</label>
          <input 
            id="building"
            v-model="formData.building" 
            type="text" 
            placeholder="e.g., Tech Building"
          />
        </div>
      </div>
    </fieldset>

    <!-- Resources Section -->
    <fieldset class="form-section">
      <legend>Resources</legend>
      <div class="form-row">
        <div class="form-group">
          <label for="programs">Number of Programs *</label>
          <input 
            id="programs"
            v-model.number="formData.programs" 
            type="number" 
            min="1"
            required
          />
        </div>
        <div class="form-group">
          <label for="faculty_count">Faculty Count *</label>
          <input 
            id="faculty_count"
            v-model.number="formData.faculty_count" 
            type="number" 
            min="1"
            required
          />
        </div>
        <div class="form-group">
          <label for="students">Total Students *</label>
          <input 
            id="students"
            v-model.number="formData.students" 
            type="number" 
            min="0"
            required
          />
        </div>
      </div>
    </fieldset>

    <!-- Accreditation Section -->
    <fieldset class="form-section">
      <legend>Accreditation</legend>
      <div class="form-row">
        <div class="form-group checkbox-group">
          <label>
            <input v-model="formData.accredited" type="checkbox" />
            Accredited
          </label>
        </div>
        <div class="form-group">
          <label for="accreditationBody">Accreditation Body</label>
          <input 
            id="accreditationBody"
            v-model="formData.accreditationBody" 
            type="text" 
            placeholder="e.g., ABET, AACSB"
            :disabled="!formData.accredited"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="establishment_year">Year Established</label>
        <input 
          id="establishment_year"
          v-model.number="formData.establishment_year" 
          type="number" 
          min="1900"
          :max="new Date().getFullYear()"
        />
      </div>
    </fieldset>

    <!-- Form Actions -->
    <div class="form-actions">
      <button type="submit" class="btn-primary" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Department' : 'Create Department') }}
      </button>
      <button type="button" @click="$emit('cancel')" class="btn-secondary">Cancel</button>
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

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = { ...newData }
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
.department-form {
  background: white;
  border: 1px solid #dfe7fb;
  border-radius: 1.2rem;
  padding: 2rem;
}

.form-section {
  border: none;
  padding: 0 0 2rem 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eef2f9;
}

.form-section:last-of-type {
  border-bottom: none;
}

legend {
  font-size: 1.1rem;
  font-weight: 700;
  color: #14213d;
  margin-bottom: 1rem;
  padding: 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
}

.checkbox-group input {
  margin: 0;
}

label {
  font-weight: 600;
  color: #5d6d8f;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

input,
textarea,
select {
  padding: 0.75rem;
  border: 1px solid #dfe7fb;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  font-family: inherit;
  transition: all 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #214d9c;
  box-shadow: 0 0 0 3px rgba(33, 77, 156, 0.1);
}

input:disabled,
select:disabled {
  background: #f8fafb;
  color: #7f8fa3;
  cursor: not-allowed;
}

textarea {
  resize: vertical;
  font-family: inherit;
}

.error {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eef2f9;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-primary {
  background: #214d9c;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1a3d7a;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f4ff;
  color: #214d9c;
  border: 1px solid #dfe7fb;
}

.btn-secondary:hover {
  background: #ecf1ff;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .department-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
