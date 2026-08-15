<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppNavbar from './components/layout/AppNavbar.vue'
import AppFooter from './components/layout/AppFooter.vue'

const route = useRoute()

const navigation = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: '/' },
      { label: 'Reports', to: '/reports' },
    ],
  },
  {
    title: 'Academic Operations',
    items: [
      { label: 'Students', to: '/students' },
      { label: 'Faculty', to: '/faculty' },
      { label: 'Departments', to: '/departments' },
      { label: 'Programs', to: '/programs' },
      { label: 'Courses', to: '/courses' },
      { label: 'Enrollment', to: '/enrollment' },
      { label: 'Attendance', to: '/attendance' },
      { label: 'Examinations', to: '/examinations' },
    ],
  },
  {
    title: 'Support Services',
    items: [
      { label: 'Fees', to: '/fees' },
      { label: 'Library', to: '/library' },
      { label: 'Hostel', to: '/hostel' },
      { label: 'Transport', to: '/transport' },
      { label: 'Leaves', to: '/leaves' },
      { label: 'Notices', to: '/notices' },
    ],
  },
]

const pageTitle = computed(() => {
  const current = navigation
    .flatMap((section) => section.items)
    .find((item) => item.to === route.path)

  return current?.label ?? 'Smart UMS'
})
</script>

<template>
  <div class="grid grid-cols-[280px_minmax(0,1fr)] min-h-screen bg-gradient-to-br from-blue-50/50 to-blue-100/50">
    <AppSidebar :navigation="navigation" />

    <div class="flex flex-col">
      <AppNavbar :title="pageTitle" />

      <main class="flex-1 p-6">
        <router-view />
      </main>

      <AppFooter />
    </div>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: Inter, 'Segoe UI', sans-serif;
  background: #f3f6ff;
  color: #14213d;
}

:global(*) {
  box-sizing: border-box;
}

@media (max-width: 960px) {
  .grid.grid-cols-\[280px_minmax\(0\,1fr\)\] {
    grid-template-columns: 1fr;
  }

  .p-6 {
    padding: 1rem;
  }
}
</style>
