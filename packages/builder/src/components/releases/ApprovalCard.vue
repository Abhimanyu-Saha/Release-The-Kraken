<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="flex items-start justify-between px-5 py-4 border-b border-gray-100">
      <div>
        <h3 class="text-sm font-semibold text-gray-900">{{ release.title }}</h3>
        <div class="flex items-center gap-2 mt-1.5">
          <StatusBadge :status="release.status" />
          <span class="text-xs text-gray-400">{{ templateLabel }}</span>
        </div>
      </div>
      <RouterLink
        :to="`/releases/${release.id}/edit`"
        class="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors shrink-0 ml-4"
      >
        View / Edit
      </RouterLink>
    </div>

    <!-- Content preview -->
    <div class="px-5 py-4 space-y-2 text-sm text-gray-700">
      <p class="font-medium text-gray-900">{{ release.content.heading }}</p>
      <p v-if="release.content.body" class="text-gray-600 text-sm leading-relaxed line-clamp-3">
        {{ release.content.body }}
      </p>
      <ul v-if="release.content.bullet_list?.length" class="space-y-1">
        <li
          v-for="(item, i) in release.content.bullet_list.slice(0, 3)"
          :key="i"
          class="flex items-start gap-1.5 text-sm text-gray-600"
        >
          <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#262A20] shrink-0" />
          {{ item }}
        </li>
        <li v-if="(release.content.bullet_list?.length ?? 0) > 3" class="text-xs text-gray-400 pl-3">
          +{{ release.content.bullet_list!.length - 3 }} more…
        </li>
      </ul>
      <div v-if="release.content.ctas?.length" class="pt-1 flex flex-wrap gap-1.5">
        <span
          v-for="(cta, i) in release.content.ctas"
          :key="i"
          class="inline-flex items-center gap-1 text-sm text-[#262A20] font-medium"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {{ cta.label }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 px-5 py-3 bg-gray-50 border-t border-gray-100">
      <button
        v-if="release.status === 'pending_approval'"
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
        :disabled="busy"
        @click="handle('approve')"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Approve
      </button>
      <button
        v-if="release.status === 'pending_approval'"
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
        :disabled="busy"
        @click="handle('reject')"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Reject
      </button>
      <button
        v-if="release.status === 'approved'"
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262A20] text-white text-xs font-semibold hover:bg-[#3c4332] transition-colors disabled:opacity-50"
        :disabled="busy"
        @click="handle('publish')"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z" />
        </svg>
        Publish
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ReleaseWithContent } from '@release-hub/shared'
import StatusBadge from './StatusBadge.vue'
import { useReleasesStore } from '../../stores/releases.store'

const props = defineProps<{ release: ReleaseWithContent }>()
const emit = defineEmits<{
  approved: []
  rejected: []
  published: []
}>()

const store = useReleasesStore()
const busy = ref(false)

const templateLabel = computed(() => ({ A: 'Media top', B: 'Text only', C: 'Bullets' }[props.release.template as 'A' | 'B' | 'C'] ?? props.release.template))

async function handle(action: 'approve' | 'reject' | 'publish') {
  busy.value = true
  try {
    await store[action](props.release.id)
    if (action === 'approve') emit('approved')
    else if (action === 'reject') emit('rejected')
    else emit('published')
  } finally {
    busy.value = false
  }
}
</script>
