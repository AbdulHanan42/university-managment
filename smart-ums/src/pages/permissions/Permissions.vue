<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePermissionStore } from '@/stores/permission.store'
import { useRouter } from 'vue-router'

defineOptions({ name: 'PermissionsList' })

const router = useRouter()
const permissionStore = usePermissionStore()

const searchQuery = ref('')
const selectedCategory = ref('all')

onMounted(() => {
  permissionStore.fetchPermissions()
})

const filteredPermissions = computed(() => {
  let permissions = permissionStore.permissions

  if (selectedCategory.value !== 'all') {
    permissions = permissions.filter(p => p.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    permissions = permissions.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }

  return permissions
})

const categories = computed(() => {
  const cats = new Set(permissionStore.permissions.map(p => p.category))
  return ['all', ...Array.from(cats)]
})

const handleBack = () => {
  router.push({ name: 'permissions' })
}
</script>

<template>
  <section class="bg-bg-white border border-border rounded-xl shadow-lg p-5">
    <header class="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div>
        <p class="mb-1 text-xs uppercase tracking-wider text-text-muted font-semibold">Access Control</p>
        <h1 class="mb-1 text-2xl font-bold text-text-primary">System Permissions</h1>
        <p class="m-0 text-sm text-text-secondary">View all available system permissions.</p>
      </div>
      <button @click="handleBack" class="px-4 py-2 bg-bg-light text-text-primary border border-border rounded-lg font-medium hover:bg-bg-white transition-all">
        Back
      </button>
    </header>

    <div v-if="permissionStore.loading" class="text-center py-12 text-text-muted">
      <p>Loading permissions...</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Filters -->
      <div class="bg-bg-light border border-border rounded-xl p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Search</label>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search permissions..." 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-text-secondary mb-2">Category</label>
            <select 
              v-model="selectedCategory" 
              class="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option v-for="category in categories" :key="category" :value="category">
                {{ category === 'all' ? 'All Categories' : category }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="flex gap-2 flex-wrap">
        <button 
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="selectedCategory === category ? 'bg-primary text-white' : 'bg-bg-light text-text-primary'"
          class="px-4 py-2 rounded-lg font-medium text-sm transition-all"
        >
          {{ category === 'all' ? 'All' : category }}
        </button>
      </div>

      <!-- Permissions Grid -->
      <div v-if="filteredPermissions.length === 0" class="text-center py-12 text-text-muted">
        <p>No permissions found matching your criteria.</p>
      </div>

      <div v-else>
        <div v-for="(perms, category) in permissionStore.permissionsByCategory" :key="category" class="mb-6">
          <div v-if="selectedCategory === 'all' || selectedCategory === category">
            <h3 class="mb-4 text-lg font-bold text-text-primary">{{ category }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="perm in perms" 
                :key="perm.id"
                class="bg-bg-light border border-border rounded-lg p-4 hover:border-primary transition-all"
              >
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                    {{ perm.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-text-primary">{{ perm.name }}</h4>
                    <p class="text-sm text-text-secondary mt-1">{{ perm.description }}</p>
                  </div>
                </div>
              </div>
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
