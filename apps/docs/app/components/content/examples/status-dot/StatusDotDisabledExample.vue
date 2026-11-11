<script setup lang="ts">
import MtStatusDot from "@shopware-ag/meteor-component-library/MtStatusDot";
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: center">
    <mt-status-dot variant="neutral" disabled />
    <mt-status-dot variant="info" disabled />
    <mt-status-dot variant="attention" disabled />
    <mt-status-dot variant="critical" disabled />
    <mt-status-dot variant="positive" disabled />
  </div>
</template>
