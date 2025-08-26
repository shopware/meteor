<template>
  <div>
    <p><strong>Changing existing data: </strong></p>

    <br>
    <br>

    <SwTextField
      v-model="productName"
      label="Product name"
    />

    <p>You can see in the title that the product name gets updated in realtime.</p>

    <br>
    <br>

    <p><strong>Working with repository: </strong></p>

    <br>
    <br>

    <p>You can have access to the whole repository functionalities for creating, reading, updating and deleting entities.</p>

    <br>

    <SwButton @click="loadManufacturer">
      Load first manufacturer
    </SwButton>

    <br>
    <br>
      
    <SwTextField
      v-if="manufacturer"
      v-model="manufacturer.name"
      label="Manufacturer name"
    />
    <SwButton
      v-if="manufacturer"
      @click="saveManufacturer"
    >
      Save manufacturer
    </SwButton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { notification, data } from "@shopware-ag/meteor-admin-sdk";
import { SwButton, SwTextField } from '@shopware-ag/meteor-component-library';

const product = ref<EntitySchema.Entity<'product'>|undefined|null>(undefined);
const manufacturer = ref<EntitySchema.Entity<'product_manufacturer'>|undefined|null>(undefined);

const productName = computed({
  get(): string {
      return product.value?.name ?? '';
  },
  set(value): void {
    if (product.value) {
        product.value.name = value;
    }

    data.update({
        id: 'sw-product-detail__product',
        data: product.value
    });
  }
});

onMounted(() => {
  data.get({ 
    id: 'sw-product-detail__product',
    selectors: ['name']
  }).then((data) => {
      product.value = data as EntitySchema.Entity<'product'>;
  });

  data.subscribe('sw-product-detail__product', (data) => {
    product.value = data.data as EntitySchema.Entity<'product'>;
  }, {
    selectors: ['name']
  });
});

async function loadManufacturer() {
    const manufacturerCriteria = new data.Classes.Criteria(1, 1);

    const manufacturers = await data.repository('product_manufacturer').search(manufacturerCriteria);

    if (manufacturers) {
      manufacturer.value = manufacturers.first();
    }
}

async function saveManufacturer() {
  if (!manufacturer.value) {
    return;
  }

  data.repository('product_manufacturer').save(manufacturer.value).then(() => {
    notification.dispatch({
      title: 'Manufacturer saved',
      message: 'The manufacturer was saved successfully',
    })
  })
}
</script>

<style>
body {
    background-color: white;
}
</style>