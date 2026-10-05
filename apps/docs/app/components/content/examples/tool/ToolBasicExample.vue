<script setup lang="ts">
import {
  MtTool,
  MtToolContent,
  MtToolHeader,
  MtToolInput,
  MtToolOutput,
} from "@shopware-ag/meteor-component-library";

// The fields of an AI SDK tool part, as they arrive in `message.parts`.
const part = {
  type: "tool-searchProducts",
  state: "output-available",
  input: { query: "lamp", sortBy: "price", order: "desc", limit: 2 },
  output: {
    count: 8,
    products: [
      { sku: "SW-1010", name: "Halo pendant light, Black", price: 149 },
      { sku: "SW-1000", name: "Aurora desk lamp, Black", price: 89.9 },
    ],
  },
} as const;
</script>

<template>
  <mt-tool default-open>
    <mt-tool-header :type="part.type" :state="part.state" title="Search products" />
    <mt-tool-content>
      <mt-tool-input :input="part.input" />
      <mt-tool-output :output="part.output" />
    </mt-tool-content>
  </mt-tool>
</template>
