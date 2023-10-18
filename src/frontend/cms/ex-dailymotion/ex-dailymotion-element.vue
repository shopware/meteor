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
    dailyUrlValue: string|undefined;
    dailyUrlSource: string;
  } {
      return {
        dailyUrlValue: undefined,
        dailyUrlSource: 'static',
      }
  },

  computed: {
      dailyUrl(): string {
          const dailymotionURL = this.dailyUrlValue || 'x8hc5d6';

          return `https://www.dailymotion.com/embed/video/${dailymotionURL}`;
      },

      dataSelectors(): string[] {
          return [
            'config.dailyUrl.value',
            'config.dailyUrl.source',
          ];
      },

      dataId(): string {
        const params = new URLSearchParams(window.location.search);
        const elementId = params.get('elementId');

        if (!elementId) {
          return EX_DAILYMOTION_CONSTANTS.PUBLISHING_KEY;
        }

        return EX_DAILYMOTION_CONSTANTS.PUBLISHING_KEY + '__' + elementId;
      }
  },

  created() {
      this.createdComponent();
  },

  methods: {
      async createdComponent() {
          const value = await data.get({
            id: this.dataId,
            selectors: this.dataSelectors,
          }) as {
            'config.dailyUrl.value': string,
            'config.dailyUrl.source': string,
          };

          if (value) {
            this.dailyUrlValue = value['config.dailyUrl.value'];
            this.dailyUrlSource = value['config.dailyUrl.source'];
          }

          data.subscribe(
            this.dataId,
            // @ts-expect-error
            this.elementSubscriber,
          {
            selectors: this.dataSelectors,
          });
      },

      elementSubscriber(response: { data: {
        'config.dailyUrl.value': string,
        'config.dailyUrl.source': string,
      }, id: string }): void {
        this.dailyUrlSource = response.data['config.dailyUrl.source'];
        this.dailyUrlValue = response.data['config.dailyUrl.value'];
      }
  }
})
</script>

<style scoped>
.sw-cms-el-dailymotion-iframe-wrapper {
  height: 500px;
}
</style>