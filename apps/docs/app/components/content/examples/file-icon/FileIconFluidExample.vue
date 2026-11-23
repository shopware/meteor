<script setup lang="ts">
import MtFileIcon from "@shopware-ag/meteor-component-library/MtFileIcon";
</script>

<template>
  <div class="preview">
    <mt-file-icon size="fluid" file-name="photos.zip" class="preview__icon" />
  </div>
</template>

<style scoped>
.preview {
  display: grid;
  place-items: center;
  width: 240px;
  aspect-ratio: 4 / 3;
  container-type: inline-size;
}

.preview__icon {
  width: 40cqw;
}
</style>
