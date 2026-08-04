<script setup lang="ts">
import MtStatusDot from "@shopware-ag/meteor-component-library/MtStatusDot";
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: center">
    <mt-status-dot variant="neutral" />
    <mt-status-dot variant="info" />
    <mt-status-dot variant="attention" />
    <mt-status-dot variant="critical" />
    <mt-status-dot variant="positive" />
  </div>
</template>
