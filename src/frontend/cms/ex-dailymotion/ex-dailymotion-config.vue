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
    dailyUrlValue: string;
    dailyUrlSource: string;
  } {
      return {
        dailyUrlValue: '',
        dailyUrlSource: 'static',
      }
  },

  computed: {
      dailyUrl: {
          get(): string {
              return this.dailyUrlValue || '';
          },

          set(value: string): void {
              this.dailyUrlValue = value;

              data.update({
                  id: this.dataId,
                  data: {
                    config: {
                      dailyUrl: {
                        value: this.dailyUrlValue,
                        source: this.dailyUrlSource,
                      }
                    }
                  },
              });
          }
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

  created(): void {
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
      }
  }
})

</script>