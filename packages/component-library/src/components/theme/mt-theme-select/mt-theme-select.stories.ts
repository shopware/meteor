import MtThemeSelect from "./mt-theme-select.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import { ref } from "vue";
import { useColorScheme } from "../../../composables/useColorScheme";

const meta: Meta<typeof MtThemeSelect> = {
  title: "Components/Theme Select",
  component: MtThemeSelect,
  args: {
    modelValue: "system",
    disabled: false,
    "onUpdate:modelValue": fn(),
  },
  argTypes: {
    modelValue: {
      control: { type: "select" },
      options: ["light", "dark", "system"],
    },
  },
  render: (args) => ({
    components: { MtThemeSelect },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `<mt-theme-select
      v-model="value"
      :disabled="args.disabled"
      :label="args.label"
      @update:model-value="args['onUpdate:modelValue']"
    />`,
  }),
};

export default meta;

type MtThemeSelectStory = StoryObj<typeof MtThemeSelect>;

export const Default: MtThemeSelectStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-theme-select v-model="scheme" />`,
      },
    },
  },
};

export const WithLabel: MtThemeSelectStory = {
  args: {
    label: "Appearance",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-theme-select v-model="scheme" label="Appearance" />`,
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
        code: `<mt-theme-select v-model="scheme" disabled />`,
      },
    },
  },
};

export const WithPreview: MtThemeSelectStory = {
  render: () => ({
    components: { MtThemeSelect },
    setup() {
      // Resolve the preference (incl. "system") without touching the document,
      // then apply it to the scoped preview below via data-theme.
      const { scheme, resolvedScheme } = useColorScheme({
        storageKey: null,
        applyToTarget: false,
      });
      return { scheme, resolvedScheme };
    },
    template: `<div style="display: flex; flex-direction: column; gap: 24px; max-width: 360px;">
      <mt-theme-select v-model="scheme" label="Appearance" />

      <div
        :data-theme="resolvedScheme"
        style="
          padding: 24px;
          border-radius: var(--border-radius-card, 8px);
          border: 1px solid var(--color-border-primary-default);
          background: var(--color-elevation-surface-default);
          color: var(--color-text-primary-default);
        "
      >
        <p style="margin: 0 0 4px; font-weight: 600;">Preview</p>
        <p style="margin: 0; color: var(--color-text-secondary-default);">
          Applied theme: <strong>{{ resolvedScheme }}</strong>
          <template v-if="scheme === 'system'"> (following system)</template>
        </p>
      </div>
    </div>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<script setup>
import { MtThemeSelect, useColorScheme } from "@shopware-ag/meteor-component-library";

const { scheme, resolvedScheme } = useColorScheme({ applyToTarget: false });
</script>

<template>
  <mt-theme-select v-model="scheme" label="Appearance" />

  <!-- Scope the resolved scheme to a preview area via data-theme -->
  <div :data-theme="resolvedScheme">
    Applied theme: {{ resolvedScheme }}
  </div>
</template>`,
      },
    },
  },
};

export const WithComposable: MtThemeSelectStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<script setup>
import { MtThemeSelect, useColorScheme } from "@shopware-ag/meteor-component-library";

// Tracks the preference, resolves "system", applies data-theme, and persists.
const { scheme } = useColorScheme();
</script>

<template>
  <mt-theme-select v-model="scheme" />
</template>`,
      },
    },
  },
};
