<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
  MtButton,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
  MtPage,
  MtPanel,
  MtScrollArea,
  MtSearch,
  MtText,
  useApp,
  type BreadcrumbItem,
} from "@shopware-ag/meteor-component-library";
import IntegrationLogo, { type Brand } from "../components/IntegrationLogo.vue";
import {
  brandNames,
  nodeIcons,
  templates,
  workflows,
  type Node,
} from "../data/workflows";

const props = defineProps<{
  /** The id of the workflow, or of the template it starts from, from the route. */
  id: string;
}>();

const { t } = useI18n();
const headingId = useId();
// In the mobile layout of the shell, the actions next to saving move into a menu.
const { isMobile } = useApp();

const workflow = computed(() => workflows.find(({ id }) => id === props.id));
const template = computed(() => templates.find(({ id }) => id === props.id));

const breadcrumb = computed<BreadcrumbItem[]>(() => [
  { label: t("overview.title"), icon: "home", to: { name: "overview" } },
  // The router only opens known ids.
  { label: (workflow.value ?? template.value)?.name ?? "" },
]);

const stepBrands: Partial<Record<Node, Brand>> = {
  hubspot: "hubspot",
  shopware: "shopware",
};

/** The steps on the canvas: those of the workflow, or the apps of the template. */
const nodes = computed<
  { id: string; label: string; brand?: Brand; icon?: string }[]
>(() =>
  workflow.value
    ? workflow.value.steps.map((step) => ({
        id: step,
        label: t(`overview.workflows.nodes.${step}`),
        brand: stepBrands[step],
        icon: nodeIcons[step],
      }))
    : (template.value?.steps ?? []).map((brand) => ({
        id: brand,
        label: brandNames[brand],
        brand,
      })),
);

const triggerIcons = {
  schedule: "regular-clock",
  webhook: "regular-link",
  manual: "regular-play",
  form: "regular-file-text",
};

const logicIcons = {
  if: "regular-sitemap",
  filter: "regular-filter",
  merge: "regular-flow",
  loop: "regular-repeat",
  wait: "regular-hourglass",
  transform: "regular-shuffle",
  editFields: "regular-file-edit",
  code: "regular-code",
  http: "regular-globe",
  aiAgent: "regular-sparkles",
};

interface Connector {
  name: string;
  /** Shows the brand's logo, otherwise the icon. */
  brand?: Brand;
  icon?: string;
}

// Example apps without real integrations behind them.
const apps: Connector[] = [
  { name: "Adyen", brand: "adyen" },
  { name: "Airtable", brand: "airtable" },
  { name: "Amazon Web Services", brand: "aws" },
  { name: "Asana", brand: "asana" },
  { name: "Box", brand: "box" },
  { name: "Brevo", brand: "brevo" },
  { name: "Claude", brand: "claude" },
  { name: "Discord", brand: "discord" },
  { name: "Dropbox", brand: "dropbox" },
  { name: "Gmail", brand: "gmail" },
  { name: "Google Ads", brand: "googleAds" },
  { name: "Google Analytics", brand: "googleAnalytics" },
  { name: "Google Drive", brand: "googleDrive" },
  { name: "HubSpot", brand: "hubspot" },
  { name: "Jira", brand: "jira" },
  { name: "Linear", brand: "linear" },
  { name: "Mailgun", brand: "mailgun" },
  { name: "Microsoft 365", brand: "microsoft" },
  { name: "Mixpanel", brand: "mixpanel" },
  { name: "MongoDB", brand: "mongodb" },
  { name: "Odoo", brand: "odoo" },
  { name: "PayPal", brand: "paypal" },
  { name: "Pimcore", brand: "pimcore" },
  { name: "Salesforce", brand: "salesforce" },
  { name: "SAP", brand: "sap" },
  { name: "Shopware", brand: "shopware" },
  { name: "Slack", brand: "slack" },
  { name: "Trello", brand: "trello" },
  { name: "Twilio", brand: "twilio" },
  { name: "WhatsApp", brand: "whatsapp" },
];

const search = ref("");

