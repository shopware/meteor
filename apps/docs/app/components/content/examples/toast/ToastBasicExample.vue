<script setup lang="ts">
import { ref } from "vue";
import MtToast from "@shopware-ag/meteor-component-library/MtToast";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
// The Toast type is only available from the barrel, it has no subpath export.
import type { Toast } from "@shopware-ag/meteor-component-library";

const toasts = ref<Toast[]>([]);

function addToast(toast: Omit<Toast, "id">) {
  toasts.value = [{ id: crypto.randomUUID(), ...toast }, ...toasts.value];
}

function removeToast(id: Toast["id"]) {
  toasts.value = toasts.value.filter((toast: Toast) => toast.id !== id);
}

function showPositive() {
  addToast({ type: "positive", msg: "Changes saved" });
}

function showInformal() {
  addToast({ type: "informal", msg: "Sync in progress" });
}

function showCritical() {
  addToast({ type: "critical", msg: "Could not save product", dismissible: true });
}

function showWithAction() {
  addToast({
    type: "positive",
    msg: "Item deleted",
    action: { label: "Undo", callback: () => addToast({ type: "informal", msg: "Restored" }) },
  });
}
</script>

<template>
  <mt-button variant="primary" size="small" @click="showPositive">Positive</mt-button>
  <mt-button variant="secondary" size="small" @click="showInformal">Informal</mt-button>
  <mt-button variant="critical" size="small" @click="showCritical">Critical</mt-button>
  <mt-button variant="secondary" size="small" @click="showWithAction">With action</mt-button>

  <mt-toast :toasts="toasts" @remove-toast="removeToast" />
</template>
