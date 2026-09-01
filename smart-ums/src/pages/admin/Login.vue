<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin.store'
import { useToast } from '@/composables/useToast'

defineOptions({ name: 'AdminLogin' })

const router = useRouter()
const adminStore = useAdminStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)

const handleLogin = async (e) => {
  e.preventDefault()
  isSubmitting.value = true
  
  try {
    await adminStore.adminLogin(email.value, password.value)
    toast.success('Admin login successful!')
    router.push({ name: 'admin-dashboard' })
  } catch (error) {
    toast.error(error.message || 'Login failed')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="admin-login-container">
    <div class="admin-login-card">
      <div class="login-header">
        <div class="logo-section">
          <div class="logo-icon">🛡️</div>
          <h1>Admin Panel</h1>
          <p class="subtitle">Smart UMS Management System</p>
        </div>
      </div>

      <form class="login-form" @submit="handleLogin">
        <div class="form-group">
          <label>Admin Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="admin@adminpanel.com" 
            required
            :disabled="isSubmitting"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            required
            :disabled="isSubmitting"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="login-button"
        >
          {{ isSubmitting ? 'Authenticating...' : 'Access Admin Panel' }}
        </button>
      </form>

      <div class="login-footer">
        <p>Default credentials: abdulhananjaved4412@gmail.com / 12345678</p>
        <router-link to="/" class="back-link">← Back to UMS System</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.admin-login-card {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  font-size: 3rem;
}

.login-header h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e3c72;
}

.subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.form-group input {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #1e3c72;
  box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
}

.form-group input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.login-button {
  padding: 1rem;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgba(30, 60, 114, 0.5);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-footer {
  margin-top: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.login-footer p {
  margin: 0;
  font-size: 0.8rem;
  color: #94a3b8;
}

.back-link {
  color: #1e3c72;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: #2a5298;
  text-decoration: underline;
}
</style>
