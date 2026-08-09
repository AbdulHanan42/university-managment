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
  <div class="app-shell">
    <AppSidebar :navigation="navigation" />

    <div class="main-panel">
      <AppNavbar :title="pageTitle" />

      <main class="content">
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

.app-shell {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fbff 0%, #eef3ff 100%);
}

.main-panel {
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 1.5rem;
}

@media (max-width: 960px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .content {
    padding: 1rem;
  }
}
</style>
