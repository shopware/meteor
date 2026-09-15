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

    <!-- i18n integration-test surface (only rendered with ?i18n=1, so the default
         page and its visual snapshot stay untouched). -->
    <section v-if="showI18nDemo" data-testid="i18n-demo">
      <button type="button" data-testid="locale-en" @click="locale = 'en'">
        en
      </button>
      <button type="button" data-testid="locale-de" @click="locale = 'de'">
        de
      </button>
      <button
        type="button"
        data-testid="locale-en-us"
        @click="locale = 'en-US'"
      >
        en-US
      </button>
      <button
        type="button"
        data-testid="locale-en-gb"
        @click="locale = 'en-GB'"
      >
        en-GB
      </button>

      <MtPagination
        :current-page="1"
        :limit="25"
        :total-items="213"
        @change-current-page="() => {}"
      />
    </section>
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
  MtPagination,
} from "@shopware-ag/meteor-component-library";
import { useI18n } from "vue-i18n";
import SwBlockStack from "./components/sw-block-stack.vue";

// Drive the host vue-i18n locale from the i18n demo controls; Meteor components follow it
// via the adapter wired in plugins/i18n.ts.
const { locale } = useI18n({ useScope: "global" });
const showI18nDemo = computed(() => !!useRoute().query.i18n);

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
