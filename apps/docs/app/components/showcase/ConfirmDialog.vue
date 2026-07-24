<script setup lang="ts">
import MtModalRoot from "@shopware-ag/meteor-component-library/MtModalRoot";
import MtModal from "@shopware-ag/meteor-component-library/MtModal";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
import MtText from "@shopware-ag/meteor-component-library/MtText";

const open = defineModel<boolean>("open", { default: false });

withDefaults(
  defineProps<{
    title?: string;
    message?: string;
    confirmLabel?: string;
  }>(),
  {
    title: "Are you sure?",
    message: "This action cannot be undone.",
    confirmLabel: "Remove",
  },
);

const emit = defineEmits<{ confirm: [] }>();

function confirm() {
  emit("confirm");
  open.value = false;
}
</script>

<template>
  <mt-modal-root :is-open="open" @change="open = $event">
    <mt-modal :title="title" width="s">
      <mt-text size="s" color="color-text-secondary-default">{{
        message
      }}</mt-text>
      <template #footer>
        <div class="confirm-footer">
          <mt-button variant="secondary" size="small" @click="open = false"
            >Cancel</mt-button
          >
          <mt-button variant="critical" size="small" @click="confirm">{{
            confirmLabel
          }}</mt-button>
        </div>
      </template>
    </mt-modal>
  </mt-modal-root>
</template>

<style scoped>
.confirm-footer {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: var(--scale-size-8);
}
</style>
