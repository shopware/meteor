<template>
  <div class="page">
    <SwCard title="Example card" subtitle="This is an example card">
      <SwBlockStack>
        <MtText>This is some very interesting text.</MtText>

        <SwButton variant="primary" @click="showBanner = !showBanner">
          Show banner
        </SwButton>

        <SwBanner title="A banner" variant="info" v-if="showBanner">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
          eum non repudiandae repellendus quam a? Nesciunt eligendi voluptate
          qui obcaecati eaque dolores perspiciatis, illum repellat quis commodi
          doloremque tempore similique!
        </SwBanner>

        <MtText data-testid="example-text">
          {{ !!text ? text : "Type something into the text field!" }}
        </MtText>

        <SwTextField label="A text field" v-model="text" />
      </SwBlockStack>

      <MtModalRoot>
        <MtModalTrigger :as="SwButton" variant="primary"
          >Open modal</MtModalTrigger
        >

        <MtModal title="Some title">
          <template #default>
            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>

            <p style="color: var(--color-text-primary-default)">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              sunt mollitia ut aut nesciunt quod debitis nam corporis explicabo
              deleniti et iste autem aliquid voluptatem ipsum voluptatum, cum
              dolorum itaque.
            </p>
          </template>

          <template #footer>
            <div
              style="display: flex; justify-content: end; column-gap: 0.5rem"
            >
              <MtModalClose :as="SwButton" variant="secondary"
                >Close</MtModalClose
              >

              <MtModalAction
                :is-loading="isLoading"
                @click="handleModalClose"
                :as="SwButton"
                variant="primary"
                >Confirm</MtModalAction
              >
            </div>
          </template>
        </MtModal>
      </MtModalRoot>
    </SwCard>
  </div>
</template>

<script setup lang="ts">
import "@shopware-ag/meteor-component-library/styles.css";
import "@shopware-ag/meteor-component-library/font.css";
import {
  SwCard,
  SwButton,
  SwBanner,
  SwTextField,
  MtModalRoot,
  MtModal,
  MtModalClose,
  MtModalTrigger,
  MtModalAction,
  MtText,
} from "@shopware-ag/meteor-component-library";
import SwBlockStack from "./components/sw-block-stack.vue";

const showBanner = ref();
const text = ref();

const isLoading = ref(false);

function handleModalClose(close: () => void) {
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    close();
  }, 2000);
}
</script>

<style scoped>
.page {
  padding-block: 48px;
}
</style>
