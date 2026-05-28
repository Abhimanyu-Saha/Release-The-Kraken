<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        @click.self="emit('close')"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-[440px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-golive-title"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 pt-5 pb-4">
            <h2 id="new-golive-title" class="text-xl font-semibold tracking-tight text-gray-900">New Go Live</h2>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-600 transition-colors rounded-md p-0.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#262A20]"
              aria-label="Close"
              @click="emit('close')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 pb-5 space-y-5">
            <!-- Internal name -->
            <div>
              <label for="golive-name" class="block text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 mb-1.5">Internal name</label>
              <input
                id="golive-name"
                ref="nameInput"
                v-model="name"
                type="text"
                placeholder="e.g. Summer launch 2026"
                class="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:border-transparent placeholder-gray-400"
                @keydown.enter="confirm"
                @keydown.escape="emit('close')"
              />
            </div>

            <!-- Type selection -->
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 mb-2">Type</p>
              <div class="grid grid-cols-2 gap-3">
                <!-- Single -->
                <button
                  type="button"
                  :class="[
                    'flex flex-col items-start gap-2 rounded-xl border-2 px-4 py-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1',
                    type === 'single'
                      ? 'border-[#262A20] bg-[#262A20]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                  @click="type = 'single'"
                >
                  <span
                    :class="[
                      'flex items-center justify-center w-8 h-8 rounded-lg',
                      type === 'single' ? 'bg-[#262A20] text-white' : 'bg-gray-100 text-gray-500'
                    ]"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  <span class="text-sm font-semibold text-gray-900">Single Go Live</span>
                  <span class="text-xs text-gray-500 leading-relaxed">One announcement for your users</span>
                </button>

                <!-- Multiple -->
                <button
                  type="button"
                  :class="[
                    'flex flex-col items-start gap-2 rounded-xl border-2 px-4 py-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1',
                    type === 'multiple'
                      ? 'border-[#262A20] bg-[#262A20]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                  @click="type = 'multiple'"
                >
                  <span
                    :class="[
                      'flex items-center justify-center w-8 h-8 rounded-lg',
                      type === 'multiple' ? 'bg-[#262A20] text-white' : 'bg-gray-100 text-gray-500'
                    ]"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </span>
                  <span class="text-sm font-semibold text-gray-900">Multiple Go Lives</span>
                  <span class="text-xs text-gray-500 leading-relaxed">A set of announcements in sequence</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="!name.trim()"
              class="px-4 py-2 text-sm font-semibold text-white bg-[#262A20] rounded-lg hover:bg-[#3c4332] transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed"
              @click="confirm"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  close: []
  confirm: [payload: { name: string; type: 'single' | 'multiple' }]
}>()

const name = ref('')
const type = ref<'single' | 'multiple'>('single')
const nameInput = ref<HTMLInputElement | null>(null)

// Reset & focus when opened
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      name.value = ''
      type.value = 'single'
      nextTick(() => nameInput.value?.focus())
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
    }
  }
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

function confirm() {
  if (!name.value.trim()) return
  emit('confirm', { name: name.value.trim(), type: type.value })
}
</script>
