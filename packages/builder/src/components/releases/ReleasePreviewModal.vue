<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="release"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        @click.self="emit('close')"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style="width: min(960px, 92vw); height: min(760px, 82vh)"
          role="dialog"
          aria-modal="true"
          aria-label="Release announcement preview"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
            <span class="text-xs text-gray-400 font-medium">Release announcement preview</span>
            <button
              ref="closeBtn"
              type="button"
              class="text-gray-400 hover:text-gray-600 transition-colors rounded-md p-0.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#262A20]"
              aria-label="Close preview"
              @click="emit('close')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-hidden">

            <!-- ── Multiple go-live: sidebar + section template ── -->
            <div v-if="isMultiple" class="h-full flex overflow-hidden">
              <!-- Sidebar -->
              <div class="w-60 shrink-0 flex flex-col bg-white border-r border-gray-100">
                <div class="flex flex-col flex-1 px-5 pt-5 pb-0 overflow-hidden">
                  <div class="pb-3 shrink-0">
                    <p style="font-size: 1.125rem; font-weight: 600; color: #508014; letter-spacing: -0.015em; margin: 0;">What's new!</p>
                  </div>
                  <ul class="flex-1 overflow-y-auto">
                    <li v-for="(section, i) in sections" :key="section.id">
                      <button
                        type="button"
                        class="w-full text-left text-sm py-2.5 pl-4 pr-3 border-l-4 rounded-r transition-colors"
                        :class="i === activeSectionIdx
                          ? 'border-[#6BAC1B] bg-[#eef7db] text-[#3d6710] font-semibold'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
                        @click="activeSectionIdx = i"
                      >
                        <span class="block truncate leading-snug">{{ section.title || 'Untitled' }}</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Right panel: template + navigation -->
              <div class="flex-1 flex flex-col overflow-hidden min-w-0">
                <div class="flex-1 overflow-hidden">
                  <Transition name="section-fade" mode="out-in">
                    <TemplateMultiple
                      :key="activeSectionIdx"
                      :content="activeSectionContent"
                      :image-size="activeSectionImageSize"
                    />
                  </Transition>
                </div>
                <div class="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                  <span class="text-xs text-gray-400 italic">Preview only</span>
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
                      @click="activeSectionIdx < sections.length - 1 ? activeSectionIdx++ : null"
                    >
                      {{ activeSectionIdx === sections.length - 1 ? 'Got it' : 'Next' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── Single go-live: full-width template ── -->
            <div v-else class="h-full flex flex-col overflow-hidden">
              <div class="flex-1 overflow-hidden">
                <component
                  :is="templateComponent"
                  :content="singleContent"
                  :image-size="release.image_size ?? null"
                />
              </div>
              <div class="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                <span class="text-xs text-gray-400 italic">Preview only</span>
                <button
                  type="button"
                  class="px-5 py-2 text-sm font-semibold text-white bg-[#6BAC1B] rounded-lg cursor-default"
                >
                  Got it
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import type { ReleaseWithContent, ReleaseContent, ReleaseSection, ImageSize } from '@release-hub/shared'
import TemplateA from '@renderer/components/templates/TemplateA.vue'
import TemplateB from '@renderer/components/templates/TemplateB.vue'
import TemplateC from '@renderer/components/templates/TemplateC.vue'
import TemplateMultiple from '@renderer/components/templates/TemplateMultiple.vue'

const props = defineProps<{ release: ReleaseWithContent | null }>()
const emit = defineEmits<{ close: [] }>()

const closeBtn = ref<HTMLButtonElement | null>(null)
const activeSectionIdx = ref(0)

const templateMap = { A: TemplateA, B: TemplateB, C: TemplateC }

const isMultiple = computed(() => props.release?.go_live_type === 'multiple')

const templateComponent = computed(() =>
  props.release ? templateMap[props.release.template] : null
)

const sections = computed<ReleaseSection[]>(() =>
  props.release?.content.sections ?? []
)

// Content for the currently active section (multiple releases)
const activeSectionContent = computed<ReleaseContent>(() => {
  const s = sections.value[activeSectionIdx.value]
  if (!s) return { heading: '', body: null, bullet_list: null, media_url: null, media_type: null, ctas: null, chip: null, sections: null }
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
})

const activeSectionImageSize = computed<ImageSize | null>(() =>
  sections.value[activeSectionIdx.value]?.image_size ?? null
)

// Content for single releases
const singleContent = computed<ReleaseContent>(() =>
  props.release
    ? {
        heading: props.release.content.heading || 'Your heading here…',
        body: props.release.content.body,
        bullet_list: props.release.content.bullet_list,
        media_url: props.release.content.media_url,
        media_type: props.release.content.media_type,
        ctas: props.release.content.ctas ?? null,
        chip: props.release.content.chip ?? null,
        sections: props.release.content.sections ?? null,
      }
    : { heading: '', body: null, bullet_list: null, media_url: null, media_type: null, ctas: null, chip: null, sections: null }
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.release,
  (val) => {
    if (val) {
      activeSectionIdx.value = 0   // reset section index whenever a new release is previewed
      document.addEventListener('keydown', onKeydown)
      setTimeout(() => closeBtn.value?.focus(), 50)
    } else {
      document.removeEventListener('keydown', onKeydown)
    }
  }
)

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
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
