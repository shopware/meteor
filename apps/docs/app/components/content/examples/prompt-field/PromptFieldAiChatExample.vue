<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import {
  MtPromptField,
  MtPromptFieldActionMenu,
  MtPromptFieldAddAttachments,
  MtPromptFieldModelSelect,
  MtContextUsage,
  MtAttachment,
  MtActionMenuItem,
  type MtChatStatus,
} from "@shopware-ag/meteor-component-library";

const models = [
  {
    value: "standard",
    label: "Standard",
    description: "Fast everyday answers",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Deeper reasoning, slower",
  },
];
const model = ref("standard");

const status = ref<MtChatStatus>("ready");
const usedTokens = ref(12_000);
const hasProductContext = ref(true);

let request: ReturnType<typeof setTimeout> | undefined;

function stop() {
  clearTimeout(request);
  status.value = "ready";
}

function send() {
  status.value = "submitted";
  request = setTimeout(() => {
    status.value = "streaming";
    request = setTimeout(() => {
      usedTokens.value += 18_000;
      stop();
    }, 2000);
  }, 600);
}

onBeforeUnmount(stop);
</script>

<template>
  <mt-prompt-field
    placeholder="How can I help you today?"
    :status="status"
    accept="image/*,application/pdf"
    :max-files="5"
    @submit="send"
    @stop="stop"
  >
    <template #header>
      <mt-attachment
        v-if="hasProductContext"
        icon="regular-products"
        label="Product: Lamp"
        removable
        @remove="hasProductContext = false"
      />
    </template>

    <template #tools>
      <mt-prompt-field-action-menu>
        <mt-prompt-field-add-attachments />
        <mt-action-menu-item
          icon="regular-products"
          :disabled="hasProductContext"
          @select="hasProductContext = true"
        >
          Add the current product
        </mt-action-menu-item>
      </mt-prompt-field-action-menu>
      <mt-context-usage :used="usedTokens" :total="200_000" />
    </template>

    <template #tools-end>
      <mt-prompt-field-model-select v-model="model" :models="models" />
    </template>
  </mt-prompt-field>
</template>
