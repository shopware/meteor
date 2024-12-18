<template>
  <div :style="componentStyling">
    <p>Auto-Resize: {{ isAutoResizing ? "On" : "Off" }}</p>
    <SwNumberField
      :value="heightInput"
      @input-change="setHeightInput"
    />

    <br><br>

    <SwButton @click="changeHeight">
      Set height of blue box to {{ heightInput }}
    </SwButton>
    <br>
    <SwButton @click="changeHeightManually">
      Set height of iFrame manually to {{ heightInput }}
    </SwButton>

    <br><br>

    <SwButton @click="startAutoResizing">
      Start auto resizing
    </SwButton>
    <SwButton @click="stopAutoResizing">
      Stop auto resizing
    </SwButton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { location } from "@shopware-ag/meteor-admin-sdk";
import { SwButton, SwNumberField } from "@shopware-ag/meteor-component-library";

const heightInput = ref(123);
const height = ref(400);
const isAutoResizing = ref(true);
const componentStyling = computed(() => {
  return {
    height: `${height.value}px`,
    backgroundColor: "#0e82ff",
    padding: "10px",
  };
});

function setHeightInput(height: number): void {
  heightInput.value = height;
}

function changeHeight(): void {
  height.value = Math.floor(heightInput.value);
}

function changeHeightManually(): void {
  void location.updateHeight(heightInput.value);
}

async function stopAutoResizing(): Promise<void> {
  await location.stopAutoResizer();
  isAutoResizing.value = false;
}

async function startAutoResizing(): Promise<void> {
  await location.startAutoResizer();
  isAutoResizing.value = true;
}
</script>
