<script setup lang="ts">
import MtCopyButton from "@shopware-ag/meteor-component-library/MtCopyButton";
import MtSnackbar from "@shopware-ag/meteor-component-library/MtSnackbar";
// useSnackbar has no subpath export, so it is imported from the barrel.
import { useSnackbar } from "@shopware-ag/meteor-component-library";

const { addSnackbar } = useSnackbar();

function onError() {
  addSnackbar({
    message: "The API key could not be copied. Select it and copy it manually.",
    variant: "error",
  });
}
</script>

<template>
  <mt-copy-button
    value="sk-example-key"
    label="Copy API key"
    @error="onError"
  />

  <mt-snackbar />
</template>
