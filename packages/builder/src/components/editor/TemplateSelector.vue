<template>
  <div class="bg-white rounded-xl border border-gray-200 p-4">
    <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Template</label>
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="t in templates"
        :key="t.id"
        type="button"
        class="relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-center transition-all"
        :class="modelValue === t.id
          ? 'border-[#262A20] bg-[#eaece5]'
          : 'border-gray-200 hover:border-gray-300'"
        @click="$emit('update:modelValue', t.id)"
      >
        <div class="w-full h-10 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
          <component :is="t.icon" class="text-gray-400 w-full h-full" />
        </div>
        <span class="text-xs font-medium" :class="modelValue === t.id ? 'text-[#262A20]' : 'text-gray-600'">
          {{ t.label }}
        </span>
        <svg
          v-if="modelValue === t.id"
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
import { h } from 'vue'
import type { Template } from '@release-hub/shared'

defineProps<{ modelValue: Template }>()
defineEmits<{ 'update:modelValue': [val: Template] }>()

// Use render functions instead of inline template strings — avoids Vue runtime
// compiler warning ("Component provided template option but runtime compilation
// is not supported in this build").
const IconA = () =>
  h('svg', { viewBox: '0 0 40 30', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
    h('rect', { x: '2', y: '2', width: '36', height: '14', rx: '2', fill: '#E5E7EB' }),
    h('rect', { x: '2', y: '18', width: '24', height: '3', rx: '1', fill: '#D1D5DB' }),
    h('rect', { x: '2', y: '23', width: '16', height: '2', rx: '1', fill: '#D1D5DB' }),
  ])

const IconB = () =>
  h('svg', { viewBox: '0 0 40 30', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
    h('rect', { x: '2', y: '2', width: '17', height: '26', rx: '2', fill: '#E5E7EB' }),
    h('rect', { x: '21', y: '4', width: '17', height: '3', rx: '1', fill: '#D1D5DB' }),
    h('rect', { x: '21', y: '9', width: '17', height: '2', rx: '1', fill: '#D1D5DB' }),
    h('rect', { x: '21', y: '13', width: '12', height: '2', rx: '1', fill: '#D1D5DB' }),
  ])

const IconC = () =>
  h('svg', { viewBox: '0 0 40 30', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
    h('rect', { x: '2', y: '4', width: '20', height: '4', rx: '1', fill: '#D1D5DB' }),
    h('rect', { x: '2', y: '11', width: '36', height: '2', rx: '1', fill: '#E5E7EB' }),
    h('rect', { x: '2', y: '15', width: '30', height: '2', rx: '1', fill: '#E5E7EB' }),
    h('rect', { x: '2', y: '21', width: '14', height: '2', rx: '1', fill: '#D1D5DB' }),
    h('rect', { x: '2', y: '25', width: '14', height: '2', rx: '1', fill: '#D1D5DB' }),
  ])

const templates = [
  { id: 'A' as Template, label: 'Media Top', icon: IconA },
  { id: 'B' as Template, label: 'Split',     icon: IconB },
  { id: 'C' as Template, label: 'Text Only', icon: IconC },
]
</script>
