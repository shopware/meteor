<template>
  <div class="ex-dailymotion-element">
    <h2>
      Your dailymotion video stuff!
    </h2>

    <div class="sw-cms-el-dailymotion">
      <div class="sw-cms-el-dailymotion-iframe-wrapper">
        <iframe
          frameborder="0"
          type="text/html"
          width="100%"
          height="100%"
          :src="dailyUrl"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { data } from '@shopware-ag/admin-extension-sdk';
import Vue from 'vue';
import EX_DAILYMOTION_CONSTANTS from './ex-dailymotion-constants';

export default Vue.extend({
  data(): {
    element: any
  } {
      return {
          element: null
      }
  },

  computed: {
      dailyUrl(): string {
          const dailymotionURL = this.element?.config?.dailyUrl?.value ?? 'x8hc5d6'

          return `https://www.dailymotion.com/embed/video/${dailymotionURL}`;
      }
  },

  created() {
      this.createdComponent();
  },

  methods: {
      async createdComponent() {
          this.element = await data.get({ id: EX_DAILYMOTION_CONSTANTS.PUBLISHING_KEY });
          data.subscribe(EX_DAILYMOTION_CONSTANTS.PUBLISHING_KEY, this.elementSubscriber);
      },

      elementSubscriber(response: { data: unknown, id: string }): void {
          this.element = response.data;
      }
  }
})
</script>

<style scoped>
.sw-cms-el-dailymotion-iframe-wrapper {
  height: 500px;
}
</style>