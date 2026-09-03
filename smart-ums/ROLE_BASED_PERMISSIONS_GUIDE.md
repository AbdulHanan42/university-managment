# Role-Based Permission System Guide

## Overview

This University Management System uses a **Role-Based Access Control (RBAC)** system where permissions are assigned to **Roles** (not individual users). All users with the same role automatically inherit the same permissions.

## How It Works

### 1. Roles are the Primary Permission Container

Permissions are defined at the **Role level**, not the user level:
- **Student Role** → Has specific student permissions
- **Faculty Role** → Has specific faculty permissions  
- **Department Head Role** → Has specific department head permissions
- **HR Role** → Has specific HR permissions
- **Admin Role** → Has admin permissions
- **Super Admin Role** → Has all permissions

### 2. Users Inherit Permissions from Their Role

When a user is assigned a role, they automatically get ALL permissions defined for that role:
- User A (Student) → Gets Student permissions
- User B (Student) → Gets Student permissions (same as User A)
- User C (Faculty) → Gets Faculty permissions

### 3. Changing a User's Role Changes Their Permissions

To change a user's permissions, simply change their role:
- Change User A from Student to Faculty → User A now has Faculty permissions
- Change User B from Faculty to Department Head → User B now has Department Head permissions

## Available Roles and Their Permissions

### 1. Super Admin
**Permissions**: `all` (Full system access)
- Can access everything
- Can manage all roles and permissions
- Can manage all users

### 2. Admin
**Permissions**: 
- `users.manage`, `students.manage`, `faculty.manage`, `departments.manage`, `courses.manage`
- `enrollment.manage`, `enrollment.approve`, `enrollment.reject`
- `attendance.manage`, `examinations.manage`, `fees.manage`
- `library.manage`, `hostel.manage`, `hostel.approve`, `hostel.reject`
- `transport.manage`, `leaves.manage`, `leaves.approve`, `leaves.reject`
- `notices.manage`, `reports.view`

### 3. Student
**Permissions**:
- `dashboard.view`, `reports.view_own`
- `students.view_own`, `students.update_own`
- `faculty.view_own_dept` (only faculty of own department)
- `departments.view_own` (only own department)
- `programs.view_own` (only own program)
- `courses.view`, `courses.view_available`
- `enrollment.view_own`, `enrollment.create`, `enrollment.cancel`
- `attendance.view_own`
- `exams.view_schedule`, `exams.view_own_results`, `exams.view_subjects`
- `fees.view_own`, `fees.view_payment_history`, `fees.download_invoice`
- `fees.apply_installment`, `fees.view_installment_status`
- `library.view`, `library.view_own`
- `hostel.view_own`, `hostel.view_room`
- `leave.view_own`, `leave.create`, `leave.cancel`
- `notices.view`

### 4. Faculty
**Permissions**:
- `students.view`, `faculty.view`, `attendance.manage`, `leaves.view`, `notices.view`

### 5. Department Head
**Permissions**:
- `students.view`, `students.manage_dept`
- `faculty.view`, `faculty.manage_dept`
- `courses.view`, `courses.manage_dept`
- `enrollment.view`, `enrollment.approve_dept`
- `attendance.manage_dept`
- `examinations.view`, `examinations.manage_dept`
- `reports.view`

### 6. Hostel Manager
**Permissions**:
- `hostel.manage`, `hostel.rooms`, `hostel.allocations`, `hostel.mess`
- `hostel.bookings`, `hostel.approve`, `hostel.reject`, `hostel.requests`

### 7. Finance Manager
**Permissions**:
- `students.view`, `fees.manage`, `fees.approve`, `fees.reject`, `reports.view`

### 8. HR
**Permissions**:
- `users.view`, `users.manage` (for HR-related user management)
- `leaves.manage`, `leaves.approve`, `leaves.reject` (for employee leave management)

## How to Assign/Change User Roles

### Using the Permission Store

```javascript
import { usePermissionStore } from '@/stores/permission.store'

const permissionStore = usePermissionStore()

// Assign a role to a user
await permissionStore.assignRole(userId, roleId)

// Update a user's role (changes their permissions automatically)
await permissionStore.updateUserRole(userId, 'Faculty')
```

### In the Admin Panel

1. Go to Permissions & Roles → Assign Roles
2. Select the user
3. Choose the role (Student, Faculty, Department Head, etc.)
4. Save - the user automatically gets all permissions for that role

## Permission Checking in Components

### Using the Composable

```vue
<script setup>
import { usePermission } from '@/composables/usePermission'

const { can, userRole } = usePermission()
</script>

<template>
  <!-- Check if user's role has specific permission -->
  <button v-if="can('students.manage')">Create Student</button>
  
  <!-- Show user's current role -->
  <p>Current Role: {{ userRole() }}</p>
</template>
```

### Using the Directive

```vue
<template>
  <!-- Hide if user's role doesn't have permission -->
  <button v-permission="'students.manage'">Create Student</button>
</template>
```

## Role-Based Permission Flow

```
Role Definition (in permission.service.js)
    ↓
User assigned to Role
    ↓
User inherits all Role permissions
    ↓
Permissions checked in UI (buttons, routes, etc.)
    ↓
User sees/hides features based on Role permissions
```

## Key Benefits of Role-Based System

1. **Consistency**: All students have the same permissions, all faculty have the same permissions
2. **Easy Management**: Change permissions for a role, and all users with that role are updated
3. **Scalability**: Add new users by simply assigning them a role
4. **Security**: No risk of accidentally giving wrong permissions to individual users
5. **Maintainability**: One place to manage permissions per role

## Example Scenarios

### Scenario 1: New Student Joins
1. Create user account
2. Assign "Student" role
3. User automatically gets all Student permissions
4. User can access student-specific features

### Scenario 2: Faculty Promoted to Department Head
1. Update user's role from "Faculty" to "Department Head"
2. User automatically loses Faculty permissions
3. User automatically gains Department Head permissions
4. User can now access department management features

### Scenario 3: Student Permissions Need to Change
1. Update "Student" role permissions in the system
2. ALL students automatically get the new permissions
3. No need to update individual students

## Important Notes

1. **Never assign permissions to individual users** - Always assign roles
2. **Role permissions are the single source of truth** - All permission checks reference the role
3. **Super Admin bypasses all permission checks** - Has access to everything
4. **Ownership checks still apply** - Even with role permissions, students can only see their own data
5. **Backend authorization is required** - Frontend permissions are for UX only

## Permission Categories

### Academic
- Dashboard, Reports, Students, Faculty, Departments, Programs, Courses, Enrollment, Attendance, Examinations

### Support Services  
- Fees, Library, Hostel, Transport, Leaves, Notices

### System
- User Management, Role Management, Permission Management

Each category has specific permissions like `view`, `manage`, `create`, `edit`, `delete`, `approve`, `reject`, etc.
