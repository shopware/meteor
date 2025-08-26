<template>
  <div>
    <h2>
      Config!
    </h2>

    Video-Code: <input
      v-model="dailyUrl"
      type="text"
    ><br>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import { data } from '@shopware-ag/meteor-admin-sdk';
import EX_DAILYMOTION_CONSTANTS from './ex-dailymotion-constants';

const dailyUrlValue = ref('');
const dailyUrlSource = ref('static');

const dataSelectors = [
  'config.dailyUrl.value',
  'config.dailyUrl.source',
];

const dataId = computed(() => {
  const params = new URLSearchParams(window.location.search);
  const elementId = params.get('elementId');

  if (!elementId) {
    return EX_DAILYMOTION_CONSTANTS.PUBLISHING_KEY;
  }

  return EX_DAILYMOTION_CONSTANTS.PUBLISHING_KEY + '__' + elementId;
});

const dailyUrl = computed({
  get(): string {
      return dailyUrlValue.value || '';
  },

  set(value: string): void {
      dailyUrlValue.value = value;

      data.update({
          id: dataId.value,
          data: {
            config: {
              dailyUrl: {
                value: dailyUrlValue.value,
                source: dailyUrlSource.value,
              }
            }
          },
      });
  }
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
});
</script>