// Course Service - API calls and data operations
export const courseService = {
  // Get all courses with optional filters
  async getAll(filters = {}) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let courses = [...mockCourses]
    
    // Apply filters
    if (filters.department) {
      courses = courses.filter(c => c.department === filters.department)
    }
    if (filters.program) {
      courses = courses.filter(c => c.program === filters.program)
    }
    if (filters.facultyId) {
      courses = courses.filter(c => c.facultyId == filters.facultyId)
    }
    if (filters.status) {
      courses = courses.filter(c => c.status === filters.status)
    }
    if (filters.search) {
      const query = filters.search.toLowerCase()
      courses = courses.filter(c => 
        c.code.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      )
    }
    
    return { data: courses, success: true }
  },

  // Get single course by ID
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const course = mockCourses.find(c => c.id == id)
    return { data: course, success: !!course }
  },

  // Create new course
  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newCourse = {
      id: Math.max(...mockCourses.map(c => c.id), 0) + 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockCourses.push(newCourse)
    return { data: newCourse, success: true }
  },

  // Update existing course
  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = mockCourses.findIndex(c => c.id == id)
    if (index === -1) return { success: false, error: 'Course not found' }

    mockCourses[index] = {
      ...mockCourses[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { data: mockCourses[index], success: true }
  },

  // Delete single course
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockCourses.findIndex(c => c.id == id)
    if (index === -1) return { success: false }
    mockCourses.splice(index, 1)
    return { success: true }
  },

  // Bulk delete courses
  async deleteBulk(ids) {
    await new Promise(resolve => setTimeout(resolve, 400))
    ids.forEach(id => {
      const index = mockCourses.findIndex(c => c.id == id)
      if (index !== -1) mockCourses.splice(index, 1)
    })
    return { success: true }
  },

  // Assign faculty to course
  async assignFaculty(courseId, facultyId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockCourses.findIndex(c => c.id == courseId)
    if (index === -1) return { success: false, error: 'Course not found' }

    mockCourses[index].facultyId = facultyId
    mockCourses[index].updatedAt = new Date().toISOString()
    return { data: mockCourses[index], success: true }
  },

  // Search courses
  async search(query) {
    return this.getAll({ search: query })
  }
}

