<template>
  <header class="h-14 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
    <h1 class="text-sm font-medium text-gray-700">{{ pageTitle }}</h1>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => {
  if (route.path === '/releases/new') return 'New Go Live'
  if (route.path.endsWith('/edit')) return 'Edit Go Live'
  if (route.path === '/review') return 'Review Queue'
  return 'All Go Lives'
})
</script>
