<template>
  <button
    v-if="canShow"
    :class="buttonClass"
    :disabled="disabled || !hasAccess"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { usePermission } from '@/composables/usePermission'

const props = defineProps({
  permission: {
    type: String,
    required: true
  },
  ownerId: {
    type: [String, Number],
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success'].includes(value)
  }
})

const emit = defineEmits(['click'])

const { canAccess } = usePermission()

const hasAccess = computed(() => {
  return canAccess(props.permission, props.ownerId).value
})

const canShow = computed(() => {
  return hasAccess.value
})

const buttonClass = computed(() => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg',
    success: 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
  }
  
  return `${baseClasses} ${variantClasses[props.variant]}`
})

function handleClick(event) {
  if (!hasAccess.value) return
  emit('click', event)
}
</script>
