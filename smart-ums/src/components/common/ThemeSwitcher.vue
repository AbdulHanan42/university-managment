<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()

const icon = computed(() => {
  return isDark.value 
    ? '☀️' 
    : '🌙'
})

const label = computed(() => {
  return isDark.value 
    ? 'Switch to Light Mode' 
    : 'Switch to Dark Mode'
})
</script>

<template>
  <button
    @click="toggleTheme"
    :aria-label="label"
    :title="label"
    class="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
  >
    {{ icon }}
  </button>
</template>
