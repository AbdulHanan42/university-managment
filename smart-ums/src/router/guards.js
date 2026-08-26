// Admin-only route guard
export const requiresAdmin = (to, from, next) => {
  // Check if user is authenticated and has admin role
  // In a real app, this would check authentication state and user role
  const userRole = localStorage.getItem('userRole')
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  
  if (isAuthenticated && userRole === 'admin') {
    next()
  } else {
    // Redirect to unauthorized page or login
    next({ name: 'unauthorized' })
  }
}

export const guards = {
  requiresAdmin
}

