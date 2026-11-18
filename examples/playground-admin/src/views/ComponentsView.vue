<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtActionMenu,
  MtActionMenuItem,
  MtAnnouncement,
  MtAvatar,
  MtBadge,
  MtBanner,
  MtButton,
  MtCard,
  MtCheckbox,
  MtCollapsible,
  MtCollapsibleContent,
  MtCollapsibleTrigger,
  MtColorpicker,
  MtDatepicker,
  MtDivider,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtEmailField,
  MtEmptyState,
  MtHelpText,
  MtIcon,
  MtLink,
  MtLoader,
  MtModal,
  MtModalClose,
  MtModalRoot,
  MtModalTrigger,
  MtNumberField,
  MtPage,
  MtPagination,
  MtPasswordField,
  MtProgressBar,
  MtPromoBadge,
  MtRadioGroupItem,
  MtRadioGroupList,
  MtRadioGroupRoot,
  MtSearch,
  MtSelect,
  MtSkeletonBar,
  MtSlider,
  MtStatusDot,
  MtSwitch,
  MtTabs,
  MtText,
  MtTextarea,
  MtTextEditor,
  MtTextField,
  MtTooltip,
  MtUrlField,
  useSnackbar,
} from "@shopware-ag/meteor-component-library";
import { useBreadcrumb } from "../composables/useBreadcrumb";

// A page for testing themes and palettes: most components with their colored variants.

const { t } = useI18n();
const breadcrumb = useBreadcrumb(() => t("nav.components"));
const { addSnackbar } = useSnackbar();

const STATUS = [
  "neutral",
  "info",
  "attention",
  "critical",
  "positive",
] as const;
const BUTTONS = ["primary", "secondary", "tertiary", "critical"] as const;
const SIZES = ["s", "m", "l"] as const;
const ANNOUNCEMENT_ICONS = {
  neutral: "solid-calendar",
  info: "solid-megaphone",
  attention: "solid-tools",
  critical: "solid-exclamation-circle",
  positive: "solid-check-circle",
};

const TOKEN_GROUPS = {
  Surfaces: [
    "elevation-surface-sunken",
    "elevation-surface-default",
    "elevation-surface-raised",
    "elevation-surface-overlay",
    "elevation-surface-hover",
    "elevation-surface-selected",
    "elevation-floating-default",
  ],
  Backgrounds: [
    "background-primary-default",
    "background-secondary-default",
    "background-tertiary-default",
    "background-brand-default",
    "background-critical-default",
    "background-attention-default",
    "background-positive-default",
    "background-accent-default",
  ],
  Interaction: [
    "interaction-primary-default",
    "interaction-primary-hover",
    "interaction-primary-pressed",
    "interaction-primary-disabled",
    "interaction-critical-default",
    "interaction-critical-hover",
    "interaction-secondary-default",
    "interaction-secondary-hover",
  ],
  Borders: [
    "border-primary-default",
    "border-secondary-default",
    "border-brand-default",
    "border-critical-default",
    "border-attention-default",
    "border-positive-default",
    "border-accent-default",
  ],
};

const TEXT_COLORS = [
  "text-primary-default",
  "text-secondary-default",
  "text-primary-disabled",
  "text-brand-default",
  "text-critical-default",
  "text-attention-default",
  "text-positive-default",
  "text-accent-default",
];

const ICON_COLORS = [
  "icon-primary-default",
  "icon-secondary-default",
  "icon-brand-default",
  "icon-critical-default",
  "icon-attention-default",
  "icon-positive-default",
  "icon-accent-default",
  "icon-primary-disabled",
];

const tabs = [
  { label: "General", name: "general" },
  { label: "Prices", name: "prices" },
  { label: "Variants", name: "variants" },
  { label: "SEO", name: "seo" },
];

const selectOptions = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

