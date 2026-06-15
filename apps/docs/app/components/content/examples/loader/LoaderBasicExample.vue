<script setup lang="ts">
import MtLoader from "@shopware-ag/meteor-component-library/MtLoader";
</script>

<template>
  <!-- mt-loader is absolutely positioned and fills its nearest positioned
       ancestor, so place it inside a container with a size. -->
  <div style="position: relative; width: 100%; height: 160px">
    <mt-loader :backdrop=false />
  </div>
</template>
