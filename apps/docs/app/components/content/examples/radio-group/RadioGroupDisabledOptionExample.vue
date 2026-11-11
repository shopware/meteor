<script setup lang="ts">
import { ref } from "vue";
import {
  MtRadioGroupRoot,
  MtRadioGroupList,
  MtRadioGroupItem,
} from "@shopware-ag/meteor-component-library";

const selectedPaymentMethod = ref("invoice");
</script>

<template>
  <mt-radio-group-root
    v-model="selectedPaymentMethod"
    label="Payment method"
    hint="Direct debit needs a verified bank account."
  >
    <mt-radio-group-list>
      <mt-radio-group-item id="payment-invoice" value="invoice" label="Invoice" />
      <mt-radio-group-item
        id="payment-direct-debit"
        value="direct-debit"
        label="Direct debit"
        disabled
      />
      <mt-radio-group-item id="payment-credit-card" value="credit-card" label="Credit card" />
    </mt-radio-group-list>
  </mt-radio-group-root>
</template>
