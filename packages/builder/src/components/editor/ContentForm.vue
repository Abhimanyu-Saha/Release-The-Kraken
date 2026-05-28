<template>
  <div class="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
    <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Content</label>

    <!-- Title (internal name) -->
    <div>
      <label class="block text-xs font-medium text-gray-600 mb-1">Release Title <span class="text-xs text-gray-400">(internal)</span></label>
      <input
        type="text"
        v-model="form.title"
        placeholder="e.g. Q2 AI Workflow Update"
        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:border-transparent"
      />
    </div>

    <!-- Heading -->
    <div>
      <label class="block text-xs font-medium text-gray-600 mb-1">Heading <span class="text-red-400">*</span></label>
      <input
        type="text"
        v-model="form.heading"
        placeholder="What's new?"
        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:border-transparent"
      />
    </div>

    <!-- Body -->
    <div>
      <label class="block text-xs font-medium text-gray-600 mb-1">Body</label>
      <RichTextEditor
        v-model="form.body"
        placeholder="Describe the release in detail…"
      />
    </div>

    <!-- Bullet list — only for Template C -->
    <div v-if="template === 'C'">
      <label class="block text-xs font-medium text-gray-600 mb-1">Bullet Points</label>
      <div class="space-y-2">
        <div
          v-for="(item, i) in form.bullet_list"
          :key="i"
          class="flex items-center gap-2"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[#262A20] shrink-0 mt-px" />
          <input
            type="text"
            :value="item"
            :placeholder="`Point ${i + 1}`"
            class="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:border-transparent"
            @input="updateBullet(i, ($event.target as HTMLInputElement).value)"
          />
          <button
            type="button"
            class="text-gray-400 hover:text-red-500 transition-colors"
            @click="removeBullet(i)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <button
        type="button"
        class="mt-2 text-xs text-[#262A20] hover:text-[#3c4332] font-medium flex items-center gap-1 transition-colors"
        @click="addBullet"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add point
      </button>
    </div>

    <!-- CTA fields now handled by SingleEditor / SectionsEditor -->
  </div>
</template>

<script setup lang="ts">
import type { Template } from '@release-hub/shared'
import type { FormData } from '../../composables/useReleaseForm'
import RichTextEditor from './RichTextEditor.vue'

const props = defineProps<{
  form: FormData
  template: Template
}>()

function updateBullet(i: number, val: string) {
  props.form.bullet_list[i] = val
}

function removeBullet(i: number) {
  props.form.bullet_list.splice(i, 1)
}

function addBullet() {
  props.form.bullet_list.push('')
}
</script>
