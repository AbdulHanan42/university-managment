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
  }
}

