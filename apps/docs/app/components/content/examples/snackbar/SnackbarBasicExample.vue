<script setup lang="ts">
import MtSnackbar from "@shopware-ag/meteor-component-library/MtSnackbar";
import MtButton from "@shopware-ag/meteor-component-library/MtButton";
// useSnackbar has no subpath export, so it is imported from the barrel.
import { useSnackbar, type Snackbar } from "@shopware-ag/meteor-component-library";

const { addSnackbar, clearSnackbars } = useSnackbar();

function showDefault() {
  addSnackbar({ message: "Changes saved" });
}

function showSuccess() {
  addSnackbar({ message: "File uploaded", variant: "success" });
}

function showError() {
  addSnackbar({ message: "Something went wrong", variant: "error" });
}

function showProgress() {
  const snackbar = addSnackbar({
    message: "Uploading file",
    variant: "progress",
    progressPercentage: 0,
    successMessage: "File uploaded successfully",
    errorMessage: "Upload failed. Please try again",
  });

  simulateProgress(snackbar);
}

function simulateProgress(snackbar: Snackbar) {
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15;

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      snackbar.uploadState = "success";
    }

    snackbar.progressPercentage = Math.round(progress);
  }, 200);
}
</script>

<template>
  <mt-button variant="secondary" size="small" @click="showDefault">Default</mt-button>
  <mt-button variant="secondary" size="small" @click="showSuccess">Success</mt-button>
  <mt-button variant="secondary" size="small" @click="showError">Error</mt-button>
  <mt-button variant="secondary" size="small" @click="showProgress">Progress</mt-button>
  <mt-button variant="critical" size="small" @click="clearSnackbars">Clear all</mt-button>

  <mt-snackbar />
</template>
