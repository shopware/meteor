import MtThemeSelect from "./mt-theme-select.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import { ref, watch } from "vue";
import { useTheme } from "@/composables/useTheme";

export type MtThemeSelectMeta = Meta<typeof MtThemeSelect>;

export default {
  title: "Components/Theme Select",
  component: MtThemeSelect,
  args: {
    label: "Color theme",
    modelValue: "system",
    "onUpdate:modelValue": fn(),
  },
  argTypes: {
    modelValue: {
      control: "select",
      options: ["light", "dark", "system"],
    },
  },
  render: (args) => ({
    components: { MtThemeSelect },
    setup() {
      const model = ref(args.modelValue);
      watch(
        () => args.modelValue,
        (value) => {
          model.value = value;
        },
      );

      return { args, model };
    },
    template: `<mt-theme-select
      v-model="model"
      :label="args.label"
      :disabled="args.disabled"
      @update:model-value="args['onUpdate:modelValue']"
    />`,
  }),
} as MtThemeSelectMeta;

export type MtThemeSelectStory = StoryObj<MtThemeSelectMeta>;

export const Default: MtThemeSelectStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-theme-select v-model="theme" label="Color theme" />`,
      },
    },
  },
};

export const Disabled: MtThemeSelectStory = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-theme-select v-model="theme" label="Color theme" disabled />`,
      },
    },
  },
};

/**
 * Pair the select with the `useTheme` composable to resolve the
 * `system` option against the operating system preference, apply the
 * resolved value as `data-theme`, and persist the choice. In this story the
 * resolved theme is scoped to the preview box instead of the whole document.
 */
export const WithUseTheme: MtThemeSelectStory = {
  render: (args) => ({
    components: { MtThemeSelect },
    setup() {
      const { theme, resolvedTheme } = useTheme({
        storageKey: null,
        applyToTarget: false,
      });

      return { args, theme, resolvedTheme };
    },
    template: `<div style="display: flex; flex-direction: column; gap: 24px;">
      <mt-theme-select v-model="theme" :label="args.label" />

      <div
        :data-theme="resolvedTheme"
        style="
          padding: 24px;
          border-radius: var(--border-radius-overlay);
          border: 1px solid var(--color-border-primary-default);
          background: var(--color-elevation-surface-default);
          color: var(--color-text-primary-default);
        "
      >
        Resolved theme: {{ resolvedTheme }}
      </div>
    </div>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<script setup>
import { MtThemeSelect, useTheme } from "@shopware-ag/meteor-component-library";

// Resolves "system", applies data-theme to the document root, and persists.
const { theme } = useTheme();
</script>

<template>
  <mt-theme-select v-model="theme" label="Color theme" />
</template>`,
      },
    },
  },
};
