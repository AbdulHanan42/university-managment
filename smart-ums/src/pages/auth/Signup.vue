<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'
import { usePermissionStore } from '@/stores/permission.store'

defineOptions({ name: 'SignupPage' })

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const permissionStore = usePermissionStore()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'Student',
  organization: 'Main Campus',
  rollNumber: '',
  department: '',
  phone: '',
  address: '',
  profilePic: null
})

const isSubmitting = ref(false)
const profilePicPreview = ref(null)

const availableRoles = [
  { name: 'Student', description: 'Student access for personal data' },
  { name: 'Employee', description: 'Staff access with limited permissions' },
  { name: 'Department Head', description: 'Department-level management' },
  { name: 'Hostel Manager', description: 'Hostel management access' },
  { name: 'Finance Manager', description: 'Financial management access' },
]

const isStudent = computed(() => formData.value.role === 'Student')

const handleProfilePicChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    formData.value.profilePic = file
    const reader = new FileReader()
    reader.onload = (e) => {
      profilePicPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSignup = async (e) => {
  e.preventDefault()
  
  if (formData.value.password !== formData.value.confirmPassword) {
    toast.error('Passwords do not match')
    return
  }

  if (formData.value.password.length < 6) {
    toast.error('Password must be at least 6 characters')
    return
  }

  if (isStudent.value && !formData.value.rollNumber) {
    toast.error('Roll number is required for students')
    return
  }

  isSubmitting.value = true
  
  try {
    const userData = {
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      role: formData.value.role,
      organization: formData.value.organization,
      rollNumber: formData.value.rollNumber || null,
      department: formData.value.department || null,
      phone: formData.value.phone || null,
      address: formData.value.address || null,
      profilePic: profilePicPreview.value || null
    }

    await authStore.signup(userData)
    toast.success('Registration successful! Please wait for admin approval.')
    router.push({ name: 'login' })
  } catch (error) {
    toast.error(error.message || 'Signup failed')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  permissionStore.fetchOrganizations()
})
</script>

<template>
  <section class="auth-card">
    <div>
      <p class="eyebrow">Create account</p>
      <h1>Join Smart UMS</h1>
      <p>Register to access university management system.</p>
    </div>

    <form class="auth-form" @submit="handleSignup">
      <!-- Basic Information -->
      <label>
        <span>Full Name *</span>
        <input 
          v-model="formData.name" 
          type="text" 
          placeholder="John Doe" 
          required
          :disabled="isSubmitting"
        />
      </label>

      <label>
        <span>Email Address *</span>
        <input 
          v-model="formData.email" 
          type="email" 
          placeholder="john@university.edu" 
          required
          :disabled="isSubmitting"
        />
      </label>

      <label>
        <span>Password *</span>
        <input 
          v-model="formData.password" 
          type="password" 
          placeholder="Minimum 6 characters" 
          required
          :disabled="isSubmitting"
        />
      </label>

      <label>
        <span>Confirm Password *</span>
        <input 
          v-model="formData.confirmPassword" 
          type="password" 
          placeholder="Confirm your password" 
          required
          :disabled="isSubmitting"
        />
      </label>

      <!-- Role Selection -->
      <label>
        <span>Role *</span>
        <select 
          v-model="formData.role" 
          required
          :disabled="isSubmitting"
          class="role-select"
        >
          <option v-for="role in availableRoles" :key="role.name" :value="role.name">
            {{ role.name }} - {{ role.description }}
          </option>
        </select>
      </label>

      <!-- Organization Selection -->
      <label>
        <span>Organization *</span>
        <select 
          v-model="formData.organization" 
          required
          :disabled="isSubmitting"
          class="role-select"
        >
          <option v-for="org in permissionStore.activeOrganizations" :key="org.id" :value="org.name">
            {{ org.name }} ({{ org.location }})
          </option>
        </select>
      </label>

      <!-- Student-specific fields -->
      <template v-if="isStudent">
        <label>
          <span>Roll Number *</span>
          <input 
            v-model="formData.rollNumber" 
            type="text" 
            placeholder="e.g., 2024-UMS-001" 
            required
            :disabled="isSubmitting"
          />
        </label>

        <label>
          <span>Department</span>
          <input 
            v-model="formData.department" 
            type="text" 
            placeholder="e.g., Computer Science" 
            :disabled="isSubmitting"
          />
        </label>
      </template>

      <!-- Profile Picture -->
      <label>
        <span>Profile Picture</span>
        <div class="profile-pic-section">
          <div v-if="profilePicPreview" class="profile-preview">
            <img :src="profilePicPreview" alt="Profile Preview" />
            <button 
              type="button" 
              @click="profilePicPreview = null; formData.profilePic = null"
              class="remove-pic"
            >
              Remove
            </button>
          </div>
          <input 
            type="file" 
            accept="image/*"
            @change="handleProfilePicChange"
            :disabled="isSubmitting"
            class="file-input"
          />
        </div>
      </label>

      <!-- Optional Fields -->
      <label>
        <span>Phone Number</span>
        <input 
          v-model="formData.phone" 
          type="tel" 
          placeholder="+1 234 567 8900" 
          :disabled="isSubmitting"
        />
      </label>

      <label>
        <span>Address</span>
        <textarea 
          v-model="formData.address" 
          placeholder="Your address" 
          rows="2"
          :disabled="isSubmitting"
          class="textarea-input"
        ></textarea>
      </label>

      <button 
        type="submit" 
        :disabled="isSubmitting"
        class="submit-button"
      >
        {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
      </button>
    </form>
    
    <div class="auth-footer">
      <p>Already have an account? <router-link to="/login" class="link">Sign in</router-link></p>
    </div>
  </section>
</template>

<style scoped>
.auth-card { 
  max-width: 520px; 
  margin: 2rem auto; 
  background: white; 
  border: 1px solid #dfe7fb; 
  border-radius: 1.2rem; 
  padding: 2rem; 
  box-shadow: 0 16px 40px rgba(20, 33, 61, 0.06); 
}
.eyebrow { 
  margin: 0 0 0.25rem; 
  font-size: 0.74rem; 
  text-transform: uppercase; 
  letter-spacing: 0.2em; 
  color: #60708f; 
}
h1 { 
  margin: 0 0 0.4rem; 
  font-size: 1.8rem;
}
.auth-form { 
  display: grid; 
  gap: 1rem; 
  margin-top: 1.5rem; 
}
label { 
  display: grid; 
  gap: 0.35rem; 
  color: #30415d; 
  font-size: 0.9rem;
}
input, select, textarea { 
  border: 1px solid #d7e1f0; 
  border-radius: 0.75rem; 
  padding: 0.8rem 0.9rem; 
  font-size: 0.95rem;
}
input:disabled, select:disabled, textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}
.role-select, .textarea-input {
  cursor: pointer;
}
.profile-pic-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.profile-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #d7e1f0;
}
.profile-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.remove-pic {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  padding: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}
.file-input {
  font-size: 0.85rem;
}
.submit-button { 
  border: none; 
  border-radius: 999px; 
  padding: 0.9rem; 
  background: #214d9c; 
  color: white; 
  cursor: pointer; 
  font-weight: 500;
  font-size: 1rem;
  margin-top: 0.5rem;
}
.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #60708f;
}
.link {
  color: #214d9c;
  text-decoration: none;
  font-weight: 500;
}
.link:hover {
  text-decoration: underline;
}
</style>
