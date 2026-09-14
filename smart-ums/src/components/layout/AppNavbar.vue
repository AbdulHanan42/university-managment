<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useTheme } from '@/composables/useTheme'
import AppButton from '@/components/common/AppButton.vue'
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Dashboard',
  },
})

const router = useRouter()
const authStore = useAuthStore()
const { isDark } = useTheme()

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}

const handleProfile = () => {
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <header :class="['flex justify-between items-center px-6 py-4 backdrop-blur-md border-b', isDark ? 'bg-gray-900/75 border-gray-700' : 'bg-white/75 border-blue-100']">
    <div>
      <p :class="['mb-1 text-xs uppercase tracking-widest', isDark ? 'text-gray-400' : 'text-gray-500']">Operations center</p>
      <h2 :class="['m-0 text-xl', isDark ? 'text-white' : 'text-gray-900']">{{ title }}</h2>
    </div>

    <div class="flex items-center gap-3">
      <span :class="['px-3 py-1 rounded-full text-sm', isDark ? 'bg-gray-800 text-gray-300' : 'bg-blue-50 text-blue-600']">Live data</span>
      
      <ThemeSwitcher />
      
      <div v-if="authStore.isAuthenticated" class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <div :class="['w-8 h-8 rounded-full flex items-center justify-center font-bold', isDark ? 'bg-gray-700 text-gray-300' : 'bg-blue-100 text-blue-600']">
            {{ authStore.user?.name?.charAt(0) || 'U' }}
          </div>
          <div class="text-sm">
            <div :class="['font-semibold', isDark ? 'text-gray-300' : 'text-gray-700']">{{ authStore.user?.name }}</div>
            <div :class="['text-xs', isDark ? 'text-gray-400' : 'text-gray-500']">{{ authStore.user?.role }}</div>
          </div>
        </div>
        <button 
          @click="handleLogout"
          :class="['px-3 py-1.5 text-sm rounded-lg transition-colors', isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700']"
        >
          Logout
        </button>
      </div>
      
      <div v-else class="flex gap-2">
        <router-link to="/login" :class="['px-4 py-2 text-sm rounded-lg transition-colors', isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700']">
          Login
        </router-link>
        <router-link to="/signup" :class="['px-4 py-2 text-sm rounded-lg transition-colors', isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
          Sign Up
        </router-link>
      </div>
    </div>
  </header>
</template>
