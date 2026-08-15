<template>
  <Transition name="toast">
    <div v-if="visible" :class="toastClasses">
      <div :class="iconClasses">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else-if="type === 'warning'">⚠</span>
        <span v-else>ℹ</span>
      </div>
      <div class="flex-1 min-w-0">
        <h4 v-if="title" class="text-sm font-semibold text-gray-900 mb-1">{{ title }}</h4>
        <p class="text-xs text-gray-600 leading-relaxed m-0">{{ message }}</p>
      </div>
      <button @click="close" class="text-gray-400 text-2xl leading-none cursor-pointer p-0 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0" aria-label="Close">×</button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

defineOptions({ name: 'AppToast' })

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 3000
  },
  onClose: {
    type: Function,
    default: null
  }
})

const visible = ref(true)
let timeoutId = null

const toastClasses = computed(() => {
  const baseClasses = 'fixed top-5 right-5 min-w-[320px] max-w-[480px] bg-white rounded-xl shadow-lg flex items-start gap-3 p-4 z-[9999] border-l-4'
  const typeClasses = {
    success: 'border-emerald-500',
    error: 'border-red-500',
    warning: 'border-amber-500',
    info: 'border-blue-500'
  }
  return `${baseClasses} ${typeClasses[props.type]}`
})

const iconClasses = computed(() => {
  const baseClasses = 'w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0'
  const typeClasses = {
    success: 'bg-emerald-100 text-emerald-600',
    error: 'bg-red-100 text-red-600',
    warning: 'bg-amber-100 text-amber-600',
    info: 'bg-blue-100 text-blue-600'
  }
  return `${baseClasses} ${typeClasses[props.type]}`
})

const close = () => {
  visible.value = false
  if (props.onClose) {
    props.onClose()
  }
}

onMounted(() => {
  if (props.duration > 0) {
    timeoutId = setTimeout(close, props.duration)
  }
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 640px) {
  .fixed.top-5.right-5 {
    left: 16px;
    right: 16px;
    min-width: auto;
    max-width: none;
  }
}
</style>
