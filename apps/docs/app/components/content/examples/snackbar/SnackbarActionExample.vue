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
</script>

<template>
  <mt-button variant="secondary" size="small" @click="deleteProduct"
    >Delete product</mt-button
  >

  <mt-snackbar />
</template>
