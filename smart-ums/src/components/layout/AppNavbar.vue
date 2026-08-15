<script setup>
import AppButton from '@/components/common/AppButton.vue'

defineProps({
  title: {
    type: String,
    default: 'Dashboard',
  },
})
</script>

<template>
  <header class="flex justify-between items-center px-6 py-4 bg-white/75 backdrop-blur-md border-b border-blue-100">
    <div>
      <p class="mb-1 text-xs uppercase tracking-widest text-gray-500">Operations center</p>
      <h2 class="m-0 text-xl">{{ title }}</h2>
    </div>

    <div class="flex items-center gap-3">
      <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">Live data</span>
      <AppButton>Quick action</AppButton>
    </div>
  </header>
</template>
