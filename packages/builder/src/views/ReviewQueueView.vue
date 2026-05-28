<template>
  <AppShell>
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-gray-900">Review Queue</h2>
      <p class="text-sm text-gray-500 mt-1">Releases pending approval</p>
    </div>
    <div v-if="pending.length === 0" class="text-center py-16 text-gray-400 text-sm">
      No releases pending review.
    </div>
    <div v-else class="space-y-4">
      <ApprovalCard
        v-for="release in pending"
        :key="release.id"
        :release="release"
        @approved="store.fetchList()"
        @rejected="store.fetchList()"
        @published="store.fetchList()"
      />
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppShell from '../components/layout/AppShell.vue'
import ApprovalCard from '../components/releases/ApprovalCard.vue'
import { useReleasesStore } from '../stores/releases.store'

const store = useReleasesStore()

onMounted(() => store.fetchList())

const pending = computed(() =>
  store.list.filter((r) => r.status === 'pending_approval' || r.status === 'approved')
)
</script>
