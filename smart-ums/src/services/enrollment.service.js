export const enrollmentService = {
  async getEnrollmentData() {
    // Simulated API call - replace with actual API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          registeredThisTerm: 3702,
          pendingApprovals: 41,
          creditLoadAverage: 15.6,
          totalStudents: 4200,
          totalCourses: 156,
          activeEnrollments: 3850
        })
      }, 500)
    })
  },

  async getEnrollments() {
    // Simulated API call for enrollments data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, studentId: 'STU001', studentName: 'John Doe', courseId: 'CS101', courseName: 'Introduction to Programming', credits: 3, semester: 'Fall 2024', status: 'approved', enrolledDate: '2024-08-15' },
          { id: 2, studentId: 'STU002', studentName: 'Jane Smith', courseId: 'MATH201', courseName: 'Calculus II', credits: 4, semester: 'Fall 2024', status: 'pending', enrolledDate: '2024-08-16' },
          { id: 3, studentId: 'STU003', studentName: 'Bob Johnson', courseId: 'ENG101', courseName: 'English Composition', credits: 3, semester: 'Fall 2024', status: 'approved', enrolledDate: '2024-08-14' },
          { id: 4, studentId: 'STU004', studentName: 'Alice Brown', courseId: 'PHY101', courseName: 'Physics I', credits: 4, semester: 'Fall 2024', status: 'rejected', enrolledDate: '2024-08-13' },
          { id: 5, studentId: 'STU005', studentName: 'Charlie Davis', courseId: 'CS201', courseName: 'Data Structures', credits: 3, semester: 'Fall 2024', status: 'approved', enrolledDate: '2024-08-15' },
        ])
      }, 500)
    })
  },

  async getAvailableCourses() {
    // Simulated API call for available courses
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, code: 'CS101', name: 'Introduction to Programming', credits: 3, department: 'Computer Science', instructor: 'Dr. Smith', capacity: 30, enrolled: 25 },
          { id: 2, code: 'CS201', name: 'Data Structures', credits: 3, department: 'Computer Science', instructor: 'Dr. Johnson', capacity: 25, enrolled: 20 },
          { id: 3, code: 'MATH201', name: 'Calculus II', credits: 4, department: 'Mathematics', instructor: 'Dr. Williams', capacity: 35, enrolled: 30 },
          { id: 4, code: 'ENG101', name: 'English Composition', credits: 3, department: 'English', instructor: 'Dr. Brown', capacity: 40, enrolled: 35 },
          { id: 5, code: 'PHY101', name: 'Physics I', credits: 4, department: 'Physics', instructor: 'Dr. Davis', capacity: 30, enrolled: 28 },
          { id: 6, code: 'BIO101', name: 'Biology I', credits: 4, department: 'Biology', instructor: 'Dr. Miller', capacity: 35, enrolled: 32 },
        ])
      }, 500)
    })
  },

  async submitEnrollment(enrollmentData) {
    // Simulated API call for enrollment submission
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Enrollment submitted successfully',
          enrollmentId: Date.now()
        })
      }, 1000)
    })
  },

  async approveEnrollment(enrollmentId) {
    // Simulated API call for approving enrollment
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Enrollment approved successfully'
        })
      }, 500)
    })
  },

  async rejectEnrollment(enrollmentId) {
    // Simulated API call for rejecting enrollment
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Enrollment rejected successfully'
        })
      }, 500)
    })
  }
}

