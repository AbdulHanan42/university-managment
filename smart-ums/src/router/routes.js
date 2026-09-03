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
import CourseIndex from '../pages/courses/Index.vue'
import ProgramIndex from '../pages/programs/Index.vue'
import ProgramCreate from '../pages/programs/Create.vue'
import ProgramEdit from '../pages/programs/Edit.vue'
import ProgramShow from '../pages/programs/Show.vue'
import EnrollmentIndex from '../pages/enrollment/Index.vue'
import EnrollmentRegister from '../pages/enrollment/Register.vue'
import EnrollmentHistory from '../pages/enrollment/History.vue'
import AttendanceIndex from '../pages/attendance/Index.vue'
import ExaminationIndex from '../pages/examinations/Index.vue'
import FeeIndex from '../pages/fees/Index.vue'
import LibraryIndex from '../pages/library/Index.vue'
import HostelIndex from '../pages/hostel/Index.vue'
import HostelRooms from '../pages/hostel/Rooms.vue'
import HostelAllocations from '../pages/hostel/Allocations.vue'
import HostelMess from '../pages/hostel/Mess.vue'
import HostelBooking from '../pages/hostel/Booking.vue'
import HostelBookingConfirmation from '../pages/hostel/BookingConfirmation.vue'
import HostelRequests from '../pages/hostel/Requests.vue'
import TransportIndex from '../pages/transport/Index.vue'
import LeaveIndex from '../pages/leaves/Index.vue'
import NoticeIndex from '../pages/notices/Index.vue'
import ReportIndex from '../pages/reports/Index.vue'
import PermissionsIndex from '../pages/permissions/Index.vue'
import PermissionsRoles from '../pages/permissions/Roles.vue'
import PermissionsList from '../pages/permissions/Permissions.vue'
import PermissionsAssign from '../pages/permissions/Assign.vue'
import LoginPage from '../pages/auth/Login.vue'
import SignupPage from '../pages/auth/Signup.vue'
import UserApproval from '../pages/auth/UserApproval.vue'
import ForgotPassword from '../pages/auth/ForgotPassword.vue'
import ResetPassword from '../pages/auth/ResetPassword.vue'
import Unauthorized from '../pages/auth/Unauthorized.vue'
import AdminPanel from '../pages/admin/AdminPanel.vue'
import { requiresAuth, requiresAdmin, requiresSuperAdmin, requiresPermission } from './guards'
import { useAuthStore } from '@/stores/auth.store'

