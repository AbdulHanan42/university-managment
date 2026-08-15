import { h, render } from 'vue'
import AppToast from '@/components/common/AppToast.vue'

let toastContainer = null

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.style.position = 'fixed'
    toastContainer.style.top = '0'
    toastContainer.style.right = '0'
    toastContainer.style.zIndex = '9999'
    toastContainer.style.pointerEvents = 'none'
    document.body.appendChild(toastContainer)
  }
  return toastContainer
}

const showToast = (options) => {
  const container = createToastContainer()
  container.style.pointerEvents = 'none'

  const toastProps = {
    ...options,
    onClose: () => {
      if (toastWrapper && toastWrapper.parentNode) {
        render(null, toastWrapper)
        toastWrapper.parentNode.removeChild(toastWrapper)
      }
      if (options.onClose) {
        options.onClose()
      }
    }
  }

  const toastWrapper = document.createElement('div')
  toastWrapper.style.pointerEvents = 'auto'
  toastWrapper.style.marginTop = '10px'
  container.appendChild(toastWrapper)

  const toastComponent = h(AppToast, toastProps)
  render(toastComponent, toastWrapper)

  return {
    close: () => {
      if (toastProps.onClose) {
        toastProps.onClose()
      }
    }
  }
}

export const useToast = () => {
  return {
    success: (message, options = {}) => {
      return showToast({
        type: 'success',
        message,
        ...options
      })
    },
    error: (message, options = {}) => {
      return showToast({
        type: 'error',
        message,
        ...options
      })
    },
    warning: (message, options = {}) => {
      return showToast({
        type: 'warning',
        message,
        ...options
      })
    },
    info: (message, options = {}) => {
      return showToast({
        type: 'info',
        message,
        ...options
      })
    }
  }
}