// Mock data - sample courses
const mockCourses = [
  {
    id: 1,
    code: 'CS101',
    name: 'Introduction to Programming',
    description: 'Fundamental concepts of programming using Python. Covers variables, control structures, functions, and basic data structures.',
    credits: 3,
    department: 'Computer Science',
    program: 'BSc Computer Science',
    facultyId: 6,
    facultyName: 'Dr. James Wilson',
    status: 'active',
    capacity: 60,
    enrolled: 45,
    schedule: 'Mon-Wed-Fri 9:00-10:00 AM',
    room: 'Tech Building, Room 101',
    semester: 'Fall 2024',
    prerequisites: [],
    level: 'undergraduate',
    category: 'core',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    id: 2,
    code: 'CS201',
    name: 'Data Structures and Algorithms',
    description: 'Advanced study of data structures including arrays, linked lists, trees, graphs, and algorithm analysis techniques.',
    credits: 4,
    department: 'Computer Science',
    program: 'BSc Computer Science',
    facultyId: 7,
    facultyName: 'Dr. Emily Chen',
    status: 'active',
    capacity: 50,
    enrolled: 48,
    schedule: 'Tue-Thu 11:00 AM-12:30 PM',
    room: 'Tech Building, Room 205',
    semester: 'Fall 2024',
    prerequisites: ['CS101'],
    level: 'undergraduate',
    category: 'core',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    id: 3,
    code: 'CS301',
    name: 'Machine Learning Fundamentals',
    description: 'Introduction to machine learning concepts including supervised learning, unsupervised learning, and neural networks.',
    credits: 3,
    department: 'Computer Science',
    program: 'BSc Computer Science',
    facultyId: 1,
    facultyName: 'Dr. Rajesh Kumar',
    status: 'active',
    capacity: 40,
    enrolled: 38,
    schedule: 'Mon-Wed 2:00-3:30 PM',
    room: 'Tech Building, Room 310',
    semester: 'Fall 2024',
    prerequisites: ['CS201', 'MATH201'],
    level: 'undergraduate',
    category: 'elective',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    id: 4,
    code: 'BA101',
    name: 'Principles of Management',
    description: 'Fundamental principles of business management including planning, organizing, leading, and controlling organizational resources.',
    credits: 3,
    department: 'Business Administration',
    program: 'BBA',
    facultyId: 2,
    facultyName: 'Prof. Margaret Johnson',
    status: 'active',
    capacity: 80,
    enrolled: 72,
    schedule: 'Tue-Thu 9:00-10:30 AM',
    room: 'Business Center, Room 101',
    semester: 'Fall 2024',
    prerequisites: [],
    level: 'undergraduate',
    category: 'core',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    id: 5,
    code: 'BA201',
    name: 'Financial Management',
    description: 'Study of financial decision-making processes including capital budgeting, risk management, and financial analysis.',
    credits: 4,
    department: 'Business Administration',
    program: 'BBA',
    facultyId: 8,
    facultyName: 'Prof. Michael Brown',
    status: 'active',
    capacity: 60,
    enrolled: 55,
    schedule: 'Mon-Wed-Fri 11:00 AM-12:00 PM',
    room: 'Business Center, Room 205',
    semester: 'Fall 2024',
    prerequisites: ['BA101', 'ACC101'],
    level: 'undergraduate',
    category: 'core',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    id: 6,
    code: 'CE101',
    name: 'Engineering Mechanics',
    description: 'Fundamental concepts of mechanics including statics, dynamics, and strength of materials for civil engineering applications.',
    credits: 4,
    department: 'Civil Engineering',
    program: 'BSc Civil Engineering',
    facultyId: 3,
    facultyName: 'Dr. Arun Patel',
    status: 'active',
    capacity: 70,
    enrolled: 65,
    schedule: 'Tue-Thu 8:00-10:00 AM',
    room: 'Engineering Block, Room 101',
    semester: 'Fall 2024',
    prerequisites: [],
    level: 'undergraduate',
    category: 'core',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    id: 7,
    code: 'CE201',
    name: 'Structural Analysis',
    description: 'Analysis of structures including beams, frames, and trusses using classical and computational methods.',
    credits: 4,
    department: 'Civil Engineering',
    program: 'BSc Civil Engineering',
    facultyId: 9,
    facultyName: 'Dr. Lisa Anderson',
    status: 'active',
    capacity: 50,
    enrolled: 42,
    schedule: 'Mon-Wed 1:00-3:00 PM',
    room: 'Engineering Block, Room 205',
    semester: 'Fall 2024',
    prerequisites: ['CE101', 'MATH101'],
    level: 'undergraduate',
    category: 'core',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    id: 8,
    code: 'LA101',
    name: 'Introduction to Philosophy',
    description: 'Survey of major philosophical traditions and thinkers from ancient to modern times.',
    credits: 3,
    department: 'Liberal Arts',
    program: 'BA Liberal Arts',
    facultyId: 4,
    facultyName: 'Dr. Sarah Mitchell',
    status: 'active',
    capacity: 50,
    enrolled: 35,
    schedule: 'Fri 9:00 AM-12:00 PM',
    room: 'Arts Wing, Room 101',
    semester: 'Fall 2024',
    prerequisites: [],
    level: 'undergraduate',
    category: 'core',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    id: 9,
    code: 'LA201',
    name: 'Modern European History',
    description: 'Study of European history from the Renaissance to the present, focusing on political, social, and cultural developments.',
    credits: 3,
    department: 'Liberal Arts',
    program: 'BA Liberal Arts',
    facultyId: 10,
    facultyName: 'Dr. Robert Taylor',
    status: 'active',
    capacity: 40,
    enrolled: 28,
    schedule: 'Tue-Thu 2:00-3:30 PM',
    room: 'Arts Wing, Room 205',
    semester: 'Fall 2024',
    prerequisites: ['LA101'],
    level: 'undergraduate',
    category: 'elective',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    id: 10,
    code: 'HS101',
    name: 'Human Anatomy and Physiology',
    description: 'Comprehensive study of human body systems including skeletal, muscular, nervous, and cardiovascular systems.',
    credits: 4,
    department: 'Health Sciences',
    program: 'BSc Nursing',
    facultyId: 5,
    facultyName: 'Dr. Priya Desai',
    status: 'active',
    capacity: 60,
    enrolled: 58,
    schedule: 'Mon-Wed-Fri 8:00-9:30 AM',
    room: 'Medical Center, Room 101',
    semester: 'Fall 2024',
    prerequisites: [],
    level: 'undergraduate',
    category: 'core',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    id: 11,
    code: 'HS201',
    name: 'Clinical Nursing Practice',
    description: 'Practical nursing skills and clinical experience in hospital settings under supervision.',
    credits: 5,
    department: 'Health Sciences',
    program: 'BSc Nursing',
    facultyId: 11,
    facultyName: 'Dr. Amanda White',
    status: 'on-leave',
    capacity: 30,
    enrolled: 25,
    schedule: 'Clinical Rotation',
    room: 'Medical Center, Lab',
    semester: 'Fall 2024',
    prerequisites: ['HS101', 'HS102'],
    level: 'undergraduate',
    category: 'core',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    id: 12,
    code: 'CS401',
    name: 'Advanced Software Engineering',
    description: 'Advanced topics in software engineering including design patterns, architecture, and DevOps practices.',
    credits: 3,
    department: 'Computer Science',
    program: 'MSc Computer Science',
    facultyId: 12,
    facultyName: 'Dr. David Lee',
    status: 'active',
    capacity: 25,
    enrolled: 20,
    schedule: 'Tue-Thu 4:00-5:30 PM',
    room: 'Tech Building, Room 401',
    semester: 'Fall 2024',
    prerequisites: ['CS301', 'CS302'],
    level: 'graduate',
    category: 'elective',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  }
]
