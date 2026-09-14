import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref('light')
  const isDark = ref(false)

  function initTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }
    applyTheme()
  }

  function applyTheme() {
    isDark.value = theme.value === 'dark'
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', theme.value)
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme()
  }

  function setTheme(newTheme) {
    if (newTheme === 'light' || newTheme === 'dark') {
      theme.value = newTheme
      applyTheme()
    }
  }

  // Watch for theme changes to apply immediately
  watch(theme, () => {
    applyTheme()
  })

  return {
    theme,
    isDark,
    initTheme,
    toggleTheme,
    setTheme
  }
})
