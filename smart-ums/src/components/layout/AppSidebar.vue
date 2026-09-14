<script setup>
import { useTheme } from '@/composables/useTheme'

defineProps({
  navigation: {
    type: Array,
    required: true,
  },
})

const { isDark } = useTheme()
</script>

<template>
  <aside :class="['fixed left-0 top-0 h-screen w-[280px] p-6 flex flex-col gap-5 overflow-y-auto z-50 transition-colors', isDark ? 'bg-[#071a3a] text-blue-50' : 'bg-white text-gray-900 border-r border-gray-200']">
    <div :class="['border-b pb-4', isDark ? 'border-white/16' : 'border-gray-200']">
      <p :class="['mb-1 text-xs uppercase tracking-widest', isDark ? 'opacity-70' : 'text-gray-500']">University management</p>
      <h1 class="m-0 text-2xl">Smart UMS</h1>
      <p :class="['mt-2 text-sm leading-relaxed', isDark ? 'opacity-80' : 'text-gray-600']">One place to run admissions, academics, finance, and campus services.</p>
    </div>

    <nav class="flex flex-col gap-4">
      <div v-for="group in navigation" :key="group.title" class="flex flex-col gap-2">
        <h2 :class="['m-0 mb-2 text-xs uppercase tracking-wider', isDark ? 'opacity-65' : 'text-gray-500']">{{ group.title }}</h2>
        <router-link
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          :class="['block px-3 py-2 rounded-lg mb-1 transition-all no-underline', isDark ? 'text-blue-200 hover:bg-[#17376f] hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900']"
          active-class="bg-blue-600 text-white"
          exact-active-class="bg-blue-600 text-white"
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
