<script setup lang="ts">
import {
  MtBadge,
  MtChainOfThought,
  MtChainOfThoughtContent,
  MtChainOfThoughtHeader,
  MtChainOfThoughtStep,
} from "@shopware-ag/meteor-component-library";
</script>

<template>
  <mt-chain-of-thought default-open>
    <mt-chain-of-thought-header>Checking the stock</mt-chain-of-thought-header>
    <mt-chain-of-thought-content>
      <mt-chain-of-thought-step
        label="Looked up the products"
        description="The merchant asks which products run out soon, so I searched the catalog for low stock."
      />
      <mt-chain-of-thought-step label="Found 3 products">
        <div class="chain-of-thought-example__results">
          <mt-badge size="s">Desk lamp</mt-badge>
          <mt-badge size="s">Oak shelf</mt-badge>
          <mt-badge size="s">Linen cushion</mt-badge>
        </div>
      </mt-chain-of-thought-step>
      <mt-chain-of-thought-step
        label="Checking the sales of the last 30 days…"
        status="active"
      />
      <mt-chain-of-thought-step label="Write the answer" status="pending" />
    </mt-chain-of-thought-content>
  </mt-chain-of-thought>
</template>

<style scoped>
.chain-of-thought-example__results {
  display: flex;
  flex-wrap: wrap;
  gap: var(--scale-size-4);
  padding-block: var(--scale-size-4);
}
</style>
