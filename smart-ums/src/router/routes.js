import Dashboard from '../pages/admin/Dashboard.vue'
import StudentIndex from '../pages/students/Index.vue'
import FacultyIndex from '../pages/faculty/Index.vue'
import FacultyCreate from '../pages/faculty/Create.vue'
import FacultyEdit from '../pages/faculty/Edit.vue'
import FacultyShow from '../pages/faculty/Show.vue'
import DepartmentIndex from '../pages/departments/Index.vue'
import DepartmentCreate from '../pages/departments/Create.vue'
import DepartmentEdit from '../pages/departments/Edit.vue'
import DepartmentShow from '../pages/departments/Show.vue'
import ProgramIndex from '../pages/programs/Index.vue'
import ProgramCreate from '../pages/programs/Create.vue'
import ProgramEdit from '../pages/programs/Edit.vue'
import ProgramShow from '../pages/programs/Show.vue'
import CourseIndex from '../pages/courses/Index.vue'
import EnrollmentIndex from '../pages/enrollment/Index.vue'
import AttendanceIndex from '../pages/attendance/Index.vue'
import ExaminationIndex from '../pages/examinations/Index.vue'
import FeeIndex from '../pages/fees/Index.vue'
import LibraryIndex from '../pages/library/Index.vue'
import HostelIndex from '../pages/hostel/Index.vue'
import TransportIndex from '../pages/transport/Index.vue'
import LeaveIndex from '../pages/leaves/Index.vue'
import NoticeIndex from '../pages/notices/Index.vue'
import ReportIndex from '../pages/reports/Index.vue'
import LoginPage from '../pages/auth/Login.vue'
import ForgotPassword from '../pages/auth/ForgotPassword.vue'
import ResetPassword from '../pages/auth/ResetPassword.vue'
import Unauthorized from '../pages/auth/Unauthorized.vue'

export const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard' },
  },
  {
    path: '/students',
    name: 'students',
    component: StudentIndex,
    meta: { title: 'Students' },
  },
  {
    path: '/faculty',
    name: 'faculty',
    component: FacultyIndex,
    meta: { title: 'Faculty' },
  },
  {
    path: '/faculty/create',
    name: 'faculty-create',
    component: FacultyCreate,
    meta: { title: 'Create Faculty' },
  },
  {
    path: '/faculty/:id',
    name: 'faculty-show',
    component: FacultyShow,
    meta: { title: 'Faculty Details' },
  },
  {
    path: '/faculty/:id/edit',
    name: 'faculty-edit',
    component: FacultyEdit,
    meta: { title: 'Edit Faculty' },
  },
  {
    path: '/departments',
    name: 'departments',
    component: DepartmentIndex,
    meta: { title: 'Departments' },
  },
  {
    path: '/departments/create',
    name: 'departments-create',
    component: DepartmentCreate,
    meta: { title: 'Create Department' },
  },
  {
    path: '/departments/:id',
    name: 'departments-show',
    component: DepartmentShow,
    meta: { title: 'Department Details' },
  },
  {
    path: '/departments/:id/edit',
    name: 'departments-edit',
    component: DepartmentEdit,
    meta: { title: 'Edit Department' },
  },
  {
    path: '/programs',
    name: 'programs',
    component: ProgramIndex,
    meta: { title: 'Programs' },
  },
  {
    path: '/programs/create',
    name: 'programs-create',
    component: ProgramCreate,
    meta: { title: 'Create Program' },
  },
  {
    path: '/programs/:id',
    name: 'programs-show',
    component: ProgramShow,
    meta: { title: 'Program Details' },
  },
  {
    path: '/programs/:id/edit',
    name: 'programs-edit',
    component: ProgramEdit,
    meta: { title: 'Edit Program' },
  },
  {
    path: '/courses',
    name: 'courses',
    component: CourseIndex,
    meta: { title: 'Courses' },
  },
  {
    path: '/enrollment',
    name: 'enrollment',
    component: EnrollmentIndex,
    meta: { title: 'Enrollment' },
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: AttendanceIndex,
    meta: { title: 'Attendance' },
  },
  {
    path: '/examinations',
    name: 'examinations',
    component: ExaminationIndex,
    meta: { title: 'Examinations' },
  },
  {
    path: '/fees',
    name: 'fees',
    component: FeeIndex,
    meta: { title: 'Fees' },
  },
  {
    path: '/library',
    name: 'library',
    component: LibraryIndex,
    meta: { title: 'Library' },
  },
  {
    path: '/hostel',
    name: 'hostel',
    component: HostelIndex,
    meta: { title: 'Hostel' },
  },
  {
    path: '/transport',
    name: 'transport',
    component: TransportIndex,
    meta: { title: 'Transport' },
  },
  {
    path: '/leaves',
    name: 'leaves',
    component: LeaveIndex,
    meta: { title: 'Leaves' },
  },
  {
    path: '/notices',
    name: 'notices',
    component: NoticeIndex,
    meta: { title: 'Notices' },
  },
  {
    path: '/reports',
    name: 'reports',
    component: ReportIndex,
    meta: { title: 'Reports' },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { title: 'Login' },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: { title: 'Forgot Password' },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword,
    meta: { title: 'Reset Password' },
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: Unauthorized,
    meta: { title: 'Unauthorized' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
]
