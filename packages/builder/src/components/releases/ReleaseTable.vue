<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <!-- Loading skeleton -->
    <div v-if="store.loading" class="divide-y divide-gray-100">
      <div v-for="n in 5" :key="n" class="flex items-center gap-4 px-4 py-3 motion-safe:animate-pulse">
        <div class="flex-1 space-y-1.5">
          <div class="h-3.5 bg-gray-200 rounded w-2/3" />
          <div class="h-3 bg-gray-100 rounded w-1/4" />
        </div>
        <div class="h-5 w-16 bg-gray-200 rounded-full" />
        <div class="h-5 w-14 bg-gray-100 rounded-full" />
      </div>
    </div>

    <!-- No releases at all -->
    <div v-else-if="store.list.length === 0" class="py-20 text-center">
      <svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-sm font-medium text-gray-500">No releases yet</p>
      <p class="text-xs text-gray-400 mt-1">Create your first release to get started.</p>
    </div>

    <!-- Filters returned nothing -->
    <div v-else-if="releases.length === 0" class="py-16 text-center">
      <svg class="w-8 h-8 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p class="text-sm font-medium text-gray-500">No matching releases</p>
      <p class="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
    </div>

    <!-- Table -->
    <table v-else class="w-full text-left table-fixed">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-200">
          <th scope="col" class="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.05em]">Title</th>
          <th scope="col" class="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.05em] w-[128px]">Status</th>
          <th scope="col" class="px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.05em] w-[140px]">Go Live Type</th>
          <th scope="col" class="px-4 py-2.5 w-20" aria-label="Actions" />
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <ReleaseRow
          v-for="release in releases"
          :key="release.id"
          :release="release"
          @archive="handleArchive"
          @delete="handleDelete"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { ReleaseWithContent } from '@release-hub/shared'
import { useReleasesStore } from '../../stores/releases.store'
import ReleaseRow from './ReleaseRow.vue'

const props = defineProps<{
  releases: ReleaseWithContent[]
}>()

const store = useReleasesStore()

onMounted(() => store.fetchList())

async function handleArchive(id: string) {
  await store.archive(id)
}

async function handleDelete(id: string) {
  await store.deleteRelease(id)
}
</script>
