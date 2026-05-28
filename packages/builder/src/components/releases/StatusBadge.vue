<template>
  <span
    class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-[0.02em]"
    :class="style.class"
  >
    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="style.dot" />
    {{ style.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ReleaseStatus } from '@release-hub/shared'

const props = defineProps<{ status: ReleaseStatus }>()

const style = computed(() => {
  const map: Record<ReleaseStatus, { class: string; dot: string; label: string }> = {
    draft:            { class: 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-300/70',   dot: 'bg-gray-400',   label: 'Draft' },
    pending_approval: { class: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-300/70', dot: 'bg-amber-400',  label: 'Pending' },
    approved:         { class: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-300/70',    dot: 'bg-blue-500',   label: 'Approved' },
    published:        { class: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-300/70', dot: 'bg-green-500',  label: 'Published' },
    archived:         { class: 'bg-gray-100 text-gray-400 ring-1 ring-inset ring-gray-200/70',   dot: 'bg-gray-300',   label: 'Archived' },
  }
  return map[props.status]
})
</script>
