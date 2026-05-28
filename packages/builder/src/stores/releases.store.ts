import { defineStore } from 'pinia'
import { ref } from 'vue'
import client from '../api/client'
import { useUiStore } from './ui.store'
import type { ReleaseWithContent, ReleasePayload } from '@release-hub/shared'

export const useReleasesStore = defineStore('releases', () => {
  const list = ref<ReleaseWithContent[]>([])
  const current = ref<ReleaseWithContent | null>(null)
  const loading = ref(false)

  async function fetchList() {
    loading.value = true
    try {
      const { data } = await client.get<{ releases: ReleaseWithContent[] }>('/releases')
      list.value = data.releases
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string) {
    const { data } = await client.get<ReleaseWithContent>(`/releases/${id}`)
    current.value = data
    return data
  }

  async function createRelease(payload: ReleasePayload): Promise<ReleaseWithContent> {
    const { data } = await client.post<ReleaseWithContent>('/releases', payload)
    list.value.unshift(data)
    current.value = data
    return data
  }

  async function updateRelease(id: string, payload: Partial<ReleasePayload>): Promise<ReleaseWithContent> {
    const { data } = await client.put<ReleaseWithContent>(`/releases/${id}`, payload)
    const idx = list.value.findIndex((r) => r.id === id)
    if (idx >= 0) list.value[idx] = data
    current.value = data
    return data
  }

  async function transition(id: string, action: string): Promise<ReleaseWithContent> {
    const ui = useUiStore()
    try {
      const { data } = await client.post<ReleaseWithContent>(`/releases/${id}/${action}`)
      const idx = list.value.findIndex((r) => r.id === id)
      if (idx >= 0) list.value[idx] = data
      if (current.value?.id === id) current.value = data
      return data
    } catch (err: any) {
      ui.addToast(err?.response?.data?.error ?? 'Action failed', 'error')
      throw err
    }
  }

  const submit = (id: string) => transition(id, 'submit')
  const approve = (id: string) => transition(id, 'approve')
  const reject = (id: string) => transition(id, 'reject')
  const publish = (id: string) => transition(id, 'publish')
  const archive = (id: string) => transition(id, 'archive')

  async function deleteRelease(id: string) {
    await client.delete(`/releases/${id}`)
    list.value = list.value.filter((r) => r.id !== id)
    if (current.value?.id === id) current.value = null
  }

  return { list, current, loading, fetchList, fetchOne, createRelease, updateRelease, submit, approve, reject, publish, archive, deleteRelease }
})
