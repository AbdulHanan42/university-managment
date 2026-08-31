<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePermissionStore } from '@/stores/permission.store'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

defineOptions({ name: 'PermissionsRoles' })

const router = useRouter()
const permissionStore = usePermissionStore()
const toast = useToast()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedRole = ref(null)

const roleForm = ref({
  name: '',
  description: '',
  permissions: [],
  organizations: []
})

onMounted(() => {
  permissionStore.fetchRoles()
  permissionStore.fetchPermissions()
  permissionStore.fetchOrganizations()
})

const handleCreateRole = () => {
  roleForm.value = {
    name: '',
    description: '',
    permissions: [],
    organizations: []
  }
  showCreateModal.value = true
}

const handleEditRole = (role) => {
  selectedRole.value = role
  roleForm.value = {
    name: role.name,
    description: role.description,
    permissions: [...role.permissions],
    organizations: [...(role.organizations || [])]
  }
  showEditModal.value = true
}

const handleDeleteRole = async (roleId) => {
  if (confirm('Are you sure you want to delete this role?')) {
    try {
      await permissionStore.deleteRole(roleId)
      toast.success('Role deleted successfully')
    } catch (error) {
      toast.error('Failed to delete role')
    }
  }
}

const handleSaveRole = async () => {
  try {
    await permissionStore.createRole(roleForm.value)
    toast.success('Role created successfully')
    showCreateModal.value = false
  } catch (error) {
    toast.error('Failed to create role')
  }
}

const handleUpdateRole = async () => {
  try {
    await permissionStore.updateRole(selectedRole.value.id, roleForm.value)
    toast.success('Role updated successfully')
    showEditModal.value = false
  } catch (error) {
    toast.error('Failed to update role')
  }
}

const togglePermission = (permissionName) => {
  const index = roleForm.value.permissions.indexOf(permissionName)
  if (index !== -1) {
    roleForm.value.permissions.splice(index, 1)
  } else {
    roleForm.value.permissions.push(permissionName)
  }
}

const toggleOrganization = (orgCode) => {
  const index = roleForm.value.organizations.indexOf(orgCode)
  if (index !== -1) {
    roleForm.value.organizations.splice(index, 1)
  } else {
    roleForm.value.organizations.push(orgCode)
  }
}

const isPermissionSelected = (permissionName) => {
  return roleForm.value.permissions.includes(permissionName)
}

