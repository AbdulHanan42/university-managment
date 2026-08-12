<script setup>
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

const classes = ['app-button', `app-button--${props.variant}`, `app-button--${props.size}`]

if (props.block) {
  classes.push('app-button--block')
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
    class="app-button"
  >
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
}

.app-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.app-button--sm {
  padding: 0.55rem 0.9rem;
  font-size: 0.82rem;
}

.app-button--md {
  padding: 0.7rem 1rem;
  font-size: 0.95rem;
}

.app-button--lg {
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
}

.app-button--primary {
  background: #214d9c;
  color: #fff;
  box-shadow: 0 10px 20px rgba(33, 77, 156, 0.18);
}

.app-button--secondary {
  background: #eaf0ff;
  color: #214d9c;
}

.app-button--ghost {
  background: transparent;
  color: #214d9c;
  border: 1px solid #dfe7fb;
}

.app-button--block {
  width: 100%;
}
</style>
