<template>
  <form @submit.prevent="handleSubmit" class="bg-white border border-blue-100 rounded-xl p-8">
    <!-- Personal Information Section -->
    <fieldset class="border-none p-0 pb-8 mb-6 border-b border-blue-50">
      <legend class="text-lg font-bold text-gray-900 mb-4 p-0">Personal Information</legend>
      
      <!-- Profile Image Upload -->
      <div class="mb-6">
        <label class="font-semibold text-gray-600 mb-2 text-sm block">Profile Image</label>
        <div class="flex items-start gap-6">
          <div class="flex-shrink-0">
            <div class="w-32 h-32 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center overflow-hidden">
              <img v-if="formData.imageUrl" :src="formData.imageUrl" alt="Profile" class="w-full h-full object-cover" />
              <span v-else class="text-gray-400 text-sm">No image</span>
            </div>
          </div>
          <div class="flex-grow">
            <input 
              id="imageUrl"
              v-model="formData.imageUrl" 
              type="text" 
              placeholder="Enter image URL (e.g., https://example.com/photo.jpg)"
              class="w-full px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 mb-2"
            />
            <p class="text-xs text-gray-500">Enter a URL for the faculty member's profile image</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div class="flex flex-col">
          <label for="name" class="font-semibold text-gray-600 mb-2 text-sm">Full Name *</label>
          <input 
            id="name"
            v-model="formData.name" 
            type="text" 
            placeholder="e.g., Dr. John Smith"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
          <span v-if="errors.name" class="text-red-600 text-xs mt-1">{{ errors.name }}</span>
        </div>
        <div class="flex flex-col">
          <label for="email" class="font-semibold text-gray-600 mb-2 text-sm">Email *</label>
          <input 
            id="email"
            v-model="formData.email" 
            type="email" 
            placeholder="e.g., john.smith@university.edu"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
          <span v-if="errors.email" class="text-red-600 text-xs mt-1">{{ errors.email }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col">
          <label for="phone" class="font-semibold text-gray-600 mb-2 text-sm">Phone</label>
          <input 
            id="phone"
            v-model="formData.phone" 
            type="tel" 
            placeholder="+1-555-0201"
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="status" class="font-semibold text-gray-600 mb-2 text-sm">Status *</label>
          <select v-model="formData.status" required class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100">
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </fieldset>

    <!-- Academic Information Section -->
    <fieldset class="border-none p-0 pb-8 mb-6 border-b border-blue-50">
      <legend class="text-lg font-bold text-gray-900 mb-4 p-0">Academic Information</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div class="flex flex-col">
          <label for="department" class="font-semibold text-gray-600 mb-2 text-sm">Department *</label>
          <input 
            id="department"
            v-model="formData.department" 
            type="text" 
            placeholder="e.g., Computer Science"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="designation" class="font-semibold text-gray-600 mb-2 text-sm">Designation *</label>
          <select v-model="formData.designation" required class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100">
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Lecturer">Lecturer</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div class="flex flex-col">
          <label for="specialization" class="font-semibold text-gray-600 mb-2 text-sm">Specialization *</label>
          <input 
            id="specialization"
            v-model="formData.specialization" 
            type="text" 
            placeholder="e.g., Artificial Intelligence"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="qualification" class="font-semibold text-gray-600 mb-2 text-sm">Qualification *</label>
          <input 
            id="qualification"
            v-model="formData.qualification" 
            type="text" 
            placeholder="e.g., Ph.D. Computer Science"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col">
          <label for="experience" class="font-semibold text-gray-600 mb-2 text-sm">Experience (years) *</label>
          <input 
            id="experience"
            v-model.number="formData.experience" 
            type="number" 
            min="0"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="joiningDate" class="font-semibold text-gray-600 mb-2 text-sm">Joining Date *</label>
          <input 
            id="joiningDate"
            v-model="formData.joiningDate" 
            type="date"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
      </div>
    </fieldset>

    <!-- Workload Section -->
    <fieldset class="border-none p-0 pb-8 mb-6 border-b border-blue-50">
      <legend class="text-lg font-bold text-gray-900 mb-4 p-0">Workload</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div class="flex flex-col">
          <label for="courses" class="font-semibold text-gray-600 mb-2 text-sm">Number of Courses *</label>
          <input 
            id="courses"
            v-model.number="formData.courses" 
            type="number" 
            min="0"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="teachingHours" class="font-semibold text-gray-600 mb-2 text-sm">Teaching Hours/Week *</label>
          <input 
            id="teachingHours"
            v-model.number="formData.teachingHours" 
            type="number" 
            min="0"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div class="flex flex-col">
          <label for="totalStudents" class="font-semibold text-gray-600 mb-2 text-sm">Total Students *</label>
          <input 
            id="totalStudents"
            v-model.number="formData.totalStudents" 
            type="number" 
            min="0"
            required
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="researchHours" class="font-semibold text-gray-600 mb-2 text-sm">Research Hours/Week</label>
          <input 
            id="researchHours"
            v-model.number="formData.researchHours" 
            type="number" 
            min="0"
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
      </div>

      <div class="flex flex-col">
        <label for="adminHours" class="font-semibold text-gray-600 mb-2 text-sm">Admin Hours/Week</label>
        <input 
          id="adminHours"
          v-model.number="formData.adminHours" 
          type="number" 
          min="0"
          class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
        />
      </div>
    </fieldset>

    <!-- Office Information Section -->
    <fieldset class="border-none p-0 pb-8 mb-6 border-b border-blue-50">
      <legend class="text-lg font-bold text-gray-900 mb-4 p-0">Office Information</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div class="flex flex-col">
          <label for="office" class="font-semibold text-gray-600 mb-2 text-sm">Office Location</label>
          <input 
            id="office"
            v-model="formData.office" 
            type="text" 
            placeholder="e.g., Tech Building, Room 301"
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="officeHours" class="font-semibold text-gray-600 mb-2 text-sm">Office Hours</label>
          <input 
            id="officeHours"
            v-model="formData.officeHours" 
            type="text" 
            placeholder="e.g., Monday-Wednesday, 10:00 AM - 12:00 PM"
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
      </div>

      <div class="flex flex-row items-center">
        <label class="flex items-center gap-2 font-normal">
          <input v-model="formData.isHead" type="checkbox" class="m-0" />
          Department Head
        </label>
      </div>
    </fieldset>

    <!-- Research Interests Section -->
    <fieldset class="border-none p-0 pb-8 mb-6 border-b border-blue-50 last:border-b-0">
      <legend class="text-lg font-bold text-gray-900 mb-4 p-0">Research</legend>
      <div class="flex flex-col mb-4">
        <label for="researchInterests" class="font-semibold text-gray-600 mb-2 text-sm">Research Interests (comma-separated)</label>
        <input 
          id="researchInterests"
          v-model="researchInterestsInput" 
          type="text" 
          placeholder="e.g., Machine Learning, Neural Networks, Computer Vision"
          class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
        />
        <small class="text-gray-500 text-xs mt-1">Enter research interests separated by commas</small>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col">
          <label for="publications" class="font-semibold text-gray-600 mb-2 text-sm">Number of Publications</label>
          <input 
            id="publications"
            v-model.number="formData.publications" 
            type="number" 
            min="0"
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
        <div class="flex flex-col">
          <label for="lastPromotion" class="font-semibold text-gray-600 mb-2 text-sm">Last Promotion Date</label>
          <input 
            id="lastPromotion"
            v-model="formData.lastPromotion" 
            type="date"
            class="px-3 py-2 border border-blue-100 rounded-lg text-sm transition-all focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
          />
        </div>
      </div>
    </fieldset>

    <!-- Form Actions -->
    <div class="flex gap-4 mt-8 pt-6 border-t border-blue-50">
      <button type="submit" :disabled="isSubmitting" class="px-6 py-3 border-none rounded-lg font-semibold cursor-pointer transition-all text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
        {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Faculty' : 'Create Faculty') }}
      </button>
      <button type="button" @click="$emit('cancel')" class="px-6 py-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg font-semibold cursor-pointer transition-all text-sm hover:bg-blue-100">Cancel</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

defineOptions({ name: 'FacultyForm' })

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
  email: '',
  phone: '',
  imageUrl: '',
  department: '',
  designation: 'Assistant Professor',
  status: 'active',
  specialization: '',
  qualification: '',
  experience: 0,
  joiningDate: '',
  courses: 2,
  teachingHours: 12,
  totalStudents: 0,
  researchHours: 8,
  adminHours: 2,
  isHead: false,
  office: '',
  officeHours: '',
  researchInterests: [],
  publications: 0,
  lastPromotion: ''
})

const researchInterestsInput = computed({
  get: () => formData.value.researchInterests.join(', '),
  set: (value) => {
    formData.value.researchInterests = value
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
      if (!formData.value.researchInterests) {
        formData.value.researchInterests = []
      }
    }
  },
  { immediate: true }
)

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Name is required'
  }
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Invalid email format'
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
