<template>
  <iframe :src="src" class="SwagStorybookIframe"></iframe>
</template>

<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps({
  component: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    default: 'meteor-component-library.vercel.app',
  }
});

const src = computed(() => `https://${props.domain}/iframe.html?id=${props.component}&viewMode=docs&shortcuts=false&singleStory=true`);
</script>

<style>
.SwagStorybookIframe {
  border: 0;
  min-height: 50vh;
  width: 100%;
}
</style>
