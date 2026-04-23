<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  lessonId: string;
  locationId: string;
  code: string;
  runCode: string;
  runVersion: number;
  height?: number;
}>();

const frame = ref<HTMLIFrameElement | null>(null);

const frameSrc = computed(
  () => `/iframe-runtime.html?lesson-id=${props.lessonId}&location-id=${props.locationId}&run-version=${props.runVersion}`,
);

function syncFrame() {
  frame.value?.contentWindow?.postMessage(
    {
      source: 'tutorial-host',
      type: 'tutorial:set-code',
      lessonId: props.lessonId,
      locationId: props.locationId,
      code: props.code,
      runCode: props.runCode,
      runVersion: props.runVersion,
    },
    '*',
  );
}

watch(
  () => [props.locationId, props.runVersion, props.code, props.runCode],
  () => syncFrame(),
);
</script>

<template>
  <iframe
    ref="frame"
    class="location-frame"
    :src="frameSrc"
    :style="{ height: `${height ?? 180}px` }"
    :title="`Location iframe ${locationId}`"
    @load="syncFrame"
  />
</template>

<style scoped>
.location-frame {
  width: 100%;
  min-height: 140px;
  border: 1px solid #d8e0eb;
  border-radius: 12px;
  background: #ffffff;
}
</style>
