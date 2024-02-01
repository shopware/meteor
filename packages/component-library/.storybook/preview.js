import '!style-loader!css-loader!sass-loader!./../src/components/assets/scss/all.scss';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import DeviceHelperPlugin from '../src/plugin/device-helper.plugin';
import { darkTheme, lightTheme } from './shopwareTheme';
import { createI18n } from 'vue-i18n-bridge';

Vue.use(VueI18n, { bridge: true });
Vue.use(DeviceHelperPlugin);

const i18n = createI18n({
  legacy: true,
  allowComposition: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
    de: {},
  }
}, VueI18n);

Vue.use(i18n);

export const decorators = [
  (story, context) => {
    return {
      components: { story },
      template: '<story />',
      i18n,
    }
  }
];

export const parameters = {
  darkMode: {
    // Override the default dark theme
    // dark: { ...themes.dark, appBg: 'black' },
    dark: darkTheme,
    // Override the default light theme
    light: lightTheme
  }
};