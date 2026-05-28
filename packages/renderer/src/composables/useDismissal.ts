import axios from 'axios'
import { useAnnouncementsStore } from '../stores/announcements.store'
import { useClientId } from './useClientId'

export function useDismissal(apiBaseUrl: string) {
  const store = useAnnouncementsStore()
  const clientId = useClientId()

  async function dismiss(releaseId: string) {
    try {
      await axios.post(`${apiBaseUrl}/runtime/release/${releaseId}/dismiss`, { clientId })
    } finally {
      store.removeRelease(releaseId)
    }
  }

  async function acknowledge(releaseId: string) {
    try {
      await axios.post(`${apiBaseUrl}/runtime/release/${releaseId}/acknowledge`, { clientId })
    } finally {
      store.removeRelease(releaseId)
    }
  }

  return { dismiss, acknowledge }
}
