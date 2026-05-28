<template>
  <div v-if="ctas?.length" class="flex flex-wrap gap-3">
    <a
      v-for="(cta, i) in ctas"
      :key="i"
      :href="cta.url"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold
             text-[#5a9217] bg-transparent
             border-2 border-[#6BAC1B]
             transition-all duration-150 ease-out
             hover:bg-[#6BAC1B]/10 hover:-translate-y-0.5
             active:translate-y-0 active:bg-[#6BAC1B]/20"
    >
      {{ cta.label }}
    </a>
  </div>
</template>

<script setup lang="ts">
import type { CtaItem } from '@release-hub/shared'

defineProps<{
  ctas?: CtaItem[] | null
}>()
</script>
