<template>
  <div class="h-full bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
    <!-- Header row -->
    <div class="flex items-center px-4 py-3 border-b border-gray-100 shrink-0">
      <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Go-live Content</span>
    </div>

    <!-- Scrollable form panel -->
    <div class="flex-1 overflow-y-auto p-6">
      <div class="w-3/4 flex flex-col gap-4">

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

        <!-- Chip picker -->
        <div class="flex flex-col gap-2">
          <div>
            <p class="text-xs font-medium text-gray-600">Announcement type</p>
            <p class="text-xs text-gray-400 mt-0.5">Tag this announcement so readers know what kind of change it is</p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Preset + any custom chip already saved -->
            <button
              v-for="chip in allChips"
              :key="chip.id"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
              :class="form.chip === chip.id
                ? chip.activeClass
                : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500'"
              @click="form.chip = form.chip === chip.id ? null : chip.id"
            >
              <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="form.chip === chip.id ? chip.dotClass : 'bg-gray-300'" />
              {{ chip.label }}
            </button>

            <!-- Inline custom chip input -->
            <template v-if="showCustomChipInput">
              <input
                ref="customChipInputEl"
                v-model="customChipText"
                type="text"
                placeholder="e.g. Breaking Change"
                maxlength="40"
                class="px-2.5 py-1 rounded-full text-xs font-semibold border-2 border-violet-300 bg-violet-50 text-violet-700 placeholder-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400 w-36"
                @keydown.enter.prevent="confirmAddChip"
                @keydown.escape="cancelAddChip"
              />
              <button
                type="button"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border-2 border-violet-400 bg-violet-400 text-white hover:bg-violet-500 transition-all"
                @click="confirmAddChip"
              >
                Add
              </button>
              <button
                type="button"
                class="text-gray-300 hover:text-gray-500 transition-colors"
                @click="cancelAddChip"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </template>

            <!-- Add custom chip trigger -->
            <button
              v-else
              type="button"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-all"
              @click="startAddChip"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add type
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="flex flex-col">
          <label class="block text-xs font-medium text-gray-600 mb-1">Body</label>
          <RichTextEditor
            v-model="form.body"
            class="min-h-[200px]"
            placeholder="Describe the release in detail…"
          />
        </div>

        <!-- Media toggle -->
        <div class="flex flex-col gap-3">
          <!-- Toggle row -->
          <div class="flex items-center justify-between py-0.5">
            <div>
              <span class="text-sm font-medium text-gray-700">Add image / video</span>
              <p class="text-xs text-gray-400 mt-0.5">Attach a visual to this announcement</p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="hasMedia"
              class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1"
              :class="hasMedia ? 'bg-[#262A20]' : 'bg-gray-200'"
              @click="toggleMedia"
            >
              <span
                class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                :class="hasMedia ? 'translate-x-[18px]' : 'translate-x-[2px]'"
              />
            </button>
          </div>

          <!-- Expanded media panel -->
          <div v-if="hasMedia" class="rounded-xl border border-gray-200 bg-gray-50/40 p-4 flex flex-col gap-5">

            <!-- Size picker (Small / Medium / Large / Split) -->
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Size</label>
              <div class="grid grid-cols-4 gap-2">
                <!-- Small, Medium, Large -->
                <button
                  v-for="size in imageSizes"
                  :key="size.id"
                  type="button"
                  class="relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-center transition-all"
                  :class="form.template === 'A' && form.image_size === size.id
                    ? 'border-[#262A20] bg-[#eef2e6]'
                    : 'border-gray-200 bg-white hover:border-gray-300'"
                  @click="selectSize(size.id)"
                >
                  <div class="w-full h-9 rounded overflow-hidden bg-gray-100">
                    <svg viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                      <rect x="0" y="0" width="40" :height="size.previewH" rx="1" fill="#4A90A4"/>
                      <rect x="2" :y="size.previewH + 2" width="22" height="2.5" rx="1" fill="#D1D5DB"/>
                      <rect x="2" :y="size.previewH + 6" width="30" height="1.5" rx="0.75" fill="#E5E7EB"/>
                    </svg>
                  </div>
                  <span class="text-xs font-medium" :class="form.template === 'A' && form.image_size === size.id ? 'text-[#262A20]' : 'text-gray-600'">{{ size.label }}</span>
                  <svg
                    v-if="form.template === 'A' && form.image_size === size.id"
                    class="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-[#262A20]"
                    fill="currentColor" viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </button>

                <!-- Split -->
                <button
                  type="button"
                  class="relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-center transition-all"
                  :class="form.template === 'B'
                    ? 'border-[#262A20] bg-[#eef2e6]'
                    : 'border-gray-200 bg-white hover:border-gray-300'"
                  @click="selectSize('split')"
                >
                  <div class="w-full h-9 rounded overflow-hidden bg-gray-100">
                    <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                      <rect x="0" y="0" width="18" height="30" rx="1" fill="#4A90A4"/>
                      <rect x="20" y="5" width="18" height="3" rx="1" fill="#D1D5DB"/>
                      <rect x="20" y="10" width="18" height="2" rx="0.75" fill="#E5E7EB"/>
                      <rect x="20" y="14" width="12" height="2" rx="0.75" fill="#E5E7EB"/>
                    </svg>
                  </div>
                  <span class="text-xs font-medium" :class="form.template === 'B' ? 'text-[#262A20]' : 'text-gray-600'">Split</span>
                  <svg
                    v-if="form.template === 'B'"
                    class="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-[#262A20]"
                    fill="currentColor" viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Source tabs + content -->
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Source</label>
              <div class="flex gap-1 bg-gray-100 p-1 rounded-lg mb-3">
                <button
                  type="button"
                  class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all"
                  :class="mediaTab === 'image' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                  @click="mediaTab = 'image'"
                >
                  Upload Image
                </button>
                <div class="relative flex-1 group/yt">
                  <button
                    type="button"
                    class="w-full py-1.5 text-xs font-medium rounded-md transition-all"
                    :class="youtubeDisabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : mediaTab === 'youtube' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                    :disabled="youtubeDisabled"
                    @click="mediaTab = 'youtube'"
                  >
                    YouTube
                  </button>
                  <div v-if="youtubeDisabled" class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/yt:block z-20">
                    <div class="bg-gray-800 text-white text-[10px] leading-snug rounded-md px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                      Select Large size to embed a YouTube video
                      <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Image / Lottie upload -->
              <div v-if="mediaTab === 'image'">
                <!-- Image preview -->
                <div v-if="form.media_url && form.media_type === 'image'" class="mb-2 relative group">
                  <img :src="form.media_url" alt="Media" class="w-full h-28 object-cover rounded-lg border border-gray-200" />
                  <button
                    type="button"
                    class="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-full p-1 shadow transition-all opacity-0 group-hover:opacity-100"
                    @click="removeMediaContent"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <!-- Lottie preview placeholder -->
                <div v-else-if="form.media_url && form.media_type === 'lottie'" class="mb-2 relative group">
                  <div class="w-full h-28 rounded-lg border border-gray-200 bg-violet-50 flex items-center justify-center gap-2">
                    <svg class="w-6 h-6 text-violet-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm font-medium text-violet-600">Lottie animation ready</span>
                  </div>
                  <button
                    type="button"
                    class="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-full p-1 shadow transition-all opacity-0 group-hover:opacity-100"
                    @click="removeMediaContent"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div
                  class="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors"
                  :class="isDragging ? 'border-[#262A20] bg-[#eef2e6]' : 'border-gray-300 hover:border-[#262A20] hover:bg-gray-50'"
                  @dragover.prevent="isDragging = true"
                  @dragleave="isDragging = false"
                  @drop.prevent="handleDrop"
                  @click="fileInputEl?.click()"
                >
                  <input ref="fileInputEl" type="file" accept="image/png,image/jpeg,image/webp,image/gif,.json,.lottie" class="hidden" @change="handleFileChange" />
                  <div v-if="uploadProgress !== null" class="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div class="bg-[#262A20] h-1.5 rounded-full transition-all" :style="{ width: uploadProgress + '%' }" />
                  </div>
                  <p class="text-xs text-gray-500">
                    {{ uploadProgress !== null ? `Uploading ${uploadProgress}%…` : 'Drop file here or click to upload' }}
                  </p>
                  <p class="text-[10px] text-gray-400 mt-0.5">PNG, JPG, WebP, GIF · Lottie (.json, .lottie) · max 10 MB</p>
                </div>
              </div>

              <!-- YouTube -->
              <div v-else-if="mediaTab === 'youtube'">
                <input
                  type="url"
                  :value="form.media_type === 'youtube' ? form.media_url ?? '' : ''"
                  placeholder="https://www.youtube.com/watch?v=…"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:border-transparent"
                  @input="handleYoutubeInput(($event.target as HTMLInputElement).value)"
                />
                <div v-if="form.media_type === 'youtube' && youtubeEmbedId" class="mt-2 rounded-lg overflow-hidden aspect-video bg-black">
                  <iframe
                    :src="`https://www.youtube.com/embed/${youtubeEmbedId}`"
                    class="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- CTA toggle -->
        <div class="flex flex-col gap-3">
          <!-- Toggle row -->
          <div class="flex items-center justify-between py-0.5">
            <div>
              <span class="text-sm font-medium text-gray-700">Add CTA</span>
              <p class="text-xs text-gray-400 mt-0.5">Link readers to one or more next actions</p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="ctaEnabled"
              class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-1"
              :class="ctaEnabled ? 'bg-[#262A20]' : 'bg-gray-200'"
              @click="toggleCta"
            >
              <span
                class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                :class="ctaEnabled ? 'translate-x-[18px]' : 'translate-x-[2px]'"
              />
            </button>
          </div>

          <!-- CTA list -->
          <div v-if="ctaEnabled" class="rounded-xl border border-gray-200 bg-gray-50/40 p-4 flex flex-col gap-2">
            <!-- Header labels (shown once above all rows) -->
            <div class="grid gap-2 pr-7" style="grid-template-columns: 1fr 1fr">
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Label</span>
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">URL</span>
            </div>
            <!-- CTA rows -->
            <div
              v-for="(cta, i) in form.ctas"
              :key="i"
              class="flex items-center gap-2"
            >
              <input
                type="text"
                v-model="cta.label"
                placeholder="Try it now"
                class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:border-transparent"
              />
              <input
                type="url"
                v-model="cta.url"
                placeholder="https://…"
                class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:border-transparent"
              />
              <button
                type="button"
                class="shrink-0 text-gray-300 hover:text-red-500 transition-colors p-1 -mr-1"
                title="Remove"
                @click="removeCta(i)"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <!-- Add button -->
            <button
              type="button"
              class="mt-1 self-start flex items-center gap-1.5 text-xs font-medium text-[#262A20] hover:text-[#3c4332] transition-colors"
              @click="addCta"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add another
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { ImageSize } from '@release-hub/shared'

const PRESET_CHIP_IDS = ['feature', 'update', 'fix']
import type { FormData } from '../../composables/useReleaseForm'
import RichTextEditor from './RichTextEditor.vue'
import axios from 'axios'
import { useUiStore } from '../../stores/ui.store'

const ui = useUiStore()

const props = defineProps<{ form: FormData }>()

// --- Chip picker ---
const PRESET_CHIPS = [
  { id: 'feature', label: 'New Feature', activeClass: 'border-[#6BAC1B] bg-[#EBF5D6] text-[#3d6b0e]', dotClass: 'bg-[#6BAC1B]' },
  { id: 'update',  label: 'New Update',  activeClass: 'border-blue-300 bg-blue-50 text-blue-700',      dotClass: 'bg-blue-500' },
  { id: 'fix',     label: 'New Fix',     activeClass: 'border-amber-300 bg-amber-50 text-amber-700',   dotClass: 'bg-amber-500' },
]

// Includes any custom chip already saved on this release
const allChips = computed(() => {
  const list = [...PRESET_CHIPS]
  const current = props.form.chip
  if (current && !PRESET_CHIP_IDS.includes(current as any)) {
    list.push({
      id: current,
      label: current,
      activeClass: 'border-violet-400 bg-violet-50 text-violet-700',
      dotClass: 'bg-violet-400',
    })
  }
  return list
})

// Custom chip inline input
const showCustomChipInput = ref(false)
const customChipText = ref('')
const customChipInputEl = ref<HTMLInputElement | null>(null)

function startAddChip() {
  showCustomChipInput.value = true
  customChipText.value = ''
  nextTick(() => customChipInputEl.value?.focus())
}

function confirmAddChip() {
  const label = customChipText.value.trim()
  if (label) props.form.chip = label
  cancelAddChip()
}

function cancelAddChip() {
  showCustomChipInput.value = false
  customChipText.value = ''
}

// --- Image sizes (top-media layouts) ---
const imageSizes = [
  { id: 'small'  as ImageSize, label: 'Small',  previewH: 10 },
  { id: 'medium' as ImageSize, label: 'Medium', previewH: 17 },
  { id: 'large'  as ImageSize, label: 'Large',  previewH: 22 },
]

// --- Media state ---
const mediaTab = ref<'image' | 'youtube' | 'none'>('none')
const isDragging = ref(false)
const uploadProgress = ref<number | null>(null)
const fileInputEl = ref<HTMLInputElement | null>(null)

const hasMedia = computed(() => mediaTab.value !== 'none')

watch(
  () => props.form.media_type,
  (t) => {
    if (t === 'image' || t === 'lottie') mediaTab.value = 'image'
    else if (t === 'youtube') mediaTab.value = 'youtube'
  },
  { immediate: true }
)

// YouTube only available on Large size (not available for Split)
const youtubeDisabled = computed(() => props.form.image_size !== 'large')

watch(youtubeDisabled, (disabled) => {
  if (disabled && mediaTab.value === 'youtube') {
    // Only clear the media content and switch tab — don't reset image_size
    mediaTab.value = 'image'
    props.form.media_url = null
    props.form.media_type = null
  }
})

function selectSize(id: ImageSize | 'split') {
  if (id === 'split') {
    props.form.template = 'B'
    props.form.image_size = null
    // YouTube is N/A for split; reset if on that tab
    if (mediaTab.value === 'youtube') {
      mediaTab.value = 'image'
      props.form.media_url = null
      props.form.media_type = null
    }
  } else {
    props.form.template = 'A'
    props.form.image_size = id
  }
}

function toggleMedia() {
  if (hasMedia.value) {
    clearMedia()
  } else {
    mediaTab.value = 'image'
    // Default to Template A / Medium
    props.form.template = 'A'
    if (!props.form.image_size) props.form.image_size = 'medium'
  }
}

function clearMedia() {
  // Full reset — used when user toggles media off entirely
  mediaTab.value = 'none'
  props.form.media_url = null
  props.form.media_type = null
  props.form.template = 'A'
  props.form.image_size = null
}

function removeMediaContent() {
  // Lightweight reset — clears uploaded file/URL but keeps panel open + size preserved
  props.form.media_url = null
  props.form.media_type = null
}

const youtubeEmbedId = computed(() => {
  const url = props.form.media_url ?? ''
  const match = url.match(/(?:youtu\.be\/|watch\?v=|embed\/)([A-Za-z0-9_-]{11})/)
  return match?.[1] ?? null
})

function handleYoutubeInput(val: string) {
  props.form.media_url = val || null
  props.form.media_type = val ? 'youtube' : null
}

async function uploadFile(file: File) {
  const fd = new FormData()
  fd.append('file', file)
  uploadProgress.value = 0
  try {
    const { data } = await axios.post<{ url: string; media_type: 'image' | 'lottie' }>('/api/media/upload', fd, {
      onUploadProgress: (e) => {
        uploadProgress.value = e.total ? Math.round((e.loaded / e.total) * 100) : null
      },
    })
    props.form.media_url = data.url
    props.form.media_type = data.media_type
  } catch (err: any) {
    const msg = err?.response?.data?.error ?? err?.message ?? 'Upload failed'
    ui.addToast(msg, 'error')
  } finally {
    uploadProgress.value = null
  }
}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) uploadFile(file)
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) uploadFile(file)
}

// --- CTA state ---
const ctaEnabled = computed(() => props.form.ctas.length > 0)

function toggleCta() {
  if (ctaEnabled.value) {
    props.form.ctas.splice(0)
  } else {
    props.form.ctas.push({ label: '', url: '' })
  }
}

function addCta() {
  props.form.ctas.push({ label: '', url: '' })
}

function removeCta(i: number) {
  props.form.ctas.splice(i, 1)
}
</script>
