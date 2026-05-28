<template>
  <div class="bg-white rounded-xl border border-gray-200 p-4">
    <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Image / Video Size</label>
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="size in sizes"
        :key="size.id"
        type="button"
        class="relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-center transition-all"
        :class="modelValue === size.id
          ? 'border-[#262A20] bg-[#eaece5]'
          : 'border-gray-200 hover:border-gray-300'"
        @click="$emit('update:modelValue', size.id)"
      >
        <!-- SVG preview of the layout with different image proportions -->
        <div class="w-full h-10 rounded bg-gray-100 overflow-hidden flex items-end justify-stretch">
          <svg :viewBox="`0 0 40 30`" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
            <rect x="0" y="0" width="40" :height="size.previewImageHeight" rx="1" fill="#4A90A4"/>
            <rect x="2" :y="size.previewImageHeight + 2" width="22" height="2.5" rx="1" fill="#D1D5DB"/>
            <rect x="2" :y="size.previewImageHeight + 6" width="30" height="1.5" rx="0.75" fill="#E5E7EB"/>
          </svg>
        </div>
        <span class="text-xs font-medium" :class="modelValue === size.id ? 'text-[#262A20]' : 'text-gray-600'">
          {{ size.label }}
        </span>
        <svg
          v-if="modelValue === size.id"
          class="absolute top-2 right-2 w-4 h-4 text-[#262A20]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageSize } from '@release-hub/shared'

defineProps<{ modelValue: ImageSize | null }>()
defineEmits<{ 'update:modelValue': [val: ImageSize] }>()

const sizes = [
  { id: 'small' as ImageSize,  label: 'Small',  previewImageHeight: 10, hint: '240px' },
  { id: 'medium' as ImageSize, label: 'Medium', previewImageHeight: 17, hint: '380px' },
  { id: 'large' as ImageSize,  label: 'Large',  previewImageHeight: 22, hint: '480px' },
]
</script>
