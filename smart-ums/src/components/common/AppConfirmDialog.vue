<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="modal-icon" :class="`icon--${type}`">
              <span v-if="type === 'danger'">⚠</span>
              <span v-else-if="type === 'warning'">⚠</span>
              <span v-else>?</span>
            </div>
            <h3 class="modal-title">{{ title }}</h3>
          </div>

          <div class="modal-body">
            <p class="modal-message">{{ message }}</p>
            <p v-if="detail" class="modal-detail">{{ detail }}</p>
          </div>

          <div class="modal-footer">
            <button @click="handleCancel" class="btn btn--cancel">
              {{ cancelText }}
            </button>
            <button @click="handleConfirm" :class="['btn', `btn--${type}`]">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 480px;
  width: 100%;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease;
}

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

.modal-header {
  padding: 24px 24px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.icon--danger {
  background: #fee2e2;
  color: #ef4444;
}

.icon--warning {
  background: #fef3c7;
  color: #f59e0b;
}

.icon--primary {
  background: #dbeafe;
  color: #3b82f6;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.modal-body {
  padding: 0 24px 24px;
}

.modal-message {
  margin: 0 0 8px;
  font-size: 15px;
  color: #4b5563;
  line-height: 1.6;
}

.modal-detail {
  margin: 0;
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  min-width: 100px;
}

.btn--cancel {
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn--cancel:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn--primary {
  background: #3b82f6;
  color: white;
}

.btn--primary:hover {
  background: #2563eb;
}

.btn--danger {
  background: #ef4444;
  color: white;
}

.btn--danger:hover {
  background: #dc2626;
}

.btn--warning {
  background: #f59e0b;
  color: white;
}

.btn--warning:hover {
  background: #d97706;
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
  .modal-container {
    margin: 16px;
    max-width: none;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
