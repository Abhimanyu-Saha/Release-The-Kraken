import { ref } from 'vue'
import { useUiStore } from '../stores/ui.store'

export function useImageUpload() {
  const uploading = ref(false)
  const progress = ref(0)
  const ui = useUiStore()

  function upload(file: File): Promise<{ url: string; media_type: 'image' }> {
    return new Promise((resolve, reject) => {
      const form = new FormData()
      form.append('file', file)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/media/upload')

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          progress.value = Math.round((e.loaded / e.total) * 100)
        }
      })

      xhr.addEventListener('load', () => {
        uploading.value = false
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          const msg = JSON.parse(xhr.responseText)?.error ?? 'Upload failed'
          ui.addToast(msg, 'error')
          reject(new Error(msg))
        }
      })

      xhr.addEventListener('error', () => {
        uploading.value = false
        ui.addToast('Upload failed', 'error')
        reject(new Error('Upload failed'))
      })

      uploading.value = true
      progress.value = 0
      xhr.send(form)
    })
  }

  return { upload, uploading, progress }
}
