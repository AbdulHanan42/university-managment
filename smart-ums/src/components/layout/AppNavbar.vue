<script setup>
defineProps({
  title: {
    type: String,
    default: 'Dashboard',
  },
})
</script>

<template>
  <header class="navbar">
    <div>
      <p class="eyebrow">Operations center</p>
      <h2>{{ title }}</h2>
    </div>

    <div class="navbar-actions">
      <span class="pill">Live data</span>
      <button type="button">Quick action</button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid #dfe7fb;
}

.eyebrow {
  margin: 0 0 0.2rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  color: #5f6f92;
}

h2 {
  margin: 0;
  font-size: 1.2rem;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pill {
  background: #e8f1ff;
  color: #214d9c;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.9rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.6rem 0.9rem;
  background: #214d9c;
  color: white;
  cursor: pointer;
}
</style>