const text = ref("Leather Weekender");
const notes = ref("A roomy weekend bag of full-grain leather.");
const quantity = ref(12);
const email = ref("max@example.com");
const password = ref("secret-password");
const url = ref("shop.example.com");
const status = ref("active");
const search = ref("");
const date = ref("2026-11-17");
const color = ref("#0069fc");
const switchOn = ref(true);
const switchOff = ref(false);
const radio = ref("standard");
const slider = ref(40);
const progress = ref(64);
const page = ref(1);
const editor = ref(
  "<p>Some <strong>formatted</strong> text with a <a href='#'>link</a>.</p>",
);
</script>

<template>
  <mt-page width="l" :breadcrumb="breadcrumb">
    <div class="components">
      <div class="components__wide">
        <mt-card title="Tokens">
          <div class="components__tokens">
            <div
              v-for="(tokens, group) in TOKEN_GROUPS"
              :key="group"
              class="stack"
            >
              <mt-text size="xs" weight="semibold">{{ group }}</mt-text>
              <div
                v-for="token in tokens"
                :key="token"
                class="components__swatch"
              >
                <span
                  class="components__swatch-color"
                  :style="{ background: `var(--color-${token})` }"
                />
                <mt-text size="2xs">{{ token }}</mt-text>
              </div>
            </div>
            <div class="stack">
              <mt-text size="xs" weight="semibold">Text</mt-text>
              <span
                v-for="token in TEXT_COLORS"
                :key="token"
                class="components__text"
                :style="{ color: `var(--color-${token})` }"
              >
                {{ token }}
              </span>
            </div>
            <div class="stack">
              <mt-text size="xs" weight="semibold">Icons</mt-text>
              <div
                v-for="token in ICON_COLORS"
                :key="token"
                class="components__swatch"
              >
                <mt-icon
                  name="solid-star"
                  size="16"
                  :color="`var(--color-${token})`"
                />
                <mt-text size="2xs">{{ token }}</mt-text>
              </div>
            </div>
          </div>
        </mt-card>
      </div>

      <div class="components__wide">
        <mt-card title="Announcements">
          <div class="stack components__flush">
            <template
              v-for="appearance in ['subtle', 'strong'] as const"
              :key="appearance"
            >
              <mt-announcement
                v-for="variant in STATUS"
                :key="`${appearance}-${variant}`"
                :variant="variant"
                :appearance="appearance"
                :icon="ANNOUNCEMENT_ICONS[variant]"
                closable
              >
                {{ appearance }} {{ variant }}: planned maintenance on Sunday.
                <mt-link as="a" to="#">Read more</mt-link>
              </mt-announcement>
            </template>
          </div>
        </mt-card>
      </div>

      <div class="components__wide">
        <mt-card title="Banners">
          <div class="components__columns">
            <mt-banner
              v-for="variant in [...STATUS, 'inherited' as const]"
              :key="variant"
              :variant="variant"
              :title="`${variant} banner`"
              closable
            >
              A message with a <mt-link as="a" to="#">link</mt-link> in the
              {{ variant }} variant.
            </mt-banner>
          </div>
        </mt-card>
      </div>

      <mt-card title="Buttons">
        <div class="stack">
          <div v-for="variant in BUTTONS" :key="variant" class="cluster">
            <mt-button :variant="variant">{{ variant }}</mt-button>
            <mt-button :variant="variant" disabled>Disabled</mt-button>
            <mt-button :variant="variant" is-loading>Loading</mt-button>
            <mt-button :variant="variant" square aria-label="Settings">
              <mt-icon name="regular-cog" size="16" />
            </mt-button>
          </div>
          <div class="cluster">
            <mt-button variant="primary" size="x-small">x-small</mt-button>
            <mt-button variant="primary" size="small">small</mt-button>
            <mt-button variant="primary">default</mt-button>
            <mt-button variant="primary" size="large">large</mt-button>
          </div>
          <div class="cluster">
            <mt-button variant="primary" ghost>Ghost primary</mt-button>
            <mt-button variant="critical" ghost>Ghost critical</mt-button>
          </div>
        </div>
      </mt-card>

      <mt-card title="Badges and status">
        <div class="stack">
          <div v-for="size in SIZES" :key="size" class="cluster">
            <mt-badge
              v-for="variant in STATUS"
              :key="variant"
              :variant="variant"
              :size="size"
            >
              {{ variant }}
            </mt-badge>
          </div>
          <div class="cluster">
            <mt-badge
              v-for="variant in STATUS"
              :key="variant"
              :variant="variant"
              icon="solid-check-circle"
            >
              {{ variant }}
            </mt-badge>
          </div>
          <div class="cluster">
            <mt-status-dot
              v-for="variant in STATUS"
              :key="variant"
              :variant="variant"
              :label="variant"
            />
          </div>
          <div class="cluster">
            <mt-promo-badge variant="new" />
            <mt-promo-badge variant="beta" />
            <mt-promo-badge variant="shopware-ai" />
          </div>
        </div>
      </mt-card>

      <mt-card title="Text fields">
        <div class="stack">
          <mt-text-field
            v-model="text"
            label="Text field"
            hint="A hint below the field"
          />
          <mt-text-field
            v-model="text"
            label="With error"
            :error="{ detail: 'This name is taken.' }"
          />
          <mt-text-field v-model="text" label="Disabled" disabled />
          <mt-text-field label="Placeholder" placeholder="Enter a name" />
          <mt-textarea v-model="notes" label="Textarea" />
        </div>
      </mt-card>

      <mt-card title="More fields">
        <div class="stack">
          <mt-number-field
            v-model="quantity"
            label="Number field"
            number-type="int"
          />
          <mt-email-field v-model="email" label="Email field" />
          <mt-password-field v-model="password" label="Password field" />
          <mt-url-field v-model="url" label="URL field" />
          <mt-select v-model="status" label="Select" :options="selectOptions" />
          <mt-search v-model="search" placeholder="Search" />
        </div>
      </mt-card>

      <mt-card title="Pickers and editor">
        <div class="stack">
          <mt-datepicker v-model="date" label="Datepicker" />
          <mt-colorpicker v-model="color" label="Colorpicker" />
          <mt-text-editor v-model="editor" />
        </div>
      </mt-card>

      <mt-card title="Choices">
        <div class="stack">
          <mt-checkbox label="Unchecked" />
          <mt-checkbox label="Checked" checked />
          <mt-checkbox label="Partial" partial />
          <mt-checkbox label="Disabled" checked disabled />
          <mt-checkbox
            label="With error"
            :error="{ detail: 'Please accept.' }"
          />
          <mt-switch v-model="switchOn" label="Switch on" />
          <mt-switch v-model="switchOff" label="Switch off" />
          <mt-switch :model-value="true" label="Disabled on" disabled />
          <mt-switch :model-value="false" label="Disabled off" disabled />
          <mt-radio-group-root v-model="radio" label="Shipping">
            <mt-radio-group-list>
              <mt-radio-group-item
                id="radio-standard"
                value="standard"
                label="Standard"
              />
              <mt-radio-group-item
                id="radio-express"
                value="express"
                label="Express"
              />
              <mt-radio-group-item
                id="radio-pickup"
                value="pickup"
                label="Pickup"
                disabled
              />
            </mt-radio-group-list>
          </mt-radio-group-root>
        </div>
      </mt-card>

      <mt-card title="Progress and loading">
        <div class="stack">
          <mt-slider v-model="slider" label="Slider" :min="0" :max="100" />
          <mt-progress-bar
            v-model="progress"
            :max-value="100"
            label="Progress bar"
          />
          <div class="cluster">
            <mt-loader size="32px" class="components__loader" />
          </div>
          <mt-skeleton-bar />
          <mt-skeleton-bar />
        </div>
      </mt-card>

      <mt-card title="Navigation">
        <div class="stack">
          <mt-tabs :items="tabs" default-item="general" />
          <mt-pagination
            :current-page="page"
            :limit="25"
            :total-items="250"
            @change-current-page="page = $event"
          />
          <div class="cluster">
            <mt-link as="a" to="#">Primary link</mt-link>
            <mt-link as="a" to="#" variant="critical">Critical link</mt-link>
            <mt-link as="a" to="#" disabled>Disabled link</mt-link>
          </div>
        </div>
      </mt-card>

      <mt-card title="Overlays">
        <div class="stack">
          <div class="cluster">
            <mt-tooltip content="A tooltip">
              <template #default="params">
                <mt-button variant="secondary" v-bind="params"
                  >Tooltip</mt-button
                >
              </template>
            </mt-tooltip>
            <mt-help-text text="Help text in a tooltip" />

            <mt-dropdown-menu-root>
              <mt-dropdown-menu-trigger as-child>
                <mt-button variant="secondary">Action menu</mt-button>
              </mt-dropdown-menu-trigger>
              <mt-dropdown-menu-portal>
                <mt-action-menu>
                  <mt-action-menu-item icon="regular-duplicate"
                    >Duplicate</mt-action-menu-item
                  >
                  <mt-action-menu-item icon="regular-download"
                    >Download</mt-action-menu-item
                  >
                  <mt-action-menu-item icon="regular-trash" variant="critical">
                    Delete
                  </mt-action-menu-item>
                </mt-action-menu>
              </mt-dropdown-menu-portal>
            </mt-dropdown-menu-root>

            <mt-modal-root>
              <mt-modal-trigger :as="MtButton" variant="secondary"
                >Modal</mt-modal-trigger
              >
              <mt-modal title="A modal" width="s">
                <mt-text size="xs">The content of the modal.</mt-text>
                <template #footer>
                  <mt-modal-close :as="MtButton" variant="primary"
                    >Close</mt-modal-close
                  >
                </template>
              </mt-modal>
            </mt-modal-root>
          </div>
          <div class="cluster">
            <mt-button
              variant="secondary"
              @click="addSnackbar({ message: 'Changes saved' })"
            >
              Snackbar
            </mt-button>
            <mt-button
              variant="secondary"
              @click="
                addSnackbar({ message: 'Product saved', variant: 'success' })
              "
            >
              Success
            </mt-button>
            <mt-button
              variant="secondary"
              @click="
                addSnackbar({ message: 'Saving failed', variant: 'error' })
              "
            >
              Error
            </mt-button>
          </div>
        </div>
      </mt-card>

      <mt-card title="Avatars and text">
        <div class="stack">
          <div class="cluster">
            <mt-avatar
              v-for="size in ['2xs', 'xs', 's', 'm', 'l'] as const"
              :key="size"
              first-name="Max"
              last-name="Mustermann"
              :size="size"
            />
            <mt-avatar
              first-name="Max"
              last-name="Mustermann"
              variant="square"
            />
          </div>
          <mt-divider />
          <mt-text size="2xl" weight="bold">Heading 2xl</mt-text>
          <mt-text size="l" weight="semibold">Heading l</mt-text>
          <mt-text size="s">Body text in size s.</mt-text>
          <mt-text size="xs" color="color-text-secondary-default"
            >Secondary text in size xs.</mt-text
          >
          <mt-collapsible>
            <mt-collapsible-trigger as-child>
              <mt-button variant="tertiary">Toggle collapsible</mt-button>
            </mt-collapsible-trigger>
            <mt-collapsible-content>
              <mt-text size="xs">The revealed content.</mt-text>
            </mt-collapsible-content>
          </mt-collapsible>
        </div>
      </mt-card>

      <mt-card title="Empty state">
        <mt-empty-state
          headline="No orders yet"
          description="Orders that customers place show up here."
          icon="regular-shopping-bag"
          button-text="Create order"
        />
      </mt-card>
    </div>
  </mt-page>
</template>

<style scoped>
.components {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));
  gap: var(--scale-size-16);
  align-items: start;
}

.components__wide {
  grid-column: 1 / -1;
}

.components__tokens {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--scale-size-24);
}

.components__swatch {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
}

.components__swatch-color {
  flex: none;
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-xs);
}

.components__text {
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
}

.components__columns {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: var(--scale-size-16);
}

.components__flush {
  gap: var(--scale-size-8);
}

.components__loader {
  position: relative;
  width: 32px;
  height: 32px;
}
</style>
