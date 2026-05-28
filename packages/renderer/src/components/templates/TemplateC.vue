<template>
  <div ref="scrollEl" class="flex flex-col h-full scroll-hover px-10 py-8 gap-5">
    <div class="tmpl-in flex flex-col gap-2">
      <SectionChip v-if="content.chip" :type="content.chip" />
      <h2 class="text-[26px] font-medium text-[#3C492C] [line-height:1.18] [letter-spacing:-0.01em]">{{ content.heading }}</h2>
    </div>
    <div v-if="content.body" class="tmpl-in tmpl-d1 text-gray-600 text-lg leading-normal max-w-[65ch] prose-body" v-html="content.body" />
    <ul v-if="content.bullet_list?.length" class="tmpl-in tmpl-d2 space-y-2.5">
      <li
        v-for="(item, i) in content.bullet_list"
        :key="i"
        class="flex items-start gap-2 text-lg text-gray-700"
      >
        <span class="mt-1 w-1.5 h-1.5 rounded-full bg-[#6BAC1B] shrink-0" />
        {{ item }}
      </li>
    </ul>
    <div class="tmpl-in tmpl-d3 mt-auto pt-4">
      <CtaButton :ctas="content.ctas" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ReleaseContent } from '@release-hub/shared'
import CtaButton from '../shared/CtaButton.vue'
import SectionChip from '../shared/SectionChip.vue'
import { useScrollHint } from '../../composables/useScrollHint'

defineProps<{ content: ReleaseContent }>()

const scrollEl = ref<HTMLElement | null>(null)
useScrollHint(scrollEl)
</script>
