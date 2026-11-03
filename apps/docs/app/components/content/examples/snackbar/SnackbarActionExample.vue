<script setup lang="ts">
import MtSnackbar from "@shopware-ag/meteor-component-library/MtSnackbar";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
// useSnackbar has no subpath export, so it is imported from the barrel.
import { useSnackbar } from "@shopware-ag/meteor-component-library";

const { addSnackbar } = useSnackbar();

function deleteProduct() {
  addSnackbar({
    message: "Product deleted",
    link: { text: "Undo", onClick: restoreProduct },
  });
}

function restoreProduct() {
  addSnackbar({ message: "Product restored", variant: "success" });
}

function showLink() {
  addSnackbar({
    message: "Snackbar added",
    link: { text: "Read the docs", url: "/utilities/composables/use-snackbar" },
  });
}
</script>

<template>
  <mt-button variant="secondary" size="small" @click="deleteProduct"
    >Delete product</mt-button
  >
  <mt-button variant="secondary" size="small" @click="showLink"
    >Show link</mt-button
  >

  <mt-snackbar />
</template>
