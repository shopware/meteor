<template>
  <div class="page">
    <SwCard title="Example card" subtitle="This is an example card">
      <SwBlockStack>
        <p>This is some very interesting text.</p>

        <SwButton variant="primary" @click="showBanner = !showBanner">
          Show banner
        </SwButton>

        <SwBanner title="A banner" variant="info" v-if="showBanner">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
          eum non repudiandae repellendus quam a? Nesciunt eligendi voluptate
          qui obcaecati eaque dolores perspiciatis, illum repellat quis commodi
          doloremque tempore similique!
        </SwBanner>

        <p data-testid="example-text">
          {{ !!text ? text : 'Type something into the text field!' }}
        </p>

        <SwTextField label="A text field" v-model="text" />
      </SwBlockStack>
    </SwCard>
  </div>
</template>

<script setup lang="ts">
import '@shopware-ag/meteor-component-library/dist/style.css';
import {
  SwCard,
  SwButton,
  SwBanner,
  SwTextField,
} from '@shopware-ag/meteor-component-library';
import SwBlockStack from './components/sw-block-stack.vue';

const showBanner = ref();
const text = ref();
</script>

<style scoped>
.page {
  padding-block: 48px;
}
</style>
