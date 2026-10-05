<script setup lang="ts">
import { MtMarkdown } from "@shopware-ag/meteor-component-library";

const answer = `This is the product photo from your media library:

![The product photo](https://meteor.shopware.com/showcase-product.jpg)

An image from anywhere else shows as a link: ![A photo from another site](https://images.example.com/lamp.png)`;
</script>

<template>
  <mt-markdown :content="answer" :allowed-image-prefixes="['https://meteor.shopware.com/']" />
</template>
