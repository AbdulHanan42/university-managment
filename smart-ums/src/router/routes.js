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
import { requiresAuth, requiresAdmin } from './guards'

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
    path: '/courses',
    name: 'courses',
    component: CourseIndex,
    meta: { title: 'Courses' },
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
    path: '/enrollment/register',
    name: 'enrollment-register',
    component: EnrollmentRegister,
    meta: { title: 'Course Registration' },
  },
  {
    path: '/enrollment/history',
    name: 'enrollment-history',
    component: EnrollmentHistory,
    meta: { title: 'Enrollment History' },
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
    path: '/hostel/rooms',
    name: 'hostel-rooms',
    component: HostelRooms,
    meta: { title: 'Hostel Rooms' },
  },
  {
    path: '/hostel/allocations',
    name: 'hostel-allocations',
    component: HostelAllocations,
    meta: { title: 'Hostel Allocations' },
  },
  {
    path: '/hostel/mess',
    name: 'hostel-mess',
    component: HostelMess,
    meta: { title: 'Hostel Mess' },
  },
  {
    path: '/hostel/booking',
    name: 'hostel-booking',
    component: HostelBooking,
    meta: { title: 'Hostel Booking' },
  },
  {
    path: '/hostel/booking/confirmation',
    name: 'hostel-booking-confirmation',
    component: HostelBookingConfirmation,
    meta: { title: 'Booking Confirmation' },
  },
  {
    path: '/hostel/requests',
    name: 'hostel-requests',
    component: HostelRequests,
    meta: { title: 'Hostel Requests' },
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
    path: '/permissions',
    name: 'permissions',
    component: PermissionsIndex,
    meta: { title: 'Permissions & Roles' },
  },
  {
    path: '/permissions/roles',
    name: 'permissions-roles',
    component: PermissionsRoles,
    meta: { title: 'Roles Management' },
  },
  {
    path: '/permissions/list',
    name: 'permissions-list',
    component: PermissionsList,
    meta: { title: 'System Permissions' },
  },
  {
    path: '/permissions/assign',
    name: 'permissions-assign',
    component: PermissionsAssign,
    meta: { title: 'Assign Roles' },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { title: 'Login' },
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupPage,
    meta: { title: 'Sign Up' },
  },
  {
    path: '/user-approval',
    name: 'user-approval',
    component: UserApproval,
    meta: { title: 'User Approval' },
    beforeEnter: requiresAdmin,
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
