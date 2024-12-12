<template>
  <mt-text-editor-toolbar-button
    :button="button"
    :editor="props.editor"
    :disabled="disabled"
    @click="openLinkModal"
  />

  <!-- Link modal -->
  <mt-modal-root :isOpen="showLinkModal" @change="($event) => (showLinkModal = $event)">
    <mt-modal width="s" :title="t('mt-text-editor-toolbar-button-link.modalTitle')">
      <template #default>
        <div class="mt-text-editor__link-modal">
          <mt-text-field
            :label="t('mt-text-editor-toolbar-button-link.linkUrl')"
            v-model="linkHref"
            placeholder="https://example.com"
            required
          />
          <mt-switch
            :label="t('mt-text-editor-toolbar-button-link.openInNewTab')"
            :checked="linkTarget === '_blank'"
            @change="
              (checked) => {
                linkTarget = checked ? '_blank' : '';
              }
            "
            :aria-label="t('mt-text-editor-toolbar-button-link.openInNewTab')"
          />
        </div>
      </template>
      <template #footer>
        <div class="mt-text-editor__link-modal-footer">
          <mt-modal-close :as="mtButton" variant="secondary">
            {{ t("mt-text-editor-toolbar-button-link.cancel") }}
          </mt-modal-close>

          <mt-button
            variant="primary"
            @click="
              () => {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange('link')
                  .setLink({ href: linkHref, target: linkTarget })
                  .run();
                showLinkModal = false;
              }
            "
          >
            {{ t("mt-text-editor-toolbar-button-link.applyLink") }}
          </mt-button>
        </div>
      </template>
    </mt-modal>
  </mt-modal-root>
</template>

<script lang="ts" setup>
import type { Editor } from "@tiptap/vue-3";
import { ref, type PropType } from "vue";
import type { CustomButton } from "./mt-text-editor-toolbar.vue";
import mtModalRoot from "@/components/overlay/mt-modal/sub-components/mt-modal-root.vue";
import mtModal from "@/components/overlay/mt-modal/mt-modal.vue";
import mtButton from "@/components/form/mt-button/mt-button.vue";
import mtTextField from "@/components/form/mt-text-field/mt-text-field.vue";
import mtSwitch from "@/components/form/mt-switch/mt-switch.vue";
import mtTextEditorToolbarButton from "./mt-text-editor-toolbar-button.vue";
import mtModalClose from "@/components/overlay/mt-modal/sub-components/mt-modal-close.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({
  useScope: "global",
  messages: {
    en: {
      "mt-text-editor-toolbar-button-link": {
        modalTitle: "Insert/Edit Link",
        cancel: "Cancel",
        applyLink: "Apply link",
        openInNewTab: "Open in new tab",
        linkUrl: "Link URL",
        label: "Link",
      },
    },
    de: {
      "mt-text-editor-toolbar-button-link": {
        modalTitle: "Link einfügen/bearbeiten",
        cancel: "Abbrechen",
        applyLink: "Link anwenden",
        openInNewTab: "In neuem Tab öffnen",
        linkUrl: "Link URL",
        label: "Link",
      },
    },
  },
});

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
const linkHref = ref("");
const linkTarget = ref("");

const openLinkModal = () => {
  // Get current link from selection
  linkHref.value = props.editor.getAttributes("link").href ?? "";
  linkTarget.value = props.editor.getAttributes("link").target ?? "";

  showLinkModal.value = true;
};
</script>

<script lang="ts">
export const linkButton: CustomButton = {
  name: "link",
  label: "mt-text-editor-toolbar-button-link.label",
  icon: "regular-link-xs",
  position: 12000,
};
</script>

<style scoped>
.mt-text-editor__link-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--scale-size-8);
}
</style>
