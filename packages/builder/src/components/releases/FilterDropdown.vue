<template>
  <div class="relative" ref="root">
    <button
      type="button"
      class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1"
      :class="hasActive
        ? 'border-[#262A20] bg-[#eaece5] text-[#262A20]'
        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'"
      @click="open = !open"
    >
      {{ label }}
      <span v-if="hasActive" class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#262A20] text-white text-[10px] font-bold leading-none">
        {{ activeCount }}
      </span>
      <svg class="w-3 h-3 transition-transform" :class="open ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="open"
        class="absolute left-0 top-full mt-1.5 z-30 bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 py-1 min-w-[160px]"
        style="transform-origin: top left"
      >
        <!-- Single select (radio) -->
        <template v-if="mode === 'single'">
          <button
            v-for="opt in options"
            :key="opt.value"
            type="button"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors"
            :class="modelValue === opt.value
              ? 'text-[#262A20] bg-[#eaece5] font-medium'
              : 'text-gray-700 hover:bg-gray-50'"
            @click="selectSingle(opt.value)"
          >
            <span
              class="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0"
              :class="modelValue === opt.value ? 'border-[#262A20]' : 'border-gray-300'"
            >
              <span v-if="modelValue === opt.value" class="w-1.5 h-1.5 rounded-full bg-[#262A20]" />
            </span>
            {{ opt.label }}
          </button>
        </template>

        <!-- Multi select (checkboxes) -->
        <template v-else>
          <button
            v-for="opt in options"
            :key="opt.value"
            type="button"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors"
            :class="isSelected(opt.value)
              ? 'text-[#262A20] bg-[#eaece5] font-medium'
              : 'text-gray-700 hover:bg-gray-50'"
            @click="toggleMulti(opt.value)"
          >
            <span
              class="w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0"
              :class="isSelected(opt.value) ? 'border-[#262A20] bg-[#262A20]' : 'border-gray-300'"
            >
              <svg v-if="isSelected(opt.value)" class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span class="flex items-center gap-1.5">
              <span v-if="opt.dot" class="w-1.5 h-1.5 rounded-full shrink-0" :class="opt.dot" />
              {{ opt.label }}
            </span>
          </button>

          <div v-if="(modelValue as string[]).length" class="border-t border-gray-100 mt-1 pt-1">
            <button
              type="button"
              class="w-full px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 text-left transition-colors"
              @click="clearMulti"
            >
              Clear
            </button>
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface DropdownOption {
  value: string | number
  label: string
  dot?: string
}

const props = defineProps<{
  label: string
  options: DropdownOption[]
  modelValue: string | number | string[] | number[]
  mode?: 'single' | 'multi'
}>()

const emit = defineEmits<{
  'update:modelValue': [val: string | number | string[] | number[]]
}>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const hasActive = computed(() => {
  if (props.mode === 'multi') return (props.modelValue as unknown[]).length > 0
  return props.modelValue !== (props.options[0]?.value ?? '')
})

const activeCount = computed(() => {
  if (props.mode === 'multi') return (props.modelValue as unknown[]).length
  return 0
})

function isSelected(val: string | number) {
  return (props.modelValue as (string | number)[]).includes(val)
}

function selectSingle(val: string | number) {
  emit('update:modelValue', val)
  open.value = false
}

function toggleMulti(val: string | number) {
  const current = props.modelValue as (string | number)[]
  const next = current.includes(val) ? current.filter(v => v !== val) : [...current, val]
  emit('update:modelValue', next as string[] | number[])
}

function clearMulti() {
  emit('update:modelValue', [])
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onDocClick))
onUnmounted(() => document.removeEventListener('mousedown', onDocClick))
</script>
