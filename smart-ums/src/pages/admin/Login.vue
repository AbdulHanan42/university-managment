<script setup>
import { ref, onMounted } from 'vue'
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

onMounted(() => {
  adminStore.initializeAdminPanel()
})

const handleLogin = async (e) => {
  e.preventDefault()
  isSubmitting.value = true
  
  try {
    await adminStore.adminLogin(email.value, password.value)
    toast.success('Admin login successful!')
    router.push({ name: 'admin-panel' })
  } catch (error) {
    toast.error(error.message || 'Login failed')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">
      <div class="text-center mb-8">
        <div class="flex flex-col items-center gap-4">
          <div class="text-5xl">🛡️</div>
          <h1 class="text-3xl font-bold text-blue-900">Admin Panel</h1>
          <p class="text-gray-500 text-sm">Smart UMS Management System</p>
        </div>
      </div>

      <form class="flex flex-col gap-5" @submit="handleLogin">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-slate-700">Admin Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="abdulhananjaved4412@gmail.com" 
            required
            :disabled="isSubmitting"
            class="px-4 py-3.5 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-900 focus:ring-3 focus:ring-blue-900/10 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-slate-700">Password</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            required
            :disabled="isSubmitting"
            class="px-4 py-3.5 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-900 focus:ring-3 focus:ring-blue-900/10 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="px-4 py-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl text-base font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2"
        >
          {{ isSubmitting ? 'Authenticating...' : 'Access Admin Panel' }}
        </button>
      </form>

      <div class="mt-8 text-center flex flex-col gap-3">
        <!-- <p class="text-xs text-slate-400">Default credentials: abdulhananjaved4412@gmail.com / 12345678</p> -->
        <router-link to="/" class="text-blue-900 no-underline font-semibold text-sm hover:text-blue-700 hover:underline transition-colors">
          ← Back to UMS System
        </router-link>
      </div>
    </div>
  </div>
</template>
