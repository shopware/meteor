<script setup lang="ts">
import { ref } from "vue";
import MtRadioGroupRoot from "@shopware-ag/meteor-component-library/MtRadioGroupRoot";
import MtRadioGroupList from "@shopware-ag/meteor-component-library/MtRadioGroupList";
import MtRadioGroupCardItem from "@shopware-ag/meteor-component-library/MtRadioGroupCardItem";

const selectedShippingMethod = ref("standard");
</script>

<template>
  <mt-radio-group-root v-model="selectedShippingMethod" label="Shipping method">
    <mt-radio-group-list>
      <mt-radio-group-card-item
        id="shipping-standard"
        value="standard"
        label="Standard delivery"
        description="Delivered within 3 to 5 business days."
      />
      <mt-radio-group-card-item
        id="shipping-express"
        value="express"
        label="Express delivery"
        description="Delivered on the next business day."
      />
    </mt-radio-group-list>
  </mt-radio-group-root>
</template>
