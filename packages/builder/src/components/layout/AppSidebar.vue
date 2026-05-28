<template>
  <nav class="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
    <div class="px-5 py-4 border-b border-gray-200">
      <span class="text-sm font-bold text-[#262A20] tracking-wide uppercase">Control Center</span>
    </div>
    <ul class="flex-1 py-4 space-y-1 px-3">
      <li>
        <RouterLink
          to="/releases"
          class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="isActive('/releases') ? 'bg-[#eaece5] text-[#262A20]' : 'text-gray-600 hover:bg-gray-100'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          All Go Lives
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

function isActive(path: string) {
  if (path === '/releases') {
    return route.path === '/releases' || route.path.startsWith('/releases/')
  }
  return route.path.startsWith(path)
}
</script>
