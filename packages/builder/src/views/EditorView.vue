<template>
  <AppShell>
    <div class="h-full flex flex-col w-full px-8">
      <EditorToolbar
        :status="status"
        :saving="saving"
        :submitting="submitting"
        :loading="formLoading"
        v-model:title="formData.title"
        @save="saveDraft()"
        @preview="openPreview()"
        @submit="submitForApproval()"
      />
      <div class="flex-1 mt-4 min-h-0 overflow-hidden">

        <!-- Loading skeleton — shown while fetching an existing release -->
        <template v-if="formLoading">
          <div class="h-full bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col animate-pulse">
            <!-- Header row -->
            <div class="px-4 py-3 border-b border-gray-100 shrink-0">
              <div class="h-3 w-32 rounded bg-gray-100" />
            </div>
            <!-- Two-column layout -->
            <div class="flex flex-1 overflow-hidden min-h-0">
              <!-- Left: section list skeleton -->
              <div class="shrink-0 border-r border-gray-100 flex flex-col gap-2 p-3" style="width: 270px">
                <div class="h-8 rounded-lg bg-gray-100" />
                <div class="h-8 rounded-lg bg-gray-100 opacity-70" />
                <div class="h-8 rounded-lg bg-gray-100 opacity-40" />
              </div>
              <!-- Right: form skeleton -->
              <div class="flex-1 p-6 flex flex-col gap-4">
                <div class="flex gap-3">
                  <div class="flex-1 h-9 rounded-lg bg-gray-100" />
                  <div class="flex-1 h-9 rounded-lg bg-gray-100" />
                </div>
                <div class="h-40 rounded-lg bg-gray-100" />
                <div class="h-9 w-1/3 rounded-lg bg-gray-100" />
                <div class="grid grid-cols-2 gap-3">
                  <div class="h-9 rounded-lg bg-gray-100" />
                  <div class="h-9 rounded-lg bg-gray-100" />
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Multiple go-live: sections editor -->
        <template v-else-if="formData.go_live_type === 'multiple'">
          <SectionsEditor
            class="h-full"
            :sections="formData.sections"
            :active-section-index="activeSectionIndex"
            @update:active-section-index="activeSectionIndex = $event"
            @add-section="addSection()"
            @remove-section="removeSection($event)"
          />
        </template>

        <!-- Single go-live -->
        <template v-else>
          <SingleEditor class="h-full" :form="formData" />
        </template>

      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppShell from '../components/layout/AppShell.vue'
import EditorToolbar from '../components/editor/EditorToolbar.vue'
import SingleEditor from '../components/editor/SingleEditor.vue'
import SectionsEditor from '../components/editor/SectionsEditor.vue'
import type { GoLiveType } from '@release-hub/shared'
import { useReleaseForm } from '../composables/useReleaseForm'

const route = useRoute()
const releaseId = route.params.id as string | undefined
const initialTitle = releaseId ? undefined : (route.query.title as string | undefined)
const initialGoLiveType = releaseId ? undefined : (route.query.type as GoLiveType | undefined)
const {
  formData,
  previewData,
  status,
  saving,
  submitting,
  formLoading,
  saveDraft,
  submitForApproval,
  activeSectionIndex,
  addSection,
  removeSection,
} = useReleaseForm(releaseId, initialTitle, initialGoLiveType)

function openPreview() {
  const payload = {
    template: formData.template,
    go_live_type: formData.go_live_type,
    image_size: formData.image_size,
    content: formData.go_live_type === 'multiple'
      ? { ...previewData.value, sections: formData.sections }
      : previewData.value,
    activeSectionIndex: activeSectionIndex.value,
  }
  localStorage.setItem('rh_preview_data', JSON.stringify(payload))
  window.open('/preview', '_blank', 'width=1040,height=840,noopener')
}
</script>
