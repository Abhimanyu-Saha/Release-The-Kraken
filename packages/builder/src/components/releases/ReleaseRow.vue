<template>
  <tr class="hover:bg-gray-100/60 transition-colors group">
    <td class="px-4 py-3 min-w-0">
      <p class="text-sm font-semibold text-gray-900 truncate">{{ release.title }}</p>
      <p class="text-xs text-gray-500 mt-0.5 tabular-nums">{{ formattedDate }}</p>
    </td>
    <td class="px-4 py-3 whitespace-nowrap">
      <StatusBadge :status="release.status" />
    </td>
    <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
      {{ release.go_live_type === 'multiple' ? 'Multiple' : 'Single' }}
    </td>
    <td class="px-4 py-3 whitespace-nowrap text-right">
      <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          type="button"
          class="inline-flex items-center px-2 py-1 rounded-md border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1"
          title="Open preview"
          aria-label="Open preview"
          @click="openPreview"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
        <RouterLink
          :to="`/releases/${release.id}/edit`"
          class="inline-flex items-center px-2.5 py-1 rounded-md border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1"
        >
          Edit
        </RouterLink>
        <button
          v-if="release.status === 'published'"
          type="button"
          class="inline-flex items-center px-2.5 py-1 rounded-md border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1"
          @click="$emit('archive', release.id)"
        >
          Archive
        </button>
        <button
          type="button"
          class="inline-flex items-center px-2.5 py-1 rounded-md border border-red-200 bg-white text-xs font-medium text-red-500 hover:border-red-300 hover:text-red-700 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          @click="confirmDelete"
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ReleaseWithContent } from '@release-hub/shared'
import StatusBadge from './StatusBadge.vue'

const props = defineProps<{ release: ReleaseWithContent }>()
const emit = defineEmits<{ archive: [id: string]; delete: [id: string] }>()

function openPreview() {
  const payload = {
    template: props.release.template,
    go_live_type: props.release.go_live_type,
    image_size: props.release.image_size,
    content: props.release.content,
  }
  localStorage.setItem('rh_preview_data', JSON.stringify(payload))
  window.open('/preview', '_blank', 'width=1040,height=840,noopener')
}

function confirmDelete() {
  if (confirm(`Delete "${props.release.title}"? This cannot be undone.`)) {
    emit('delete', props.release.id)
  }
}

const formattedDate = computed(() => {
  const d = new Date(props.release.created_at)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})
</script>
