<template>
  <div>
    <h2>
      Config!
    </h2>

    Video-Code: <input
      v-model="dailyUrl"
      type="text"
    ><br>
  </div>
</template>

<script lang="ts">
import { data } from '@shopware-ag/admin-extension-sdk';
import Vue from 'vue';
import EX_DAILYMOTION_CONSTANTS from './ex-dailymotion-constants';

export default Vue.extend({
  data(): {
    element: any;
  } {
      return {
          element: null
      }
  },

  computed: {
      dailyUrl: {
          get(): string {
              return this.element?.config?.dailyUrl?.value || '';
          },

          set(value: string): void {
              this.element.config.dailyUrl.value = value;

              data.update({
                  id: EX_DAILYMOTION_CONSTANTS.PUBLISHING_KEY,
                  data: this.element,
              });
          }
      }
  },

  created(): void {
      this.createdComponent();
  },

  methods: {
      async createdComponent() {
          this.element = await data.get({ id: EX_DAILYMOTION_CONSTANTS.PUBLISHING_KEY });
      }
  }
})

</script>