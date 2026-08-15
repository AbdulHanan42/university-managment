<template>
  <Transition name="toast">
    <div v-if="visible" :class="['toast', `toast--${type}`]">
      <div class="toast-icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else-if="type === 'warning'">⚠</span>
        <span v-else>ℹ</span>
      </div>
      <div class="toast-content">
        <h4 v-if="title" class="toast-title">{{ title }}</h4>
        <p class="toast-message">{{ message }}</p>
      </div>
      <button @click="close" class="toast-close" aria-label="Close">×</button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 320px;
  max-width: 480px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  z-index: 9999;
  border-left: 4px solid;
}

.toast--success {
  border-left-color: #10b981;
}

.toast--success .toast-icon {
  background: #d1fae5;
  color: #10b981;
}

.toast--error {
  border-left-color: #ef4444;
}

.toast--error .toast-icon {
  background: #fee2e2;
  color: #ef4444;
}

.toast--warning {
  border-left-color: #f59e0b;
}

.toast--warning .toast-icon {
  background: #fef3c7;
  color: #f59e0b;
}

.toast--info {
  border-left-color: #3b82f6;
}

.toast--info .toast-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.toast-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.toast-message {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.toast-close {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.toast-close:hover {
  background: #f3f4f6;
  color: #4b5563;
}

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
  .toast {
    left: 16px;
    right: 16px;
    min-width: auto;
    max-width: none;
  }
}
</style>
