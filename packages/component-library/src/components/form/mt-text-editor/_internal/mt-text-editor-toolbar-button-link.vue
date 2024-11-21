<template>
  <mt-text-editor-toolbar-button
    :button="button"
    :editor="props.editor"
    :disabled="disabled"
    @click="openLinkModal"
  />

  <!-- Link modal -->
  <mt-modal-root :isOpen="showLinkModal" @change="($event) => showLinkModal = $event">
      <mt-modal title="Insert/Edit Link" width="s">
        <template #default>
          <div class="mt-text-editor__link-modal">
            <mt-text-field
              label="URL"
              v-model="linkHref"
              placeholder="https://example.com"
              required
            />
            <mt-switch
              label="Open in new tab"
              :checked="linkTarget === '_blank'"
              @change="(checked) => {
                linkTarget = checked ? '_blank' : '';
              }"
            />
          </div>
        </template>
        <template #footer>
          <div class="mt-text-editor__link-modal-footer">
            <mt-button
              variant="secondary"
              @click="() => showLinkModal = false"
            >
              Cancel
            </mt-button>
            <mt-button
              variant="primary"
              @click="() => {
                editor.chain().focus().extendMarkRange('link').setLink({ href: linkHref, target: linkTarget }).run();
                showLinkModal = false;
              }"
            >
              Save
            </mt-button>
          </div>
        </template>
      </mt-modal>
    </mt-modal-root>
</template>

<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3';
import { ref, type PropType } from 'vue';
import type { CustomButton } from './mt-text-editor-toolbar.vue';
import mtModalRoot from '@/components/overlay/mt-modal/sub-components/mt-modal-root.vue';
import mtModal from '@/components/overlay/mt-modal/mt-modal.vue';
import mtButton from '@/components/form/mt-button/mt-button.vue';
import mtTextField from '@/components/form/mt-text-field/mt-text-field.vue';
import mtSwitch from '@/components/form/mt-switch/mt-switch.vue';
import mtTextEditorToolbarButton from './mt-text-editor-toolbar-button.vue';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  button: {
    type: Object as PropType<CustomButton>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const showLinkModal = ref(false);
const linkHref = ref('');
const linkTarget = ref('');

const openLinkModal = () => {
  // Get current link from selection
  linkHref.value = props.editor.getAttributes('link').href ?? '';
  linkTarget.value = props.editor.getAttributes('link').target ?? '';

  showLinkModal.value = true;
}
</script>

<script lang="ts">
export const linkButton: CustomButton = {
  name: 'link',
  label: 'Link',
  icon: 'regular-link-xs',
  position: 12000,
}
</script>

<style lang="scss" scoped>
.mt-text-editor__link-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>