<template>
  <SwCard title="CMS">
    <p>
      You can create your own custom CMS elements with the Meteor Admin SDK. You can go to the <a
        href="#"
        @click="goToCmsModule"
      >CMS
        module</a> and replace an existing element with the dailymotion element.
    </p>
  </SwCard>
</template>

<script setup lang="ts">
import { window } from '@shopware-ag/meteor-admin-sdk';
import { SwCard } from '@shopware-ag/meteor-component-library';

function goToCmsModule() {
  window.routerPush({
    path: '/sw/cms/index',
  });
}
</script>
