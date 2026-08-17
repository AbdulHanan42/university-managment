// Faculty Service - API calls and data operations
export const facultyService = {
  // Get all faculty with optional filters
  async getAll(filters = {}) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let faculty = [...mockFaculty]
    
    // Apply filters
    if (filters.status) {
      faculty = faculty.filter(f => f.status === filters.status)
    }
    if (filters.department) {
      faculty = faculty.filter(f => f.department === filters.department)
    }
    if (filters.search) {
      const query = filters.search.toLowerCase()
      faculty = faculty.filter(f => 
        f.name.toLowerCase().includes(query) ||
        f.email.toLowerCase().includes(query) ||
        f.department.toLowerCase().includes(query) ||
        f.designation.toLowerCase().includes(query)
      )
    }
    
    return { data: faculty, success: true }
  },

  // Get single faculty by ID
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const facultyMember = mockFaculty.find(f => f.id == id)
    return { data: facultyMember, success: !!facultyMember }
  },

  // Create new faculty
  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newFaculty = {
      id: Math.max(...mockFaculty.map(f => f.id), 0) + 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockFaculty.push(newFaculty)
    return { data: newFaculty, success: true }
  },

  // Update existing faculty
  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = mockFaculty.findIndex(f => f.id == id)
    if (index === -1) return { success: false, error: 'Faculty not found' }

    mockFaculty[index] = {
      ...mockFaculty[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { data: mockFaculty[index], success: true }
  },

  // Delete single faculty
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockFaculty.findIndex(f => f.id == id)
    if (index === -1) return { success: false }
    mockFaculty.splice(index, 1)
    return { success: true }
  },

  // Bulk delete faculty
  async deleteBulk(ids) {
    await new Promise(resolve => setTimeout(resolve, 400))
    ids.forEach(id => {
      const index = mockFaculty.findIndex(f => f.id == id)
      if (index !== -1) mockFaculty.splice(index, 1)
    })
    return { success: true }
  },

  // Search faculty
  async search(query) {
    return this.getAll({ search: query })
  },

  // Get faculty workload
  async getWorkload(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const facultyMember = mockFaculty.find(f => f.id == id)
    if (!facultyMember) return { success: false, error: 'Faculty not found' }
    
    return { 
      data: {
        ...facultyMember,
        workload: {
          courses: facultyMember.courses || 4,
          hours: facultyMember.teachingHours || 20,
          students: facultyMember.totalStudents || 120,
          researchHours: facultyMember.researchHours || 8,
          adminHours: facultyMember.adminHours || 5
        }
      }, 
      success: true 
    }
  },

  // Get faculty leave history
  async getLeaveHistory(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const facultyMember = mockFaculty.find(f => f.id == id)
    if (!facultyMember) return { success: false, error: 'Faculty not found' }
    
    return { 
      data: {
        ...facultyMember,
        leaveHistory: facultyMember.leaveHistory || mockLeaveHistory
      }, 
      success: true 
    }
  }
}