const isOrganizationSelected = (orgCode) => {
  return roleForm.value.organizations.includes(orgCode)
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
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Roles Management</h1>
        <p class="m-0 text-sm text-text-secondary">Create and manage user roles with permissions.</p>
      </div>
      <div class="flex gap-2">
        <button @click="handleBack" class="px-4 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all">
          Back
        </button>
        <button @click="handleCreateRole" class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all">
          + Create Role
        </button>
      </div>
    </header>

    <div v-if="permissionStore.loading" class="text-center py-12 text-text-muted">
      <p>Loading roles...</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Roles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="role in permissionStore.roles" :key="role.id" class="bg-bg-light border border-border rounded-xl p-5 hover:border-primary transition-all">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-bold text-text-primary">{{ role.name }}</h3>
              <p class="text-sm text-text-secondary">{{ role.description }}</p>
            </div>
            <span class="text-xs bg-primary-light text-primary px-2 py-1 rounded">{{ role.userCount }} users</span>
          </div>
          
          <div class="mb-4">
            <div class="text-xs text-text-muted mb-2">Permissions:</div>
            <div class="flex flex-wrap gap-1">
              <span v-if="role.permissions.includes('all')" class="text-xs bg-success-light text-success px-2 py-1 rounded">All Permissions</span>
              <span v-else v-for="perm in role.permissions.slice(0, 3)" :key="perm" class="text-xs bg-bg-white text-text-secondary px-2 py-1 rounded border border-border">
                {{ perm }}
              </span>
              <span v-if="!role.permissions.includes('all') && role.permissions.length > 3" class="text-xs text-text-muted">
                +{{ role.permissions.length - 3 }} more
              </span>
            </div>
          </div>

          <div class="flex gap-2">
            <button @click="handleEditRole(role)" class="flex-1 px-3 py-2 bg-bg-white border border-border rounded-lg text-sm font-medium hover:border-primary transition-all">
              Edit
            </button>
            <button 
              @click="handleDeleteRole(role.id)"
              :disabled="role.name === 'Super Admin' || role.name === 'Student'"
              class="px-3 py-2 bg-error-light text-error rounded-lg text-sm font-medium hover:bg-error transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Role Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-bg-white border border-border rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="mb-4 text-xl font-bold text-text-primary">Create New Role</h2>
        
        <div class="flex flex-col gap-4 mb-6">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Role Name *</label>
            <input v-model="roleForm.name" type="text" placeholder="e.g., Department Head" class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Description *</label>
            <textarea v-model="roleForm.description" placeholder="Describe this role's purpose" rows="3" class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"></textarea>
          </div>
        </div>

        <div class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-bold text-text-primary">Permissions</h3>
            <button @click="roleForm.permissions = ['all']" class="text-sm text-primary hover:text-primary-dark">Grant All</button>
          </div>
          
          <div v-for="(perms, category) in permissionStore.permissionsByCategory" :key="category" class="mb-4">
            <h4 class="text-sm font-semibold text-text-secondary mb-2">{{ category }}</h4>
            <div class="grid grid-cols-2 gap-2">
              <div 
                v-for="perm in perms" 
                :key="perm.id"
                @click="togglePermission(perm.name)"
                :class="isPermissionSelected(perm.name) ? 'border-primary bg-primary-light' : 'border-border'"
                class="border rounded-lg p-2 cursor-pointer hover:border-primary transition-all"
              >
                <div class="flex items-center gap-2">
                  <input type="checkbox" :checked="isPermissionSelected(perm.name)" class="w-4 h-4" />
                  <div>
                    <div class="text-sm font-medium text-text-primary">{{ perm.name }}</div>
                    <div class="text-xs text-text-secondary">{{ perm.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-bold text-text-primary">Organizations</h3>
            <button @click="roleForm.organizations = ['all']" class="text-sm text-primary hover:text-primary-dark">All Organizations</button>
          </div>
          
          <div class="grid grid-cols-2 gap-2">
            <div 
              v-for="org in permissionStore.activeOrganizations" 
              :key="org.id"
              @click="toggleOrganization(org.code)"
              :class="isOrganizationSelected(org.code) || roleForm.organizations.includes('all') ? 'border-primary bg-primary-light' : 'border-border'"
              class="border rounded-lg p-3 cursor-pointer hover:border-primary transition-all"
            >
              <div class="flex items-center gap-2">
                <input type="checkbox" :checked="isOrganizationSelected(org.code) || roleForm.organizations.includes('all')" class="w-4 h-4" />
                <div>
                  <div class="text-sm font-medium text-text-primary">{{ org.name }}</div>
                  <div class="text-xs text-text-secondary">{{ org.location }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 justify-end">
          <button @click="showCreateModal = false" class="px-4 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all">
            Cancel
          </button>
          <button @click="handleSaveRole" class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all">
            Create Role
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Role Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-bg-white border border-border rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="mb-4 text-xl font-bold text-text-primary">Edit Role: {{ selectedRole?.name }}</h2>
        
        <div class="flex flex-col gap-4 mb-6">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Role Name *</label>
            <input v-model="roleForm.name" type="text" class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Description *</label>
            <textarea v-model="roleForm.description" rows="3" class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"></textarea>
          </div>
        </div>

        <div class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-bold text-text-primary">Permissions</h3>
            <button @click="roleForm.permissions = ['all']" class="text-sm text-primary hover:text-primary-dark">Grant All</button>
          </div>
          
          <div v-for="(perms, category) in permissionStore.permissionsByCategory" :key="category" class="mb-4">
            <h4 class="text-sm font-semibold text-text-secondary mb-2">{{ category }}</h4>
            <div class="grid grid-cols-2 gap-2">
              <div 
                v-for="perm in perms" 
                :key="perm.id"
                @click="togglePermission(perm.name)"
                :class="isPermissionSelected(perm.name) ? 'border-primary bg-primary-light' : 'border-border'"
                class="border rounded-lg p-2 cursor-pointer hover:border-primary transition-all"
              >
                <div class="flex items-center gap-2">
                  <input type="checkbox" :checked="isPermissionSelected(perm.name)" class="w-4 h-4" />
                  <div>
                    <div class="text-sm font-medium text-text-primary">{{ perm.name }}</div>
                    <div class="text-xs text-text-secondary">{{ perm.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-bold text-text-primary">Organizations</h3>
            <button @click="roleForm.organizations = ['all']" class="text-sm text-primary hover:text-primary-dark">All Organizations</button>
          </div>
          
          <div class="grid grid-cols-2 gap-2">
            <div 
              v-for="org in permissionStore.activeOrganizations" 
              :key="org.id"
              @click="toggleOrganization(org.code)"
              :class="isOrganizationSelected(org.code) || roleForm.organizations.includes('all') ? 'border-primary bg-primary-light' : 'border-border'"
              class="border rounded-lg p-3 cursor-pointer hover:border-primary transition-all"
            >
              <div class="flex items-center gap-2">
                <input type="checkbox" :checked="isOrganizationSelected(org.code) || roleForm.organizations.includes('all')" class="w-4 h-4" />
                <div>
                  <div class="text-sm font-medium text-text-primary">{{ org.name }}</div>
                  <div class="text-xs text-text-secondary">{{ org.location }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 justify-end">
          <button @click="showEditModal = false" class="px-4 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all">
            Cancel
          </button>
          <button @click="handleUpdateRole" class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all">
            Update Role
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
