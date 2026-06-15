<script setup lang="ts">
import MtTooltip from "@shopware-ag/meteor-component-library/MtTooltip";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
</script>

<template>
  <mt-tooltip content="Tooltip content" placement="top">
    <template #default="params">
      <mt-button variant="secondary" v-bind="params">Top</mt-button>
    </template>
  </mt-tooltip>

  <mt-tooltip content="Tooltip content" placement="right">
    <template #default="params">
      <mt-button variant="secondary" v-bind="params">Right</mt-button>
    </template>
  </mt-tooltip>

  <mt-tooltip content="Tooltip content" placement="bottom">
    <template #default="params">
      <mt-button variant="secondary" v-bind="params">Bottom</mt-button>
    </template>
  </mt-tooltip>

  <mt-tooltip content="Tooltip content" placement="left">
    <template #default="params">
      <mt-button variant="secondary" v-bind="params">Left</mt-button>
    </template>
  </mt-tooltip>
</template>
