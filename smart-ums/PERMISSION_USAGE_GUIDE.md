# Permission-Based Button Usage Guide

This guide explains how to apply permissions to action buttons and UI elements for students and other roles.

## 1. Using the `usePermission` Composable

Import and use the composable in your Vue components:

```vue
<script setup>
import { usePermission } from '@/composables/usePermission'

const { can, canEdit, canDelete, canApprove, canReject, isStudent } = usePermission()
</script>
```

### Example: Conditional Button Rendering

```vue
<template>
  <div>
    <!-- Only show if user has students.manage permission -->
    <button v-if="can('students.manage')" @click="createStudent">
      Create Student
    </button>

    <!-- Only show if user can edit this specific student -->
    <button 
      v-if="canEdit('students', student.userId)" 
      @click="editStudent(student)"
    >
      Edit
    </button>

    <!-- Only show if user can delete this specific student -->
    <button 
      v-if="canDelete('students', student.userId)" 
      @click="deleteStudent(student)"
    >
      Delete
    </button>

    <!-- Only show if user can approve enrollments -->
    <button v-if="canApprove('enrollment')" @click="approveEnrollment">
      Approve
    </button>

    <!-- Only show if user can reject enrollments -->
    <button v-if="canReject('enrollment')" @click="rejectEnrollment">
      Reject
    </button>
  </div>
</template>
```

## 2. Using the `v-permission` Directive

The directive automatically hides elements if the user lacks permission.

### Basic Usage

```vue
<template>
  <!-- Hide if user doesn't have students.manage permission -->
  <button v-permission="'students.manage'" @click="createStudent">
    Create Student
  </button>

  <!-- Hide if user doesn't have faculty.view_own_dept permission -->
  <div v-permission="'faculty.view_own_dept'">
    Faculty List
  </div>
</template>
```

### With Ownership Check

```vue
<template>
  <!-- Hide if user doesn't own this resource -->
  <button 
    v-permission:owner="'students.update_own'" 
    :data-owner-id="student.userId"
    @click="updateStudent(student)"
  >
    Update
  </button>
</template>
```

## 3. Using the `PermissionButton` Component

A reusable button component with built-in permission checking.

```vue
<template>
  <PermissionButton 
    permission="students.manage" 
    @click="createStudent"
  >
    Create Student
  </PermissionButton>

  <PermissionButton 
    permission="students.update_own" 
    :owner-id="student.userId"
    variant="secondary"
    @click="editStudent(student)"
  >
    Edit
  </PermissionButton>

  <PermissionButton 
    permission="students.manage" 
    :owner-id="student.userId"
    variant="danger"
    @click="deleteStudent(student)"
  >
    Delete
  </PermissionButton>
</template>

<script setup>
import PermissionButton from '@/components/common/PermissionButton.vue'
</script>
```

## 4. Student-Specific Permission Examples

### Students Page (My Profile)

```vue
<template>
  <div class="student-profile">
    <h1>My Profile</h1>
    
    <!-- Students can only update their own profile -->
    <PermissionButton 
      permission="students.update_own" 
      @click="updateProfile"
    >
      Update Profile
    </PermissionButton>

    <!-- Students cannot delete their profile - no permission -->
    <!-- This button will be hidden for students -->
    <button v-permission="'students.manage'" @click="deleteProfile">
      Delete Profile
    </button>
  </div>
</template>
```

### Faculty Page

```vue
<template>
  <div class="faculty-list">
    <h1>Faculty</h1>
    
    <!-- Students can only view faculty, not create/edit/delete -->
    <!-- These buttons will be hidden for students -->
    <button v-permission="'faculty.manage'" @click="createFaculty">
      Add Faculty
    </button>

    <div v-for="faculty in facultyList" :key="faculty.id">
      <h3>{{ faculty.name }}</h3>
      
      <!-- Students cannot edit faculty -->
      <button v-permission="'faculty.manage'" @click="editFaculty(faculty)">
        Edit
      </button>
      
      <!-- Students cannot delete faculty -->
      <button v-permission="'faculty.manage'" @click="deleteFaculty(faculty)">
        Delete
      </button>
    </div>
  </div>
</template>
```

### Departments Page

```vue
<template>
  <div class="departments">
    <h1>Departments</h1>
    
    <!-- Students can only view their own department -->
    <!-- Create/Edit/Delete buttons hidden for students -->
    <button v-permission="'departments.manage'" @click="createDepartment">
      Add Department
    </button>

    <div v-for="dept in departments" :key="dept.id">
      <h3>{{ dept.name }}</h3>
      
      <button v-permission="'departments.manage'" @click="editDepartment(dept)">
        Edit
      </button>
      
      <button v-permission="'departments.manage'" @click="deleteDepartment(dept)">
        Delete
      </button>
    </div>
  </div>
</template>
```

### Programs Page

```vue
<template>
  <div class="programs">
    <h1>Programs</h1>
    
    <!-- Students can only view their own program -->
    <!-- No create/edit/delete for students -->
    <button v-permission="'programs.manage'" @click="createProgram">
      Add Program
    </button>

    <div v-for="program in programs" :key="program.id">
      <h3>{{ program.name }}</h3>
      
      <button v-permission="'programs.manage'" @click="editProgram(program)">
        Edit
      </button>
      
      <button v-permission="'programs.manage'" @click="deleteProgram(program)">
        Delete
      </button>
    </div>
  </div>
</template>
```

### Hostel Page

