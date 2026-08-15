// Department Service - API calls and data operations
export const departmentService = {
  // Get all departments with optional filters
  async getAll(filters = {}) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let departments = [...mockDepartments]
    
    // Apply filters
    if (filters.status) {
      departments = departments.filter(d => d.status === filters.status)
    }
    if (filters.faculty) {
      departments = departments.filter(d => d.faculty === filters.faculty)
    }
    if (filters.search) {
      const query = filters.search.toLowerCase()
      departments = departments.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.head.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query)
      )
    }
    
    return { data: departments, success: true }
  },

  // Get single department by ID
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const department = mockDepartments.find(d => d.id == id)
    return { data: department, success: !!department }
  },

  // Create new department
  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newDepartment = {
      id: Math.max(...mockDepartments.map(d => d.id), 0) + 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockDepartments.push(newDepartment)
    return { data: newDepartment, success: true }
  },

  // Update existing department
  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = mockDepartments.findIndex(d => d.id == id)
    if (index === -1) return { success: false, error: 'Department not found' }

    mockDepartments[index] = {
      ...mockDepartments[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { data: mockDepartments[index], success: true }
  },

  // Delete single department
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockDepartments.findIndex(d => d.id == id)
    if (index === -1) return { success: false }
    mockDepartments.splice(index, 1)
    return { success: true }
  },

  // Bulk delete departments
  async deleteBulk(ids) {
    await new Promise(resolve => setTimeout(resolve, 400))
    ids.forEach(id => {
      const index = mockDepartments.findIndex(d => d.id == id)
      if (index !== -1) mockDepartments.splice(index, 1)
    })
    return { success: true }
  },

  // Search departments
  async search(query) {
    return this.getAll({ search: query })
  }
}

// Mock data - 5 sample departments
const mockDepartments = [
  {
    id: 1,
    name: 'Computer Science',
    code: 'CS',
    faculty: 'Engineering',
    head: 'Dr. Rajesh Kumar',
    headEmail: 'rajesh.kumar@university.edu',
    programs: 5,
    faculty_count: 12,
    students: 450,
    description: 'Department of Computer Science offering cutting-edge programs in AI, ML, and Software Engineering.',
    status: 'active',
    phone: '+1-555-0101',
    building: 'Tech Building',
    floor: '3rd & 4th',
    office_hours: 'Monday-Friday, 9:00 AM - 5:00 PM',
    accredited: true,
    accreditationBody: 'ABET',
    establishment_year: 2015,
    specialization: ['Artificial Intelligence', 'Cloud Computing', 'Cybersecurity']
  },
  {
    id: 2,
    name: 'Business Administration',
    code: 'BA',
    faculty: 'Management',
    head: 'Prof. Margaret Johnson',
    headEmail: 'margaret.johnson@university.edu',
    programs: 4,
    faculty_count: 10,
    students: 380,
    description: 'Leading business school providing world-class management and entrepreneurship education.',
    status: 'active',
    phone: '+1-555-0102',
    building: 'Business Center',
    floor: '1st & 2nd',
    office_hours: 'Monday-Friday, 8:30 AM - 5:30 PM',
    accredited: true,
    accreditationBody: 'AACSB',
    establishment_year: 2010,
    specialization: ['Finance', 'Marketing', 'Entrepreneurship']
  },
  {
    id: 3,
    name: 'Civil Engineering',
    code: 'CE',
    faculty: 'Engineering',
    head: 'Dr. Arun Patel',
    headEmail: 'arun.patel@university.edu',
    programs: 3,
    faculty_count: 8,
    students: 240,
    description: 'Department dedicated to infrastructure development and sustainable construction practices.',
    status: 'active',
    phone: '+1-555-0103',
    building: 'Engineering Block',
    floor: '2nd Floor',
    office_hours: 'Monday-Friday, 9:00 AM - 4:30 PM',
    accredited: true,
    accreditationBody: 'ABET',
    establishment_year: 2008,
    specialization: ['Structural Engineering', 'Water Resources', 'Geotechnical Engineering']
  },
  {
    id: 4,
    name: 'Liberal Arts',
    code: 'LA',
    faculty: 'Arts & Sciences',
    head: 'Dr. Sarah Mitchell',
    headEmail: 'sarah.mitchell@university.edu',
    programs: 6,
    faculty_count: 15,
    students: 520,
    description: 'Interdisciplinary programs in humanities, social sciences, and natural sciences.',
    status: 'active',
    phone: '+1-555-0104',
    building: 'Arts Wing',
    floor: 'Multiple',
    office_hours: 'Monday-Friday, 10:00 AM - 4:00 PM',
    accredited: true,
    accreditationBody: 'HLC',
    establishment_year: 2000,
    specialization: ['Philosophy', 'History', 'Environmental Studies']
  },
  {
    id: 5,
    name: 'Health Sciences',
    code: 'HS',
    faculty: 'Medical',
    head: 'Dr. Priya Desai',
    headEmail: 'priya.desai@university.edu',
    programs: 4,
    faculty_count: 14,
    students: 310,
    description: 'Medical and healthcare programs focusing on patient care and biomedical research.',
    status: 'active',
    phone: '+1-555-0105',
    building: 'Medical Center',
    floor: 'Multiple',
    office_hours: 'Monday-Friday, 8:00 AM - 6:00 PM',
    accredited: true,
    accreditationBody: 'LCME',
    establishment_year: 2005,
    specialization: ['Medicine', 'Nursing', 'Public Health']
  }
]

