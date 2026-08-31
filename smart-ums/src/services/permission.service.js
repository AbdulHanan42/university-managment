export const permissionService = {
  async getOrganizations() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Main Campus', code: 'MAIN', location: 'Central City', status: 'active' },
          { id: 2, name: 'North Campus', code: 'NORTH', location: 'North District', status: 'active' },
          { id: 3, name: 'South Campus', code: 'SOUTH', location: 'South District', status: 'active' },
          { id: 4, name: 'East Campus', code: 'EAST', location: 'East District', status: 'inactive' },
        ])
      }, 500)
    })
  },

  async getRoles() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Super Admin', description: 'Full system access跨所有组织', permissions: ['all'], organizations: ['all'], userCount: 1, createdAt: '2024-01-01' },
          { id: 2, name: 'Admin', description: 'Administrative access with most permissions', permissions: ['users.manage', 'students.manage', 'faculty.manage', 'departments.manage', 'courses.manage', 'enrollment.manage', 'enrollment.approve', 'enrollment.reject', 'attendance.manage', 'examinations.manage', 'fees.manage', 'library.manage', 'hostel.manage', 'hostel.approve', 'hostel.reject', 'transport.manage', 'leaves.manage', 'leaves.approve', 'leaves.reject', 'notices.manage', 'reports.view'], organizations: ['all'], userCount: 5, createdAt: '2024-01-15' },
          { id: 3, name: 'Hostel Manager', description: 'Hostel management access', permissions: ['hostel.manage', 'hostel.rooms', 'hostel.allocations', 'hostel.mess', 'hostel.bookings', 'hostel.approve', 'hostel.reject', 'hostel.requests'], organizations: ['MAIN', 'NORTH', 'SOUTH'], userCount: 3, createdAt: '2024-02-01' },
          { id: 4, name: 'Employee', description: 'Staff access with limited permissions', permissions: ['students.view', 'faculty.view', 'attendance.manage', 'leaves.view', 'notices.view'], organizations: ['MAIN'], userCount: 25, createdAt: '2024-02-15' },
          { id: 5, name: 'Student', description: 'Student access for personal data', permissions: ['students.view_own', 'courses.view', 'enrollment.view_own', 'enrollment.submit', 'attendance.view_own', 'examinations.view_own', 'fees.view_own', 'library.view', 'hostel.book_own', 'hostel.view_own', 'leaves.manage_own', 'leaves.submit'], organizations: ['all'], userCount: 4200, createdAt: '2024-03-01' },
          { id: 6, name: 'Department Head', description: 'Department-level management', permissions: ['students.view', 'students.manage_dept', 'faculty.view', 'faculty.manage_dept', 'courses.view', 'courses.manage_dept', 'enrollment.view', 'enrollment.approve_dept', 'attendance.manage_dept', 'examinations.view', 'examinations.manage_dept', 'reports.view'], organizations: ['all'], userCount: 8, createdAt: '2024-03-15' },
          { id: 7, name: 'Finance Manager', description: 'Financial management access', permissions: ['students.view', 'fees.manage', 'fees.approve', 'fees.reject', 'reports.view'], organizations: ['MAIN'], userCount: 2, createdAt: '2024-04-01' },
        ])
      }, 500)
    })
  },

  async getPermissions() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          // Users
          { id: 1, category: 'Users', name: 'users.manage', description: 'Manage users and accounts', action: 'manage' },
          { id: 2, category: 'Users', name: 'users.view', description: 'View user information', action: 'view' },
          
          // Students
          { id: 3, category: 'Students', name: 'students.manage', description: 'Manage all student records', action: 'manage' },
          { id: 4, category: 'Students', name: 'students.manage_dept', description: 'Manage department students', action: 'manage' },
          { id: 5, category: 'Students', name: 'students.view', description: 'View all student information', action: 'view' },
          { id: 6, category: 'Students', name: 'students.view_own', description: 'View own student information', action: 'view' },
          
          // Faculty
          { id: 7, category: 'Faculty', name: 'faculty.manage', description: 'Manage all faculty records', action: 'manage' },
          { id: 8, category: 'Faculty', name: 'faculty.manage_dept', description: 'Manage department faculty', action: 'manage' },
          { id: 9, category: 'Faculty', name: 'faculty.view', description: 'View faculty information', action: 'view' },
          
          // Departments
          { id: 10, category: 'Departments', name: 'departments.manage', description: 'Manage departments', action: 'manage' },
          { id: 11, category: 'Departments', name: 'departments.view', description: 'View departments', action: 'view' },
          
          // Courses
          { id: 12, category: 'Courses', name: 'courses.manage', description: 'Manage all courses', action: 'manage' },
          { id: 13, category: 'Courses', name: 'courses.manage_dept', description: 'Manage department courses', action: 'manage' },
          { id: 14, category: 'Courses', name: 'courses.view', description: 'View courses', action: 'view' },
          
          // Enrollment
          { id: 15, category: 'Enrollment', name: 'enrollment.manage', description: 'Manage all enrollments', action: 'manage' },
          { id: 16, category: 'Enrollment', name: 'enrollment.approve', description: 'Approve enrollment requests', action: 'approve' },
          { id: 17, category: 'Enrollment', name: 'enrollment.reject', description: 'Reject enrollment requests', action: 'reject' },
          { id: 18, category: 'Enrollment', name: 'enrollment.approve_dept', description: 'Approve department enrollments', action: 'approve' },
          { id: 19, category: 'Enrollment', name: 'enrollment.view', description: 'View all enrollments', action: 'view' },
          { id: 20, category: 'Enrollment', name: 'enrollment.view_own', description: 'View own enrollments', action: 'view' },
          { id: 21, category: 'Enrollment', name: 'enrollment.submit', description: 'Submit enrollment requests', action: 'submit' },
          
          // Attendance
          { id: 22, category: 'Attendance', name: 'attendance.manage', description: 'Manage all attendance', action: 'manage' },
          { id: 23, category: 'Attendance', name: 'attendance.manage_dept', description: 'Manage department attendance', action: 'manage' },
          { id: 24, category: 'Attendance', name: 'attendance.view', description: 'View attendance', action: 'view' },
          { id: 25, category: 'Attendance', name: 'attendance.view_own', description: 'View own attendance', action: 'view' },
          
          // Examinations
          { id: 26, category: 'Examinations', name: 'examinations.manage', description: 'Manage all examinations', action: 'manage' },
          { id: 27, category: 'Examinations', name: 'examinations.manage_dept', description: 'Manage department examinations', action: 'manage' },
          { id: 28, category: 'Examinations', name: 'examinations.view', description: 'View examinations', action: 'view' },
          { id: 29, category: 'Examinations', name: 'examinations.view_own', description: 'View own examination results', action: 'view' },
          
          // Fees
          { id: 30, category: 'Fees', name: 'fees.manage', description: 'Manage all fee records', action: 'manage' },
          { id: 31, category: 'Fees', name: 'fees.approve', description: 'Approve fee payments', action: 'approve' },
          { id: 32, category: 'Fees', name: 'fees.reject', description: 'Reject fee payments', action: 'reject' },
          { id: 33, category: 'Fees', name: 'fees.view', description: 'View fee records', action: 'view' },
          { id: 34, category: 'Fees', name: 'fees.view_own', description: 'View own fee records', action: 'view' },
          
          // Library
          { id: 35, category: 'Library', name: 'library.manage', description: 'Manage library resources', action: 'manage' },
          { id: 36, category: 'Library', name: 'library.view', description: 'View library resources', action: 'view' },
          
          // Hostel
          { id: 37, category: 'Hostel', name: 'hostel.manage', description: 'Full hostel management', action: 'manage' },
          { id: 38, category: 'Hostel', name: 'hostel.rooms', description: 'Manage hostel rooms', action: 'manage' },
          { id: 39, category: 'Hostel', name: 'hostel.allocations', description: 'Manage room allocations', action: 'manage' },
          { id: 40, category: 'Hostel', name: 'hostel.mess', description: 'Manage mess schedules', action: 'manage' },
          { id: 41, category: 'Hostel', name: 'hostel.bookings', description: 'Manage hostel bookings', action: 'manage' },
          { id: 42, category: 'Hostel', name: 'hostel.approve', description: 'Approve hostel requests', action: 'approve' },
          { id: 43, category: 'Hostel', name: 'hostel.reject', description: 'Reject hostel requests', action: 'reject' },
          { id: 44, category: 'Hostel', name: 'hostel.requests', description: 'View booking requests', action: 'view' },
          { id: 45, category: 'Hostel', name: 'hostel.book_own', description: 'Book own hostel accommodation', action: 'submit' },
          { id: 46, category: 'Hostel', name: 'hostel.view_own', description: 'View own hostel details', action: 'view' },
          
          // Transport
          { id: 47, category: 'Transport', name: 'transport.manage', description: 'Manage transport services', action: 'manage' },
          { id: 48, category: 'Transport', name: 'transport.view', description: 'View transport information', action: 'view' },
          
          // Leaves
          { id: 49, category: 'Leaves', name: 'leaves.manage', description: 'Manage all leave requests', action: 'manage' },
          { id: 50, category: 'Leaves', name: 'leaves.approve', description: 'Approve leave requests', action: 'approve' },
          { id: 51, category: 'Leaves', name: 'leaves.reject', description: 'Reject leave requests', action: 'reject' },
          { id: 52, category: 'Leaves', name: 'leaves.view', description: 'View leave requests', action: 'view' },
          { id: 53, category: 'Leaves', name: 'leaves.manage_own', description: 'Manage own leave requests', action: 'manage' },
          { id: 54, category: 'Leaves', name: 'leaves.submit', description: 'Submit leave requests', action: 'submit' },
          
          // Notices
          { id: 55, category: 'Notices', name: 'notices.manage', description: 'Manage notices', action: 'manage' },
          { id: 56, category: 'Notices', name: 'notices.view', description: 'View notices', action: 'view' },
          
          // Reports
          { id: 57, category: 'Reports', name: 'reports.view', description: 'View reports', action: 'view' },
          
          // System
          { id: 58, category: 'System', name: 'all', description: 'All system permissions', action: 'all' },
        ])
      }, 500)
    })
  },

  async getUsers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Hanan', email: 'hanan@ums.edu', role: 'Super Admin', organization: 'Main Campus', status: 'active', lastLogin: '2024-08-31' },
          { id: 2, name: 'John Smith', email: 'john@ums.edu', role: 'Admin', organization: 'Main Campus', status: 'active', lastLogin: '2024-08-30' },
          { id: 3, name: 'Sarah Johnson', email: 'sarah@ums.edu', role: 'Hostel Manager', organization: 'North Campus', status: 'active', lastLogin: '2024-08-29' },
          { id: 4, name: 'Mike Wilson', email: 'mike@ums.edu', role: 'Employee', organization: 'Main Campus', status: 'active', lastLogin: '2024-08-28' },
          { id: 5, name: 'Emily Brown', email: 'emily@ums.edu', role: 'Employee', organization: 'Main Campus', status: 'inactive', lastLogin: '2024-08-20' },
          { id: 6, name: 'David Lee', email: 'david@ums.edu', role: 'Student', organization: 'Main Campus', status: 'active', lastLogin: '2024-08-31' },
          { id: 7, name: 'Lisa Chen', email: 'lisa@ums.edu', role: 'Department Head', organization: 'South Campus', status: 'active', lastLogin: '2024-08-30' },
          { id: 8, name: 'Tom Garcia', email: 'tom@ums.edu', role: 'Finance Manager', organization: 'Main Campus', status: 'active', lastLogin: '2024-08-29' },
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

  async assignRole(userId, roleId, organizationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Role assigned successfully'
        })
      }, 500)
    })
  },

  async updatePermissions(roleId, permissions, organizations) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Permissions updated successfully'
        })
      }, 500)
    })
  },

  async checkPermission(userRole, permission) {
    // In a real app, this would check against the user's actual permissions
    const rolePermissions = {
      'Super Admin': ['all'],
      'Admin': ['users.manage', 'students.manage', 'faculty.manage', 'departments.manage', 'courses.manage', 'enrollment.manage', 'enrollment.approve', 'enrollment.reject', 'attendance.manage', 'examinations.manage', 'fees.manage', 'library.manage', 'hostel.manage', 'hostel.approve', 'hostel.reject', 'transport.manage', 'leaves.manage', 'leaves.approve', 'leaves.reject', 'notices.manage', 'reports.view'],
      'Hostel Manager': ['hostel.manage', 'hostel.rooms', 'hostel.allocations', 'hostel.mess', 'hostel.bookings', 'hostel.approve', 'hostel.reject', 'hostel.requests'],
      'Employee': ['students.view', 'faculty.view', 'attendance.manage', 'leaves.view', 'notices.view'],
      'Student': ['students.view_own', 'courses.view', 'enrollment.view_own', 'enrollment.submit', 'attendance.view_own', 'examinations.view_own', 'fees.view_own', 'library.view', 'hostel.book_own', 'hostel.view_own', 'leaves.manage_own', 'leaves.submit'],
      'Department Head': ['students.view', 'students.manage_dept', 'faculty.view', 'faculty.manage_dept', 'courses.view', 'courses.manage_dept', 'enrollment.view', 'enrollment.approve_dept', 'attendance.manage_dept', 'examinations.view', 'examinations.manage_dept', 'reports.view'],
      'Finance Manager': ['students.view', 'fees.manage', 'fees.approve', 'fees.reject', 'reports.view'],
    }

    const permissions = rolePermissions[userRole] || []
    return permissions.includes('all') || permissions.includes(permission)
  }
}
