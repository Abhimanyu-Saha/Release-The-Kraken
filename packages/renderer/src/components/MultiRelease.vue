<template>
  <div class="h-full flex overflow-hidden">
    <!-- Sidebar: shows sections (if current release has sections) or releases -->
    <ReleaseSidebar
      v-if="store.sidebarEnabled"
      :items="sidebarItems"
      :current-index="sidebarCurrentIndex"
      @select="onSidebarSelect($event)"
    />

    <!-- Right content panel -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- Template content -->
      <div class="flex-1 overflow-hidden">
        <Transition name="section-fade" mode="out-in">
          <!-- Section-based: show the current section's content -->
          <TemplateMultiple
            v-if="store.hasSections && store.currentSection"
            :key="`section-${store.currentSectionIndex}`"
            :content="sectionAsContent"
            :image-size="store.currentSection.image_size ?? null"
          />
          <!-- Release-based go_live_type=multiple (no sections defined) -->
          <TemplateMultiple
            v-else-if="store.current && store.current.go_live_type === 'multiple'"
            :key="`release-multi-${store.currentIndex}`"
            :content="store.current.content"
            :image-size="store.current.image_size ?? null"
          />
          <!-- Single template for single releases in a multi-release queue -->
          <component
            :is="templateComponent"
            v-else-if="store.current"
            :key="`release-single-${store.currentIndex}`"
            :content="store.current.content"
          />
        </Transition>
      </div>

      <!-- Footer -->
      <div class="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-end bg-white">
        <div class="flex items-center gap-2">
          <!-- Back: section-aware -->
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="isAtStart"
            @click="handleBack"
          >
            Back
          </button>

          <!-- Next / Got it: section-aware -->
          <button
            type="button"
            class="px-5 py-2 text-sm font-semibold text-white bg-[#6BAC1B] hover:bg-[#5a9217] rounded-lg transition-colors"
            @click="handleNext"
          >
            {{ isAtEnd ? 'Got it' : 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Template, ReleaseContent } from '@release-hub/shared'
import { useAnnouncementsStore } from '../stores/announcements.store'
import ReleaseSidebar from './ReleaseSidebar.vue'
import TemplateA from './templates/TemplateA.vue'
import TemplateB from './templates/TemplateB.vue'
import TemplateC from './templates/TemplateC.vue'
import TemplateMultiple from './templates/TemplateMultiple.vue'

const emit = defineEmits<{
  dismiss: []
  acknowledge: []
}>()

const store = useAnnouncementsStore()

const templateMap: Record<Template, unknown> = { A: TemplateA, B: TemplateB, C: TemplateC }
const templateComponent = computed(() =>
  store.current ? templateMap[store.current.template] : null
)

// --- Sidebar items ---
// When current release has sections, sidebar shows sections; else show releases
const sidebarItems = computed<{ id: string; title: string }[]>(() => {
  if (store.hasSections && store.currentSections) {
    return store.currentSections.map((s) => ({ id: s.id, title: s.title || 'Untitled' }))
  }
  return store.releases.map((r) => ({ id: r.id, title: r.title }))
})

const sidebarCurrentIndex = computed(() =>
  store.hasSections ? store.currentSectionIndex : store.currentIndex
)

function onSidebarSelect(index: number) {
  if (store.hasSections) {
    store.goToSection(index)
  } else {
    store.goTo(index)
  }
}

// --- Navigation state ---
const isAtStart = computed(() => {
  if (store.hasSections) return store.isFirstSection
  return store.currentIndex === 0
})

const isAtEnd = computed(() => {
  if (store.hasSections) return store.isLastSection
  return store.currentIndex === store.releases.length - 1
})

function handleBack() {
  if (store.hasSections) {
    store.prevSection()
  } else {
    store.prev()
  }
}

function handleNext() {
  if (isAtEnd.value) {
    emit('acknowledge')
  } else if (store.hasSections) {
    store.nextSection()
  } else {
    store.next()
  }
}

// --- Content mapping: section → ReleaseContent shape for TemplateMultiple ---
const sectionAsContent = computed<ReleaseContent>(() => {
  const s = store.currentSection
  if (!s) return { heading: '', body: null, bullet_list: null, media_url: null, media_type: null, ctas: null, chip: null, sections: null }
  return {
    heading: s.heading,
    body: s.body,
    bullet_list: s.bullet_list,
    media_url: s.media_url,
    media_type: s.media_type,
    ctas: s.ctas ?? null,
    chip: s.chip ?? null,
    sections: null,
  }
})
</script>

<style scoped>
/* Section / release cross-fade with a subtle upward drift on enter */
.section-fade-enter-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.section-fade-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.section-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.section-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
