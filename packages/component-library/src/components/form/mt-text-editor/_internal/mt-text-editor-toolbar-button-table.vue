<template>
  <mt-text-editor-toolbar-button
    :button="button"
    :editor="props.editor"
    :disabled="disabled"
    @click="openTableModal"
  />

  <!-- Table modal -->
  <mt-modal-root :isOpen="showTableModal" @change="($event) => (showTableModal = $event)">
    <mt-modal :title="t('mt-text-editor-toolbar-button-table.modalTitle')" width="s">
      <template #default>
        <div class="mt-text-editor__table-modal">
          <mt-number-field
            :label="t('mt-text-editor-toolbar-button-table.columns')"
            v-model="tableColumns"
            type="number"
            :min="1"
            numberType="int"
          />
          <mt-number-field
            :label="t('mt-text-editor-toolbar-button-table.rows')"
            v-model="tableRows"
            type="number"
            :min="1"
            numberType="int"
          />
          <mt-switch
            :label="t('mt-text-editor-toolbar-button-table.showHeader')"
            v-model="tableShowHeader"
          />
        </div>
      </template>
      <template #footer>
        <div class="mt-text-editor__table-modal-footer">
          <mt-modal-close :as="mtButton" variant="secondary">
            {{ t("mt-text-editor-toolbar-button-table.cancel") }}
          </mt-modal-close>

          <mt-button variant="primary" @click="insertTable">
            {{ t("mt-text-editor-toolbar-button-table.insertTable") }}
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
import mtSwitch from "@/components/form/mt-switch/mt-switch.vue";
import mtTextEditorToolbarButton from "./mt-text-editor-toolbar-button.vue";
import mtNumberField from "@/components/form/mt-number-field/mt-number-field.vue";
import mtModalClose from "@/components/overlay/mt-modal/sub-components/mt-modal-close.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({
  useScope: "global",
  messages: {
    en: {
      "mt-text-editor-toolbar-button-table": {
        label: "Table",
        modalTitle: "Insert/Edit Table",
        insertTable: "Insert table",
        cancel: "Cancel",
        columns: "Columns",
        rows: "Rows",
        showHeader: "Show header",
        insertRowBefore: "Insert row before",
        insertRowAfter: "Insert row after",
        deleteRow: "Delete row",
        insertColumnBefore: "Insert column before",
        insertColumnAfter: "Insert column after",
        deleteColumn: "Delete column",
        removeTable: "Remove table",
      },
    },
    de: {
      "mt-text-editor-toolbar-button-table": {
        label: "Tabelle",
        modalTitle: "Tabelle einfügen/bearbeiten",
        insertTable: "Tabelle einfügen",
        cancel: "Abbrechen",
        columns: "Spalten",
        rows: "Zeilen",
        showHeader: "Kopfzeile anzeigen",
        insertRowBefore: "Zeile davor einfügen",
        insertRowAfter: "Zeile danach einfügen",
        deleteRow: "Zeile löschen",
        insertColumnBefore: "Spalte davor einfügen",
        insertColumnAfter: "Spalte danach einfügen",
        deleteColumn: "Spalte löschen",
        removeTable: "Tabelle entfernen",
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

const showTableModal = ref(false);
const tableColumns = ref(3);
const tableRows = ref(3);
const tableShowHeader = ref(true);

const openTableModal = () => {
  // Don't open the modal if the table is already active
  if (props.editor.isActive("table")) {
    return;
  }

  tableColumns.value = 3;
  tableRows.value = 3;
  tableShowHeader.value = true;
  showTableModal.value = true;
};

const insertTable = () => {
  // Insert a new table
  props.editor
    .chain()
    .focus()
    .insertTable({
      rows: tableRows.value,
      cols: tableColumns.value,
      withHeaderRow: tableShowHeader.value,
    })
    .run();

  showTableModal.value = false;
};
</script>

<script lang="ts">
export const tableButton: CustomButton = {
  name: "table",
  label: "mt-text-editor-toolbar-button-table.label",
  icon: "regular-table-xs",
  disabled: (editor, globalDisabled) => {
    if (globalDisabled) {
      return true;
    }

    return editor.isActive("table");
  },
  position: 13000,
  contextualButtons: (editor) => {
    if (!editor.isActive("table")) {
      return [];
    }

    return [
      {
        name: "table-insert-row-before",
        label: "Insert row before",
        icon: "regular-insert-row-before",
        action: (editor) => editor.chain().focus().addRowBefore().run(),
      },
      {
        name: "table-insert-row-after",
        label: "Insert row after",
        icon: "regular-insert-row-after",
        action: (editor) => editor.chain().focus().addRowAfter().run(),
      },
      {
        name: "table-delete-row",
        label: "Delete row",
        icon: "regular-delete-row",
        action: (editor) => editor.chain().focus().deleteRow().run(),
      },
      {
        name: "table-insert-column-before",
        label: "Insert column before",
        icon: "regular-insert-column-before",
        action: (editor) => editor.chain().focus().addColumnBefore().run(),
      },
      {
        name: "table-insert-column-after",
        label: "Insert column after",
        icon: "regular-insert-column-after",
        action: (editor) => editor.chain().focus().addColumnAfter().run(),
      },
      {
        name: "table-delete-column",
        label: "Delete column",
        icon: "regular-delete-column",
        action: (editor) => editor.chain().focus().deleteColumn().run(),
      },
      {
        name: "table-remove-table",
        label: "Remove table",
        icon: "regular-times-xs",
        action: (editor) => editor.chain().focus().deleteTable().run(),
      },
    ];
  },
};
</script>

<style scoped>
.mt-text-editor__table-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--scale-size-8);
}
</style>
