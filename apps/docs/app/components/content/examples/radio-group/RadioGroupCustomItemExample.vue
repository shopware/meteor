<script setup lang="ts">
import { ref } from "vue";
import MtRadioGroupRoot from "@shopware-ag/meteor-component-library/MtRadioGroupRoot";
import MtRadioGroupCustomItem from "@shopware-ag/meteor-component-library/MtRadioGroupCustomItem";
import MtRadioGroupIndicator from "@shopware-ag/meteor-component-library/MtRadioGroupIndicator";
import ExampleRadioOption from "@shopware-ag/meteor-component-library/ExampleRadioOption";

const selectedPlan = ref("pro");
</script>

<template>
  <mt-radio-group-root v-model="selectedPlan" label="Choose a plan">
    <template #default="{ disabled, identification }">
      <div style="display: flex; gap: var(--scale-size-24)">
        <mt-radio-group-custom-item value="pro">
          <example-radio-option
            :checked="selectedPlan === 'pro'"
            :disabled="disabled"
            title="Pro"
            feature1="100 image generations"
            feature2="Unlimited workflows"
            feature3="Advanced analytics"
            price="$10"
          >
            <template #indicator>
              <mt-radio-group-indicator
                id="indicator-1"
                :name="identification"
                value="pro"
                :checked="selectedPlan === 'pro'"
                :disabled="disabled"
              />
            </template>
          </example-radio-option>
        </mt-radio-group-custom-item>
        <mt-radio-group-custom-item value="plus">
          <example-radio-option
            :checked="selectedPlan === 'plus'"
            :disabled="disabled"
            title="Plus"
            feature1="300 image generations"
            feature2="Unlimited workflows"
            feature3="Advanced analytics"
            price="$15"
          >
            <template #indicator>
              <mt-radio-group-indicator
                id="indicator-2"
                :name="identification"
                value="plus"
                :checked="selectedPlan === 'plus'"
                :disabled="disabled"
              />
            </template>
          </example-radio-option>
        </mt-radio-group-custom-item>
      </div>
    </template>
  </mt-radio-group-root>
</template>
