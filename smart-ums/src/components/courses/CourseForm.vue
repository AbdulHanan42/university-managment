<template>
  <form @submit.prevent="handleSubmit" class="course-form">
    <div class="form-grid">
      <!-- Course Code -->
      <div class="form-group">
        <label for="code">Course Code *</label>
        <input
          id="code"
          v-model="formData.code"
          type="text"
          placeholder="e.g., CS101"
          required
          class="form-input"
        />
      </div>

      <!-- Course Name -->
      <div class="form-group">
        <label for="name">Course Name *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          placeholder="e.g., Introduction to Programming"
          required
          class="form-input"
        />
      </div>

      <!-- Department -->
      <div class="form-group">
        <label for="department">Department *</label>
        <select id="department" v-model="formData.department" required class="form-select">
          <option value="">Select Department</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Business Administration">Business Administration</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Liberal Arts">Liberal Arts</option>
          <option value="Health Sciences">Health Sciences</option>
        </select>
      </div>

      <!-- Program -->
      <div class="form-group">
        <label for="program">Program *</label>
        <select id="program" v-model="formData.program" required class="form-select">
          <option value="">Select Program</option>
          <option value="BSc Computer Science">BSc Computer Science</option>
          <option value="MSc Computer Science">MSc Computer Science</option>
          <option value="BBA">BBA</option>
          <option value="MBA">MBA</option>
          <option value="BSc Civil Engineering">BSc Civil Engineering</option>
          <option value="BA Liberal Arts">BA Liberal Arts</option>
          <option value="BSc Nursing">BSc Nursing</option>
        </select>
      </div>

      <!-- Credits -->
      <div class="form-group">
        <label for="credits">Credits *</label>
        <input
          id="credits"
          v-model.number="formData.credits"
          type="number"
          min="1"
          max="6"
          placeholder="e.g., 3"
          required
          class="form-input"
        />
      </div>

      <!-- Capacity -->
      <div class="form-group">
        <label for="capacity">Capacity *</label>
        <input
          id="capacity"
          v-model.number="formData.capacity"
          type="number"
          min="1"
          placeholder="e.g., 60"
          required
          class="form-input"
        />
      </div>

      <!-- Faculty Assignment -->
      <div class="form-group">
        <label for="facultyId">Faculty Member</label>
        <select id="facultyId" v-model="formData.facultyId" class="form-select">
          <option value="">Select Faculty (Optional)</option>
          <option v-for="faculty in facultyList" :key="faculty.id" :value="faculty.id">
            {{ faculty.name }}
          </option>
        </select>
      </div>

      <!-- Status -->
      <div class="form-group">
        <label for="status">Status *</label>
        <select id="status" v-model="formData.status" required class="form-select">
          <option value="active">Active</option>
          <option value="on-leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <!-- Level -->
      <div class="form-group">
        <label for="level">Level *</label>
        <select id="level" v-model="formData.level" required class="form-select">
          <option value="undergraduate">Undergraduate</option>
          <option value="graduate">Graduate</option>
        </select>
      </div>

      <!-- Category -->
      <div class="form-group">
        <label for="category">Category *</label>
        <select id="category" v-model="formData.category" required class="form-select">
          <option value="core">Core</option>
          <option value="elective">Elective</option>
        </select>
      </div>

      <!-- Semester -->
      <div class="form-group">
        <label for="semester">Semester *</label>
        <input
          id="semester"
          v-model="formData.semester"
          type="text"
          placeholder="e.g., Fall 2024"
          required
          class="form-input"
        />
      </div>

      <!-- Schedule -->
      <div class="form-group">
        <label for="schedule">Schedule</label>
        <input
          id="schedule"
          v-model="formData.schedule"
          type="text"
          placeholder="e.g., Mon-Wed-Fri 9:00-10:00 AM"
          class="form-input"
        />
      </div>

      <!-- Room -->
      <div class="form-group">
        <label for="room">Room</label>
        <input
          id="room"
          v-model="formData.room"
          type="text"
          placeholder="e.g., Tech Building, Room 101"
          class="form-input"
        />
      </div>

      <!-- Description -->
      <div class="form-group full-width">
        <label for="description">Description *</label>
        <textarea
          id="description"
          v-model="formData.description"
          rows="4"
          placeholder="Course description..."
          required
          class="form-textarea"
        ></textarea>
      </div>

      <!-- Prerequisites -->
      <div class="form-group full-width">
        <label for="prerequisites">Prerequisites (comma-separated course codes)</label>
        <input
          id="prerequisites"
          v-model="prerequisitesInput"
          type="text"
          placeholder="e.g., CS101, MATH201"
          class="form-input"
        />
      </div>
    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      <button type="button" @click="$emit('cancel')" class="btn-cancel">Cancel</button>
      <button type="submit" :disabled="loading" class="btn-submit">
        {{ loading ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { facultyService } from '@/services/faculty.service'

defineOptions({ name: 'CourseForm' })

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const facultyList = ref([])

const formData = ref({
  code: '',
  name: '',
  description: '',
  credits: 3,
  department: '',
  program: '',
  facultyId: null,
  facultyName: '',
  status: 'active',
  capacity: 60,
  enrolled: 0,
  schedule: '',
  room: '',
  semester: '',
  prerequisites: [],
  level: 'undergraduate',
  category: 'core'
})

const prerequisitesInput = computed({
  get: () => formData.value.prerequisites.join(', '),
  set: (value) => {
    formData.value.prerequisites = value
      .split(',')
      .map(code => code.trim())
      .filter(code => code.length > 0)
  }
})

const loadFaculty = async () => {
  try {
    const response = await facultyService.getAll()
    facultyList.value = response.data
  } catch (error) {
    console.error('Failed to load faculty:', error)
  }
}

const handleSubmit = () => {
  // Set faculty name based on selected faculty ID
  if (formData.value.facultyId) {
    const faculty = facultyList.value.find(f => f.id == formData.value.facultyId)
    if (faculty) {
      formData.value.facultyName = faculty.name
    }
  } else {
    formData.value.facultyName = ''
  }
  
  emit('submit', formData.value)
}

// Watch for initial data changes
watch(() => props.initialData, (newData) => {
  if (Object.keys(newData).length > 0) {
    formData.value = { ...formData.value, ...newData }
  }
}, { immediate: true })

// Load faculty on mount
loadFaculty()
</script>

<style scoped>
.course-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(33, 77, 156, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: var(--color-bg-light);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.btn-cancel:hover {
  background: var(--color-border);
}

.btn-submit {
  background: var(--color-primary);
  border: none;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(33, 77, 156, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
