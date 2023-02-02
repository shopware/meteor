<template>
  <sw-card title="Context">
    <p>You can access several information about the current context with the Context API from the SDK. Here are some examples: </p>

    <div class="context-functionality-buttons">
      <sw-button @click="getCurrentLanguage">
        Get current language
      </sw-button>
      <sw-button @click="getCurrentEnvironment">
        Get current environment
      </sw-button>
      <sw-button @click="getCurrentLocale">
        Get current locale
      </sw-button>
      <sw-button @click="getCurrentCurrency">
        Get current currency
      </sw-button>
      <sw-button @click="getCurrentShopwareVersion">
        Get current Shopware version
      </sw-button>
      <sw-button @click="getCurrentAppInformation">
        Get current app information
      </sw-button>
      <sw-button @click="getCurrentModuleInformation">
        Get information about all registered modules
      </sw-button>
    </div>

    <p>
      Most information can also be subscribed to. So you react dynamically to changes in the context.
    </p>
  </sw-card>
</template>

<script lang="ts">import { context, notification } from '@shopware-ag/admin-extension-sdk';
import { SwCard, SwButton } from '@shopware-ag/meteor-component-library';
import Vue from 'vue';

export default Vue.extend({
  components: {
    'sw-card': SwCard,
    'sw-button': SwButton,
  },
  methods: {
    async getCurrentLanguage() {
      const currentLanguage = await context.getLanguage();

      notification.dispatch({
        title: 'Current language',
        message: `
        Your current language ID is "${currentLanguage.languageId}".
        <br /><br /> 
        Your system language ID is "${currentLanguage.systemLanguageId}".
        `
      })
    },

    async getCurrentEnvironment() {
      const currentEnvironment = await context.getEnvironment();

      notification.dispatch({
        title: 'Current environment',
        message: `
        Your current environment is "${currentEnvironment}".
        `
      })
    },

    async getCurrentLocale() {
      const currentLocale = await context.getLocale();

      notification.dispatch({
        title: 'Current locale',
        message: `
        Your current locale ID is "${currentLocale.locale}".
        <br />
        Your fallback locale ID is "${currentLocale.fallbackLocale}"".
        `
      })
    },

    async getCurrentCurrency() {
      const currentCurrency = await context.getCurrency();

      notification.dispatch({
        title: 'Current currency',
        message: `
        Your system currency ID is "${currentCurrency.systemCurrencyId}".
        <br />
        The ISO Code for this currency is "${currentCurrency.systemCurrencyISOCode}".
        `
      })
    },

    async getCurrentShopwareVersion() {
      const currentShopwareVersion = await context.getShopwareVersion();

      notification.dispatch({
        title: 'Current Shopware version',
        message: `
        Your current Shopware version is "${currentShopwareVersion}".
        `
      })
    },

    async getCurrentAppInformation() {
      const currentAppInformation = await context.getAppInformation();

      notification.dispatch({
        title: 'Current app information',
        message: `
        Your current app name is "${currentAppInformation.name}".
        <br />
        Your current app version is "${currentAppInformation.version}".
        <br />
        Your current extension type is "${currentAppInformation.type}".
        `
      })
    },

    async getCurrentModuleInformation() {
      const currentModuleInformation = await context.getModuleInformation();

      notification.dispatch({
        title: 'Current module information',
        message: `
        Your current registered modules are:
        <br /> <br />
        ${currentModuleInformation.modules.map((module, index) => {
          return `
            <b>
              Module ${index + 1}:
            </b>
            
            <br /><br />
            
            Module Heading: <br />
            "${module.heading}" <br /><br />
            Module ID: <br />
            "${module.id}" <br /><br />
            Module location ID: <br />
            "${module.locationId}" <br /><br />
            Module displaySearchBar: <br />
            "${module.displaySearchBar}" <br /><br />
          `
        }).join('<br />< br />')}
        `
      })
    },
  }
})
</script>

<style scoped>
.context-functionality-buttons {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>