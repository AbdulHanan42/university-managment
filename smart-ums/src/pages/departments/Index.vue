<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  summaryCards: {
    type: Array,
    default: () => [
      { title: 'Managed departments', value: 14, subtitle: 'Across 4 faculties' },
      { title: 'Department heads', value: 12, subtitle: 'Assigned and active' },
      { title: 'Pending reviews', value: 3, subtitle: 'Staffing updates' }
    ]
  }
})

const summaryCards = ref(props.summaryCards)

watch(
  () => props.summaryCards,
  (newCards) => {
    summaryCards.value = newCards
  },
  { immediate: true }
)
</script>

<template>
  <section class="page-card">
    <header class="page-header">
      <div>
        <p class="eyebrow">Department management</p>
        <h1>Departments</h1>
        <p>Coordinate colleges, departments, faculty heads, and academic resources.</p>
      </div>
    </header>

    <div class="card-grid">
      <article v-for="card in summaryCards" :key="card.title" class="summary-card">
        <h2>{{ card.title }}</h2>
        <p class="value">{{ card.value }}</p>
        <span>{{ card.subtitle }}</span>
      </article>
    </div>
  </section>
</template>

<style scoped>
.page-card { background: white; border: 1px solid #dfe7fb; border-radius: 1.2rem; padding: 1.25rem; box-shadow: 0 16px 40px rgba(20, 33, 61, 0.06); }
.page-header { margin-bottom: 1rem; }
.eyebrow { margin: 0 0 0.25rem; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.2em; color: #60708f; }
h1 { margin: 0 0 0.4rem; }
.card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
.summary-card { background: #f6f9ff; border-radius: 1rem; padding: 1rem; }
.summary-card h2 { margin: 0 0 0.4rem; font-size: 1rem; color: #5d6d8f; }
.value { margin: 0 0 0.2rem; font-size: 1.5rem; font-weight: 700; color: #14213d; }
</style>
