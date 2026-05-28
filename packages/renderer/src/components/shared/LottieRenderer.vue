<template>
  <div ref="containerEl" class="w-full h-full" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import lottie from 'lottie-web'
import type { AnimationItem } from 'lottie-web'

const props = defineProps<{ src: string }>()

const containerEl = ref<HTMLElement | null>(null)
let anim: AnimationItem | null = null

function loadAnimation() {
  if (!containerEl.value || !props.src) return
  anim?.destroy()
  anim = lottie.loadAnimation({
    container: containerEl.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: props.src,
  })
}

onMounted(loadAnimation)
watch(() => props.src, loadAnimation)
onUnmounted(() => anim?.destroy())
</script>
