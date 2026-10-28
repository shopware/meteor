<template>
  <div class="i18n-demo">
    <mt-card
      title="Meteor i18n via the Admin SDK"
      subtitle="No i18n framework installed — everything below is translated by Meteor's bundled snippets."
    >
      <mt-text as="p">
        Switch the administration language (for example between English and
        German): the pagination texts and the validation message follow along.
        The language reaches this iframe through the Admin SDK's locale channel
        and is handed to Meteor by the ten-line adapter in
        <code>src/bootstrap.ts</code>.
      </mt-text>

      <mt-pagination
        :current-page="currentPage"
        :limit="25"
        :total-items="213"
        @change-current-page="currentPage = $event"
      />

      <mt-text-field
        label="Email"
        model-value="not-an-email"
        :error="{ code: 'INVALID_MAIL' }"
      />
    </mt-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  MtCard,
  MtPagination,
  MtText,
  MtTextField,
} from "@shopware-ag/meteor-component-library";

const currentPage = ref(1);
</script>

<style scoped>
.i18n-demo {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
  padding: var(--scale-size-16);
}
</style>
