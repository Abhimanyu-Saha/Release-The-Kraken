<template>
  <div class="bg-white rounded-xl border border-gray-200 p-4">
    <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Media</label>

    <!-- Tab toggle -->
    <div class="flex gap-1 bg-gray-100 p-1 rounded-lg mb-4">
      <button
        type="button"
        class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all"
        :class="tab === 'image' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        @click="tab = 'image'"
      >
        Upload Image
      </button>
      <button
        type="button"
        class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all"
        :class="tab === 'youtube' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        @click="tab = 'youtube'"
      >
        YouTube Video
      </button>
    </div>

    <!-- Image tab -->
    <div v-if="tab === 'image'">
      <!-- Thumbnail if already uploaded -->
      <div v-if="imageUrl" class="mb-3 relative group">
        <img :src="imageUrl" alt="Uploaded media" class="w-full h-32 object-cover rounded-lg border border-gray-200" />
        <button
          type="button"
          class="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 hover:text-red-600 rounded-full p-1 shadow transition-all opacity-0 group-hover:opacity-100"
          @click="clearMedia"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Upload zone -->
      <div
        class="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
        :class="isDragging
          ? 'border-[#262A20] bg-[#eaece5]'
          : 'border-gray-300 hover:border-[#c084fc] hover:bg-gray-50'"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="handleDrop"
        @click="fileInput?.click()"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          class="hidden"
          @change="handleFileChange"
        />

        <div v-if="!uploading">
          <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-xs text-gray-500">
            <span class="text-[#262A20] font-medium">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-400 mt-1">PNG, JPG, WebP, GIF — max 10 MB</p>
        </div>

        <!-- Progress -->
        <div v-else class="space-y-2">
          <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-[#262A20] rounded-full transition-all duration-150"
              :style="{ width: `${progress}%` }"
            />
          </div>
          <p class="text-xs text-gray-500">Uploading… {{ progress }}%</p>
        </div>
      </div>
    </div>

    <!-- YouTube tab -->
    <div v-else class="space-y-3">
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">YouTube URL</label>
        <input
          type="url"
          v-model="youtubeInput"
          placeholder="https://youtube.com/watch?v=… or youtu.be/…"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:border-transparent"
          @input="handleYouTubeInput"
        />
        <p v-if="youtubeInput && !youtubeId" class="text-xs text-red-500 mt-1">Could not extract video ID from this URL.</p>
      </div>

      <!-- YouTube preview -->
      <div v-if="youtubeId" class="rounded-lg overflow-hidden border border-gray-200 aspect-video">
        <iframe
          :src="`https://www.youtube.com/embed/${youtubeId}`"
          class="w-full h-full"
          frameborder="0"
          allowfullscreen
        />
      </div>

      <!-- Clear button -->
      <button
        v-if="youtubeId"
        type="button"
        class="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
        @click="clearMedia"
      >
        Remove video
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useImageUpload } from '../../composables/useImageUpload'

const props = defineProps<{
  mediaUrl: string | null
  mediaType: 'image' | 'youtube' | null
}>()

const emit = defineEmits<{
  'update:mediaUrl': [val: string | null]
  'update:mediaType': [val: 'image' | 'youtube' | null]
}>()

const { upload, uploading, progress } = useImageUpload()

const tab = ref<'image' | 'youtube'>(props.mediaType === 'youtube' ? 'youtube' : 'image')
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const youtubeInput = ref(props.mediaType === 'youtube' && props.mediaUrl ? props.mediaUrl : '')

const imageUrl = computed(() => props.mediaType === 'image' ? props.mediaUrl : null)

const youtubeId = computed(() => {
  if (!youtubeInput.value) return null
  return extractYouTubeId(youtubeInput.value)
})

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

function handleYouTubeInput() {
  const id = youtubeId.value
  if (id) {
    emit('update:mediaUrl', youtubeInput.value)
    emit('update:mediaType', 'youtube')
  } else if (!youtubeInput.value) {
    clearMedia()
  }
}

function clearMedia() {
  youtubeInput.value = ''
  emit('update:mediaUrl', null)
  emit('update:mediaType', null)
}

async function handleFile(file: File) {
  try {
    const result = await upload(file)
    emit('update:mediaUrl', result.url)
    emit('update:mediaType', 'image')
  } catch {
    // error toast handled inside useImageUpload
  }
}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) handleFile(file)
}

watch(tab, (newTab) => {
  if (newTab === 'image' && props.mediaType === 'youtube') clearMedia()
  if (newTab === 'youtube' && props.mediaType === 'image') clearMedia()
})
</script>
