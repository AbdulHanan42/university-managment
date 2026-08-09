<script setup>
defineProps({
  navigation: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <p class="eyebrow">University management</p>
      <h1>Smart UMS</h1>
      <p class="subtitle">One place to run admissions, academics, finance, and campus services.</p>
    </div>

    <nav class="nav-groups">
      <div v-for="group in navigation" :key="group.title" class="nav-group">
        <h2>{{ group.title }}</h2>
        <router-link
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          active-class="active"
          exact-active-class="active"
        >
          {{ item.label }}
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  background: #071a3a;
  color: #f8fbff;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.brand {
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  padding-bottom: 1rem;
}

.eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  opacity: 0.7;
}

h1 {
  margin: 0;
  font-size: 1.4rem;
}

.subtitle {
  margin: 0.4rem 0 0;
  font-size: 0.95rem;
  line-height: 1.5;
  opacity: 0.8;
}

.nav-groups {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-group h2 {
  margin: 0 0 0.5rem;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.65;
}

.nav-link {
  display: block;
  color: #dce9ff;
  text-decoration: none;
  padding: 0.7rem 0.8rem;
  border-radius: 0.7rem;
  margin-bottom: 0.35rem;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  background: #17376f;
  color: #fff;
}
</style>
