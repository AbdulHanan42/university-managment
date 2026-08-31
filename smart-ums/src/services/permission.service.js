export const permissionService = {
  async getRoles() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Super Admin', description: 'Full system access with all permissions', permissions: ['all'], userCount: 1, createdAt: '2024-01-01' },
          { id: 2, name: 'Admin', description: 'Administrative access with most permissions', permissions: ['users.manage', 'students.manage', 'faculty.manage', 'departments.manage', 'courses.manage', 'enrollment.manage', 'attendance.manage', 'examinations.manage', 'fees.manage', 'library.manage', 'hostel.manage', 'transport.manage', 'leaves.manage', 'notices.manage', 'reports.view'], userCount: 5, createdAt: '2024-01-15' },
          { id: 3, name: 'Hostel Manager', description: 'Hostel management access', permissions: ['hostel.manage', 'hostel.rooms', 'hostel.allocations', 'hostel.mess', 'hostel.bookings', 'hostel.requests'], userCount: 3, createdAt: '2024-02-01' },
          { id: 4, name: 'Employee', description: 'Staff access with limited permissions', permissions: ['students.view', 'faculty.view', 'attendance.manage', 'leaves.manage', 'notices.view'], userCount: 25, createdAt: '2024-02-15' },
          { id: 5, name: 'Student', description: 'Student access for personal data', permissions: ['students.view_own', 'courses.view', 'enrollment.view_own', 'attendance.view_own', 'examinations.view_own', 'fees.view_own', 'library.view', 'hostel.book_own', 'leaves.manage_own'], userCount: 4200, createdAt: '2024-03-01' },
        ])
      }, 500)
    })
  },

  async getPermissions() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, category: 'Users', name: 'users.manage', description: 'Manage users and accounts' },
          { id: 2, category: 'Users', name: 'users.view', description: 'View user information' },
          { id: 3, category: 'Students', name: 'students.manage', description: 'Manage student records' },
          { id: 4, category: 'Students', name: 'students.view', description: 'View student information' },
          { id: 5, category: 'Students', name: 'students.view_own', description: 'View own student information' },
          { id: 6, category: 'Faculty', name: 'faculty.manage', description: 'Manage faculty records' },
          { id: 7, category: 'Faculty', name: 'faculty.view', description: 'View faculty information' },
          { id: 8, category: 'Departments', name: 'departments.manage', description: 'Manage departments' },
          { id: 9, category: 'Courses', name: 'courses.manage', description: 'Manage courses' },
          { id: 10, category: 'Enrollment', name: 'enrollment.manage', description: 'Manage enrollments' },
          { id: 11, category: 'Enrollment', name: 'enrollment.view_own', description: 'View own enrollments' },
          { id: 12, category: 'Attendance', name: 'attendance.manage', description: 'Manage attendance records' },
          { id: 13, category: 'Attendance', name: 'attendance.view_own', description: 'View own attendance' },
          { id: 14, category: 'Examinations', name: 'examinations.manage', description: 'Manage examinations' },
          { id: 15, category: 'Examinations', name: 'examinations.view_own', description: 'View own examination results' },
          { id: 16, category: 'Fees', name: 'fees.manage', description: 'Manage fee records' },
          { id: 17, category: 'Fees', name: 'fees.view_own', description: 'View own fee records' },
          { id: 18, category: 'Library', name: 'library.manage', description: 'Manage library resources' },
          { id: 19, category: 'Library', name: 'library.view', description: 'View library resources' },
          { id: 20, category: 'Hostel', name: 'hostel.manage', description: 'Full hostel management' },
          { id: 21, category: 'Hostel', name: 'hostel.rooms', description: 'Manage hostel rooms' },
          { id: 22, category: 'Hostel', name: 'hostel.allocations', description: 'Manage room allocations' },
          { id: 23, category: 'Hostel', name: 'hostel.mess', description: 'Manage mess schedules' },
          { id: 24, category: 'Hostel', name: 'hostel.bookings', description: 'Manage hostel bookings' },
          { id: 25, category: 'Hostel', name: 'hostel.book_own', description: 'Book own hostel accommodation' },
          { id: 26, category: 'Hostel', name: 'hostel.requests', description: 'Manage booking requests' },
          { id: 27, category: 'Transport', name: 'transport.manage', description: 'Manage transport services' },
          { id: 28, category: 'Leaves', name: 'leaves.manage', description: 'Manage leave requests' },
          { id: 29, category: 'Leaves', name: 'leaves.manage_own', description: 'Manage own leave requests' },
          { id: 30, category: 'Notices', name: 'notices.manage', description: 'Manage notices' },
          { id: 31, category: 'Notices', name: 'notices.view', description: 'View notices' },
          { id: 32, category: 'Reports', name: 'reports.view', description: 'View reports' },
          { id: 33, category: 'System', name: 'all', description: 'All system permissions' },
        ])
      }, 500)
    })
  },

  async getUsers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Hanan', email: 'hanan@ums.edu', role: 'Super Admin', status: 'active', lastLogin: '2024-08-31' },
          { id: 2, name: 'John Smith', email: 'john@ums.edu', role: 'Admin', status: 'active', lastLogin: '2024-08-30' },
          { id: 3, name: 'Sarah Johnson', email: 'sarah@ums.edu', role: 'Hostel Manager', status: 'active', lastLogin: '2024-08-29' },
          { id: 4, name: 'Mike Wilson', email: 'mike@ums.edu', role: 'Employee', status: 'active', lastLogin: '2024-08-28' },
          { id: 5, name: 'Emily Brown', email: 'emily@ums.edu', role: 'Employee', status: 'inactive', lastLogin: '2024-08-20' },
          { id: 6, name: 'David Lee', email: 'david@ums.edu', role: 'Student', status: 'active', lastLogin: '2024-08-31' },
        ])
      }, 500)
    })
  },

  async createRole(roleData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Role created successfully',
          roleId: Date.now()
        })
      }, 1000)
    })
  },

  async updateRole(roleId, roleData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Role updated successfully'
        })
      }, 1000)
    })
  },

  async deleteRole(roleId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Role deleted successfully'
        })
      }, 500)
    })
  },

  async assignRole(userId, roleId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Role assigned successfully'
        })
      }, 500)
    })
  },

  async updatePermissions(roleId, permissions) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Permissions updated successfully'
        })
      }, 500)
    })
  }
}
