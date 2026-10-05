<script setup lang="ts">
import {
  MtChainOfThought,
  MtChainOfThoughtContent,
  MtChainOfThoughtHeader,
  MtChainOfThoughtStep,
} from "@shopware-ag/meteor-component-library";
</script>

<template>
  <mt-chain-of-thought>
    <mt-chain-of-thought-header>Worked for 12 seconds</mt-chain-of-thought-header>
    <mt-chain-of-thought-content>
      <mt-chain-of-thought-step label="Looked up the products" />
      <mt-chain-of-thought-step label="Compared the sales of the last 30 days" />
      <mt-chain-of-thought-step label="Wrote the reorder list" />
    </mt-chain-of-thought-content>
  </mt-chain-of-thought>
</template>
