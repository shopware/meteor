<template>
  <div class="ex-dailymotion-element">
    <h2>
      Your dailymotion video stuff!
    </h2>

    <div class="sw-cms-el-dailymotion">
      <div class="sw-cms-el-dailymotion-iframe-wrapper">
        <iframe
          frameborder="0"
          type="text/html"
          width="100%"
          height="100%"
          :src="dailyUrl"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { data } from '@shopware-ag/meteor-admin-sdk';
import EX_DAILYMOTION_CONSTANTS from './ex-dailymotion-constants';

const dataSelectors = [
  'config.dailyUrl.value',
  'config.dailyUrl.source',
];

const dailyUrlValue = ref<string|undefined>(undefined);
const dailyUrlSource = ref<string>('static');

const dailyUrl = computed(() => {
  const dailymotionURL = dailyUrlValue.value || 'x8hc5d6';

  return `https://www.dailymotion.com/embed/video/${dailymotionURL}`;
});

const dataId = computed(() => {
  const params = new URLSearchParams(window.location.search);
  const elementId = params.get('elementId');

  if (!elementId) {
    return EX_DAILYMOTION_CONSTANTS.PUBLISHING_KEY;
  }

  return EX_DAILYMOTION_CONSTANTS.PUBLISHING_KEY + '__' + elementId;
});

onBeforeMount(async () => {
  const value = await data.get({
    id: dataId.value,
    selectors: dataSelectors,
  }) as {
    'config.dailyUrl.value': string,
    'config.dailyUrl.source': string,
  };

  if (value) {
    dailyUrlValue.value = value['config.dailyUrl.value'];
    dailyUrlSource.value = value['config.dailyUrl.source'];
  }

  data.subscribe(
    dataId.value,
    // @ts-expect-error -- TS doesn't know about the subscriber
    elementSubscriber,
  {
    selectors: dataSelectors,
  });
});

function elementSubscriber(response: { data: {
  'config.dailyUrl.value': string,
  'config.dailyUrl.source': string,
}, id: string }): void {
  dailyUrlSource.value = response.data['config.dailyUrl.source'];
  dailyUrlValue.value = response.data['config.dailyUrl.value'];
}
</script>

<style scoped>
.sw-cms-el-dailymotion-iframe-wrapper {
  height: 500px;
}
</style>