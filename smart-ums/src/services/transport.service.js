// Transport Service - API calls and data operations
export const transportService = {
  // Get all vehicles with optional filters
  async getAllVehicles(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let vehicles = [...mockVehicles]
    
    if (filters.status) {
      vehicles = vehicles.filter(v => v.status === filters.status)
    }
    if (filters.type) {
      vehicles = vehicles.filter(v => v.type === filters.type)
    }
    if (filters.search) {
      const query = filters.search.toLowerCase()
      vehicles = vehicles.filter(v => 
        v.registrationNumber.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.driverName.toLowerCase().includes(query)
      )
    }
    
    return { data: vehicles, success: true }
  },

  // Get single vehicle by ID
  async getVehicleById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const vehicle = mockVehicles.find(v => v.id == id)
    return { data: vehicle, success: !!vehicle }
  },

  // Create new vehicle
  async createVehicle(data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newVehicle = {
      id: Math.max(...mockVehicles.map(v => v.id), 0) + 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockVehicles.push(newVehicle)
    return { data: newVehicle, success: true }
  },

  // Update vehicle
  async updateVehicle(id, data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = mockVehicles.findIndex(v => v.id == id)
    if (index === -1) return { success: false, error: 'Vehicle not found' }

    mockVehicles[index] = {
      ...mockVehicles[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { data: mockVehicles[index], success: true }
  },

  // Delete vehicle
  async deleteVehicle(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockVehicles.findIndex(v => v.id == id)
    if (index === -1) return { success: false }
    mockVehicles.splice(index, 1)
    return { success: true }
  },

  // Get all routes
  async getAllRoutes(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let routes = [...mockRoutes]
    
    if (filters.status) {
      routes = routes.filter(r => r.status === filters.status)
    }
    if (filters.search) {
      const query = filters.search.toLowerCase()
      routes = routes.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.startPoint.toLowerCase().includes(query) ||
        r.endPoint.toLowerCase().includes(query)
      )
    }
    
    return { data: routes, success: true }
  },

  // Get single route by ID
  async getRouteById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const route = mockRoutes.find(r => r.id == id)
    return { data: route, success: !!route }
  },

  // Create new route
  async createRoute(data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newRoute = {
      id: Math.max(...mockRoutes.map(r => r.id), 0) + 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockRoutes.push(newRoute)
    return { data: newRoute, success: true }
  },

  // Update route
  async updateRoute(id, data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = mockRoutes.findIndex(r => r.id == id)
    if (index === -1) return { success: false, error: 'Route not found' }

    mockRoutes[index] = {
      ...mockRoutes[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { data: mockRoutes[index], success: true }
  },

  // Delete route
  async deleteRoute(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockRoutes.findIndex(r => r.id == id)
    if (index === -1) return { success: false }
    mockRoutes.splice(index, 1)
    return { success: true }
  },

  // Get all transport assignments
  async getAllAssignments(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let assignments = [...mockAssignments]
    
    if (filters.routeId) {
      assignments = assignments.filter(a => a.routeId == filters.routeId)
    }
    if (filters.studentId) {
      assignments = assignments.filter(a => a.studentId == filters.studentId)
    }
    if (filters.status) {
      assignments = assignments.filter(a => a.status === filters.status)
    }
    
    return { data: assignments, success: true }
  },

  // Create transport assignment
  async createAssignment(data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newAssignment = {
      id: Math.max(...mockAssignments.map(a => a.id), 0) + 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockAssignments.push(newAssignment)
    return { data: newAssignment, success: true }
  },

  // Update assignment
  async updateAssignment(id, data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = mockAssignments.findIndex(a => a.id == id)
    if (index === -1) return { success: false, error: 'Assignment not found' }

    mockAssignments[index] = {
      ...mockAssignments[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { data: mockAssignments[index], success: true }
  },

  // Delete assignment
  async deleteAssignment(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockAssignments.findIndex(a => a.id == id)
    if (index === -1) return { success: false }
    mockAssignments.splice(index, 1)
    return { success: true }
  },

  // Get transport statistics
  async getStatistics() {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const totalVehicles = mockVehicles.length
    const activeVehicles = mockVehicles.filter(v => v.status === 'active').length
    const totalRoutes = mockRoutes.length
    const totalAssignments = mockAssignments.length
    const activeAssignments = mockAssignments.filter(a => a.status === 'active').length
    const totalCapacity = mockVehicles.reduce((sum, v) => sum + v.capacity, 0)
    const currentOccupancy = mockAssignments.filter(a => a.status === 'active').length
    
    return {
      data: {
        totalVehicles,
        activeVehicles,
        totalRoutes,
        totalAssignments,
        activeAssignments,
        totalCapacity,
        currentOccupancy,
        utilizationRate: totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0
      },
      success: true
    }
  }
}

// Mock data - Vehicles
const mockVehicles = [
  {
    id: 1,
    registrationNumber: 'BUS-001',
    model: 'Toyota Coaster',
    type: 'bus',
    capacity: 45,
    driverId: 1,
    driverName: 'Ahmed Khan',
    driverPhone: '+92-300-1234567',
    driverPhoto: 'https://i.pravatar.cc/150?img=1',
    status: 'active',
    fuelType: 'diesel',
    fuelCapacity: 60,
    currentFuel: 45,
    lastMaintenance: '2024-06-15',
    nextMaintenance: '2024-09-15',
    insuranceExpiry: '2024-12-31',
    routeId: 1,
    routeName: 'Route A - North Campus',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 2,
    registrationNumber: 'BUS-002',
    model: 'Toyota Coaster',
    type: 'bus',
    capacity: 45,
    driverId: 2,
    driverName: 'Muhammad Ali',
    driverPhone: '+92-301-2345678',
    driverPhoto: 'https://i.pravatar.cc/150?img=2',
    status: 'active',
    fuelType: 'diesel',
    fuelCapacity: 60,
    currentFuel: 38,
    lastMaintenance: '2024-07-01',
    nextMaintenance: '2024-10-01',
    insuranceExpiry: '2024-12-31',
    routeId: 2,
    routeName: 'Route B - South Campus',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 3,
    registrationNumber: 'BUS-003',
    model: 'Toyota Hiace',
    type: 'van',
    capacity: 15,
    driverId: 3,
    driverName: 'Hassan Raza',
    driverPhone: '+92-302-3456789',
    driverPhoto: 'https://i.pravatar.cc/150?img=3',
    status: 'active',
    fuelType: 'petrol',
    fuelCapacity: 40,
    currentFuel: 32,
    lastMaintenance: '2024-07-20',
    nextMaintenance: '2024-10-20',
    insuranceExpiry: '2024-11-30',
    routeId: 3,
    routeName: 'Route C - East Campus',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 4,
    registrationNumber: 'BUS-004',
    model: 'Toyota Coaster',
    type: 'bus',
    capacity: 45,
    driverId: 4,
    driverName: 'Sajid Ahmed',
    driverPhone: '+92-303-4567890',
    driverPhoto: 'https://i.pravatar.cc/150?img=4',
    status: 'maintenance',
    fuelType: 'diesel',
    fuelCapacity: 60,
    currentFuel: 20,
    lastMaintenance: '2024-08-10',
    nextMaintenance: '2024-11-10',
    insuranceExpiry: '2024-12-31',
    routeId: null,
    routeName: null,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 5,
    registrationNumber: 'VAN-001',
    model: 'Toyota Hiace',
    type: 'van',
    capacity: 12,
    driverId: 5,
    driverName: 'Imran Shah',
    driverPhone: '+92-304-5678901',
    driverPhoto: 'https://i.pravatar.cc/150?img=5',
    status: 'active',
    fuelType: 'petrol',
    fuelCapacity: 40,
    currentFuel: 35,
    lastMaintenance: '2024-07-15',
    nextMaintenance: '2024-10-15',
    insuranceExpiry: '2024-11-15',
    routeId: 4,
    routeName: 'Route D - West Campus',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  }
]

// Mock data - Routes
const mockRoutes = [
  {
    id: 1,
    name: 'Route A - North Campus',
    code: 'RT-A',
    startPoint: 'City Center',
    endPoint: 'North Campus',
    stops: ['City Center', 'Main Market', 'Railway Station', 'Bus Terminal', 'North Campus'],
    distance: 15,
    estimatedTime: 45,
    morningSchedule: '07:00 AM',
    eveningSchedule: '05:00 PM',
    fee: 2500,
    capacity: 45,
    currentOccupancy: 38,
    status: 'active',
    vehicleId: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 2,
    name: 'Route B - South Campus',
    code: 'RT-B',
    startPoint: 'South Gate',
    endPoint: 'South Campus',
    stops: ['South Gate', 'Shopping Mall', 'Hospital', 'School Zone', 'South Campus'],
    distance: 12,
    estimatedTime: 35,
    morningSchedule: '07:30 AM',
    eveningSchedule: '05:30 PM',
    fee: 2200,
    capacity: 45,
    currentOccupancy: 42,
    status: 'active',
    vehicleId: 2,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 3,
    name: 'Route C - East Campus',
    code: 'RT-C',
    startPoint: 'East Terminal',
    endPoint: 'East Campus',
    stops: ['East Terminal', 'Industrial Area', 'Residential Block', 'East Campus'],
    distance: 10,
    estimatedTime: 30,
    morningSchedule: '08:00 AM',
    eveningSchedule: '06:00 PM',
    fee: 2000,
    capacity: 15,
    currentOccupancy: 12,
    status: 'active',
    vehicleId: 3,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 4,
    name: 'Route D - West Campus',
    code: 'RT-D',
    startPoint: 'West Gate',
    endPoint: 'West Campus',
    stops: ['West Gate', 'Park Avenue', 'Commercial Center', 'West Campus'],
    distance: 8,
    estimatedTime: 25,
    morningSchedule: '08:15 AM',
    eveningSchedule: '06:15 PM',
    fee: 1800,
    capacity: 12,
    currentOccupancy: 10,
    status: 'active',
    vehicleId: 5,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 5,
    name: 'Route E - Central Campus',
    code: 'RT-E',
    startPoint: 'Central Station',
    endPoint: 'Central Campus',
    stops: ['Central Station', 'Metro Station', 'University Gate', 'Central Campus'],
    distance: 18,
    estimatedTime: 50,
    morningSchedule: '06:45 AM',
    eveningSchedule: '04:45 PM',
    fee: 3000,
    capacity: 45,
    currentOccupancy: 0,
    status: 'inactive',
    vehicleId: null,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  }
]

// Mock data - Student Transport Assignments
const mockAssignments = [
  {
    id: 1,
    studentId: 1,
    studentName: 'John Smith',
    studentRollNo: '2024001',
    routeId: 1,
    routeName: 'Route A - North Campus',
    pickupPoint: 'City Center',
    dropPoint: 'North Campus',
    fee: 2500,
    feeStatus: 'paid',
    status: 'active',
    passNumber: 'TP-2024-001',
    passExpiry: '2024-12-31',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Emma Johnson',
    studentRollNo: '2024002',
    routeId: 1,
    routeName: 'Route A - North Campus',
    pickupPoint: 'Railway Station',
    dropPoint: 'North Campus',
    fee: 2500,
    feeStatus: 'paid',
    status: 'active',
    passNumber: 'TP-2024-002',
    passExpiry: '2024-12-31',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Michael Brown',
    studentRollNo: '2024003',
    routeId: 2,
    routeName: 'Route B - South Campus',
    pickupPoint: 'South Gate',
    dropPoint: 'South Campus',
    fee: 2200,
    feeStatus: 'pending',
    status: 'active',
    passNumber: 'TP-2024-003',
    passExpiry: '2024-12-31',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'Sarah Davis',
    studentRollNo: '2024004',
    routeId: 3,
    routeName: 'Route C - East Campus',
    pickupPoint: 'East Terminal',
    dropPoint: 'East Campus',
    fee: 2000,
    feeStatus: 'paid',
    status: 'active',
    passNumber: 'TP-2024-004',
    passExpiry: '2024-12-31',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 5,
    studentId: 5,
    studentName: 'David Wilson',
    studentRollNo: '2024005',
    routeId: 4,
    routeName: 'Route D - West Campus',
    pickupPoint: 'West Gate',
    dropPoint: 'West Campus',
    fee: 1800,
    feeStatus: 'paid',
    status: 'active',
    passNumber: 'TP-2024-005',
    passExpiry: '2024-12-31',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  },
  {
    id: 6,
    studentId: 6,
    studentName: 'Lisa Anderson',
    studentRollNo: '2024006',
    routeId: 2,
    routeName: 'Route B - South Campus',
    pickupPoint: 'Shopping Mall',
    dropPoint: 'South Campus',
    fee: 2200,
    feeStatus: 'overdue',
    status: 'suspended',
    passNumber: 'TP-2024-006',
    passExpiry: '2024-12-31',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z'
  }
]