function coreNodes(icons: Record<string, string>): Connector[] {
  return Object.entries(icons).map(([id, icon]) => ({
    name: t(`workflow.nodes.${id}`),
    icon,
  }));
}

const groups = computed(() => {
  const term = search.value.trim().toLowerCase();

  return [
    { id: "triggers", connectors: coreNodes(triggerIcons) },
    { id: "logic", connectors: coreNodes(logicIcons) },
    { id: "apps", connectors: apps },
  ]
    .map((group) => ({
      ...group,
      connectors: group.connectors.filter(({ name }) =>
        name.toLowerCase().includes(term),
      ),
    }))
    .filter((group) => group.connectors.length);
});

// Placeholders without a function yet.
const controls = computed(() => [
  { label: t("workflow.zoomOut"), icon: "regular-minus" },
  { label: t("workflow.zoomIn"), icon: "regular-plus" },
  { label: t("workflow.fitView"), icon: "regular-expand" },
]);
</script>

<template>
  <mt-page :breadcrumb="breadcrumb" closable inset>
    <template #actions>
      <!-- In the mobile layout, the actions next to saving move into a menu. -->
      <mt-dropdown-menu-root v-if="isMobile">
        <mt-dropdown-menu-trigger as-child>
          <mt-button
            variant="tertiary"
            size="default"
            square
            :aria-label="t('workflow.moreActions')"
          >
            <template #iconFront>
              <mt-icon
                name="regular-ellipsis-h"
                size="var(--scale-size-16)"
                decorative
              />
            </template>
          </mt-button>
        </mt-dropdown-menu-trigger>

        <mt-dropdown-menu-portal>
          <mt-action-menu>
            <mt-action-menu-group>
              <mt-action-menu-item icon="regular-play">
                {{ t("workflow.test") }}
              </mt-action-menu-item>
              <mt-action-menu-item icon="regular-history">
                {{ t("workflow.history") }}
              </mt-action-menu-item>
            </mt-action-menu-group>
          </mt-action-menu>
        </mt-dropdown-menu-portal>
      </mt-dropdown-menu-root>

      <template v-else>
        <mt-button
          variant="tertiary"
          size="default"
          square
          :aria-label="t('workflow.history')"
        >
          <template #iconFront>
            <mt-icon
              name="regular-history"
              size="var(--scale-size-16)"
              decorative
            />
          </template>
        </mt-button>
        <mt-button variant="secondary" size="default">
          <template #iconFront>
            <mt-icon
              name="regular-play-s"
              size="var(--scale-size-12)"
              decorative
            />
          </template>
          {{ t("workflow.test") }}
        </mt-button>
      </template>

      <mt-button variant="primary" size="default">
        {{ t("workflow.save") }}
      </mt-button>
    </template>

    <template #start>
      <mt-panel :label="t('workflow.connectors')" closable :width="320">
        <aside
          class="workflow-connectors"
          :aria-label="t('workflow.connectors')"
        >
          <div class="workflow-connectors__search">
            <mt-search
              v-model="search"
              :placeholder="t('workflow.searchConnectors')"
            />
          </div>

          <!-- Scrolls below the search, and fades the list out while there is more to scroll. -->
          <mt-scroll-area>
            <div class="workflow-connectors__list">
              <section
                v-for="group in groups"
                :key="group.id"
                :aria-labelledby="`${headingId}-${group.id}`"
              >
                <mt-text
                  :id="`${headingId}-${group.id}`"
                  as="h2"
                  size="xs"
                  weight="semibold"
                  color="color-text-secondary-default"
                  class="workflow-connectors__heading"
                >
                  {{ t(`workflow.groups.${group.id}`) }}
                </mt-text>

                <ul class="workflow-connectors__items">
                  <li
                    v-for="connector in group.connectors"
                    :key="connector.name"
                  >
                    <button type="button" class="workflow-connector">
                      <IntegrationLogo
                        :brand="connector.brand"
                        :icon="connector.icon"
                        small
                      />
                      <mt-text
                        as="span"
                        size="xs"
                        class="workflow-connector__name"
                      >
                        {{ connector.name }}
                      </mt-text>
                    </button>
                  </li>
                </ul>
              </section>

              <mt-text
                v-if="!groups.length"
                size="xs"
                color="color-text-secondary-default"
              >
                {{ t("workflow.noConnectors") }}
              </mt-text>
            </div>
          </mt-scroll-area>
        </aside>
      </mt-panel>
    </template>

    <!-- The canvas scrolls on its own, so the controls stay in place over it. -->
    <div class="workflow-editor">
      <!--
        Scrolls down when the steps stack and across when they run side by side, and fades them
        out at the edges while there is more to scroll.
      -->
      <mt-scroll-area>
        <mt-scroll-area orientation="horizontal">
          <div class="workflow-canvas">
            <div class="workflow-flow">
              <ol class="workflow-steps" :aria-label="t('workflow.steps')">
                <li
                  v-for="(node, index) in nodes"
                  :key="node.id"
                  class="workflow-node"
                >
                  <span
                    v-if="index > 0"
                    class="workflow-node__handle workflow-node__handle--input"
                  />

                  <div class="workflow-node__header">
                    <IntegrationLogo :brand="node.brand" :icon="node.icon" />
                    <div class="workflow-node__title">
                      <mt-text
                        size="xs"
                        weight="semibold"
                        class="workflow-node__label"
                      >
                        {{ node.label }}
                      </mt-text>
                      <mt-text size="xs" color="color-text-secondary-default">
                        {{
                          index === 0
                            ? t("workflow.trigger")
                            : t("workflow.action")
                        }}
                      </mt-text>
                    </div>
                  </div>

                  <!-- Stands in for the settings of the step. -->
                  <div class="workflow-node__skeleton" aria-hidden="true">
                    <span class="workflow-bar" />
                    <span class="workflow-bar" />
                  </div>

                  <span
                    class="workflow-node__handle workflow-node__handle--output"
                  />
                </li>
              </ol>

              <mt-button
                variant="secondary"
                size="default"
                square
                :aria-label="t('workflow.addStep')"
              >
                <template #iconFront>
                  <mt-icon
                    name="regular-plus"
                    size="var(--scale-size-16)"
                    decorative
                  />
                </template>
              </mt-button>
            </div>
          </div>
        </mt-scroll-area>
      </mt-scroll-area>

      <div class="workflow-controls">
        <mt-button
          v-for="control in controls"
          :key="control.icon"
          variant="tertiary"
          size="small"
          square
          :aria-label="control.label"
        >
          <template #iconFront>
            <mt-icon
              :name="control.icon"
              size="var(--scale-size-16)"
              decorative
            />
          </template>
        </mt-button>
      </div>
    </div>
  </mt-page>
