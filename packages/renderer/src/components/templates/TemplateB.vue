<template>
  <div class="flex h-full overflow-hidden">
    <!-- Media left 50% — fade only, no Y translate for a full-height panel -->
    <div class="tmpl-in-fade w-1/2 shrink-0 h-full">
      <MediaRenderer :media-url="content.media_url" :media-type="content.media_type" />
    </div>
    <!-- Text right 50% — staggered presentation -->
    <div ref="scrollEl" class="w-1/2 flex flex-col justify-center px-10 py-8 gap-4 scroll-hover">
      <div class="tmpl-in flex flex-col gap-2">
        <SectionChip v-if="content.chip" :type="content.chip" />
        <h2 class="text-[26px] font-medium text-[#3C492C] [line-height:1.18] [letter-spacing:-0.01em]">{{ content.heading }}</h2>
      </div>
      <div v-if="content.body" class="tmpl-in tmpl-d1 text-gray-600 text-lg leading-normal max-w-[65ch] prose-body" v-html="content.body" />
      <div class="tmpl-in tmpl-d2 mt-4">
        <CtaButton :ctas="content.ctas" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ReleaseContent } from '@release-hub/shared'
import MediaRenderer from '../shared/MediaRenderer.vue'
import CtaButton from '../shared/CtaButton.vue'
import SectionChip from '../shared/SectionChip.vue'
import { useScrollHint } from '../../composables/useScrollHint'

defineProps<{ content: ReleaseContent }>()

const scrollEl = ref<HTMLElement | null>(null)
useScrollHint(scrollEl)
</script>
