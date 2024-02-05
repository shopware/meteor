const custom = require('../../../node_modules/@vue/cli-service/webpack.config.js');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  "stories": ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions", "@storybook/addon-a11y", "storybook-dark-mode"],
  features: {
    interactionsDebugger: true
  },
  "framework": {
    name: "@storybook/vue-webpack5",
    options: {}
  },
  staticDirs: ['../public'],
  "webpackFinal": config => {
    // Add .scss rule to config from vue-cli-service
    const scssRule = custom.module.rules.find(rule => rule.test.toString() === /\.scss$/.toString());
    config.module.rules.push(scssRule);

    // add exclusion rule for meteor icons for type asset/resource
    const assetResourceLoader = config.module.rules.find(l => l.hasOwnProperty('type') && l.type === 'asset/resource');
    if (!assetResourceLoader.exclude) {
      assetResourceLoader.exclude = [];
    }
    assetResourceLoader.exclude.push(/@shopware-ag\/meteor-icon-kit\/icons/);

    // add svg inline loader for meteor icons
    config.module.rules.unshift({
      test: /\.svg$/,
      include: [/@shopware-ag\/meteor-icon-kit\/icons/],
      loader: 'svg-inline-loader',
      options: {
        removeSVGTagAttrs: false
      }
    });

    // add loader for css
    config.plugins.unshift(new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css"
    }));
    return config;
  },
  docs: {
    autodocs: true
  }
};