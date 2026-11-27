<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
import {
  MtBadge,
  MtButton,
  MtCard,
  MtContentHeader,
  MtIcon,
  MtLink,
  MtPage,
  MtSearch,
  MtSelect,
  MtText,
} from "@shopware-ag/meteor-component-library";
import IntegrationLogo from "../components/IntegrationLogo.vue";
import {
  brandNames,
  nodeIcons,
  templates,
  workflows,
  type Node,
} from "../data/workflows";

const { t } = useI18n();

// The toolbar only keeps its values; the list doesn't filter or sort yet.
const search = ref("");
const nodeType = ref<Node | null>(null);
const status = ref<string | null>(null);
const sort = ref("updated");

const nodeTypeOptions = computed(() =>
  (Object.keys(nodeIcons) as Node[]).map((node) => ({
    label: t(`overview.workflows.nodes.${node}`),
    value: node,
  })),
);

const statusOptions = computed(() =>
  ["draft", "active", "inactive"].map((value) => ({
    label: t(`overview.workflows.statuses.${value}`),
    value,
  })),
);

const sortOptions = computed(() =>
  ["updated", "name", "status"].map((value) => ({
    label: t(`overview.workflows.sort.${value}`),
    value,
  })),
);

const columns = ["name", "status", "steps", "updated"];
</script>

<template>
  <mt-page width="l">
    <div class="overview">
      <mt-content-header :title="t('overview.workflows.title')">
        <template #actions>
          <mt-button
            variant="secondary"
            size="small"
            square
            :aria-label="t('overview.workflows.refresh')"
          >
            <template #iconFront>
              <mt-icon
                name="regular-sync"
                size="var(--scale-size-16)"
                decorative
              />
            </template>
          </mt-button>
          <mt-button variant="secondary" size="small">
            {{ t("overview.workflows.import") }}
          </mt-button>
          <mt-button variant="secondary" size="small">
            {{ t("overview.workflows.templates") }}
          </mt-button>
          <mt-button variant="primary" size="small">
            {{ t("overview.workflows.create") }}
          </mt-button>
        </template>
      </mt-content-header>

      <section class="workflows">
        <div class="workflows__toolbar">
          <mt-search
            v-model="search"
            class="workflows__search"
            size="small"
            :placeholder="t('overview.workflows.search')"
          />
          <mt-select
            v-model="nodeType"
            class="workflows__filter"
            :options="nodeTypeOptions"
            :placeholder="t('overview.workflows.nodeTypes')"
            :enable-search="false"
            small
          />
          <mt-select
            v-model="status"
            class="workflows__filter"
            :options="statusOptions"
            :placeholder="t('overview.workflows.status')"
            :enable-search="false"
            small
          />
          <mt-select
            v-model="sort"
            class="workflows__sort"
            :options="sortOptions"
            :enable-search="false"
            hide-clearable-button
            small
          />
        </div>

        <!-- Scrolls sideways on narrow screens and clips the header to the rounded corners. -->
        <div class="workflows__table">
          <table>
            <caption class="visually-hidden">
              {{
                t("overview.workflows.title")
              }}
            </caption>

            <thead>
              <tr>
                <th v-for="column in columns" :key="column" scope="col">
                  <mt-text
                    as="span"
                    size="xs"
                    color="color-text-secondary-default"
                  >
                    {{ t(`overview.workflows.columns.${column}`) }}
                  </mt-text>
                </th>
                <th scope="col">
                  <span class="visually-hidden">
                    {{ t("overview.workflows.columns.actions") }}
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="workflow in workflows" :key="workflow.id">
                <td>
                  <mt-text as="div" size="xs" weight="medium">
                    <!-- Stretched over the row, so the whole row opens the workflow. -->
                    <RouterLink
                      class="workflows__row-link"
                      :to="{ name: 'workflow', params: { id: workflow.id } }"
                    >
                      {{ workflow.name }}
                    </RouterLink>
                  </mt-text>
                  <mt-text
                    as="div"
                    size="xs"
                    color="color-text-secondary-default"
                  >
                    {{ workflow.description }}
                  </mt-text>
                </td>

                <td>
                  <mt-badge variant="neutral" size="m" status-indicator>
                    {{ t(`overview.workflows.statuses.${workflow.status}`) }}
                  </mt-badge>
                </td>

                <td>
                  <ol
                    class="workflow-steps"
                    :aria-label="t('overview.workflows.columns.steps')"
                  >
                    <li
                      v-for="(step, index) in workflow.steps"
                      :key="step"
                      class="workflow-steps__step"
                    >
                      <mt-icon
                        v-if="index > 0"
                        name="regular-chevron-right-xxs"
                        size="var(--scale-size-8)"
                        color="var(--color-icon-secondary-default)"
                        decorative
                      />
                      <span class="workflow-steps__icon">
                        <mt-icon
                          :name="nodeIcons[step]"
                          size="var(--scale-size-12)"
                          decorative
                        />
                      </span>
                      <span class="visually-hidden">
                        {{ t(`overview.workflows.nodes.${step}`) }}
                      </span>
                    </li>
                  </ol>
                </td>

                <td>
                  <mt-text
                    as="span"
                    size="xs"
                    color="color-text-secondary-default"
                  >
                    {{
                      t("overview.workflows.minutesAgo", {
                        count: workflow.updatedMinutesAgo,
                      })
                    }}
                  </mt-text>
                </td>

                <td class="workflows__actions">
                  <mt-button
                    class="workflows__more"
                    variant="tertiary"
                    size="small"
                    square
                    :aria-label="
                      t('overview.workflows.moreActions', {
                        name: workflow.name,
                      })
                    "
                  >
                    <template #iconFront>
                      <mt-icon
                        name="regular-ellipsis-h"
                        size="var(--scale-size-16)"
                        decorative
                      />
                    </template>
                  </mt-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="templates">
        <div class="templates__header">
          <div>
            <mt-text as="h3" size="s" weight="semibold">
              {{ t("overview.templates.title") }}
            </mt-text>
            <mt-text size="xs" color="color-text-secondary-default">
              {{ t("overview.templates.description") }}
            </mt-text>
          </div>

          <mt-button variant="secondary" size="small">
            {{ t("overview.templates.browse") }}
          </mt-button>
        </div>

        <div class="templates__cards">
          <mt-card v-for="template in templates" :key="template.id">
            <div class="template">
              <ol
                class="template-steps"
                :aria-label="t('overview.workflows.columns.steps')"
              >
                <li
                  v-for="(step, index) in template.steps"
                  :key="step"
                  class="template-steps__step"
                >
                  <mt-icon
                    v-if="index > 0"
                    name="regular-chevron-right-xs"
                    size="var(--scale-size-12)"
                    color="var(--color-icon-secondary-default)"
                    decorative
                  />
                  <IntegrationLogo :brand="step" />
                  <span class="visually-hidden">{{ brandNames[step] }}</span>
                </li>
              </ol>

              <div>
                <mt-text as="h4" size="s" weight="semibold">
                  {{ template.name }}
                </mt-text>
                <mt-text size="xs" color="color-text-secondary-default">
                  {{ template.description }}
                </mt-text>
              </div>

              <mt-text as="div" size="xs" weight="medium">
                <mt-link
                  type="internal"
                  :to="{ name: 'workflow', params: { id: template.id } }"
                  :aria-label="
                    t('overview.templates.useFor', { name: template.name })
                  "
                >
                  {{ t("overview.templates.use") }}
                </mt-link>
              </mt-text>
            </div>
          </mt-card>
        </div>
      </section>
    </div>
  </mt-page>
