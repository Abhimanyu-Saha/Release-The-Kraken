<template>
  <div class="w-full h-full overflow-hidden bg-gray-100">
    <img
      v-if="mediaType === 'image' && mediaUrl"
      :src="mediaUrl"
      class="w-full h-full object-cover"
      alt=""
    />
    <LottieRenderer
      v-else-if="mediaType === 'lottie' && mediaUrl"
      :src="mediaUrl"
    />
    <iframe
      v-else-if="mediaType === 'youtube' && embedUrl"
      :src="embedUrl"
      class="w-full h-full border-0"
      allow="autoplay; encrypted-media"
      allowfullscreen
    />
    <div v-else class="w-full h-full flex items-center justify-center text-gray-300 text-sm">
      No media
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MediaType } from '@release-hub/shared'
import LottieRenderer from './LottieRenderer.vue'

const props = defineProps<{
  mediaUrl: string | null
  mediaType: MediaType | null
}>()

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtu\.be\/([^?\s]+)/,
    /youtube\.com\/embed\/([^?\s]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

const embedUrl = computed(() => {
  if (!props.mediaUrl) return null
  const id = extractYouTubeId(props.mediaUrl)
  return id ? `https://www.youtube.com/embed/${id}` : null
})
</script>
