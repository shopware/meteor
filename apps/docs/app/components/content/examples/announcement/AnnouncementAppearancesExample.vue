<script setup lang="ts">
import { MtAnnouncement } from "@shopware-ag/meteor-component-library";
</script>

<template>
  <div style="display: grid; gap: var(--scale-size-8)">
    <mt-announcement variant="critical" icon="solid-exclamation-circle">
      Orders can't be saved right now. We are working on a fix.
    </mt-announcement>

    <mt-announcement variant="critical" appearance="strong" icon="solid-exclamation-circle">
      Orders can't be saved right now. We are working on a fix.
    </mt-announcement>
  </div>
</template>
