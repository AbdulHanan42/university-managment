<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'

defineOptions({ name: 'LoginPage' })

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)

const handleLogin = async (e) => {
  e.preventDefault()
  isSubmitting.value = true
  
  try {
    await authStore.login(email.value, password.value)
    toast.success('Login successful!')
    router.push({ name: 'dashboard' })
  } catch (error) {
    toast.error(error.message || 'Login failed')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="auth-card">
    <div>
      <p class="eyebrow">Secure access</p>
      <h1>Welcome back</h1>
      <p>Sign in to explore the university operations dashboard.</p>
    </div>

    <form class="auth-form" @submit="handleLogin">
      <label>
        <span>Email</span>
        <input 
          v-model="email" 
          type="email" 
          placeholder="staff@university.edu" 
          required
          :disabled="isSubmitting"
        />
      </label>
      <label>
        <span>Password</span>
        <input 
          v-model="password" 
          type="password" 
          placeholder="••••••••" 
          required
          :disabled="isSubmitting"
        />
      </label>
      <button 
        type="submit" 
        :disabled="isSubmitting"
        class="submit-button"
      >
        {{ isSubmitting ? 'Signing in...' : 'Continue' }}
      </button>
    </form>
    
    <div class="auth-footer">
      <p>Don't have an account? <router-link to="/signup" class="link">Sign up</router-link></p>
    </div>
  </section>
</template>

<style scoped>
.auth-card { 
  max-width: 480px; 
  margin: 3rem auto; 
  background: white; 
  border: 1px solid #dfe7fb; 
  border-radius: 1.2rem; 
  padding: 1.5rem; 
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
}
.auth-form { 
  display: grid; 
  gap: 0.9rem; 
  margin-top: 1rem; 
}
label { 
  display: grid; 
  gap: 0.35rem; 
  color: #30415d; 
}
input { 
  border: 1px solid #d7e1f0; 
  border-radius: 0.75rem; 
  padding: 0.8rem 0.9rem; 
}
input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}
.submit-button { 
  border: none; 
  border-radius: 999px; 
  padding: 0.8rem; 
  background: #214d9c; 
  color: white; 
  cursor: pointer; 
  font-weight: 500;
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
