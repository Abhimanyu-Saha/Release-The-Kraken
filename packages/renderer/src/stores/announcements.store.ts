import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ActiveReleaseItem } from '@release-hub/shared'

export const useAnnouncementsStore = defineStore('announcements', () => {
  const releases = ref<ActiveReleaseItem[]>([])
  const currentIndex = ref(0)
  const currentSectionIndex = ref(0)
  const sessionFetched = ref(false)
  const sidebarEnabled = ref(true)

  // --- Release-level ---
  const isMulti = computed(() => releases.value.length > 1)
  const current = computed(() => releases.value[currentIndex.value] ?? null)
  const isVisible = computed(() => releases.value.length > 0)

  // --- Section-level (within current release) ---
  const currentSections = computed(() => current.value?.content?.sections ?? null)
  const hasSections = computed(
    () => Boolean(currentSections.value && currentSections.value.length > 0)
  )
  const currentSection = computed(() =>
    hasSections.value ? currentSections.value![currentSectionIndex.value] ?? null : null
  )
  const isLastSection = computed(() => {
    if (!hasSections.value) return true
    return currentSectionIndex.value >= (currentSections.value!.length - 1)
  })
  const isFirstSection = computed(() => currentSectionIndex.value === 0)

  // --- Actions ---
  function setReleases(items: ActiveReleaseItem[], showSidebar = true) {
    releases.value = items
    currentIndex.value = 0
    currentSectionIndex.value = 0
    sessionFetched.value = true
    sidebarEnabled.value = showSidebar
  }

  function removeRelease(id: string) {
    const idx = releases.value.findIndex((r) => r.id === id)
    if (idx < 0) return
    releases.value.splice(idx, 1)
    if (currentIndex.value >= releases.value.length) {
      currentIndex.value = Math.max(0, releases.value.length - 1)
    }
    currentSectionIndex.value = 0
  }

  function goTo(index: number) {
    if (index >= 0 && index < releases.value.length) {
      currentIndex.value = index
      currentSectionIndex.value = 0
    }
  }

  function next() {
    goTo(currentIndex.value + 1)
  }

  function prev() {
    goTo(currentIndex.value - 1)
  }

  function goToSection(index: number) {
    if (!currentSections.value) return
    if (index >= 0 && index < currentSections.value.length) {
      currentSectionIndex.value = index
    }
  }

  function nextSection() {
    goToSection(currentSectionIndex.value + 1)
  }

  function prevSection() {
    goToSection(currentSectionIndex.value - 1)
  }

  return {
    releases,
    currentIndex,
    currentSectionIndex,
    sessionFetched,
    sidebarEnabled,
    isMulti,
    current,
    isVisible,
    currentSections,
    hasSections,
    currentSection,
    isLastSection,
    isFirstSection,
    setReleases,
    removeRelease,
    goTo,
    next,
    prev,
    goToSection,
    nextSection,
    prevSection,
  }
})
