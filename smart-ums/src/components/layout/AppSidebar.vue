<script setup>
defineProps({
  navigation: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <aside class="fixed left-0 top-0 h-screen w-[280px] bg-[#071a3a] text-blue-50 p-6 flex flex-col gap-5 overflow-y-auto z-50">
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

<style scoped>
/* Custom Scrollbar */
aside::-webkit-scrollbar {
  width: 8px;
}

aside::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

aside::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}

aside::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.4);
  background-clip: content-box;
}
</style>
