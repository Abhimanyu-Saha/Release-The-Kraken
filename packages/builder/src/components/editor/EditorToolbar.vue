<template>
  <div class="flex items-center justify-between gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3">
    <!-- Internal name + Status badge -->
    <div class="flex items-center gap-2.5 min-w-0">
      <!-- Auto-sizing title input: ghost span drives the width, input overlays it -->
      <div v-if="title !== undefined" class="relative inline-flex items-center">
        <span
          class="invisible whitespace-pre text-sm font-semibold px-1.5 py-0.5 pointer-events-none"
          aria-hidden="true"
        >{{ title || 'Untitled' }}</span>
        <input
          :value="title"
          type="text"
          placeholder="Untitled"
          class="absolute inset-0 w-full text-sm font-semibold text-gray-800 bg-transparent border border-transparent rounded-md px-1.5 py-0.5 hover:border-gray-300 focus:border-gray-400 focus:outline-none focus:bg-white transition-colors"
          @input="$emit('update:title', ($event.target as HTMLInputElement).value)"
          @keydown.enter="($event.target as HTMLInputElement).blur()"
          @keydown.escape="($event.target as HTMLInputElement).blur()"
        />
      </div>
      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
        :class="statusStyle.class"
      >
        <span class="w-1.5 h-1.5 rounded-full" :class="statusStyle.dot" />
        {{ statusStyle.label }}
      </span>
      <span v-if="lastSaved" class="text-xs text-gray-400 truncate hidden sm:block">Saved</span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 shrink-0">
      <button
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading"
        @click="$emit('preview')"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Preview
      </button>

      <button
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="saving || loading || !canEdit"
        @click="$emit('save')"
      >
        <svg v-if="saving || loading" class="w-3.5 h-3.5 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ loading ? 'Loading…' : saving ? 'Saving…' : 'Save draft' }}
      </button>

      <button
        v-if="status === 'draft' || status === 'pending_approval'"
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262A20] text-white text-sm font-medium hover:bg-[#3c4332] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="submitting || status === 'pending_approval'"
        @click="$emit('submit')"
      >
        <svg v-if="submitting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ submitting ? 'Submitting…' : status === 'pending_approval' ? 'Awaiting approval' : 'Submit for approval' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ReleaseStatus } from '@release-hub/shared'

const props = defineProps<{
  status: ReleaseStatus
  saving: boolean
  submitting: boolean
  loading?: boolean
  title?: string
}>()

defineEmits<{
  save: []
  preview: []
  submit: []
  'update:title': [value: string]
}>()

const lastSaved = ref(false)

watch(() => props.saving, (nowSaving, wasSaving) => {
  if (wasSaving && !nowSaving) {
    lastSaved.value = true
    setTimeout(() => { lastSaved.value = false }, 3000)
  }
})

const canEdit = computed(() => props.status === 'draft')

const statusStyle = computed(() => {
  const map: Record<ReleaseStatus, { class: string; dot: string; label: string }> = {
    draft:            { class: 'bg-gray-100 text-gray-600',    dot: 'bg-gray-400',   label: 'Draft' },
    pending_approval: { class: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500',  label: 'Pending approval' },
    approved:         { class: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500',   label: 'Approved' },
    published:        { class: 'bg-green-100 text-green-700',  dot: 'bg-green-500',  label: 'Published' },
    archived:         { class: 'bg-gray-100 text-gray-500',    dot: 'bg-gray-400',   label: 'Archived' },
  }
  return map[props.status]
})
</script>
