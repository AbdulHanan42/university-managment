<script setup>
import { ref, onMounted } from 'vue'
import { usePermissionStore } from '@/stores/permission.store'
import { useRouter } from 'vue-router'

defineOptions({ name: 'PermissionsIndex' })

const router = useRouter()
const permissionStore = usePermissionStore()

onMounted(() => {
  permissionStore.fetchRoles()
  permissionStore.fetchUsers()
})

const handleManageRoles = () => {
  router.push({ name: 'permissions-roles' })
}

const handleManagePermissions = () => {
  router.push({ name: 'permissions-list' })
}

const handleAssignRoles = () => {
  router.push({ name: 'permissions-assign' })
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Access Control</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">Permissions & Roles</h1>
        <p class="m-0 text-sm text-text-secondary">Manage user roles, permissions, and access control.</p>
      </div>
    </header>

    <div v-if="permissionStore.loading" class="text-center py-12 text-text-muted">
      <p>Loading permissions data...</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-primary-light border border-border rounded-xl p-5">
          <div class="text-3xl font-bold text-primary mb-1">{{ permissionStore.roles.length }}</div>
          <div class="text-sm text-text-secondary">Total Roles</div>
        </div>
        <div class="bg-secondary-light border border-border rounded-xl p-5">
          <div class="text-3xl font-bold text-secondary mb-1">{{ permissionStore.permissions.length }}</div>
          <div class="text-sm text-text-secondary">Total Permissions</div>
        </div>
        <div class="bg-success-light border border-border rounded-xl p-5">
          <div class="text-3xl font-bold text-success mb-1">{{ permissionStore.users.length }}</div>
          <div class="text-sm text-text-secondary">Total Users</div>
        </div>
        <div class="bg-warning-light border border-border rounded-xl p-5">
          <div class="text-3xl font-bold text-warning mb-1">{{ permissionStore.activeUsers.length }}</div>
          <div class="text-sm text-text-secondary">Active Users</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-bg-light border border-border rounded-xl p-6">
        <h2 class="mb-4 text-lg font-bold text-text-primary">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button @click="handleManageRoles" class="bg-bg-white border border-border rounded-lg p-4 text-left hover:border-primary transition-all">
            <div class="text-2xl mb-2">👥</div>
            <div class="font-semibold text-text-primary">Manage Roles</div>
            <div class="text-sm text-text-muted">Create and edit user roles</div>
          </button>
          <button @click="handleManagePermissions" class="bg-bg-white border border-border rounded-lg p-4 text-left hover:border-primary transition-all">
            <div class="text-2xl mb-2">🔐</div>
            <div class="font-semibold text-text-primary">Manage Permissions</div>
            <div class="text-sm text-text-muted">Configure system permissions</div>
          </button>
          <button @click="handleAssignRoles" class="bg-bg-white border border-border rounded-lg p-4 text-left hover:border-primary transition-all">
            <div class="text-2xl mb-2">🎯</div>
            <div class="font-semibold text-text-primary">Assign Roles</div>
            <div class="text-sm text-text-muted">Assign roles to users</div>
          </button>
        </div>
      </div>

      <!-- Roles Overview -->
      <div class="bg-bg-light border border-border rounded-xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-text-primary">Roles Overview</h2>
          <button @click="handleManageRoles" class="text-sm text-primary hover:text-primary-dark font-medium">View All →</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="role in permissionStore.roles" :key="role.id" class="bg-bg-white border border-border rounded-lg p-4 hover:border-primary transition-all">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-bold text-text-primary">{{ role.name }}</h3>
              <span class="text-xs bg-primary-light text-primary px-2 py-1 rounded">{{ role.userCount }} users</span>
            </div>
            <p class="text-sm text-text-secondary mb-3">{{ role.description }}</p>
            <div class="text-xs text-text-muted">
              {{ role.permissions.includes('all') ? 'All permissions' : `${role.permissions.length} permissions` }}
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Users -->
      <div class="bg-bg-light border border-border rounded-xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-text-primary">Recent Users</h2>
          <button @click="handleAssignRoles" class="text-sm text-primary hover:text-primary-dark font-medium">Manage All →</button>
        </div>
        <div class="space-y-3">
          <div v-for="user in permissionStore.users.slice(0, 5)" :key="user.id" class="bg-bg-white border border-border rounded-lg p-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold">
                {{ user.name.charAt(0) }}
              </div>
              <div>
                <div class="font-semibold text-text-primary">{{ user.name }}</div>
                <div class="text-sm text-text-secondary">{{ user.email }}</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs bg-secondary-light text-secondary px-2 py-1 rounded">{{ user.role }}</span>
              <span :class="user.status === 'active' ? 'text-success' : 'text-text-muted'" class="text-xs">
                {{ user.status }}
              </span>
            </div>
          </div>
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
