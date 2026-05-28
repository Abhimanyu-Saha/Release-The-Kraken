<template>
  <span
    v-if="type"
    class="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
    :class="chipStyle"
  >
    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="dotStyle" />
    {{ chipLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ type: string | null | undefined }>()

// Preset styles for the built-in chip ids
const presetStyles: Record<string, { chip: string; dot: string; label: string }> = {
  feature: {
    chip:  'bg-[oklch(97%_0.014_145)] text-[oklch(44%_0.07_145)]',
    dot:   'bg-[oklch(57%_0.13_145)]',
    label: 'New Feature',
  },
  update: {
    chip:  'bg-[oklch(97%_0.011_245)] text-[oklch(44%_0.07_245)]',
    dot:   'bg-[oklch(54%_0.12_245)]',
    label: 'New Update',
  },
  fix: {
    chip:  'bg-[oklch(97%_0.014_78)] text-[oklch(46%_0.08_78)]',
    dot:   'bg-[oklch(65%_0.14_78)]',
    label: 'New Fix',
  },
}

// Fallback for custom chips
const fallback = {
  chip: 'bg-violet-50 text-violet-700',
  dot:  'bg-violet-400',
}

const preset   = computed(() => props.type ? presetStyles[props.type] : null)
const chipStyle = computed(() => preset.value?.chip  ?? fallback.chip)
const dotStyle  = computed(() => preset.value?.dot   ?? fallback.dot)
const chipLabel = computed(() => preset.value?.label ?? props.type ?? '')
</script>
