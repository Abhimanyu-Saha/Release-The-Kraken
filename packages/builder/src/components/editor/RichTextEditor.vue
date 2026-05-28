<template>
  <div class="h-full flex flex-col rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-[#262A20] focus-within:border-transparent overflow-hidden transition-all">
    <!-- Toolbar -->
    <div v-if="editor" class="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
      <ToolbarBtn :active="editor.isActive('bold')"       @click="editor.chain().focus().toggleBold().run()"       title="Bold (Ctrl+B)">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
      </ToolbarBtn>
      <ToolbarBtn :active="editor.isActive('italic')"     @click="editor.chain().focus().toggleItalic().run()"     title="Italic (Ctrl+I)">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><line x1="19" y1="4" x2="10" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="20" x2="5" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="4" x2="9" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </ToolbarBtn>
      <ToolbarBtn :active="editor.isActive('underline')"  @click="editor.chain().focus().toggleUnderline().run()"  title="Underline (Ctrl+U)">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
      </ToolbarBtn>

      <div class="w-px h-4 bg-gray-200 mx-1" />

      <ToolbarBtn :active="editor.isActive('bulletList')"  @click="editor.chain().focus().toggleBulletList().run()"  title="Bullet list">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></svg>
      </ToolbarBtn>
      <ToolbarBtn :active="editor.isActive('orderedList')" @click="editor.chain().focus().toggleOrderedList().run()" title="Numbered list">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4" stroke="currentColor"/><path d="M4 10h2" stroke="currentColor"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" stroke="currentColor"/></svg>
      </ToolbarBtn>

      <div class="w-px h-4 bg-gray-200 mx-1" />

      <!-- Link button + inline input -->
      <div class="relative flex items-center">
        <ToolbarBtn
          :active="editor.isActive('link') || linkInputOpen"
          title="Link"
          @click="toggleLinkInput"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </ToolbarBtn>

        <!-- Inline URL popover -->
        <div
          v-if="linkInputOpen"
          class="absolute top-full left-0 mt-1 z-30 flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-1.5"
          style="min-width: 260px"
          @keydown.stop
        >
          <input
            ref="linkInputEl"
            v-model="linkUrl"
            type="url"
            placeholder="https://…"
            class="flex-1 text-xs text-gray-900 placeholder-gray-400 outline-none"
            @keydown.enter.prevent="applyLink"
            @keydown.escape.prevent="closeLinkInput"
          />
          <button
            type="button"
            class="shrink-0 text-xs font-medium text-white bg-[#262A20] rounded-md px-2 py-0.5 hover:bg-[#3c4332] transition-colors"
            @click="applyLink"
          >
            Apply
          </button>
          <button
            v-if="editor.isActive('link')"
            type="button"
            class="shrink-0 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
            title="Remove link"
            @click="removeLink"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18.84 12.25l1.72-1.71a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M5.17 11.75l-1.72 1.71a5 5 0 0 0 7.07 7.07l1.71-1.71"/><line x1="4" y1="4" x2="20" y2="20"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="w-px h-4 bg-gray-200 mx-1" />

      <ToolbarBtn :active="false" @click="editor.chain().focus().clearNodes().unsetAllMarks().run()" title="Clear formatting">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5l7 7-7 7"/><path d="M19 12H5"/><line x1="4" y1="20" x2="10" y2="20"/></svg>
      </ToolbarBtn>
    </div>

    <!-- Editor content -->
    <EditorContent
      :editor="editor"
      class="flex-1 overflow-y-auto min-h-[96px] text-sm text-gray-900 [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:my-0.5 [&_.ProseMirror_ul]:pl-4 [&_.ProseMirror_ol]:pl-4 [&_.ProseMirror_li]:my-0.5 [&_.ProseMirror_strong]:font-semibold [&_.ProseMirror_em]:italic [&_.ProseMirror_u]:underline [&_.ProseMirror_a]:text-blue-600 [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:cursor-pointer [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { watch, ref, nextTick, defineComponent, h, onBeforeUnmount } from 'vue'

const props = defineProps<{ modelValue: string | null; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [val: string | null] }>()

const ToolbarBtn = defineComponent({
  props: { active: Boolean, title: String },
  emits: ['click'],
  setup(p, { slots, emit }) {
    return () =>
      h('button', {
        type: 'button',
        title: p.title,
        class: [
          'p-1.5 rounded transition-colors',
          p.active
            ? 'bg-gray-200 text-gray-900'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800',
        ].join(' '),
        onClick: () => emit('click'),
      }, slots.default?.())
  },
})

const editor = useEditor({
  extensions: [
    StarterKit.configure({ heading: false, blockquote: false, codeBlock: false, code: false, horizontalRule: false }),
    Underline,
    Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
  ],
  content: props.modelValue ?? '',
  editorProps: {
    attributes: {
      'data-placeholder': props.placeholder ?? 'Describe the release in detail…',
    },
  },
  onUpdate({ editor }) {
    const html = editor.isEmpty ? null : editor.getHTML()
    emit('update:modelValue', html)
  },
})

watch(
  () => props.modelValue,
  (val) => {
    if (!editor.value) return
    const current = editor.value.isEmpty ? null : editor.value.getHTML()
    if (val !== current) editor.value.commands.setContent(val ?? '')
  },
)

// Link popover state
const linkInputOpen = ref(false)
const linkUrl = ref('')
const linkInputEl = ref<HTMLInputElement | null>(null)

function toggleLinkInput() {
  if (linkInputOpen.value) {
    closeLinkInput()
    return
  }
  linkUrl.value = editor.value?.getAttributes('link').href ?? ''
  linkInputOpen.value = true
  nextTick(() => linkInputEl.value?.focus())
}

function applyLink() {
  const url = linkUrl.value.trim()
  if (!url) { removeLink(); return }
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  closeLinkInput()
}

function removeLink() {
  editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
  closeLinkInput()
}

function closeLinkInput() {
  linkInputOpen.value = false
  linkUrl.value = ''
}

function onDocClick(e: MouseEvent) {
  if (linkInputOpen.value && !(e.target as HTMLElement).closest('.relative')) {
    closeLinkInput()
  }
}

document.addEventListener('click', onDocClick)
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>
