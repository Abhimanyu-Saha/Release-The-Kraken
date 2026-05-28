<template>
  <div class="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
    <!-- Preview header -->
    <div class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
      <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Preview</span>
      <div class="flex items-center gap-3">
        <!-- Open in window button -->
        <button
          type="button"
          class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#262A20] font-medium transition-colors"
          title="Open modal in a new window"
          @click="openInWindow"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open in window
        </button>
        <!-- Traffic lights -->
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span class="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
      </div>
    </div>

    <!-- Modal preview shell -->
    <div class="flex-1 flex items-center justify-center p-6 overflow-hidden">
      <div class="tmpl-modal-shell w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style="height: 420px;">

        <!-- Multiple go-live: mini sidebar + content -->
        <div v-if="isMultiple" class="flex-1 flex overflow-hidden min-h-0">
          <!-- Mini sidebar (only when sections exist) -->
          <div v-if="props.formData.sections.length > 0" class="w-32 shrink-0 border-r border-gray-100 flex flex-col bg-white overflow-y-auto">
            <div class="px-3 pt-3 pb-2">
              <p style="font-size: 0.875rem; font-weight: 700; color: #508014; letter-spacing: -0.015em; margin: 0;">What's new!</p>
            </div>
            <ul class="flex-1 px-1">
              <li v-for="(section, i) in props.formData.sections" :key="section.id">
                <button
                  type="button"
                  class="w-full text-left text-[10px] py-2 pl-2.5 pr-2 border-l-2 rounded-r transition-colors"
                  :class="i === props.activeSectionIndex
                    ? 'border-[#6BAC1B] bg-[#eef7db] text-[#3d6710] font-semibold'
                    : 'border-transparent text-gray-500'"
                >
                  <span class="block truncate leading-snug">{{ section.title || `Section ${i + 1}` }}</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- Content area -->
          <div class="flex-1 flex flex-col overflow-hidden min-w-0">
            <div class="flex-1 overflow-hidden">
              <TemplateMultiple
                v-if="activeSectionContent"
                :content="activeSectionContent"
                :image-size="activeSectionImageSize"
              />
              <div v-else class="h-full flex items-center justify-center text-xs text-gray-400">
                Add a section to preview
              </div>
            </div>
            <!-- Footer -->
            <div class="shrink-0 px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-white">
              <span class="text-[9px] text-gray-400 italic">Preview only</span>
              <div class="flex items-center gap-1.5">
                <span class="px-2.5 py-1 text-[10px] font-medium text-gray-600 border border-gray-300 rounded-md">Back</span>
                <span class="px-2.5 py-1 text-[10px] font-semibold text-white bg-[#6BAC1B] rounded-md">Next</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Single go-live: template content -->
        <template v-else>
          <div class="flex-1 overflow-hidden">
            <component :is="currentTemplate" :content="previewContent" />
          </div>
          <!-- Footer -->
          <div class="shrink-0 px-4 py-3 border-t border-gray-100 flex items-center justify-end bg-white">
            <span class="px-2.5 py-1 text-[10px] font-semibold text-white bg-[#6BAC1B] rounded-md">Got it</span>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ReleaseContent, ImageSize } from '@release-hub/shared'
import type { FormData } from '../../composables/useReleaseForm'
import TemplateA from '@renderer/components/templates/TemplateA.vue'
import TemplateB from '@renderer/components/templates/TemplateB.vue'
import TemplateC from '@renderer/components/templates/TemplateC.vue'
import TemplateMultiple from '@renderer/components/templates/TemplateMultiple.vue'

const props = defineProps<{
  formData: FormData
  activeSectionIndex: number
}>()

const templateMap = { A: TemplateA, B: TemplateB, C: TemplateC }

const isMultiple = computed(() => props.formData.go_live_type === 'multiple')

const currentTemplate = computed(() => templateMap[props.formData.template])

const previewContent = computed<ReleaseContent>(() => ({
  heading: props.formData.heading || 'Your heading here…',
  body: props.formData.body || null,
  bullet_list: props.formData.bullet_list.filter(Boolean).length
    ? props.formData.bullet_list.filter(Boolean)
    : null,
  media_url: props.formData.media_url,
  media_type: props.formData.media_type,
  ctas: props.formData.ctas.length > 0 ? props.formData.ctas : null,
  chip: null,
  sections: null,
}))

const activeSection = computed(() => props.formData.sections[props.activeSectionIndex] ?? null)

const activeSectionContent = computed<ReleaseContent | null>(() => {
  const s = activeSection.value
  if (!s) return null
  return {
    heading: s.heading || 'Section heading…',
    body: s.body || null,
    bullet_list: s.bullet_list,
    media_url: s.media_url,
    media_type: s.media_type,
    ctas: s.ctas ?? null,
    chip: s.chip ?? null,
    sections: null,
  }
})

const activeSectionImageSize = computed<ImageSize | null>(
  () => activeSection.value?.image_size ?? null
)

function openInWindow() {
  const previewPayload = isMultiple.value
    ? {
        template: props.formData.template,
        go_live_type: props.formData.go_live_type,
        image_size: props.formData.image_size,
        content: {
          ...previewContent.value,
          sections: props.formData.sections,
        },
        activeSectionIndex: props.activeSectionIndex,
      }
    : {
        template: props.formData.template,
        go_live_type: props.formData.go_live_type,
        image_size: props.formData.image_size,
        content: previewContent.value,
      }

  localStorage.setItem('rh_preview_data', JSON.stringify(previewPayload))
  window.open('/preview', '_blank', 'width=1040,height=840,noopener')
}
</script>
