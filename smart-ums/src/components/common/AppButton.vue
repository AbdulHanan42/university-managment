<script setup>
import { computed } from 'vue'

defineOptions({ name: 'AppButton' })

const props = defineProps({
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
})

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center border-none rounded-full font-semibold cursor-pointer transition-all'
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  }
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-blue-50 text-blue-600',
    ghost: 'bg-transparent text-blue-600 border border-blue-100'
  }
  
  let classes = `${baseClasses} ${sizeClasses[props.size]} ${variantClasses[props.variant]}`
  
  if (props.disabled) {
    classes += ' opacity-60 cursor-not-allowed'
  }
  
  if (props.block) {
    classes += ' w-full'
  }
  
  return classes
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
  >
    <slot />
  </button>
</template>
