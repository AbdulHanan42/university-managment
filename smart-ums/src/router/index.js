import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/stores/auth.store'
import { useAdminStore } from '@/stores/admin.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Global navigation guard to enforce authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const adminStore = useAdminStore()
  
  // Check if route is public (login, signup, etc.)
  const isPublicRoute = to.meta.public === true
  
  // Check if route requires authentication
  const requiresAuth = to.meta.requiresAuth === true
  
  // Redirect to login if not authenticated and route requires auth
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }
  
  // Redirect to dashboard if authenticated and trying to access public routes (except admin panel)
  if (isPublicRoute && authStore.isAuthenticated && !to.path.includes('/admin')) {
    next({ name: 'dashboard' })
    return
  }
  
  next()
})

export default router
