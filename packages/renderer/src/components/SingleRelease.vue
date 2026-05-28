<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- Template content -->
    <div class="flex-1 overflow-hidden">
      <TemplateMultiple
        v-if="release.go_live_type === 'multiple'"
        :content="release.content"
        :image-size="release.image_size ?? null"
      />
      <component v-else :is="templateComponent" :content="release.content" :image-size="release.image_size ?? null" />
    </div>

    <!-- Footer -->
    <div class="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-end bg-white">
      <button
        type="button"
        class="px-5 py-2 text-sm font-semibold text-white bg-[#6BAC1B] hover:bg-[#5a9217] rounded-lg transition-colors"
        @click="$emit('acknowledge')"
      >
        Got it
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ActiveReleaseItem, Template } from '@release-hub/shared'
import TemplateA from './templates/TemplateA.vue'
import TemplateB from './templates/TemplateB.vue'
import TemplateC from './templates/TemplateC.vue'
import TemplateMultiple from './templates/TemplateMultiple.vue'

const props = defineProps<{ release: ActiveReleaseItem }>()

defineEmits<{
  dismiss: []
  acknowledge: []
}>()

const templateMap: Record<Template, unknown> = { A: TemplateA, B: TemplateB, C: TemplateC }
const templateComponent = computed(() => templateMap[props.release.template])
</script>
