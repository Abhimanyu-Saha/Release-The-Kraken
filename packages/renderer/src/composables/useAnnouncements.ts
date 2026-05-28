import axios from 'axios'
import type { ActiveReleaseResponse } from '@release-hub/shared'
import { useAnnouncementsStore } from '../stores/announcements.store'
import { useClientId } from './useClientId'

export function useAnnouncements() {
  const store = useAnnouncementsStore()

  async function bootstrap(apiBaseUrl: string) {
    if (store.sessionFetched) return
    const clientId = useClientId()
    try {
      const { data } = await axios.get<ActiveReleaseResponse>(
        `${apiBaseUrl}/runtime/active-release`,
        { params: { clientId } }
      )
      store.setReleases(data.releases, data.sidebar_enabled ?? true)
    } catch {
      store.sessionFetched = true
    }
  }

  return { bootstrap }
}