// Mock data - sample faculty members
const mockFaculty = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@university.edu',
    phone: '+1-555-0201',
    department: 'Computer Science',
    designation: 'Professor',
    status: 'active',
    specialization: 'Artificial Intelligence',
    qualification: 'Ph.D. Computer Science',
    experience: 15,
    joiningDate: '2010-08-15',
    courses: 4,
    teachingHours: 20,
    totalStudents: 120,
    researchHours: 8,
    adminHours: 5,
    isHead: true,
    office: 'Tech Building, Room 301',
    officeHours: 'Monday-Wednesday, 10:00 AM - 12:00 PM',
    researchInterests: ['Machine Learning', 'Neural Networks', 'Computer Vision'],
    publications: 45,
    lastPromotion: '2022-01-15'
  },
  {
    id: 2,
    name: 'Prof. Margaret Johnson',
    email: 'margaret.johnson@university.edu',
    phone: '+1-555-0202',
    department: 'Business Administration',
    designation: 'Associate Professor',
    status: 'active',
    specialization: 'Finance',
    qualification: 'Ph.D. Business Administration',
    experience: 12,
    joiningDate: '2012-09-01',
    courses: 3,
    teachingHours: 18,
    totalStudents: 90,
    researchHours: 10,
    adminHours: 3,
    isHead: true,
    office: 'Business Center, Room 205',
    officeHours: 'Tuesday-Thursday, 2:00 PM - 4:00 PM',
    researchInterests: ['Corporate Finance', 'Investment Analysis', 'Financial Markets'],
    publications: 32,
    lastPromotion: '2021-06-01'
  },
  {
    id: 3,
    name: 'Dr. Arun Patel',
    email: 'arun.patel@university.edu',
    phone: '+1-555-0203',
    department: 'Civil Engineering',
    designation: 'Professor',
    status: 'active',
    specialization: 'Structural Engineering',
    qualification: 'Ph.D. Civil Engineering',
    experience: 18,
    joiningDate: '2008-07-20',
    courses: 3,
    teachingHours: 16,
    totalStudents: 75,
    researchHours: 12,
    adminHours: 4,
    isHead: true,
    office: 'Engineering Block, Room 102',
    officeHours: 'Monday-Friday, 9:00 AM - 11:00 AM',
    researchInterests: ['Structural Analysis', 'Earthquake Engineering', 'Concrete Technology'],
    publications: 58,
    lastPromotion: '2020-03-10'
  },
  {
    id: 4,
    name: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@university.edu',
    phone: '+1-555-0204',
    department: 'Liberal Arts',
    designation: 'Professor',
    status: 'active',
    specialization: 'Philosophy',
    qualification: 'Ph.D. Philosophy',
    experience: 20,
    joiningDate: '2006-08-25',
    courses: 4,
    teachingHours: 18,
    totalStudents: 110,
    researchHours: 10,
    adminHours: 6,
    isHead: true,
    office: 'Arts Wing, Room 405',
    officeHours: 'Wednesday-Friday, 1:00 PM - 3:00 PM',
    researchInterests: ['Ethics', 'Political Philosophy', 'Metaphysics'],
    publications: 62,
    lastPromotion: '2019-09-15'
  },
  {
    id: 5,
    name: 'Dr. Priya Desai',
    email: 'priya.desai@university.edu',
    phone: '+1-555-0205',
    department: 'Health Sciences',
    designation: 'Associate Professor',
    status: 'active',
    specialization: 'Medicine',
    qualification: 'MD, Ph.D. Medical Sciences',
    experience: 14,
    joiningDate: '2011-06-10',
    courses: 3,
    teachingHours: 15,
    totalStudents: 60,
    researchHours: 15,
    adminHours: 5,
    isHead: true,
    office: 'Medical Center, Room 501',
    officeHours: 'Tuesday-Thursday, 9:00 AM - 11:00 AM',
    researchInterests: ['Internal Medicine', 'Clinical Research', 'Public Health'],
    publications: 38,
    lastPromotion: '2022-02-20'
  },
  {
    id: 6,
    name: 'Dr. James Wilson',
    email: 'james.wilson@university.edu',
    phone: '+1-555-0206',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    status: 'active',
    specialization: 'Software Engineering',
    qualification: 'Ph.D. Computer Science',
    experience: 5,
    joiningDate: '2020-08-01',
    courses: 3,
    teachingHours: 18,
    totalStudents: 85,
    researchHours: 8,
    adminHours: 2,
    isHead: false,
    office: 'Tech Building, Room 305',
    officeHours: 'Monday-Wednesday, 2:00 PM - 4:00 PM',
    researchInterests: ['Software Architecture', 'Agile Development', 'DevOps'],
    publications: 12,
    lastPromotion: null
  },
  {
    id: 7,
    name: 'Dr. Emily Chen',
    email: 'emily.chen@university.edu',
    phone: '+1-555-0207',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    status: 'active',
    specialization: 'Data Science',
    qualification: 'Ph.D. Statistics',
    experience: 4,
    joiningDate: '2021-09-15',
    courses: 2,
    teachingHours: 12,
    totalStudents: 65,
    researchHours: 12,
    adminHours: 1,
    isHead: false,
    office: 'Tech Building, Room 308',
    officeHours: 'Thursday-Friday, 10:00 AM - 12:00 PM',
    researchInterests: ['Big Data', 'Statistical Learning', 'Data Mining'],
    publications: 8,
    lastPromotion: null
  },
  {
    id: 8,
    name: 'Prof. Michael Brown',
    email: 'michael.brown@university.edu',
    phone: '+1-555-0208',
    department: 'Business Administration',
    designation: 'Professor',
    status: 'active',
    specialization: 'Marketing',
    qualification: 'Ph.D. Marketing',
    experience: 16,
    joiningDate: '2009-07-01',
    courses: 3,
    teachingHours: 15,
    totalStudents: 95,
    researchHours: 10,
    adminHours: 4,
    isHead: false,
    office: 'Business Center, Room 210',
    officeHours: 'Monday-Tuesday, 3:00 PM - 5:00 PM',
    researchInterests: ['Digital Marketing', 'Consumer Behavior', 'Brand Management'],
    publications: 41,
    lastPromotion: '2021-01-10'
  },
  {
    id: 9,
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@university.edu',
    phone: '+1-555-0209',
    department: 'Civil Engineering',
    designation: 'Associate Professor',
    status: 'active',
    specialization: 'Water Resources',
    qualification: 'Ph.D. Environmental Engineering',
    experience: 10,
    joiningDate: '2015-08-20',
    courses: 2,
    teachingHours: 14,
    totalStudents: 55,
    researchHours: 14,
    adminHours: 3,
    isHead: false,
    office: 'Engineering Block, Room 108',
    officeHours: 'Wednesday-Friday, 11:00 AM - 1:00 PM',
    researchInterests: ['Hydrology', 'Water Treatment', 'Environmental Impact'],
    publications: 28,
    lastPromotion: '2023-03-15'
  },
  {
    id: 10,
    name: 'Dr. Robert Taylor',
    email: 'robert.taylor@university.edu',
    phone: '+1-555-0210',
    department: 'Liberal Arts',
    designation: 'Assistant Professor',
    status: 'active',
    specialization: 'History',
    qualification: 'Ph.D. History',
    experience: 3,
    joiningDate: '2022-08-10',
    courses: 2,
    teachingHours: 12,
    totalStudents: 70,
    researchHours: 10,
    adminHours: 2,
    isHead: false,
    office: 'Arts Wing, Room 412',
    officeHours: 'Tuesday-Thursday, 1:00 PM - 3:00 PM',
    researchInterests: ['Modern History', 'European History', 'Historical Research'],
    publications: 5,
    lastPromotion: null
  },
  {
    id: 11,
    name: 'Dr. Amanda White',
    email: 'amanda.white@university.edu',
    phone: '+1-555-0211',
    department: 'Health Sciences',
    designation: 'Assistant Professor',
    status: 'on-leave',
    specialization: 'Nursing',
    qualification: 'Ph.D. Nursing',
    experience: 6,
    joiningDate: '2019-09-01',
    courses: 2,
    teachingHours: 10,
    totalStudents: 45,
    researchHours: 8,
    adminHours: 2,
    isHead: false,
    office: 'Medical Center, Room 505',
    officeHours: 'Monday-Wednesday, 9:00 AM - 11:00 AM',
    researchInterests: ['Patient Care', 'Nursing Education', 'Healthcare Policy'],
    publications: 15,
    lastPromotion: null
  },
  {
    id: 12,
    name: 'Dr. David Lee',
    email: 'david.lee@university.edu',
    phone: '+1-555-0212',
    department: 'Computer Science',
    designation: 'Lecturer',
    status: 'active',
    specialization: 'Web Development',
    qualification: 'M.S. Computer Science',
    experience: 2,
    joiningDate: '2023-01-15',
    courses: 2,
    teachingHours: 16,
    totalStudents: 80,
    researchHours: 4,
    adminHours: 1,
    isHead: false,
    office: 'Tech Building, Room 310',
    officeHours: 'Tuesday-Thursday, 3:00 PM - 5:00 PM',
    researchInterests: ['Web Technologies', 'Frontend Development', 'UX Design'],
    publications: 3,
    lastPromotion: null
  }
]

// Mock leave history data
const mockLeaveHistory = [
  {
    id: 1,
    type: 'Sick Leave',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    days: 3,
    reason: 'Medical appointment',
    status: 'approved',
    appliedOn: '2024-01-10'
  },
  {
    id: 2,
    type: 'Annual Leave',
    startDate: '2024-03-20',
    endDate: '2024-03-25',
    days: 6,
    reason: 'Family vacation',
    status: 'approved',
    appliedOn: '2024-02-15'
  },
  {
    id: 3,
    type: 'Conference Leave',
    startDate: '2024-06-10',
    endDate: '2024-06-14',
    days: 5,
    reason: 'International conference on AI',
    status: 'pending',
    appliedOn: '2024-05-20'
  },
  {
    id: 4,
    type: 'Personal Leave',
    startDate: '2024-08-05',
    endDate: '2024-08-06',
    days: 2,
    reason: 'Personal matters',
    status: 'rejected',
    appliedOn: '2024-07-25'
  }
]
