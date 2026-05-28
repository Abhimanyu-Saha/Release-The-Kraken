<template>
  <div class="h-full scroll-outer">
    <div ref="scrollEl" class="scroll-inner">
      <!-- Media top — scale-settle entrance -->
      <div v-if="content.media_url" class="tmpl-in-media w-full shrink-0" :style="{ height: mediaHeight }">
        <MediaRenderer :media-url="content.media_url" :media-type="content.media_type" />
      </div>
      <!-- Text content — staggered presentation -->
      <div class="flex flex-col p-8 gap-4">
        <div class="tmpl-in tmpl-d1 flex flex-col gap-2">
          <SectionChip v-if="content.chip" :type="content.chip" />
          <h2 class="text-[26px] font-medium text-[#3C492C] [line-height:1.18] [letter-spacing:-0.01em]">{{ content.heading }}</h2>
        </div>
        <div v-if="content.body" class="tmpl-in tmpl-d2 text-gray-600 text-lg leading-normal max-w-[65ch] prose-body" v-html="content.body" />
        <div class="tmpl-in tmpl-d3 pt-4">
          <CtaButton :ctas="content.ctas" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ReleaseContent, ImageSize } from '@release-hub/shared'
import MediaRenderer from '../shared/MediaRenderer.vue'
import CtaButton from '../shared/CtaButton.vue'
import SectionChip from '../shared/SectionChip.vue'
import { useScrollHint } from '../../composables/useScrollHint'

const props = defineProps<{
  content: ReleaseContent
  imageSize?: ImageSize | null
}>()

const mediaHeight = computed(() => {
  if (props.imageSize === 'large') return '480px'
  if (props.imageSize === 'medium') return '380px'
  return '240px'
})

const scrollEl = ref<HTMLElement | null>(null)
useScrollHint(scrollEl)
</script>
