<template>
  <div>
    <p>
      This App is built for demonstration purposes. It is an example where developer can see, what are
      the possibilities of the Admin Extension SDK. It is not intended to be used in production. 

      <br>
      <br>
    
      You can find in the menu a separate module for this App. There are all features described.
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

<script lang="ts">
import Vue from 'vue'
import { window, context } from "@shopware-ag/admin-extension-sdk";
import { SwButton } from '@shopware-ag/meteor-component-library';

export default Vue.extend({
components: {
  SwButton
},
data() {
    return {}
},
computed: {},
methods: {
  async goToExampleModule() {
    const moduleInformation = await context.getModuleInformation();
    const exampleModule = moduleInformation.modules.find(module => module.locationId === 'ex-admin-extension-sdk-example-module');

    if (exampleModule) {
      window.routerPush({
          name: 'sw.extension.sdk.index',
          params: {
              id: exampleModule.id
          }
      })
    }
  }
}
})
</script>

<style>
  body {
    background-color: white;
  }
</style>