<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppButton from '@/components/common/AppButton.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Dashboard',
  },
})

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}

const handleProfile = () => {
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <header class="flex justify-between items-center px-6 py-4 bg-white/75 backdrop-blur-md border-b border-blue-100">
    <div>
      <p class="mb-1 text-xs uppercase tracking-widest text-gray-500">Operations center</p>
      <h2 class="m-0 text-xl">{{ title }}</h2>
    </div>

    <div class="flex items-center gap-3">
      <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">Live data</span>
      
      <div v-if="authStore.isAuthenticated" class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            {{ authStore.user?.name?.charAt(0) || 'U' }}
          </div>
          <div class="text-sm">
            <div class="font-semibold text-gray-700">{{ authStore.user?.name }}</div>
            <div class="text-xs text-gray-500">{{ authStore.user?.role }}</div>
          </div>
        </div>
        <button 
          @click="handleLogout"
          class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div v-else class="flex gap-2">
        <router-link to="/login" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Login
        </router-link>
        <router-link to="/signup" class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          Sign Up
        </router-link>
      </div>
    </div>
  </header>
</template>
