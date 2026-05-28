<template>
  <div class="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
    <button
      type="button"
      class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="currentIndex === 0"
      @click="$emit('prev')"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Previous
    </button>

    <span class="text-xs text-gray-400 font-medium">
      {{ currentIndex + 1 }} of {{ total }}
    </span>

    <button
      type="button"
      class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="currentIndex === total - 1"
      @click="$emit('next')"
    >
      Next
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentIndex: number
  total: number
}>()

defineEmits<{
  prev: []
  next: []
}>()
</script>
