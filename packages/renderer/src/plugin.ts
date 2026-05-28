import type { App } from 'vue'
import { createPinia } from 'pinia'
import AnnouncementModal from './components/AnnouncementModal.vue'

export interface ReleaseHubOptions {
  apiBaseUrl: string
}

export function createReleaseHub(options: ReleaseHubOptions) {
  return {
    install(app: App) {
      // Only install Pinia if the host app hasn't already done so
      if (!('$pinia' in app.config.globalProperties)) {
        app.use(createPinia())
      }

      app.component('AnnouncementModal', AnnouncementModal)
      app.provide('rhApiBaseUrl', options.apiBaseUrl)
    },
  }
}