</template>

<style scoped>
/* Fills the panel, so the list scrolls below the search. */
.workflow-connectors {
  display: grid;
  flex: 1 1 auto;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 0;
}

.workflow-connectors__search {
  padding: var(--scale-size-16) var(--scale-size-16) 0;
}

.workflow-connectors__list {
  display: grid;
  align-content: start;
  gap: var(--scale-size-16);
  padding: var(--scale-size-16);
}

/* Like the section headers of mt-nav, with the text in line with the logos. */
.workflow-connectors__heading {
  display: flex;
  align-items: center;
  height: var(--scale-size-24);
  margin-block-end: var(--scale-size-4);
  padding-inline: var(--scale-size-4);
}

.workflow-connectors__items {
  display: grid;
  gap: var(--scale-size-2);
}

/* The states are those of the company switcher. */
.workflow-connector {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  width: 100%;
  padding: var(--scale-size-4);
  border: none;
  border-radius: var(--border-radius-s);
  background: transparent;
  color: var(--color-text-primary-default);
  text-align: start;
  cursor: pointer;
  transition: background-color 0.15s ease-out;
}

.workflow-connector:hover {
  background: var(--color-interaction-secondary-hover);
}

.workflow-connector:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(-1 * var(--scale-size-2));
}

.workflow-connector__name,
.workflow-node__label {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/*
 * The canvas behind the scroll areas, which fill it. The dots are part of the scrolled content, so
 * they move and fade out with the steps.
 */
.workflow-editor {
  position: relative;
  display: grid;
  /* The scroll areas fill it and don't grow with the steps. */
  grid-template: minmax(0, 1fr) / minmax(0, 1fr);
  height: 100%;
  container: workflow-editor / size;
  background-color: var(--color-elevation-surface-sunken);
}

.workflow-canvas {
  display: flex;
  min-height: 100cqh;
  padding: var(--scale-size-64);
  background-image: radial-gradient(
    circle,
    var(--color-border-secondary-default) var(--scale-size-1),
    transparent var(--scale-size-1)
  );
  background-size: var(--scale-size-20) var(--scale-size-20);
}

/* Centered while it fits, and scrollable from its start when it doesn't. */
.workflow-flow {
  display: flex;
  align-items: center;
  gap: var(--scale-size-48);
  margin: auto;
}

.workflow-steps {
  display: flex;
  gap: var(--scale-size-48);
}

.workflow-node {
  position: relative;
  display: grid;
  gap: var(--scale-size-12);
  width: var(--scale-size-224);
  padding: var(--scale-size-12);
  border: var(--scale-size-1) solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
  background: var(--color-elevation-surface-default);
}

/* The connection to the next step, or to the add button, across the gap. */
.workflow-node::after {
  content: "";
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: calc(100% + var(--scale-size-1));
  width: var(--scale-size-48);
  height: var(--scale-size-2);
  background: var(--color-border-primary-default);
  translate: 0 -50%;
}

/* Centered on the border, over the connection. */
.workflow-node__handle {
  position: absolute;
  z-index: 1;
  inset-block-start: 50%;
  width: var(--scale-size-8);
  height: var(--scale-size-8);
  border-radius: var(--border-radius-round);
  background: var(--color-border-primary-default);
  translate: 0 -50%;
}

.workflow-node__handle--input {
  inset-inline-start: calc(-1 * (var(--scale-size-4) + var(--scale-size-1)));
}

.workflow-node__handle--output {
  inset-inline-end: calc(-1 * (var(--scale-size-4) + var(--scale-size-1)));
}

.workflow-node__header {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
}

.workflow-node__title {
  min-width: 0;
}

/* The steps stack when the editor is too narrow for them to run side by side. */
@container workflow-editor (width < 960px) {
  .workflow-canvas {
    padding-inline: var(--scale-size-16);
  }

  .workflow-flow,
  .workflow-steps {
    flex-direction: column;
  }

  .workflow-node::after {
    inset-block-start: calc(100% + var(--scale-size-1));
    inset-inline-start: 50%;
    width: var(--scale-size-2);
    height: var(--scale-size-48);
    margin-inline-start: calc(-1 * var(--scale-size-1));
    translate: none;
  }

  .workflow-node__handle {
    inset-inline: 50% auto;
    margin-inline-start: calc(-1 * var(--scale-size-4));
    translate: none;
  }

  .workflow-node__handle--input {
    inset-block-start: calc(-1 * (var(--scale-size-4) + var(--scale-size-1)));
  }

  .workflow-node__handle--output {
    inset-block: auto calc(-1 * (var(--scale-size-4) + var(--scale-size-1)));
  }
}

/* Custom, because mt-skeleton-bar shimmers like content that is loading. */
.workflow-node__skeleton {
  display: grid;
  gap: var(--scale-size-8);
}

.workflow-bar {
  height: var(--scale-size-8);
  border-radius: var(--border-radius-round);
  background: var(--color-background-tertiary-default);
}

.workflow-bar:last-child {
  width: 60%;
}

.workflow-controls {
  position: absolute;
  inset-block-end: var(--scale-size-16);
  inset-inline-start: var(--scale-size-16);
  display: flex;
  gap: var(--scale-size-4);
  padding: var(--scale-size-4);
  border: var(--scale-size-1) solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
  background: var(--color-elevation-surface-default);
}
</style>
