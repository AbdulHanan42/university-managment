<script setup>
defineProps({
  navigation: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <aside class="bg-[#071a3a] text-blue-50 p-6 flex flex-col gap-5">
    <div class="border-b border-white/16 pb-4">
      <p class="mb-1 text-xs uppercase tracking-widest opacity-70">University management</p>
      <h1 class="m-0 text-2xl">Smart UMS</h1>
      <p class="mt-2 text-sm leading-relaxed opacity-80">One place to run admissions, academics, finance, and campus services.</p>
    </div>

    <nav class="flex flex-col gap-4">
      <div v-for="group in navigation" :key="group.title" class="flex flex-col gap-2">
        <h2 class="m-0 mb-2 text-xs uppercase tracking-wider opacity-65">{{ group.title }}</h2>
        <router-link
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="block text-blue-200 no-underline px-3 py-2 rounded-lg mb-1 transition-all hover:bg-[#17376f] hover:text-white"
          active-class="bg-[#17376f] text-white"
          exact-active-class="bg-[#17376f] text-white"
        >
          {{ item.label }}
        </router-link>
      </div>
    </nav>
  </aside>
</template>
