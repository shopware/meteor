<template>
  <mt-banner variant="neutral" title="Neutral banner">
    Use for general information that should stay visible in the page flow.
  </mt-banner>

  <mt-banner variant="info" title="Info banner">
    Use for informative updates or guidance that helps users continue their
    task.
  </mt-banner>

  <mt-banner variant="attention" title="Attention banner">
    Use when users should review something carefully before continuing.
  </mt-banner>

  <mt-banner variant="critical" title="Critical banner">
    Use for errors or states that require user attention.
  </mt-banner>

  <mt-banner variant="positive" title="Positive banner">
    Use for success states that should remain visible in context.
  </mt-banner>

  <mt-banner variant="inherited" title="Inherited banner">
    Use when content or configuration is inherited from another source.
  </mt-banner>
</template>

<script setup lang="ts">
import MtBanner from "@shopware-ag/meteor-component-library/MtBanner";
</script>
