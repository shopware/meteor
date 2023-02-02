<template>
  <sw-card title="CMS">
    <p>
      You can create your own custom CMS elements with the Admin Extension SDK. You can go to the <a
        href="#"
        @click="goToCmsModule"
      >CMS
        module</a> and replace an existing element with the dailymotion element.
    </p>
  </sw-card>
</template>

<script lang="ts">
import { window } from '@shopware-ag/admin-extension-sdk';
import { SwCard } from '@shopware-ag/meteor-component-library';
import Vue from 'vue';

export default Vue.extend({
  components: {
    'sw-card': SwCard,
  },
  methods: {
    goToCmsModule() {
      window.routerPush({
        path: '/sw/cms/index',
      });
    }
  }
})
</script>

<style scoped>
</style>