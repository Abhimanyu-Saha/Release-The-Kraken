<template>
  <AppShell>
    <!-- Section header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold tracking-[-0.01em] text-gray-900">Go Lives</h2>
        <p class="text-sm text-gray-500 mt-1">Author, approve, and go live with announcements to your products.</p>
      </div>
      <div class="flex items-center gap-2 shrink-0 ml-6">
        <RouterLink
          to="/review"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium text-gray-600 rounded-lg hover:border-gray-300 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-2"
        >
          Review Queue
          <span
            v-if="pendingCount > 0"
            class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold"
          >{{ pendingCount }}</span>
        </RouterLink>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#262A20] text-white text-sm font-semibold rounded-lg hover:bg-[#3c4332] transition-colors focus:outline-none focus:ring-2 focus:ring-[#262A20] focus:ring-offset-2"
          @click="showNewModal = true"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Go Live
        </button>
      </div>
    </div>

    <!-- Search & filters -->
    <SearchFilterBar
      v-model:search="search"
      :date-sort="dateSort"
      :statuses="statuses"
      :result-count="filtered.length"
      :total-count="store.list.length"
      class="mb-4"
      @update:date-sort="dateSort = $event as string"
      @update:statuses="statuses = $event as string[]"
      @clear-all="clearAll"
    />

    <ReleaseTable :releases="filtered" />

    <NewGoLiveModal
      v-model="showNewModal"
      @close="showNewModal = false"
      @confirm="onNewGoLiveConfirm"
    />
  </AppShell>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '../components/layout/AppShell.vue'
import ReleaseTable from '../components/releases/ReleaseTable.vue'
import SearchFilterBar from '../components/releases/SearchFilterBar.vue'
import NewGoLiveModal from '../components/releases/NewGoLiveModal.vue'
import { useReleasesStore } from '../stores/releases.store'

const store = useReleasesStore()
const router = useRouter()

const showNewModal = ref(false)

function onNewGoLiveConfirm(payload: { name: string; type: 'single' | 'multiple' }) {
  showNewModal.value = false
  router.push({ path: '/releases/new', query: { title: payload.name, type: payload.type } })
}

const pendingCount = computed(() => store.list.filter(r => r.status === 'pending_approval').length)

const search = ref('')
const dateSort = ref('newest')
const statuses = ref<string[]>([])

const filtered = computed(() => {
  let list = [...store.list]

  // Text search — title or heading
  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.content.heading.toLowerCase().includes(q)
    )
  }

  // Status filter
  if (statuses.value.length) {
    list = list.filter(r => statuses.value.includes(r.status))
  }

  // Date sort
  list.sort((a, b) => {
    if (dateSort.value === 'oldest')  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    if (dateSort.value === 'updated') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime() // newest (default)
  })

  return list
})

function clearAll() {
  search.value = ''
  dateSort.value = 'newest'
  statuses.value = []
}
</script>
