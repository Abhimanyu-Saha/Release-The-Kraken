import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])

  function addToast(message: string, type: Toast['type'] = 'info') {
    const id = crypto.randomUUID()
    toasts.value.push({ id, message, type })
    setTimeout(() => removeToast(id), 4000)
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, addToast, removeToast }
})
