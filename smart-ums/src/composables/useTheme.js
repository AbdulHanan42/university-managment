import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme.store'

export function useTheme() {
  const themeStore = useThemeStore()

  const isDark = computed(() => themeStore.isDark)
  const theme = computed(() => themeStore.theme)

  function toggleTheme() {
    themeStore.toggleTheme()
  }

  function setTheme(newTheme) {
    themeStore.setTheme(newTheme)
  }

  function initTheme() {
    themeStore.initTheme()
  }

  return {
    isDark,
    theme,
    toggleTheme,
    setTheme,
    initTheme
  }
}
