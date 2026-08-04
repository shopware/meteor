<script setup lang="ts">
import { ref } from "vue";
import MtRadioGroupRoot from "@shopware-ag/meteor-component-library/MtRadioGroupRoot";
import MtRadioGroupList from "@shopware-ag/meteor-component-library/MtRadioGroupList";
import MtRadioGroupItem from "@shopware-ag/meteor-component-library/MtRadioGroupItem";

const selectedValue = ref("value1");
</script>

<template>
  <mt-radio-group-root v-model="selectedValue" label="Radio field">
    <mt-radio-group-list>
      <mt-radio-group-item id="option-1" value="value1" label="Option 1" />
      <mt-radio-group-item id="option-2" value="value2" label="Option 2" />
      <mt-radio-group-item id="option-3" value="value3" label="Option 3" />
    </mt-radio-group-list>
  </mt-radio-group-root>
</template>
