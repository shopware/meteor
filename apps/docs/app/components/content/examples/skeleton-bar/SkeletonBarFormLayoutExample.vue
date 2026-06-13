<script setup lang="ts">
import MtSkeletonBar from "@shopware-ag/meteor-component-library/MtSkeletonBar";
</script>

<template>
  <div style="display: grid; gap: 32px">
    <div
      style="
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 32px;
      "
    >
      <div>
        <mt-skeleton-bar />
      </div>
      <div>
        <mt-skeleton-bar />
      </div>
    </div>

    <div
      style="
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 32px;
      "
    >
      <div>
        <mt-skeleton-bar />
      </div>
      <div>
        <mt-skeleton-bar />
      </div>
    </div>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 32px;
      "
    >
      <div>
        <mt-skeleton-bar />
      </div>
      <div>
        <mt-skeleton-bar />
      </div>
      <div>
        <mt-skeleton-bar />
      </div>
    </div>
  </div>
</template>
