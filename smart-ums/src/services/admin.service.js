export const adminService = {
  // Get all pending requests from UMS system
  async getPendingRequests() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const requests = JSON.parse(localStorage.getItem('adminRequests') || '[]')
        resolve(requests.filter(r => r.status === 'pending'))
      }, 300)
    })
  },

  // Get all requests (pending, approved, rejected)
  async getAllRequests() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const requests = JSON.parse(localStorage.getItem('adminRequests') || '[]')
        resolve(requests)
      }, 300)
    })
  },

  // Get request statistics
  async getRequestStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const requests = JSON.parse(localStorage.getItem('adminRequests') || '[]')
        resolve({
          total: requests.length,
          pending: requests.filter(r => r.status === 'pending').length,
          approved: requests.filter(r => r.status === 'approved').length,
          rejected: requests.filter(r => r.status === 'rejected').length,
          today: requests.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length
        })
      }, 300)
    })
  },

  // Approve a request
  async approveRequest(requestId, adminId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const requests = JSON.parse(localStorage.getItem('adminRequests') || '[]')
        const requestIndex = requests.findIndex(r => r.id === requestId)
        
        if (requestIndex === -1) {
          reject({ message: 'Request not found' })
          return
        }

        requests[requestIndex].status = 'approved'
        requests[requestIndex].approvedBy = adminId
        requests[requestIndex].approvedAt = new Date().toISOString()
        localStorage.setItem('adminRequests', JSON.stringify(requests))

        // Update the corresponding user in UMS system
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex(u => u.email === requests[requestIndex].email)
        if (userIndex !== -1) {
          users[userIndex].status = 'active'
          users[userIndex].approvedAt = new Date().toISOString()
          localStorage.setItem('users', JSON.stringify(users))
        }

        resolve({
          success: true,
          message: 'Request approved successfully'
        })
      }, 500)
    })
  },

  // Reject a request
  async rejectRequest(requestId, adminId, reason) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const requests = JSON.parse(localStorage.getItem('adminRequests') || '[]')
        const requestIndex = requests.findIndex(r => r.id === requestId)
        
        if (requestIndex === -1) {
          reject({ message: 'Request not found' })
          return
        }

        requests[requestIndex].status = 'rejected'
        requests[requestIndex].rejectedBy = adminId
        requests[requestIndex].rejectedAt = new Date().toISOString()
        requests[requestIndex].rejectionReason = reason
        localStorage.setItem('adminRequests', JSON.stringify(requests))

        // Update the corresponding user in UMS system
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex(u => u.email === requests[requestIndex].email)
        if (userIndex !== -1) {
          users[userIndex].status = 'rejected'
          users[userIndex].rejectionReason = reason
          users[userIndex].rejectedAt = new Date().toISOString()
          localStorage.setItem('users', JSON.stringify(users))
        }

        resolve({
          success: true,
          message: 'Request rejected successfully'
        })
      }, 500)
    })
  },

  // Create a new request (called from UMS system)
  async createRequest(requestData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const requests = JSON.parse(localStorage.getItem('adminRequests') || '[]')
        
        const newRequest = {
          id: Date.now(),
          type: requestData.type, // 'registration', 'enrollment', 'hostel_booking', etc.
          ...requestData,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        requests.push(newRequest)
        localStorage.setItem('adminRequests', JSON.stringify(requests))

        resolve({
          success: true,
          message: 'Request submitted to admin panel',
          requestId: newRequest.id
        })
      }, 300)
    })
  },

  // Get request by ID
  async getRequestById(requestId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const requests = JSON.parse(localStorage.getItem('adminRequests') || '[]')
        const request = requests.find(r => r.id === requestId)
        resolve(request)
      }, 200)
    })
  },

  // Get requests by type
  async getRequestsByType(type) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const requests = JSON.parse(localStorage.getItem('adminRequests') || '[]')
        resolve(requests.filter(r => r.type === type))
      }, 300)
    })
  },

  // Get requests by status
  async getRequestsByStatus(status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const requests = JSON.parse(localStorage.getItem('adminRequests') || '[]')
        resolve(requests.filter(r => r.status === status))
      }, 300)
    })
  },

  // Admin login for admin panel
  async adminLogin(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const admins = JSON.parse(localStorage.getItem('adminPanelAdmins') || '[]')
        const admin = admins.find(a => a.email === email && a.password === password)
        
        if (admin) {
          resolve({
            success: true,
            admin: {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: admin.role,
              permissions: admin.permissions
            },
            token: 'admin-panel-token-' + admin.id
          })
        } else {
          reject({ message: 'Invalid admin credentials' })
        }
      }, 500)
    })
  },

  // Initialize admin panel with default admin
  initializeAdminPanel() {
    const admins = JSON.parse(localStorage.getItem('adminPanelAdmins') || '[]')
    if (admins.length === 0) {
      const defaultAdmin = {
        id: 1,
        name: 'Super Admin',
        email: 'abdulhananjaved4412@gmail.com',
        password: '12345678',
        role: 'Super Admin',
        permissions: ['all'],
        createdAt: new Date().toISOString()
      }
      admins.push(defaultAdmin)
      localStorage.setItem('adminPanelAdmins', JSON.stringify(admins))
    }
  }
}