export const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { title: 'Login', public: true },
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupPage,
    meta: { title: 'Sign Up', public: true },
  },
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard', requiresAuth: true },
    beforeEnter: requiresPermission('dashboard.view'),
  },
  {
    path: '/students',
    name: 'students',
    component: StudentIndex,
    meta: { title: 'Students', requiresAuth: true },
    beforeEnter: requiresPermission('students.view_own'),
  },
  {
    path: '/faculty',
    name: 'faculty',
    component: FacultyIndex,
    meta: { title: 'Faculty', requiresAuth: true },
    beforeEnter: requiresPermission('faculty.view_own_dept'),
  },
  {
    path: '/faculty/create',
    name: 'faculty-create',
    component: FacultyCreate,
    meta: { title: 'Create Faculty', requiresAuth: true },
  },
  {
    path: '/faculty/:id',
    name: 'faculty-show',
    component: FacultyShow,
    meta: { title: 'Faculty Details', requiresAuth: true },
  },
  {
    path: '/faculty/:id/edit',
    name: 'faculty-edit',
    component: FacultyEdit,
    meta: { title: 'Edit Faculty', requiresAuth: true },
  },
  {
    path: '/courses',
    name: 'courses',
    component: CourseIndex,
    meta: { title: 'Courses', requiresAuth: true },
    beforeEnter: requiresPermission('courses.view'),
  },
  {
    path: '/departments',
    name: 'departments',
    component: DepartmentIndex,
    meta: { title: 'Departments', requiresAuth: true },
    beforeEnter: requiresPermission('departments.view_own'),
  },
  {
    path: '/departments/create',
    name: 'departments-create',
    component: DepartmentCreate,
    meta: { title: 'Create Department', requiresAuth: true },
  },
  {
    path: '/departments/:id',
    name: 'departments-show',
    component: DepartmentShow,
    meta: { title: 'Department Details', requiresAuth: true },
  },
  {
    path: '/departments/:id/edit',
    name: 'departments-edit',
    component: DepartmentEdit,
    meta: { title: 'Edit Department', requiresAuth: true },
  },
  {
    path: '/programs',
    name: 'programs',
    component: ProgramIndex,
    meta: { title: 'Programs', requiresAuth: true },
    beforeEnter: requiresPermission('programs.view_own'),
  },
  {
    path: '/programs/create',
    name: 'programs-create',
    component: ProgramCreate,
    meta: { title: 'Create Program', requiresAuth: true },
  },
  {
    path: '/programs/:id',
    name: 'programs-show',
    component: ProgramShow,
    meta: { title: 'Program Details', requiresAuth: true },
  },
  {
    path: '/programs/:id/edit',
    name: 'programs-edit',
    component: ProgramEdit,
    meta: { title: 'Edit Program', requiresAuth: true },
  },
  {
    path: '/enrollment',
    name: 'enrollment',
    component: EnrollmentIndex,
    meta: { title: 'Enrollment', requiresAuth: true },
    beforeEnter: requiresPermission('enrollment.view_own'),
  },
  {
    path: '/enrollment/register',
    name: 'enrollment-register',
    component: EnrollmentRegister,
    meta: { title: 'Course Registration', requiresAuth: true },
  },
  {
    path: '/enrollment/history',
    name: 'enrollment-history',
    component: EnrollmentHistory,
    meta: { title: 'Enrollment History', requiresAuth: true },
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: AttendanceIndex,
    meta: { title: 'Attendance', requiresAuth: true },
    beforeEnter: requiresPermission('attendance.view_own'),
  },
  {
    path: '/examinations',
    name: 'examinations',
    component: ExaminationIndex,
    meta: { title: 'Examinations', requiresAuth: true },
    beforeEnter: requiresPermission('exams.view_schedule'),
  },
  {
    path: '/fees',
    name: 'fees',
    component: FeeIndex,
    meta: { title: 'Fees', requiresAuth: true },
    beforeEnter: requiresPermission('fees.view_own'),
  },
  {
    path: '/library',
    name: 'library',
    component: LibraryIndex,
    meta: { title: 'Library', requiresAuth: true },
    beforeEnter: requiresPermission('library.view'),
  },
  {
    path: '/hostel',
    name: 'hostel',
    component: HostelIndex,
    meta: { title: 'Hostel', requiresAuth: true },
    beforeEnter: requiresPermission('hostel.view_own'),
  },
  {
    path: '/hostel/rooms',
    name: 'hostel-rooms',
    component: HostelRooms,
    meta: { title: 'Hostel Rooms', requiresAuth: true },
  },
  {
    path: '/hostel/allocations',
    name: 'hostel-allocations',
    component: HostelAllocations,
    meta: { title: 'Hostel Allocations', requiresAuth: true },
  },
  {
    path: '/hostel/mess',
    name: 'hostel-mess',
    component: HostelMess,
    meta: { title: 'Hostel Mess', requiresAuth: true },
  },
  {
    path: '/hostel/booking',
    name: 'hostel-booking',
    component: HostelBooking,
    meta: { title: 'Hostel Booking', requiresAuth: true },
  },
  {
    path: '/hostel/booking/confirmation',
    name: 'hostel-booking-confirmation',
    component: HostelBookingConfirmation,
    meta: { title: 'Booking Confirmation', requiresAuth: true },
  },
  {
    path: '/hostel/requests',
    name: 'hostel-requests',
    component: HostelRequests,
    meta: { title: 'Hostel Requests', requiresAuth: true },
  },
  {
    path: '/transport',
    name: 'transport',
    component: TransportIndex,
    meta: { title: 'Transport', requiresAuth: true },
    beforeEnter: requiresPermission('transport.view'),
  },
  {
    path: '/leaves',
    name: 'leaves',
    component: LeaveIndex,
    meta: { title: 'Leaves', requiresAuth: true },
    beforeEnter: requiresPermission('leave.view_own'),
  },
  {
    path: '/notices',
    name: 'notices',
    component: NoticeIndex,
    meta: { title: 'Notices', requiresAuth: true },
    beforeEnter: requiresPermission('notices.view'),
  },
  {
    path: '/reports',
    name: 'reports',
    component: ReportIndex,
    meta: { title: 'Reports', requiresAuth: true },
    beforeEnter: requiresPermission('reports.view_own'),
  },
  {
    path: '/permissions',
    name: 'permissions',
    component: PermissionsIndex,
    meta: { title: 'Permissions & Roles', requiresAuth: true },
    beforeEnter: requiresSuperAdmin,
  },
  {
    path: '/permissions/roles',
    name: 'permissions-roles',
    component: PermissionsRoles,
    meta: { title: 'Manage Roles', requiresAuth: true },
    beforeEnter: requiresSuperAdmin,
  },
  {
    path: '/permissions/list',
    name: 'permissions-list',
    component: PermissionsList,
    meta: { title: 'System Permissions', requiresAuth: true },
    beforeEnter: requiresSuperAdmin,
  },
  {
    path: '/permissions/assign',
    name: 'permissions-assign',
    component: PermissionsAssign,
    meta: { title: 'Assign Roles', requiresAuth: true },
    beforeEnter: requiresSuperAdmin,
  },
  {
    path: '/user-approval',
    name: 'user-approval',
    component: UserApproval,
    meta: { title: 'User Approval', requiresAuth: true },
    beforeEnter: requiresAdmin,
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: { title: 'Forgot Password', public: true },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword,
    meta: { title: 'Reset Password', public: true },
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: Unauthorized,
    meta: { title: 'Unauthorized', public: true },
  },
  {
    path: '/admin/panel',
    name: 'admin-panel',
    component: AdminPanel,
    meta: { title: 'Admin Panel', requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'login' },
  },
]
