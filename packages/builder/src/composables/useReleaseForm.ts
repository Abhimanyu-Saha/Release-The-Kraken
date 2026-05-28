import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReleasesStore } from '../stores/releases.store'
import { useUiStore } from '../stores/ui.store'
import type { ReleaseStatus, Template, GoLiveType, ImageSize, MediaType, ChipType, ReleaseSection, CtaItem } from '@release-hub/shared'

export interface FormData {
  title: string
  template: Template
  go_live_type: GoLiveType
  image_size: ImageSize | null
  heading: string
  body: string
  bullet_list: string[]
  media_url: string | null
  media_type: MediaType | null
  ctas: CtaItem[]
  chip: ChipType | null
  sections: ReleaseSection[]
}

function blankSection(): ReleaseSection {
  return {
    id: crypto.randomUUID(),
    title: '',
    heading: '',
    body: null,
    bullet_list: null,
    media_url: null,
    media_type: null,
    ctas: null,
    image_size: null,
    chip: null,
  }
}

export function useReleaseForm(releaseId?: string, initialTitle?: string, initialGoLiveType?: GoLiveType) {
  const store = useReleasesStore()
  const ui = useUiStore()
  const router = useRouter()

  const status = ref<ReleaseStatus>('draft')
  const saving = ref(false)
  const submitting = ref(false)
  const formLoading = ref(!!releaseId)
  const savedId = ref<string | undefined>(releaseId)
  const activeSectionIndex = ref(0)

  const formData = reactive<FormData>({
    title: initialTitle ?? '',
    template: 'A',
    go_live_type: initialGoLiveType ?? 'single',
    image_size: null,
    heading: '',
    body: '',
    bullet_list: [],
    media_url: null,
    media_type: null,
    ctas: [],
    chip: null,
    sections: [],
  })

  onMounted(async () => {
    if (releaseId) {
      try {
        const release = await store.fetchOne(releaseId)
        status.value = release.status
        Object.assign(formData, {
          title: release.title,
          template: release.template,
          go_live_type: release.go_live_type,
          image_size: release.image_size ?? null,
          heading: release.content.heading,
          body: release.content.body ?? '',
          bullet_list: release.content.bullet_list ?? [],
          media_url: release.content.media_url,
          media_type: release.content.media_type,
          ctas: release.content.ctas ?? [],
          chip: release.content.chip ?? null,
          sections: release.content.sections
            ? release.content.sections.map((s) => ({ ...s }))
            : [],
        })
      } finally {
        formLoading.value = false
      }
    }
  })

  function addSection() {
    formData.sections.push(blankSection())
    activeSectionIndex.value = formData.sections.length - 1
  }

  function removeSection(index: number) {
    formData.sections.splice(index, 1)
    if (activeSectionIndex.value >= formData.sections.length) {
      activeSectionIndex.value = Math.max(0, formData.sections.length - 1)
    }
  }

  const activeSection = computed<ReleaseSection | null>(() =>
    formData.sections[activeSectionIndex.value] ?? null
  )

  const previewData = computed(() => ({
    heading: formData.heading,
    body: formData.body || null,
    bullet_list: formData.bullet_list.filter(Boolean).length ? formData.bullet_list : null,
    media_url: formData.media_url,
    media_type: formData.media_type,
    ctas: formData.ctas.length > 0 ? formData.ctas : null,
    chip: formData.chip,
    sections: formData.sections.length > 0 ? formData.sections : null,
  }))

  function buildPayload() {
    return {
      title: formData.title || 'Untitled Release',
      template: formData.template,
      go_live_type: formData.go_live_type,
      image_size: formData.image_size,
      heading: formData.heading || 'Untitled',
      body: formData.body || null,
      bullet_list: formData.bullet_list.filter(Boolean).length
        ? formData.bullet_list.filter(Boolean)
        : null,
      media_url: formData.media_url,
      media_type: formData.media_type,
      ctas: formData.ctas.length > 0 ? formData.ctas : null,
      chip: formData.chip,
      sections: formData.sections.length > 0 ? formData.sections : null,
    }
  }

  async function saveDraft() {
    saving.value = true
    try {
      if (savedId.value) {
        const updated = await store.updateRelease(savedId.value, buildPayload())
        status.value = updated.status
      } else {
        const created = await store.createRelease(buildPayload())
        savedId.value = created.id
        status.value = created.status
        router.replace(`/releases/${created.id}/edit`)
      }
      ui.addToast('Draft saved', 'success')
    } catch (err: any) {
      ui.addToast(err?.response?.data?.error ?? 'Failed to save', 'error')
    } finally {
      saving.value = false
    }
  }

  async function submitForApproval() {
    if (!savedId.value) {
      await saveDraft()
    }
    if (!savedId.value) return
    submitting.value = true
    try {
      const updated = await store.submit(savedId.value)
      status.value = updated.status
      ui.addToast('Submitted for approval', 'success')
    } finally {
      submitting.value = false
    }
  }

  return {
    formData,
    previewData,
    status,
    saving,
    submitting,
    formLoading,
    saveDraft,
    submitForApproval,
    activeSectionIndex,
    activeSection,
    addSection,
    removeSection,
  }
}
