<template>
  <div>
    <p><strong>Changing existing data: </strong></p>

    <br>
    <br>

    <sw-text-field
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

    <sw-button @click="loadManufacturer">
      Load first manufacturer
    </sw-button>

    <br>
    <br>
      
    <sw-text-field
      v-if="manufacturer"
      v-model="manufacturer.name"
      label="Manufacturer name"
    />
    <sw-button
      v-if="manufacturer"
      @click="saveManufacturer"
    >
      Save manufacturer
    </sw-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { notification, data } from "@shopware-ag/admin-extension-sdk";
import { SwButton, SwTextField } from '@shopware-ag/meteor-component-library';

export default Vue.extend({
  components: {
      'sw-button': SwButton,
      'sw-text-field': SwTextField,
  },
  data(): {
    product: any,
    manufacturer: any,
  } {
      return {
        product: undefined,
        manufacturer: undefined
      }
  },
  computed: {
    productName: {
        get(): string {
            // @ts-expect-error
            return this.product?.name;
        },
        set(value): void {
            // @ts-expect-error
            if (this.product) {
                // @ts-expect-error
                this.product.name = value;
            }

            data.update({
                id: 'sw-product-detail__product',
                // @ts-expect-error
                data: this.product
            });
        }
    }
  },
  mounted(): void {
    data.get({ 
      id: 'sw-product-detail__product',
      selectors: ['name']
    }).then((product) => {
        console.log('product', product)
      this.product = product;
    });

    data.subscribe('sw-product-detail__product', (product) => {
      this.product = product.data;
    }, {
      selectors: ['name']
    });
  },

  methods: {
    async loadManufacturer() {
        const manufacturerCriteria = new data.Classes.Criteria(1, 1);

        const manufacturers = await data.repository('product_manufacturer').search(manufacturerCriteria);

        if (manufacturers) {
          this.manufacturer = manufacturers.first();
        }
    },

    async saveManufacturer() {
      data.repository('product_manufacturer').save(this.manufacturer).then(() => {
        notification.dispatch({
          title: 'Manufacturer saved',
          message: 'The manufacturer was saved successfully',
        })
      })
    }
  }
})
</script>

<style>
body {
    background-color: white;
}
</style>