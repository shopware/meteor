<script setup lang="ts">
import { ref } from "vue";
import { MtAnnouncement, MtButton } from "@shopware-ag/meteor-component-library";

const isOpen = ref(true);
</script>

<template>
  <mt-announcement
    v-if="isOpen"
    variant="info"
    icon="regular-megaphone"
    closable
    @close="isOpen = false"
  >
    Join our live product update on Thursday, November 20, at 3:00 PM CET.
  </mt-announcement>

  <mt-button v-else variant="secondary" @click="isOpen = true">Show announcement</mt-button>
</template>
