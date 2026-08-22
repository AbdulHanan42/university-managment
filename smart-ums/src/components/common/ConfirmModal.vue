<script setup>
import { computed } from 'vue'

defineOptions({ name: 'ConfirmModal' })

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String,
    default: 'danger',
    validator: (value) => ['danger', 'warning', 'info'].includes(value)
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleBackdropClick = () => {
  emit('cancel')
}

const iconClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-100'
    case 'warning':
      return 'bg-yellow-100'
    case 'info':
      return 'bg-blue-100'
    default:
      return 'bg-gray-100'
  }
})

const buttonClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-500 hover:bg-red-600'
    case 'warning':
      return 'bg-yellow-500 hover:bg-yellow-600'
    case 'info':
      return 'bg-blue-500 hover:bg-blue-600'
    default:
      return 'bg-gray-500 hover:bg-gray-600'
  }
})
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" @click.self="handleBackdropClick">
    <div class="bg-white rounded-xl max-w-md w-[90%] p-8 animate-slide-up shadow-2xl">
      <div class="text-center mb-6">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" :class="iconClass">
          <span class="text-3xl">{{ type === 'danger' ? '⚠️' : type === 'warning' ? '⚡' : 'ℹ️' }}</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ title }}</h3>
      </div>
      
      <div class="mb-6">
        <p class="text-center text-gray-600 text-sm leading-relaxed">{{ message }}</p>
      </div>
      
      <div class="flex gap-3 justify-center">
        <button
          @click="handleCancel"
          class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          class="px-6 py-2.5 text-white rounded-lg font-medium transition-colors"
          :class="buttonClass"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-in;
}
</style>
