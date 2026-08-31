export const authService = {
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const user = users.find(u => u.email === email && u.password === password)
        
        if (user) {
          if (user.status === 'pending') {
            reject({ message: 'Your account is pending approval from an administrator' })
          } else if (user.status === 'rejected') {
            reject({ message: 'Your account registration was rejected' })
          } else if (user.status === 'inactive') {
            reject({ message: 'Your account has been deactivated' })
          } else {
            resolve({
              success: true,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                organization: user.organization,
                status: user.status,
                profilePic: user.profilePic,
                rollNumber: user.rollNumber,
                department: user.department
              },
              token: 'mock-jwt-token-' + user.id
            })
          }
        } else {
          reject({ message: 'Invalid email or password' })
        }
      }, 500)
    })
  },

  async signup(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        
        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
          reject({ message: 'Email already registered' })
          return
        }

        // Check if roll number already exists (for students)
        if (userData.role === 'Student' && userData.rollNumber) {
          if (users.find(u => u.rollNumber === userData.rollNumber)) {
            reject({ message: 'Roll number already registered' })
            return
          }
        }

        const newUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          organization: userData.organization || 'Main Campus',
          status: 'pending', // Requires admin approval
          profilePic: userData.profilePic || null,
          rollNumber: userData.rollNumber || null,
          department: userData.department || null,
          phone: userData.phone || null,
          address: userData.address || null,
          createdAt: new Date().toISOString(),
          lastLogin: null
        }

        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))

        resolve({
          success: true,
          message: 'Registration successful. Please wait for admin approval.',
          user: newUser
        })
      }, 800)
    })
  },

  async getPendingUsers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const pendingUsers = users.filter(u => u.status === 'pending')
        resolve(pendingUsers)
      }, 300)
    })
  },

  async approveUser(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex(u => u.id === userId)
        
        if (userIndex === -1) {
          reject({ message: 'User not found' })
          return
        }

        users[userIndex].status = 'active'
        users[userIndex].approvedAt = new Date().toISOString()
        localStorage.setItem('users', JSON.stringify(users))

        resolve({
          success: true,
          message: 'User approved successfully'
        })
      }, 500)
    })
  },

  async rejectUser(userId, reason) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex(u => u.id === userId)
        
        if (userIndex === -1) {
          reject({ message: 'User not found' })
          return
        }

        users[userIndex].status = 'rejected'
        users[userIndex].rejectionReason = reason
        users[userIndex].rejectedAt = new Date().toISOString()
        localStorage.setItem('users', JSON.stringify(users))

        resolve({
          success: true,
          message: 'User rejected successfully'
        })
      }, 500)
    })
  },

  async getAllUsers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        resolve(users)
      }, 300)
    })
  },

  async updateUser(userId, userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex(u => u.id === userId)
        
        if (userIndex === -1) {
          reject({ message: 'User not found' })
          return
        }

        users[userIndex] = { ...users[userIndex], ...userData }
        localStorage.setItem('users', JSON.stringify(users))

        resolve({
          success: true,
          message: 'User updated successfully',
          user: users[userIndex]
        })
      }, 500)
    })
  },

  async deleteUser(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex(u => u.id === userId)
        
        if (userIndex === -1) {
          reject({ message: 'User not found' })
          return
        }

        users.splice(userIndex, 1)
        localStorage.setItem('users', JSON.stringify(users))

        resolve({
          success: true,
          message: 'User deleted successfully'
        })
      }, 500)
    })
  },

  async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('currentUser')
        localStorage.removeItem('authToken')
        resolve({ success: true })
      }, 200)
    })
  },

  async getCurrentUser() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
        resolve(user)
      }, 200)
    })
  },

  // Initialize with default admin user
  initializeDefaultAdmin() {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.length === 0) {
      const defaultAdmin = {
        id: 1,
        name: 'Hanan',
        email: 'hanan@ums.edu',
        password: 'admin123',
        role: 'Super Admin',
        organization: 'Main Campus',
        status: 'active',
        profilePic: null,
        rollNumber: null,
        department: null,
        phone: null,
        address: null,
        createdAt: new Date().toISOString(),
        lastLogin: null
      }
      users.push(defaultAdmin)
      localStorage.setItem('users', JSON.stringify(users))
    }
  }
}

