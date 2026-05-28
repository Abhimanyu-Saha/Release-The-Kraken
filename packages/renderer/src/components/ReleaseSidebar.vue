<template>
  <div class="w-60 shrink-0 flex flex-col bg-white border-r border-gray-100 overflow-y-auto">
    <div class="flex flex-col flex-1 px-5 pt-5 pb-0">
      <!-- Section header -->
      <div class="pb-3">
        <p style="font-size: 1.125rem; font-weight: 600; color: #508014; letter-spacing: -0.015em; margin: 0;">What's new!</p>
      </div>

      <!-- Items (releases or sections) -->
      <ul class="flex-1">
        <li
          v-for="(item, i) in items"
          :key="item.id"
        >
          <button
            type="button"
            class="w-full text-left text-sm py-2.5 pl-4 pr-3 border-l-4 rounded-r transition-colors"
            :class="i === currentIndex
              ? 'border-[#6BAC1B] bg-[#eef7db] text-[#3d6710] font-semibold'
              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            @click="$emit('select', i)"
          >
            <span class="block truncate leading-snug">{{ item.title }}</span>
          </button>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: { id: string; title: string }[]
  currentIndex: number
}>()

defineEmits<{ select: [index: number] }>()
</script>
