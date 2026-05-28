<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center">
    <!-- No data state -->
    <div v-if="!data" class="text-white text-sm opacity-60">
      No preview data found. Open this from the editor.
    </div>

    <!-- Modal — matches renderer AnnouncementModal layout -->
    <div
      v-else
      class="tmpl-modal-shell bg-white rounded-2xl shadow-2xl overflow-hidden relative"
      style="width: min(960px, 92vw); height: min(760px, 82vh)"
    >
      <!-- Floating close button -->
      <button
        type="button"
        class="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 shadow-sm transition-colors"
        aria-label="Close"
        @click="window.close()"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Multi go-live layout: sidebar + content -->
      <div v-if="data.go_live_type === 'multiple'" class="h-full flex overflow-hidden">
        <!-- Sidebar -->
        <div class="w-60 shrink-0 flex flex-col bg-white border-r border-gray-100">
          <div class="flex flex-col flex-1 px-5 pt-5 pb-0">
            <div class="pb-3">
              <p style="font-size: 1.125rem; font-weight: 600; color: #508014; letter-spacing: -0.015em; margin: 0;">What's new!</p>
            </div>
            <ul class="flex-1">
              <li v-for="(item, i) in sidebarItems" :key="item.id">
                <button
                  type="button"
                  class="w-full text-left text-sm py-2.5 pl-4 pr-3 border-l-4 rounded-r transition-colors"
                  :class="i === activeSectionIdx
                    ? 'border-[#6BAC1B] bg-[#eef7db] text-[#3d6710] font-semibold'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
                  @click="activeSectionIdx = i"
                >
                  <span class="block truncate leading-snug">{{ item.title }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Right panel -->
        <div class="flex-1 flex flex-col overflow-hidden min-w-0">
          <div class="flex-1 overflow-hidden">
            <Transition name="section-fade" mode="out-in">
              <TemplateMultiple :key="activeSectionIdx" :content="activeContent" :image-size="activeImageSize" />
            </Transition>
          </div>
          <div class="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-end bg-white">
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg transition-colors disabled:opacity-40"
                :disabled="activeSectionIdx === 0"
                @click="activeSectionIdx--"
              >
                Back
              </button>
              <button
                type="button"
                class="px-5 py-2 text-sm font-semibold text-white bg-[#6BAC1B] hover:bg-[#5a9217] rounded-lg transition-colors"
                @click="activeSectionIdx < sidebarItems.length - 1 ? activeSectionIdx++ : null"
              >
                {{ activeSectionIdx === sidebarItems.length - 1 ? 'Got it' : 'Next' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Single-release layout: full width -->
      <div v-else class="h-full flex flex-col overflow-hidden">
        <div class="flex-1 overflow-hidden">
          <component :is="templateComponent" :content="activeContent" :image-size="activeImageSize" />
        </div>
        <div class="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-end bg-white">
          <button type="button" class="px-5 py-2 text-sm font-semibold text-white bg-[#6BAC1B] rounded-lg cursor-default">
            Got it
          </button>
        </div>
      </div>

      <!-- Preview watermark -->
      <div class="absolute bottom-[52px] left-0 right-0 flex justify-center pointer-events-none">
        <span class="text-[10px] text-gray-300 italic">Preview only</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ReleaseContent, ReleaseSection, Template, GoLiveType, ImageSize } from '@release-hub/shared'
import TemplateA from '@renderer/components/templates/TemplateA.vue'
import TemplateB from '@renderer/components/templates/TemplateB.vue'
import TemplateC from '@renderer/components/templates/TemplateC.vue'
import TemplateMultiple from '@renderer/components/templates/TemplateMultiple.vue'

const window = globalThis.window

interface PreviewData {
  template: Template
  go_live_type?: GoLiveType
  image_size?: ImageSize | null
  content: ReleaseContent
  activeSectionIndex?: number
}

const raw = localStorage.getItem('rh_preview_data')
const data = raw ? (JSON.parse(raw) as PreviewData) : null

const activeSectionIdx = ref(data?.activeSectionIndex ?? 0)

const sections = computed<ReleaseSection[] | null>(() => data?.content?.sections ?? null)

// Sidebar items: sections if present, else single fallback item
const sidebarItems = computed(() => {
  if (sections.value?.length) {
    return sections.value.map((s) => ({ id: s.id, title: s.title || 'Untitled' }))
  }
  return [{ id: 'root', title: data?.content?.heading || 'Release preview' }]
})

// Active content for TemplateMultiple or single templates
const activeContent = computed<ReleaseContent>(() => {
  if (!data) return { heading: '', body: null, bullet_list: null, media_url: null, media_type: null, ctas: null, chip: null, sections: null }

  if (sections.value?.length) {
    const s = sections.value[activeSectionIdx.value]
    if (s) {
      return {
        heading: s.heading || 'Section heading…',
        body: s.body,
        bullet_list: s.bullet_list,
        media_url: s.media_url,
        media_type: s.media_type,
        ctas: s.ctas ?? null,
        chip: s.chip ?? null,
        sections: null,
      }
    }
  }

  return {
    heading: data.content.heading || 'Your heading here…',
    body: data.content.body,
    bullet_list: data.content.bullet_list,
    media_url: data.content.media_url,
    media_type: data.content.media_type,
    ctas: data.content.ctas ?? null,
    chip: data.content.chip ?? null,
    sections: null,
  }
})

// Active image size: from section or release level
const activeImageSize = computed<ImageSize | null>(() => {
  if (sections.value?.length) {
    return sections.value[activeSectionIdx.value]?.image_size ?? null
  }
  return data?.image_size ?? null
})

const templateMap: Record<Template, unknown> = { A: TemplateA, B: TemplateB, C: TemplateC }
const templateComponent = computed(() => (data ? templateMap[data.template] : null))
</script>

<style scoped>
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