```vue
<template>
  <div class="hostel">
    <h1>Hostel</h1>
    
    <!-- Students can only view their own room -->
    <!-- No room management for students -->
    <div v-if="can('hostel.view_own')">
      <h3>Room Number: {{ myRoom.number }}</h3>
      <p>Block: {{ myRoom.block }}</p>
    </div>

    <!-- These buttons hidden for students -->
    <button v-permission="'hostel.manage'" @click="allocateRoom">
      Allocate Room
    </button>
    
    <button v-permission="'hostel.manage'" @click="manageRooms">
      Manage Rooms
    </button>
  </div>
</template>

<script setup>
import { usePermission } from '@/composables/usePermission'

const { can } = usePermission()
</script>
```

### Leaves Page

```vue
<template>
  <div class="leaves">
    <h1>My Leaves</h1>
    
    <!-- Students can create and cancel their own leaves -->
    <PermissionButton 
      permission="leave.create" 
      @click="showLeaveForm = true"
    >
      Apply for Leave
    </PermissionButton>

    <div v-for="leave in myLeaves" :key="leave.id">
      <h3>{{ leave.type }} - {{ leave.status }}</h3>
      
      <!-- Students can cancel pending leaves -->
      <PermissionButton 
        permission="leave.cancel" 
        v-if="leave.status === 'pending'"
        @click="cancelLeave(leave)"
      >
        Cancel
      </PermissionButton>

      <!-- Students cannot approve/reject leaves -->
      <button v-permission="'leaves.approve'" @click="approveLeave(leave)">
        Approve
      </button>
      
      <button v-permission="'leaves.reject'" @click="rejectLeave(leave)">
        Reject
      </button>
    </div>
  </div>
</template>
```

### Fees Page

```vue
<template>
  <div class="fees">
    <h1>My Fees</h1>
    
    <!-- Students can view own fees and apply for installments -->
    <div v-if="can('fees.view_own')">
      <h3>Total Due: {{ totalDue }}</h3>
      <h3>Paid: {{ totalPaid }}</h3>
    </div>

    <!-- Students can apply for installments -->
    <PermissionButton 
      permission="fees.apply_installment" 
      @click="showInstallmentForm = true"
    >
      Apply for Installment
    </PermissionButton>

    <!-- Students can view installment status -->
    <div v-if="can('fees.view_installment_status')">
      <h3>Installment Status: {{ installmentStatus }}</h3>
    </div>

    <!-- Students cannot manage fees -->
    <button v-permission="'fees.manage'" @click="manageFees">
      Manage Fees
    </button>
    
    <button v-permission="'fees.approve'" @click="approvePayment">
      Approve Payment
    </button>
  </div>
</template>
```

### Examinations Page

```vue
<template>
  <div class="examinations">
    <h1>Examinations</h1>
    
    <!-- Students can view exam schedule and results -->
    <div v-if="can('exams.view_schedule')">
      <h3>Exam Schedule</h3>
      <ul>
        <li v-for="exam in examSchedule" :key="exam.id">
          {{ exam.subject }} - {{ exam.date }}
        </li>
      </ul>
    </div>

    <!-- Students can view their own results -->
    <div v-if="can('exams.view_own_results')">
      <h3>My Results</h3>
      <ul>
        <li v-for="result in myResults" :key="result.id">
          {{ result.subject }} - {{ result.grade }}
        </li>
      </ul>
    </div>

    <!-- Students can view studied and pending subjects -->
    <div v-if="can('exams.view_subjects')">
      <h3>Studied Subjects: {{ studiedSubjects }}</h3>
      <h3>Pending Subjects: {{ pendingSubjects }}</h3>
    </div>

    <!-- Students cannot manage examinations -->
    <button v-permission="'examinations.manage'" @click="createExam">
      Create Exam
    </button>
    
    <button v-permission="'examinations.manage'" @click="enterResults">
      Enter Results
    </button>
  </div>
</template>
```

## 5. Available Student Permissions

### Academic
- `dashboard.view` - View dashboard
- `reports.view_own` - View own reports
- `students.view_own` - View own profile
- `students.update_own` - Update own profile
- `faculty.view_own_dept` - View faculty of own department
- `departments.view_own` - View own department
- `programs.view_own` - View own program
- `courses.view` - View courses
- `courses.view_available` - View available courses
- `enrollment.view_own` - View own enrollments
- `enrollment.create` - Create enrollment
- `enrollment.cancel` - Cancel enrollment
- `attendance.view_own` - View own attendance
- `exams.view_schedule` - View exam schedule
- `exams.view_own_results` - View own exam results
- `exams.view_subjects` - View studied/pending subjects

### Support Services
- `fees.view_own` - View own fees
- `fees.view_payment_history` - View payment history
- `fees.download_invoice` - Download invoices
- `fees.apply_installment` - Apply for installment
- `fees.view_installment_status` - View installment status
- `library.view` - View library
- `library.view_own` - View own library records
- `hostel.view_own` - View own hostel details
- `hostel.view_room` - View own room number
- `leave.view_own` - View own leaves
- `leave.create` - Create leave request
- `leave.cancel` - Cancel leave request
- `notices.view` - View notices

## 6. Best Practices

1. **Always use permission checks** - Never rely solely on hiding UI elements
2. **Use ownership checks** - For student data, always verify resource ownership
3. **Combine with route guards** - Use both route guards and button permissions
4. **Test with different roles** - Test UI with student, admin, and super admin accounts
5. **Use the composable for complex logic** - Use directives for simple cases
6. **Use PermissionButton for consistency** - Standardize button permissions across the app

## 7. Security Note

Permission-based UI hiding is for UX only. Always implement backend authorization to ensure security. The frontend permissions prevent accidental access but should not be the only security layer.
