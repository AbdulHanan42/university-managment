<template>
  <form @submit.prevent="handleSubmit" class="program-form">
    <div class="form-section">
      <h3>Basic Information</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="name">Program Name *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="e.g., Bachelor of Science in Computer Science"
            required
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>
        <div class="form-group">
          <label for="code">Program Code *</label>
          <input
            id="code"
            v-model="formData.code"
            type="text"
            placeholder="e.g., BSC-CS"
            required
          />
          <span v-if="errors.code" class="error-message">{{ errors.code }}</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="department">Department *</label>
          <select id="department" v-model="formData.department" required>
            <option value="">Select Department</option>
            <option>Computer Science</option>
            <option>Business</option>
            <option>Social Sciences</option>
            <option>Engineering</option>
            <option>Health Sciences</option>
            <option>Arts & Humanities</option>
          </select>
          <span v-if="errors.department" class="error-message">{{ errors.department }}</span>
        </div>
        <div class="form-group">
          <label for="level">Level *</label>
          <select id="level" v-model="formData.level" required>
            <option value="">Select Level</option>
            <option>Undergraduate</option>
            <option>Graduate</option>
            <option>Doctoral</option>
            <option>Certificate</option>
          </select>
          <span v-if="errors.level" class="error-message">{{ errors.level }}</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="duration">Duration *</label>
          <input
            id="duration"
            v-model="formData.duration"
            type="text"
            placeholder="e.g., 4 years"
            required
          />
          <span v-if="errors.duration" class="error-message">{{ errors.duration }}</span>
        </div>
        <div class="form-group">
          <label for="credits">Total Credits *</label>
          <input
            id="credits"
            v-model.number="formData.credits"
            type="number"
            placeholder="120"
            required
          />
          <span v-if="errors.credits" class="error-message">{{ errors.credits }}</span>
        </div>
      </div>

      <div class="form-group full-width">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          placeholder="Detailed program description..."
          rows="4"
        />
      </div>
    </div>

    <div class="form-section">
      <h3>Administrative Details</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="faculty">Faculty Lead *</label>
          <input
            id="faculty"
            v-model="formData.faculty"
            type="text"
            placeholder="e.g., Dr. James Wilson"
            required
          />
        </div>
        <div class="form-group">
          <label for="status">Status *</label>
          <select id="status" v-model="formData.status" required>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="accreditation">Accreditation Status</label>
          <select id="accreditation" v-model="formData.accreditation">
            <option value="Accredited">Accredited</option>
            <option value="Pending">Pending</option>
            <option value="Not Required">Not Required</option>
          </select>
        </div>
      </div>
    </div>

    <div class="form-section">
      <h3>Admission & Career</h3>
      <div class="form-group full-width">
        <label for="admissionRequirements">Admission Requirements</label>
        <textarea
          id="admissionRequirements"
          v-model="formData.admissionRequirements"
          placeholder="e.g., High School Diploma with Math & Science"
          rows="3"
        />
      </div>

      <div class="form-group full-width">
        <label for="careerOutcomes">Career Outcomes</label>
        <textarea
          id="careerOutcomes"
          v-model="formData.careerOutcomes"
          placeholder="e.g., Software Developer, Systems Engineer, Data Scientist"
          rows="3"
        />
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-cancel" @click="$emit('cancel')">Cancel</button>
      <button type="submit" class="btn-submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : isEditMode ? 'Update Program' : 'Create Program' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

defineOptions({ name: 'ProgramForm' })

const props = defineProps({
  program: {
    type: Object,
    default: null
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEditMode = computed(() => !!props.program)

const formData = ref({
  name: '',
  code: '',
  department: '',
  level: '',
  duration: '',
  credits: '',
  description: '',
  faculty: '',
  status: 'Active',
  accreditation: 'Accredited',
  admissionRequirements: '',
  careerOutcomes: ''
})

const errors = ref({})

watch(
  () => props.program,
  (newProgram) => {
    if (newProgram) {
      formData.value = { ...newProgram }
    }
  },
  { immediate: true }
)

const validateForm = () => {
  errors.value = {}

  if (!formData.value.name?.trim()) {
    errors.value.name = 'Program name is required'
  }
  if (!formData.value.code?.trim()) {
    errors.value.code = 'Program code is required'
  }
  if (!formData.value.department) {
    errors.value.department = 'Department is required'
  }
  if (!formData.value.level) {
    errors.value.level = 'Level is required'
  }
  if (!formData.value.duration?.trim()) {
    errors.value.duration = 'Duration is required'
  }
  if (!formData.value.credits) {
    errors.value.credits = 'Credits are required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', formData.value)
  }
}
</script>

<style scoped>
.program-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #14213d;
  font-weight: 600;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f0f4ff;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #2a3f61;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #dfe7fb;
  border-radius: 0.75rem;
  font-family: inherit;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #214d9c;
  box-shadow: 0 0 0 3px rgba(33, 77, 156, 0.1);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eef2f9;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.btn-cancel {
  background: #f0f4ff;
  color: #214d9c;
  border: 1px solid #dfe7fb;
}

.btn-cancel:hover {
  background: #e4ebff;
}

.btn-submit {
  background: #214d9c;
  color: white;
  min-width: 140px;
}

.btn-submit:hover:not(:disabled) {
  background: #1a3a6f;
  box-shadow: 0 8px 16px rgba(33, 77, 156, 0.2);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
