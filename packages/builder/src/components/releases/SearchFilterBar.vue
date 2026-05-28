<template>
  <div class="space-y-3">
    <!-- Search + filters row -->
    <div class="flex items-center gap-2">
      <!-- Search -->
      <div class="relative flex-1 max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          :value="search"
          placeholder="Search go lives…"
          class="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-300 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:border-transparent transition-all"
          @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- Divider -->
      <div class="h-4 w-px bg-gray-200 mx-1" />

      <!-- Date sort -->
      <FilterDropdown
        label="Date"
        :options="dateOptions"
        :model-value="dateSort"
        mode="single"
        @update:model-value="onDateSort"
      />

      <!-- Status -->
      <FilterDropdown
        label="Status"
        :options="statusOptions"
        :model-value="statuses"
        mode="multi"
        @update:model-value="onStatuses"
      />

      <!-- Result count -->
      <span class="ml-auto text-xs text-gray-400 tabular-nums shrink-0">
        {{ resultCount }} of {{ totalCount }}
      </span>
    </div>

    <!-- Active filter chips -->
    <div v-if="hasActiveFilters" class="flex items-center gap-2 flex-wrap">
      <span class="text-xs text-gray-400 font-medium">Filters:</span>

      <!-- Date chip (only when not default) -->
      <button
        v-if="dateSort !== 'newest'"
        type="button"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eaece5] text-[#262A20] text-xs font-medium hover:bg-[#e1e4da] transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1"
        @click="$emit('update:dateSort', 'newest')"
      >
        {{ dateOptions.find(o => o.value === dateSort)?.label }}
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Status chips -->
      <button
        v-for="s in statuses"
        :key="s"
        type="button"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eaece5] text-[#262A20] text-xs font-medium hover:bg-[#e1e4da] transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1"
        @click="$emit('update:statuses', statuses.filter(x => x !== s))"
      >
        {{ statusOptions.find(o => o.value === s)?.label }}
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Clear all -->
      <button
        type="button"
        class="text-xs text-gray-400 hover:text-gray-600 font-medium underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1 rounded ml-1"
        @click="$emit('clearAll')"
      >
        Clear all
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FilterDropdown from './FilterDropdown.vue'

const props = defineProps<{
  search: string
  dateSort: string
  statuses: string[]
  resultCount: number
  totalCount: number
}>()

const emit = defineEmits<{
  'update:search': [val: string]
  'update:dateSort': [val: string]
  'update:statuses': [val: string[]]
  clearAll: []
}>()

function onDateSort(val: string | number | string[] | number[]) {
  emit('update:dateSort', val as string)
}

function onStatuses(val: string | number | string[] | number[]) {
  emit('update:statuses', val as string[])
}

const hasActiveFilters = computed(() =>
  props.dateSort !== 'newest' ||
  props.statuses.length > 0
)

const dateOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'updated', label: 'Recently updated' },
]

const statusOptions = [
  { value: 'draft',            label: 'Draft',    dot: 'bg-gray-400' },
  { value: 'pending_approval', label: 'Pending',  dot: 'bg-amber-400' },
  { value: 'approved',         label: 'Approved', dot: 'bg-blue-500' },
  { value: 'published',        label: 'Published',dot: 'bg-green-500' },
  { value: 'archived',         label: 'Archived', dot: 'bg-gray-300' },
]
</script>
