<template>
  <template v-if="!isLoading && boosting">
    {{  }}
    <mt-text-field
      v-model="boosting.value.name"
      label="Name"
    ></mt-text-field>

    <mt-number-field
      v-model="boosting.value.boost"
      label="Boost"
    ></mt-number-field>
  </template>
  <div v-else :style="{ minHeight: '150px' }">
    <mt-loader />
  </div>
</template>

<script setup lang="ts">
import { composables, data, notification } from '@shopware-ag/meteor-admin-sdk'
import { MtLoader, MtTextField, MtNumberField } from '@shopware-ag/meteor-component-library'
import type { Entity } from '@shopware-ag/meteor-admin-sdk/es/_internals/data/Entity'
import { ref, onMounted } from 'vue'
import { useAdvancedSearch } from '../store/sw-advanced-search.store'

const { advancedSearchConfigId, isReady } = useAdvancedSearch()
const boostingRepository = data.repository('advanced_search_boosting')

const { useSharedState } = composables
const isLoading = ref(true)
const boostingId = useSharedState('boostingId', '')
const boosting = useSharedState('boostingEntity', null)

const getBoosting = async () => {
  isLoading.value = true

  // Create new boosting value if it doesn't exist
  if (!boostingId.value) {
    const boostingEntity = await boostingRepository.create()

    boostingEntity.configId = advancedSearchConfigId.value;
    boostingEntity.name = null;
    boostingEntity.boost = null;
    boostingEntity.active = null;
    boostingEntity.validFrom = null;
    boostingEntity.validTo = null;
    boostingEntity.productStreamId = null;
    boostingEntity.entityStreamId = null;

    boosting.value = boostingEntity

    isLoading.value = false;
    return;
  }

  // Load existing boosting
  try {
    const response = await boostingRepository.get(boostingId.value);
    // @ts-expect-error
    boosting.value = response;

    console.log("boosting.value", boosting.value);
  } catch (error) {
    boosting.value = null;

    void notification.dispatch({
      variant: 'error',
      title: `Error loading boosting`,
      message: `${error?.message}`,
    })
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  // Wait 1 second to be sure that everything is loaded
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Load boosting
  await getBoosting();
})
</script>
