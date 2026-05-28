import { defineStore } from 'pinia'
import { ref } from 'vue'
import client from '../api/client'
import type { SettingsResponse } from '@release-hub/shared'

export const useSettingsStore = defineStore('settings', () => {
  const sidebarEnabled = ref(true)
  const loaded = ref(false)

  async function fetchSettings() {
    const { data } = await client.get<SettingsResponse>('/settings')
    sidebarEnabled.value = data.sidebar_enabled
    loaded.value = true
  }

  async function setSidebarEnabled(val: boolean) {
    sidebarEnabled.value = val
    await client.put<SettingsResponse>('/settings', { sidebar_enabled: val })
  }

  return { sidebarEnabled, loaded, fetchSettings, setSidebarEnabled }
})
