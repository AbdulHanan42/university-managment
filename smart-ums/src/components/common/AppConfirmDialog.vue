<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 bg Black/50 flex items-center justify-center z-[10000] p-5 backdrop-blur-sm" @click="handleOverlayClick">
        <div class="bg-white rounded-2xl shadow-2xl max-w-[480px] w-full overflow-hidden animate-modal-slide-in" @click.stop>
          <div class="p-6 pb-4 flex items-center gap-4">
            <div :class="iconClasses">
              <span v-if="type === 'danger'">⚠</span>
              <span v-else-if="type === 'warning'">⚠</span>
              <span v-else>?</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 m-0">{{ title }}</h3>
          </div>

          <div class="px-6 pb-6">
            <p class="text-base text-gray-600 leading-relaxed mb-2 m-0">{{ message }}</p>
            <p v-if="detail" class="text-xs text-gray-400 leading-relaxed m-0">{{ detail }}</p>
          </div>

          <div class="flex gap-3 p-4 bg-gray-50 border-t border-gray-200 justify-end">
            <button @click="handleCancel" class="px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all border-none min-w-[100px] bg-white text-gray-600 border border-gray-300 hover:bg-gray-100 hover:border-gray-400">
              {{ cancelText }}
            </button>
            <button @click="handleConfirm" :class="confirmButtonClasses">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'AppConfirmDialog' })

const props = defineProps({
  visible: {
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
  detail: {
    type: String,
    default: ''
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
    default: 'primary',
    validator: (value) => ['primary', 'danger', 'warning'].includes(value)
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const iconClasses = computed(() => {
  const baseClasses = 'w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0'
  const typeClasses = {
    danger: 'bg-red-100 text-red-600',
    warning: 'bg-amber-100 text-amber-600',
    primary: 'bg-blue-100 text-blue-600'
  }
  return `${baseClasses} ${typeClasses[props.type]}`
})

const confirmButtonClasses = computed(() => {
  const baseClasses = 'px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all border-none min-w-[100px]'
  const typeClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    warning: 'bg-amber-600 text-white hover:bg-amber-700'
  }
  return `${baseClasses} ${typeClasses[props.type]}`
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleCancel()
  }
}
</script>

<style scoped>
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-modal-slide-in {
  animation: modalSlideIn 0.3s ease;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .max-w-\[480px\] {
    margin: 16px;
    max-width: none;
  }

  .flex.gap-3.justify-end {
    flex-direction: column-reverse;
  }

  .min-w-\[100px\] {
    width: 100%;
  }
}
</style>