</template>

<style scoped>
.overview {
  display: grid;
  gap: var(--scale-size-56);
}

.workflows {
  display: grid;
  gap: var(--scale-size-24);
}

.workflows__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--scale-size-16);
}

.workflows__search {
  flex: 0 1 calc(3 * var(--scale-size-128));
}

.workflows__filter {
  flex: 0 1 var(--scale-size-224);
}

.workflows__sort {
  flex: 0 1 var(--scale-size-256);
  margin-inline-start: auto;
}

.workflows__table {
  overflow-x: auto;
  border: var(--scale-size-1) solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
}

.workflows__table table {
  width: 100%;
}

.workflows__table th,
.workflows__table td {
  padding: var(--scale-size-12) var(--scale-size-20);
  text-align: start;
  vertical-align: middle;
}

.workflows__table th {
  background: var(--color-elevation-surface-raised);
}

.workflows__table td {
  border-block-start: var(--scale-size-1) solid
    var(--color-border-secondary-default);
}

.workflows__table .workflows__actions {
  text-align: end;
}

/*
 * The row is the containing block of the link's overlay. Safari ignores `position: relative` on
 * table rows, but not a transform. The transition is the one of the mt-user-menu hover.
 */
.workflows__table tbody tr {
  transform: translate(0);
  transition: background-color 0.15s ease-out;
}

.workflows__table tbody tr:hover {
  background: var(--color-interaction-secondary-hover);
}

.workflows__row-link {
  color: inherit;
  text-decoration: none;
  outline: none;
}

.workflows__row-link::after {
  content: "";
  position: absolute;
  inset: 0;
}

/* The focus ring goes around the row the link covers. */
.workflows__row-link:focus-visible::after {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(-1 * var(--scale-size-2));
}

/* In the last row, the ring follows the rounded corners of the table. */
.workflows__table tbody tr:last-child .workflows__row-link::after {
  border-end-start-radius: calc(var(--border-radius-m) - var(--scale-size-1));
  border-end-end-radius: calc(var(--border-radius-m) - var(--scale-size-1));
}

/* Stays clickable above the link. */
.workflows__more {
  position: relative;
  z-index: 1;
}

.workflow-steps,
.workflow-steps__step {
  display: flex;
  align-items: center;
  gap: var(--scale-size-4);
}

.workflow-steps__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  border: var(--scale-size-1) solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-xs);
}

.template-steps,
.template-steps__step {
  display: flex;
  align-items: center;
  gap: var(--scale-size-8);
}

.templates {
  display: grid;
  gap: var(--scale-size-24);
}

.templates__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--scale-size-16);
}

/* Three columns at the page width, one below the other when narrow. */
.templates__cards {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, var(--scale-size-256)), 1fr)
  );
  gap: var(--scale-size-16);
}

.template {
  display: grid;
  justify-items: start;
  gap: var(--scale-size-16);
}
</style>
