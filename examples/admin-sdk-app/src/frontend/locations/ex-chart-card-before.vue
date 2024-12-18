<template>
  <div>
    <p>
      This App is built for demonstration purposes. It is an example where
      developer can see, what are the possibilities of the Meteor Admin SDK. It
      is not intended to be used in production.

      <br>
      <br>

      You can find in the menu a separate module for this App. There are all
      features described.
    </p>

    <br>

    <SwButton
      variant="primary"
      @click="goToExampleModule"
    >
      Go to the example module
    </SwButton>
  </div>
</template>

<script setup lang="ts">
import { window, context } from "@shopware-ag/meteor-admin-sdk";
import { SwButton } from "@shopware-ag/meteor-component-library";

async function goToExampleModule() {
  const moduleInformation = await context.getModuleInformation();
  const exampleModule = moduleInformation.modules.find(
    (module) => module.locationId === "ex-meteor-admin-sdk-example-module",
  );

  if (exampleModule) {
    window.routerPush({
      name: "sw.extension.sdk.index",
      params: {
        id: exampleModule.id,
      },
    });
  }
}
</script>

<style>
body {
  background-color: white;
}
</style>
