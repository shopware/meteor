<script setup lang="ts">
import { ref } from "vue";
import { MtButton, MtPage } from "@shopware-ag/meteor-component-library";

const isOpen = ref(true);
</script>

<template>
  <div style="height: 320px">
    <mt-page
      v-if="isOpen"
      :breadcrumb="[{ label: 'Shopping Experiences', icon: 'image-text' }]"
      closable
      @close="isOpen = false"
    >
      <placeholder-slot name="default" />
    </mt-page>

    <mt-button v-else variant="secondary" size="default" @click="isOpen = true">
      Open again
    </mt-button>
  </div>
</template>
