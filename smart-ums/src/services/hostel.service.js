export const hostelService = {
  async getHostelData() {
    // Simulated API call - replace with actual API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          occupiedBeds: 742,
          vacantRooms: 28,
          messCompliance: 95,
          totalHostels: 3,
          totalRooms: 120,
          totalBeds: 800
        })
      }, 500)
    })
  },

  async getRooms() {
    // Simulated API call for rooms data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, number: '101', capacity: 4, occupied: 3, hostel: 'Hostel A', floor: 1 },
          { id: 2, number: '102', capacity: 4, occupied: 4, hostel: 'Hostel A', floor: 1 },
          { id: 3, number: '201', capacity: 3, occupied: 2, hostel: 'Hostel A', floor: 2 },
          { id: 4, number: '301', capacity: 4, occupied: 0, hostel: 'Hostel B', floor: 3 },
          { id: 5, number: '302', capacity: 4, occupied: 4, hostel: 'Hostel B', floor: 3 },
        ])
      }, 500)
    })
  },

  async getAllocations() {
    // Simulated API call for allocations data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, studentId: 'STU001', studentName: 'John Doe', roomNumber: '101', hostel: 'Hostel A', bedNumber: 1 },
          { id: 2, studentId: 'STU002', studentName: 'Jane Smith', roomNumber: '101', hostel: 'Hostel A', bedNumber: 2 },
          { id: 3, studentId: 'STU003', studentName: 'Bob Johnson', roomNumber: '102', hostel: 'Hostel A', bedNumber: 1 },
        ])
      }, 500)
    })
  },

  async submitBookingRequest(bookingData) {
    // Simulated API call for booking request submission
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Booking request submitted successfully',
          requestId: Date.now()
        })
      }, 1000)
    })
  },

  async getBookingRequests() {
    // Simulated API call for booking requests
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedRequests = localStorage.getItem('hostelRequests')
        resolve(storedRequests ? JSON.parse(storedRequests) : [])
      }, 500)
    })
  },

  async approveRequest(requestId, assignmentData) {
    // Simulated API call for approving request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Request approved and room assigned successfully'
        })
      }, 500)
    })
  },

  async rejectRequest(requestId) {
    // Simulated API call for rejecting request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Request rejected successfully'
        })
      }, 500)
    })
  }
}

