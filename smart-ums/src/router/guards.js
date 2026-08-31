import { useAuthStore } from '@/stores/auth.store'

// Admin-only route guard
export const requiresAdmin = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated && authStore.isAdmin) {
    next()
  } else {
    // Redirect to login if not authenticated, unauthorized if not admin
    if (!authStore.isAuthenticated) {
      next({ name: 'login' })
    } else {
      next({ name: 'unauthorized' })
    }
  }
}

// Authentication guard
export const requiresAuth = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    next()
  } else {
    next({ name: 'login' })
  }
}

export const guards = {
  requiresAdmin,
  requiresAuth
}

