<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePermissionStore } from '@/stores/permission.store'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

defineOptions({ name: 'PermissionsAssign' })

const router = useRouter()
const permissionStore = usePermissionStore()
const toast = useToast()

const searchQuery = ref('')
const filterRole = ref('all')
const filterStatus = ref('all')
const filterOrganization = ref('all')
const selectedUser = ref(null)
const showAssignModal = ref(false)

const assignForm = ref({
  userId: null,
  roleId: null,
  organizationId: null
})

onMounted(() => {
  permissionStore.fetchUsers()
  permissionStore.fetchRoles()
  permissionStore.fetchOrganizations()
})

const filteredUsers = computed(() => {
  let users = permissionStore.users

  if (filterRole.value !== 'all') {
    users = users.filter(u => u.role === filterRole.value)
  }

  if (filterStatus.value !== 'all') {
    users = users.filter(u => u.status === filterStatus.value)
  }

  if (filterOrganization.value !== 'all') {
    users = users.filter(u => u.organization === filterOrganization.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    users = users.filter(u => 
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    )
  }

  return users
})

const roleOptions = computed(() => {
  return ['all', ...permissionStore.roles.map(r => r.name)]
})

const organizationOptions = computed(() => {
  return ['all', ...permissionStore.activeOrganizations.map(o => o.name)]
})

const handleAssignRole = (user) => {
  selectedUser.value = user
  assignForm.value = {
    userId: user.id,
    roleId: permissionStore.roles.find(r => r.name === user.role)?.id || null,
    organizationId: permissionStore.organizations.find(o => o.name === user.organization)?.id || null
  }
  showAssignModal.value = true
}

const handleSaveAssignment = async () => {
  try {
    await permissionStore.assignRole(assignForm.value.userId, assignForm.value.roleId, assignForm.value.organizationId)
    toast.success('Role assigned successfully')
    showAssignModal.value = false
  } catch (error) {
    toast.error('Failed to assign role')
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-success-light text-success'
    case 'inactive': return 'bg-error-light text-error'
    default: return 'bg-bg-light text-text-muted'
  }
}

const handleBack = () => {
  router.push({ name: 'permissions' })
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Access Control</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Assign Roles & Permissions</h1>
        <p class="m-0 text-sm text-text-secondary">Assign roles and organizations to users with granular permissions.</p>
      </div>
      <button @click="handleBack" class="px-4 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all">
        Back
      </button>
    </header>

    <div v-if="permissionStore.loading" class="text-center py-12 text-text-muted">
      <p>Loading users...</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-primary-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-primary mb-1">{{ permissionStore.users.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Total Users</div>
        </div>
        <div class="bg-success-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-success mb-1">{{ permissionStore.activeUsers.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Active Users</div>
        </div>
        <div class="bg-secondary-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-secondary mb-1">{{ permissionStore.roles.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Available Roles</div>
        </div>
        <div class="bg-warning-light border border-border rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-warning mb-1">{{ permissionStore.activeOrganizations.length }}</div>
          <div class="text-xs text-text-secondary uppercase tracking-wider">Active Organizations</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-bg-light border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Search</label>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search users..." 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Role</label>
            <select 
              v-model="filterRole" 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option v-for="role in roleOptions" :key="role" :value="role">
                {{ role === 'all' ? 'All Roles' : role }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Organization</label>
            <select 
              v-model="filterOrganization" 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option v-for="org in organizationOptions" :key="org" :value="org">
                {{ org === 'all' ? 'All Organizations' : org }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Status</label>
            <select 
              v-model="filterStatus" 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div v-if="filteredUsers.length === 0" class="text-center py-12 text-text-muted">
        <p>No users found matching your criteria.</p>
      </div>

      <div v-else class="bg-bg-white border border-border rounded-xl overflow-hidden">
        <table class="w-full">
          <thead class="bg-bg-light">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">User</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Email</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Role</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Organization</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Status</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Last Login</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in filteredUsers" 
              :key="user.id" 
              class="border-b border-border-light hover:bg-bg-light transition-all"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div class="font-semibold text-text-primary">{{ user.name }}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span class="bg-secondary-light text-secondary px-2 py-1 rounded text-xs font-semibold">{{ user.role }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ user.organization }}</td>
              <td class="px-4 py-3">
                <span :class="getStatusColor(user.status)" class="px-2 py-1 rounded text-xs font-semibold">
                  {{ user.status.charAt(0).toUpperCase() + user.status.slice(1) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-text-secondary">{{ user.lastLogin }}</td>
              <td class="px-4 py-3">
                <button 
                  @click="handleAssignRole(user)"
                  class="text-primary hover:text-primary-dark font-medium text-sm"
                >
                  Assign Role
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Assign Role Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-bg-white border border-border rounded-xl p-6 max-w-md w-full">
        <h2 class="mb-4 text-xl font-bold text-text-primary">Assign Role & Organization</h2>
        
        <div v-if="selectedUser" class="mb-4 p-3 bg-bg-light rounded-lg">
          <div class="font-semibold text-text-primary">{{ selectedUser.name }}</div>
          <div class="text-sm text-text-secondary">{{ selectedUser.email }}</div>
        </div>

        <div class="flex flex-col gap-4 mb-6">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Role *</label>
            <select 
              v-model="assignForm.roleId" 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option :value="null">Select a role</option>
              <option v-for="role in permissionStore.roles" :key="role.id" :value="role.id">
                {{ role.name }} - {{ role.description }}
              </option>
            </select>
            <div v-if="assignForm.roleId" class="mt-2 text-xs text-text-muted">
              <div class="font-semibold">Permissions:</div>
              <div class="flex flex-wrap gap-1 mt-1">
                <span v-for="perm in permissionStore.getPermissionsByRole(assignForm.roleId).slice(0, 5)" :key="perm.name" class="bg-bg-white border border-border px-2 py-1 rounded">
                  {{ perm.name }}
                </span>
                <span v-if="permissionStore.getPermissionsByRole(assignForm.roleId).length > 5" class="text-text-muted">
                  +{{ permissionStore.getPermissionsByRole(assignForm.roleId).length - 5 }} more
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Organization *</label>
            <select 
              v-model="assignForm.organizationId" 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option :value="null">Select an organization</option>
              <option v-for="org in permissionStore.activeOrganizations" :key="org.id" :value="org.id">
                {{ org.name }} ({{ org.location }})
              </option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 justify-end">
          <button @click="showAssignModal = false" class="px-4 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all">
            Cancel
          </button>
          <button 
            @click="handleSaveAssignment"
            :disabled="!assignForm.roleId || !assignForm.organizationId"
            class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}
</style>
